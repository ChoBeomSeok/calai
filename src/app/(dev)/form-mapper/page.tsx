"use client";

// 개발자 전용 — 정부 PDF 위에 클릭·드래그로 필드 좌표를 측정해서
// FormField[] JSON으로 export. 사이트맵·검색에 노출 안 됨.

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormField, FormFieldType } from "@/lib/koreanForms/types";

type Page = {
  pageNumber: number;
  pdfWidth: number;
  pdfHeight: number;
  viewportWidth: number; // 화면 px
  viewportHeight: number;
  scale: number;
};

type DraftBox = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export default function FormMapperPage() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fields, setFields] = useState<FormField[]>([]);
  const [draft, setDraft] = useState<DraftBox | null>(null);
  const [templateId, setTemplateId] = useState("molit-rental-2020");
  const [templateName, setTemplateName] = useState("국토교통부 주택임대차표준계약서");
  const [pdfPath, setPdfPath] = useState("/forms/molit-rental-2020.pdf");
  const [renderingPage, setRenderingPage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // PDF 업로드 + 메타 추출
  const handleFile = useCallback(async (f: File | null) => {
    if (!f) return;
    const bytes = new Uint8Array(await f.arrayBuffer());
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
    const targetWidth = 900;
    const infos: Page[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const baseVp = page.getViewport({ scale: 1 });
      const scale = targetWidth / baseVp.width;
      const vp = page.getViewport({ scale });
      infos.push({
        pageNumber: i,
        pdfWidth: baseVp.width,
        pdfHeight: baseVp.height,
        viewportWidth: vp.width,
        viewportHeight: vp.height,
        scale,
      });
    }
    setPdfBytes(bytes);
    setPages(infos);
    setCurrentPage(1);
  }, []);

  // 페이지 렌더링
  useEffect(() => {
    if (!pdfBytes || pages.length === 0 || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      setRenderingPage(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
        const page = await pdf.getPage(currentPage);
        const info = pages[currentPage - 1];
        const viewport = page.getViewport({ scale: info.scale });
        const canvas = canvasRef.current!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      } finally {
        if (!cancelled) setRenderingPage(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfBytes, pages, currentPage]);

  const info = pages[currentPage - 1];

  // 화면 px → PDF pt 변환
  const screenToPdf = (sx: number, sy: number) => {
    if (!info) return { x: 0, y: 0 };
    const pdfX = sx / info.scale;
    // PDF Y축은 좌하단 기준. 화면 Y는 좌상단 기준 → 뒤집기
    const pdfY = (info.viewportHeight - sy) / info.scale;
    return { x: pdfX, y: pdfY };
  };

  // 마우스 이벤트 — 드래그로 박스
  const onMouseDown = (e: React.MouseEvent) => {
    if (!wrapRef.current || !info) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDraft({ startX: x, startY: y, endX: x, endY: y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!draft || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setDraft({
      ...draft,
      endX: e.clientX - rect.left,
      endY: e.clientY - rect.top,
    });
  };
  const onMouseUp = () => {
    if (!draft || !info) {
      setDraft(null);
      return;
    }
    const sx = Math.min(draft.startX, draft.endX);
    const sy = Math.min(draft.startY, draft.endY);
    const sw = Math.abs(draft.endX - draft.startX);
    const sh = Math.abs(draft.endY - draft.startY);

    if (sw < 5 || sh < 5) {
      // 단순 클릭 — 좌표만 출력 (콘솔)
      const pt = screenToPdf(draft.startX, draft.startY);
      console.log(`Click @ pdf pt (${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
      setDraft(null);
      return;
    }

    // 박스 → PDF 좌표 (PDF의 좌하단이 (x, y))
    const topLeft = screenToPdf(sx, sy);
    const bottomRight = screenToPdf(sx + sw, sy + sh);
    const pdfX = topLeft.x;
    const pdfY = bottomRight.y; // 좌하단
    const pdfW = bottomRight.x - topLeft.x;
    const pdfH = topLeft.y - bottomRight.y;

    const id = prompt("필드 ID (예: landlord-name):", "");
    if (!id) {
      setDraft(null);
      return;
    }
    const label = prompt("필드 라벨 (예: 임대인 성명):", id) || id;
    const typeRaw = prompt("타입: text / checkbox / signature", "text") || "text";
    const type: FormFieldType = typeRaw === "checkbox" || typeRaw === "signature" ? typeRaw : "text";

    const newField: FormField = {
      id,
      label,
      type,
      page: currentPage,
      x: round(pdfX),
      y: round(pdfY),
      width: round(pdfW),
      height: round(pdfH),
      fontSize: 10,
    };
    setFields((prev) => [...prev, newField]);
    setDraft(null);
  };

  const removeField = (id: string) => {
    if (!confirm(`필드 '${id}' 삭제?`)) return;
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const exportJson = () => {
    const template = {
      id: templateId,
      name: templateName,
      source: "국토교통부",
      pdfPath,
      totalPages: pages.length,
      license: "공공누리 1유형",
      fields: fields.sort((a, b) => a.page - b.page || b.y - a.y),
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 박스 그리기 (PDF pt → 화면 px)
  const pdfToScreen = (pdfX: number, pdfY: number, pdfW: number, pdfH: number) => {
    if (!info) return null;
    const left = pdfX * info.scale;
    const top = info.viewportHeight - (pdfY + pdfH) * info.scale;
    const w = pdfW * info.scale;
    const h = pdfH * info.scale;
    return { left, top, width: w, height: h };
  };

  const currentFields = fields.filter((f) => f.page === currentPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">PDF 좌표 매핑 도구 (개발자 전용)</h1>
      <p className="text-sm text-slate-600 mb-4">
        PDF를 업로드하고, 빈칸 위에 마우스로 박스를 그리면 PDF pt 좌표가 측정됩니다. 작업 완료 후 JSON으로 export.
      </p>

      {/* 메타 입력 */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
        <label className="block">
          <span className="text-xs text-slate-500">템플릿 ID</span>
          <input
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="block w-full rounded border px-2 py-1"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">템플릿 이름</span>
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="block w-full rounded border px-2 py-1"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">PDF 경로 (public 기준)</span>
          <input
            value={pdfPath}
            onChange={(e) => setPdfPath(e.target.value)}
            className="block w-full rounded border px-2 py-1"
          />
        </label>
      </div>

      {!pdfBytes ? (
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-12 text-center hover:border-indigo-400">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="text-4xl mb-2">📄</div>
          <div className="font-semibold">PDF 업로드</div>
        </label>
      ) : (
        <div className="grid grid-cols-[1fr_320px] gap-4">
          {/* 메인 PDF + 박스 */}
          <div>
            <div className="flex gap-2 items-center mb-2 text-sm">
              <span>페이지:</span>
              {pages.map((p) => (
                <button
                  key={p.pageNumber}
                  onClick={() => setCurrentPage(p.pageNumber)}
                  className={`px-2 py-1 rounded text-xs ${
                    currentPage === p.pageNumber ? "bg-indigo-600 text-white" : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {p.pageNumber}
                </button>
              ))}
              {info && (
                <span className="text-xs text-slate-500 ml-auto">
                  PDF: {info.pdfWidth.toFixed(0)} × {info.pdfHeight.toFixed(0)} pt
                </span>
              )}
            </div>
            <div
              ref={wrapRef}
              className="relative inline-block bg-slate-100 cursor-crosshair select-none"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => setDraft(null)}
            >
              <canvas ref={canvasRef} />
              {renderingPage && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
                  렌더링 중...
                </div>
              )}
              {/* 기존 필드 박스 */}
              {currentFields.map((f) => {
                const pos = pdfToScreen(f.x, f.y, f.width, f.height);
                if (!pos) return null;
                return (
                  <div
                    key={f.id}
                    className="absolute border-2 border-emerald-500 bg-emerald-200/30 pointer-events-none"
                    style={pos}
                    title={`${f.id} (${f.label})`}
                  >
                    <span className="absolute -top-5 left-0 text-[10px] bg-emerald-600 text-white px-1 rounded">
                      {f.id}
                    </span>
                  </div>
                );
              })}
              {/* 그리는 중인 박스 */}
              {draft && (
                <div
                  className="absolute border-2 border-indigo-500 bg-indigo-200/30 pointer-events-none"
                  style={{
                    left: Math.min(draft.startX, draft.endX),
                    top: Math.min(draft.startY, draft.endY),
                    width: Math.abs(draft.endX - draft.startX),
                    height: Math.abs(draft.endY - draft.startY),
                  }}
                />
              )}
            </div>
          </div>

          {/* 사이드바 — 필드 목록 + export */}
          <div className="space-y-3">
            <div className="rounded-lg bg-slate-50 border p-3 text-xs">
              <strong>사용법</strong>
              <ol className="list-decimal ml-4 mt-1 space-y-0.5">
                <li>PDF 위에 박스를 드래그</li>
                <li>필드 ID·라벨·타입 입력</li>
                <li>모든 페이지·필드 작업 후 JSON 다운로드</li>
                <li>다운로드된 JSON을 src/lib/koreanForms/templates/에 저장</li>
              </ol>
            </div>

            <div className="rounded-lg border max-h-[600px] overflow-y-auto">
              <div className="px-3 py-2 bg-slate-100 text-xs font-semibold border-b">
                필드 {fields.length}개 (현재 페이지 {currentFields.length}개)
              </div>
              {fields.map((f) => (
                <div
                  key={f.id}
                  className="px-3 py-2 text-xs border-b last:border-0 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-slate-700 truncate">{f.id}</div>
                    <div className="text-slate-500">
                      p{f.page} ({f.x},{f.y}) {f.width}×{f.height}
                    </div>
                  </div>
                  <button
                    onClick={() => removeField(f.id)}
                    className="text-rose-500 text-sm hover:text-rose-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={exportJson}
              disabled={fields.length === 0}
              className="w-full bg-indigo-600 text-white px-3 py-2 rounded font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              💾 JSON 내보내기 ({fields.length}개 필드)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
