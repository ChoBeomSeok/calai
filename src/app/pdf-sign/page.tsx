"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { getStroke } from "perfect-freehand";
import CalculatorLayout from "@/components/CalculatorLayout";

// ─────────────────────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────────────────────
type Signature = {
  id: string;
  page: number; // 1-based
  dataUrl: string;
  pxWidth: number; // 원본 서명 PNG 가로 px (해상도 보존용)
  pxHeight: number;
  x: number; // 화면 캔버스 좌표 (좌상단)
  y: number;
  w: number; // 화면 캔버스 px
  h: number;
};

type PageInfo = {
  pageNumber: number;
  viewportWidth: number; // 화면 px (render scale 적용 후)
  viewportHeight: number;
  pdfWidth: number; // PDF pt (실제 페이지 크기)
  pdfHeight: number;
  scale: number; // viewportWidth / pdfWidth
};

// ─────────────────────────────────────────────────────────────
// perfect-freehand → SVG path
// ─────────────────────────────────────────────────────────────
function strokeToSvgPath(points: number[][]): string {
  if (points.length === 0) return "";
  const d = points.reduce(
    (acc, [x0, y0], i, arr) => {
      if (i === 0) return `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
      const [x1, y1] = arr[(i + 1) % arr.length];
      return `${acc} Q ${x0.toFixed(2)} ${y0.toFixed(2)} ${((x0 + x1) / 2).toFixed(2)} ${((y0 + y1) / 2).toFixed(2)}`;
    },
    ""
  );
  return d + " Z";
}

// ─────────────────────────────────────────────────────────────
// 서명 그리기 모달
// ─────────────────────────────────────────────────────────────
function SignatureModal({
  onClose,
  onSave,
  color,
  setColor,
  thickness,
  setThickness,
}: {
  onClose: () => void;
  onSave: (dataUrl: string, w: number, h: number) => void;
  color: string;
  setColor: (c: string) => void;
  thickness: number;
  setThickness: (n: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<{ points: number[][]; color: string; size: number }[]>([]);
  const [current, setCurrent] = useState<number[][] | null>(null);
  const W = 600;
  const H = 220;

  const getPos = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top, e.pressure || 0.5];
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setCurrent([getPos(e)]);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!current) return;
    setCurrent([...current, getPos(e)]);
  };
  const onPointerUp = () => {
    if (!current) return;
    if (current.length > 1) {
      setStrokes([...strokes, { points: current, color, size: thickness }]);
    }
    setCurrent(null);
  };

  const clear = () => {
    setStrokes([]);
    setCurrent(null);
  };

  const undo = () => setStrokes(strokes.slice(0, -1));

  const exportPng = () => {
    if (strokes.length === 0) return;
    // 1) 경계 박스 계산
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const s of strokes) {
      for (const [x, y] of s.points) {
        const half = s.size / 2;
        if (x - half < minX) minX = x - half;
        if (y - half < minY) minY = y - half;
        if (x + half > maxX) maxX = x + half;
        if (y + half > maxY) maxY = y + half;
      }
    }
    const pad = 8;
    minX -= pad;
    minY -= pad;
    maxX += pad;
    maxY += pad;
    const w = Math.max(1, Math.ceil(maxX - minX));
    const h = Math.max(1, Math.ceil(maxY - minY));

    // 2) 오프스크린 canvas에 그리기 (투명 배경)
    const dpr = 2; // 해상도 2배
    const canvas = document.createElement("canvas");
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.translate(-minX, -minY);
    for (const s of strokes) {
      const outline = getStroke(s.points, {
        size: s.size,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });
      const path = new Path2D(strokeToSvgPath(outline));
      ctx.fillStyle = s.color;
      ctx.fill(path);
    }
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl, w * dpr, h * dpr);
  };

  const renderPath = (points: number[][], size: number, c: string) => {
    const outline = getStroke(points, { size, thinning: 0.5, smoothing: 0.5, streamline: 0.5 });
    return <path d={strokeToSvgPath(outline)} fill={c} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">✏️ 서명 그리기</h3>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            ×
          </button>
        </div>

        <div className="flex gap-3 items-center mb-3 flex-wrap">
          <div className="flex gap-1.5">
            {[
              { c: "#000000", name: "검정" },
              { c: "#1d4ed8", name: "파랑" },
              { c: "#dc2626", name: "빨강" },
            ].map((opt) => (
              <button
                key={opt.c}
                onClick={() => setColor(opt.c)}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  color === opt.c ? "border-indigo-500 scale-110" : "border-slate-200 dark:border-slate-600"
                }`}
                style={{ backgroundColor: opt.c }}
                title={opt.name}
              />
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>두께</span>
            <input
              type="range"
              min={2}
              max={12}
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-24"
            />
            <span className="font-mono w-6 text-right">{thickness}</span>
          </label>
          <button
            onClick={undo}
            disabled={strokes.length === 0}
            className="ml-auto text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            ↶ 실행 취소
          </button>
          <button
            onClick={clear}
            disabled={strokes.length === 0}
            className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            🗑 지우기
          </button>
        </div>

        <svg
          ref={svgRef}
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg cursor-crosshair touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {strokes.map((s, i) => (
            <g key={i}>{renderPath(s.points, s.size, s.color)}</g>
          ))}
          {current && renderPath(current, thickness, color)}
        </svg>

        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          마우스·터치·펜으로 서명을 그려주세요. 압력 인식 펜 지원.
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-semibold"
          >
            취소
          </button>
          <button
            onClick={exportPng}
            disabled={strokes.length === 0}
            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-semibold disabled:opacity-50"
          >
            ✓ 서명 사용하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────
export default function PdfSignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignModal, setShowSignModal] = useState(false);
  const [renderingPage, setRenderingPage] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(4);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);

  // ─── 파일 로드 ───
  const handleFile = useCallback(async (f: File | null) => {
    if (!f) return;
    setError("");
    setFile(f);
    setSignatures([]);
    setCurrentPage(1);
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      setPdfBytes(bytes);
      // pdfjs로 페이지 정보 수집
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      const infos: PageInfo[] = [];
      const targetWidth = 700; // 미리보기 너비
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const baseVp = page.getViewport({ scale: 1 });
        const scale = targetWidth / baseVp.width;
        const vp = page.getViewport({ scale });
        infos.push({
          pageNumber: i,
          viewportWidth: vp.width,
          viewportHeight: vp.height,
          pdfWidth: baseVp.width,
          pdfHeight: baseVp.height,
          scale,
        });
      }
      setPages(infos);
    } catch (e) {
      setError(e instanceof Error ? `PDF 로드 실패: ${e.message}` : "PDF 로드 실패");
      setFile(null);
      setPdfBytes(null);
    }
  }, []);

  // ─── 페이지 렌더링 ───
  useEffect(() => {
    if (!pdfBytes || pages.length === 0 || !previewCanvasRef.current) return;
    let cancelled = false;
    (async () => {
      setRenderingPage(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
        const page = await pdf.getPage(currentPage);
        const info = pages[currentPage - 1];
        const viewport = page.getViewport({ scale: info.scale });
        const canvas = previewCanvasRef.current!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setRenderingPage(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfBytes, pages, currentPage]);

  // ─── 서명 저장 ───
  const handleSignatureSave = (dataUrl: string, pxW: number, pxH: number) => {
    setShowSignModal(false);
    const info = pages[currentPage - 1];
    if (!info) return;
    // 페이지 중앙에 기본 크기 (서명 폭을 페이지의 30%로)
    const targetW = info.viewportWidth * 0.3;
    const aspect = pxH / pxW;
    const targetH = targetW * aspect;
    const sig: Signature = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      page: currentPage,
      dataUrl,
      pxWidth: pxW,
      pxHeight: pxH,
      x: (info.viewportWidth - targetW) / 2,
      y: info.viewportHeight - targetH - 50,
      w: targetW,
      h: targetH,
    };
    setSignatures((prev) => [...prev, sig]);
  };

  const deleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── 서명 드래그 ───
  const onSigMouseDown = (e: React.MouseEvent, sig: Signature) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = sig.x;
    const origY = sig.y;
    const info = pages[currentPage - 1];
    const onMove = (ev: MouseEvent) => {
      const nx = origX + (ev.clientX - startX);
      const ny = origY + (ev.clientY - startY);
      setSignatures((prev) =>
        prev.map((s) =>
          s.id === sig.id
            ? {
                ...s,
                x: Math.max(0, Math.min(info.viewportWidth - s.w, nx)),
                y: Math.max(0, Math.min(info.viewportHeight - s.h, ny)),
              }
            : s
        )
      );
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ─── 모서리 리사이즈 ───
  const onResizeStart = (e: React.MouseEvent, sig: Signature) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const origW = sig.w;
    const origH = sig.h;
    const aspect = sig.h / sig.w;
    const info = pages[currentPage - 1];
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const grow = Math.max(dx, dy / aspect);
      const newW = Math.max(40, origW + grow);
      const newH = newW * aspect;
      if (sig.x + newW > info.viewportWidth || sig.y + newH > info.viewportHeight) return;
      setSignatures((prev) => prev.map((s) => (s.id === sig.id ? { ...s, w: newW, h: newH } : s)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ─── PDF에 서명 적용 후 다운로드 ───
  const handleApply = async () => {
    if (!pdfBytes || signatures.length === 0) return;
    setProcessing(true);
    setError("");
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes.slice() as unknown as ArrayBuffer);
      const pdfPages = pdfDoc.getPages();
      // 서명 PNG embed 캐싱 (같은 dataUrl 재사용)
      const cache = new Map<string, Awaited<ReturnType<typeof pdfDoc.embedPng>>>();
      for (const sig of signatures) {
        let png = cache.get(sig.dataUrl);
        if (!png) {
          png = await pdfDoc.embedPng(sig.dataUrl);
          cache.set(sig.dataUrl, png);
        }
        const pageIndex = sig.page - 1;
        if (pageIndex < 0 || pageIndex >= pdfPages.length) continue;
        const page = pdfPages[pageIndex];
        const info = pages[pageIndex];
        // 화면 px → PDF pt (스케일 역변환)
        const pdfX = sig.x / info.scale;
        const pdfW = sig.w / info.scale;
        const pdfH = sig.h / info.scale;
        // PDF Y축은 좌하단 기준 → 화면 Y(상단 기준)를 뒤집기
        const pdfY = info.pdfHeight - sig.y / info.scale - pdfH;
        page.drawImage(png, { x: pdfX, y: pdfY, width: pdfW, height: pdfH });
      }
      const out = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = file!.name.replace(/\.pdf$/i, "");
      a.download = `${base}_signed.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? `서명 적용 실패: ${e.message}` : "서명 적용 실패");
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdfBytes(null);
    setPages([]);
    setSignatures([]);
    setCurrentPage(1);
    setError("");
  };

  const currentSigs = signatures.filter((s) => s.page === currentPage);
  const info = pages[currentPage - 1];

  return (
    <CalculatorLayout
      title="PDF 손글씨 서명 (무료)"
      description="PDF에 손글씨 서명 추가. 마우스·터치·펜 지각 압력 인식, 드래그·리사이즈로 정확한 위치 배치. 100% 브라우저 처리, 가입·워터마크 없음."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {!file ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0] || null);
            }}
            className={`block cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition ${
              dragOver
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
            }`}
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="text-5xl mb-3">✍️</div>
            <div className="font-semibold text-slate-700 dark:text-slate-200">
              서명할 PDF를 드래그하거나 클릭해서 선택
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              100% 브라우저 처리 · 파일은 서버로 전송되지 않습니다
            </div>
          </label>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 mb-4">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{file.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  총 {pages.length}페이지 · 서명 {signatures.length}개 추가됨
                </div>
              </div>
              <button
                onClick={reset}
                className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ↻ 다른 파일
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-4">
              {/* 페이지 썸네일 사이드바 */}
              <div className="lg:max-h-[600px] overflow-y-auto flex lg:flex-col gap-2">
                {pages.map((p) => {
                  const count = signatures.filter((s) => s.page === p.pageNumber).length;
                  return (
                    <button
                      key={p.pageNumber}
                      onClick={() => setCurrentPage(p.pageNumber)}
                      className={`shrink-0 relative rounded-lg border-2 transition p-2 text-xs ${
                        currentPage === p.pageNumber
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                      }`}
                    >
                      <div className="text-slate-700 dark:text-slate-300 font-semibold">{p.pageNumber}</div>
                      {count > 0 && (
                        <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] rounded-full px-1.5 py-0.5">
                          ✍ {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 메인 프리뷰 영역 */}
              <div>
                <div className="flex justify-between mb-2 items-center">
                  <button
                    onClick={() => setShowSignModal(true)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                  >
                    ✏️ 서명 그리기
                  </button>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {info ? `${info.pdfWidth.toFixed(0)} × ${info.pdfHeight.toFixed(0)} pt` : ""}
                  </div>
                </div>

                <div
                  ref={previewWrapRef}
                  className="relative inline-block max-w-full bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden shadow"
                  style={{
                    width: info ? `${info.viewportWidth}px` : undefined,
                    height: info ? `${info.viewportHeight}px` : undefined,
                  }}
                >
                  <canvas ref={previewCanvasRef} className="block" />
                  {renderingPage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 text-xs text-slate-600 dark:text-slate-300">
                      페이지 렌더링 중...
                    </div>
                  )}
                  {currentSigs.map((sig) => (
                    <div
                      key={sig.id}
                      className="absolute cursor-move border-2 border-indigo-500/50 hover:border-indigo-500 group"
                      style={{ left: sig.x, top: sig.y, width: sig.w, height: sig.h }}
                      onMouseDown={(e) => onSigMouseDown(e, sig)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sig.dataUrl} alt="서명" className="w-full h-full object-contain pointer-events-none" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSignature(sig.id);
                        }}
                        className="absolute -top-3 -right-3 bg-rose-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                      <div
                        onMouseDown={(e) => onResizeStart(e, sig)}
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-indigo-600 rounded-sm cursor-nwse-resize opacity-0 group-hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={signatures.length === 0 || processing}
              className="mt-5 w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? "PDF 생성 중..." : `💾 서명 적용 후 PDF 다운로드 (${signatures.length}개 서명)`}
            </button>

            {error && (
              <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>법적 효력</strong>: 본 도구의 서명은 한국 전자서명법상 일반 전자서명에 해당합니다. 임대차계약·근로계약·동의서·서약서 등 일반 계약에 사용 가능. 공인전자서명(공동인증서·금융인증서)이 필요한 거래는 별도 절차를 따르세요.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: PDF가 서버로 전송되지 않습니다. 모든 처리는 브라우저 안에서.
      </div>

      {showSignModal && (
        <SignatureModal
          onClose={() => setShowSignModal(false)}
          onSave={handleSignatureSave}
          color={color}
          setColor={setColor}
          thickness={thickness}
          setThickness={setThickness}
        />
      )}
    </CalculatorLayout>
  );
}
