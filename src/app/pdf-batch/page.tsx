"use client";

import { useEffect, useRef, useState } from "react";
import { PDFDocument, PDFName, StandardFonts, rgb, degrees } from "pdf-lib";
import JSZip from "jszip";
import CalculatorLayout from "@/components/CalculatorLayout";
import { encryptPdf, preloadQpdf } from "@/lib/qpdfWasm";

type Action = "page-numbers" | "watermark" | "strip-meta" | "encrypt";
type Position = "bottom-right" | "bottom-center" | "bottom-left" | "top-right" | "top-center" | "top-left";
type Status = "pending" | "processing" | "done" | "error";

type Item = {
  id: string;
  file: File;
  status: Status;
  message?: string;
  outBlob?: Blob;
  outName?: string;
};

function toArrayBuffer(u: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(u.byteLength);
  new Uint8Array(ab).set(u);
  return ab;
}

function formatSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── 페이지 번호 추가 ───
async function processPageNumbers(
  bytes: Uint8Array,
  opts: { position: Position; startFrom: number; format: "n" | "n-of-N" | "page-n" }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const total = pages.length;
  const size = 12;
  pages.forEach((page, i) => {
    const num = opts.startFrom + i;
    const text =
      opts.format === "n-of-N" ? `${num} / ${total}` : opts.format === "page-n" ? `Page ${num}` : `${num}`;
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, size);
    const margin = 30;
    let x: number;
    let y: number;
    switch (opts.position) {
      case "bottom-right":
        x = width - margin - textWidth;
        y = margin;
        break;
      case "bottom-center":
        x = (width - textWidth) / 2;
        y = margin;
        break;
      case "bottom-left":
        x = margin;
        y = margin;
        break;
      case "top-right":
        x = width - margin - textWidth;
        y = height - margin;
        break;
      case "top-center":
        x = (width - textWidth) / 2;
        y = height - margin;
        break;
      case "top-left":
        x = margin;
        y = height - margin;
        break;
    }
    page.drawText(text, { x, y, size, font, color: rgb(0.3, 0.3, 0.3) });
  });
  return await doc.save();
}

// ─── 워터마크 추가 (영문/숫자만, 한글 미지원 안내) ───
async function processWatermark(
  bytes: Uint8Array,
  opts: { text: string; opacity: number; angle: number; size: number }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const text = opts.text;
  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, opts.size);
    const cx = width / 2;
    const cy = height / 2;
    page.drawText(text, {
      x: cx - textWidth / 2,
      y: cy - opts.size / 2,
      size: opts.size,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: opts.opacity,
      rotate: degrees(opts.angle),
    });
  });
  return await doc.save();
}

// ─── 메타데이터 제거 ───
async function processStripMeta(bytes: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  doc.setTitle("");
  doc.setAuthor("");
  doc.setSubject("");
  doc.setKeywords([]);
  doc.setProducer("");
  doc.setCreator("");
  const epoch = new Date(0);
  doc.setCreationDate(epoch);
  doc.setModificationDate(epoch);
  doc.catalog.delete(PDFName.of("Metadata"));
  return await doc.save({ useObjectStreams: false, addDefaultPage: false });
}

export default function PdfBatchPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [action, setAction] = useState<Action>("page-numbers");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 작업별 옵션
  const [pageNumPos, setPageNumPos] = useState<Position>("bottom-right");
  const [pageNumStart, setPageNumStart] = useState(1);
  const [pageNumFmt, setPageNumFmt] = useState<"n" | "n-of-N" | "page-n">("n-of-N");
  const [wmText, setWmText] = useState("CONFIDENTIAL");
  const [wmOpacity, setWmOpacity] = useState(0.25);
  const [wmAngle, setWmAngle] = useState(45);
  const [wmSize, setWmSize] = useState(72);
  const [encryptPwd, setEncryptPwd] = useState("");

  useEffect(() => {
    if (action === "encrypt") preloadQpdf();
  }, [action]);

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter(
      (f) => f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf"
    );
    if (arr.length === 0) {
      setError("PDF 파일만 추가됩니다.");
      return;
    }
    setError("");
    setItems((prev) => [
      ...prev,
      ...arr.map((f) => ({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${f.name}`,
        file: f,
        status: "pending" as Status,
      })),
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    setError("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const runProcess = async (item: Item): Promise<{ blob: Blob; name: string }> => {
    const inBytes = new Uint8Array(await item.file.arrayBuffer());
    const base = item.file.name.replace(/\.pdf$/i, "");
    let out: Uint8Array;
    let suffix = "";
    if (action === "page-numbers") {
      out = await processPageNumbers(inBytes, {
        position: pageNumPos,
        startFrom: pageNumStart,
        format: pageNumFmt,
      });
      suffix = "_numbered";
    } else if (action === "watermark") {
      if (!/^[\u0020-\u007e]+$/.test(wmText)) {
        throw new Error("워터마크는 영문·숫자만 지원합니다 (한글 미지원).");
      }
      out = await processWatermark(inBytes, {
        text: wmText,
        opacity: wmOpacity,
        angle: wmAngle,
        size: wmSize,
      });
      suffix = "_watermarked";
    } else if (action === "strip-meta") {
      out = await processStripMeta(inBytes);
      suffix = "_cleaned";
    } else {
      if (!encryptPwd) throw new Error("비밀번호를 입력해 주세요.");
      out = await encryptPdf(inBytes, encryptPwd);
      suffix = "_locked";
    }
    return {
      blob: new Blob([toArrayBuffer(out)], { type: "application/pdf" }),
      name: `${base}${suffix}.pdf`,
    };
  };

  const runAll = async () => {
    if (items.length === 0) return;
    if (action === "encrypt" && !encryptPwd) {
      setError("일괄 잠금에는 비밀번호가 필요합니다.");
      return;
    }
    if (action === "watermark" && !wmText) {
      setError("워터마크 텍스트를 입력해 주세요.");
      return;
    }
    setError("");
    setProcessing(true);
    setProgress(0);

    // 모든 항목 pending으로 초기화
    setItems((prev) => prev.map((x) => ({ ...x, status: "pending" as Status, message: undefined, outBlob: undefined, outName: undefined })));

    let done = 0;
    const results: Item[] = [];
    for (const item of items) {
      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "processing" as Status } : x)));
      try {
        const r = await runProcess(item);
        const updated: Item = { ...item, status: "done", outBlob: r.blob, outName: r.name };
        results.push(updated);
        setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const updated: Item = { ...item, status: "error", message: msg };
        results.push(updated);
        setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
      }
      done++;
      setProgress((done / items.length) * 100);
      // UI 양보
      await new Promise((r) => setTimeout(r, 0));
    }

    setProcessing(false);
  };

  const downloadAllZip = async () => {
    const successes = items.filter((x) => x.status === "done" && x.outBlob && x.outName);
    if (successes.length === 0) return;
    const zip = new JSZip();
    for (const it of successes) {
      zip.file(it.outName!, it.outBlob!);
    }
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calai_pdf_batch_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadOne = (it: Item) => {
    if (!it.outBlob || !it.outName) return;
    const url = URL.createObjectURL(it.outBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = it.outName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const successCount = items.filter((x) => x.status === "done").length;
  const errorCount = items.filter((x) => x.status === "error").length;

  return (
    <CalculatorLayout
      title="PDF 일괄 처리 (무료)"
      description="여러 PDF에 페이지 번호·워터마크·메타 제거·비밀번호 잠금을 한 번에. 100장+ 가능, zip 다운로드. 100% 브라우저 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 작업 선택 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {(
            [
              { id: "page-numbers", label: "🔢 페이지 번호" },
              { id: "watermark", label: "💧 워터마크" },
              { id: "strip-meta", label: "🧹 메타 제거" },
              { id: "encrypt", label: "🔒 일괄 잠금" },
            ] as { id: Action; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setAction(t.id)}
              className={`px-3 py-2.5 rounded-lg font-semibold text-sm transition ${
                action === t.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 작업별 옵션 */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 mb-5">
          {action === "page-numbers" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <label className="block">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">위치</span>
                <select
                  value={pageNumPos}
                  onChange={(e) => setPageNumPos(e.target.value as Position)}
                  className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                >
                  <option value="bottom-right">우하단</option>
                  <option value="bottom-center">중앙 하단</option>
                  <option value="bottom-left">좌하단</option>
                  <option value="top-right">우상단</option>
                  <option value="top-center">중앙 상단</option>
                  <option value="top-left">좌상단</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">시작 번호</span>
                <input
                  type="number"
                  value={pageNumStart}
                  onChange={(e) => setPageNumStart(Math.max(1, Number(e.target.value) || 1))}
                  min={1}
                  className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">포맷</span>
                <select
                  value={pageNumFmt}
                  onChange={(e) => setPageNumFmt(e.target.value as typeof pageNumFmt)}
                  className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                >
                  <option value="n-of-N">1 / N</option>
                  <option value="n">1</option>
                  <option value="page-n">Page 1</option>
                </select>
              </label>
            </div>
          )}
          {action === "watermark" && (
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">워터마크 텍스트 (영문·숫자)</span>
                <input
                  type="text"
                  value={wmText}
                  onChange={(e) => setWmText(e.target.value)}
                  placeholder="CONFIDENTIAL"
                  className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm font-mono"
                />
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">투명도 {(wmOpacity * 100).toFixed(0)}%</span>
                  <input
                    type="range"
                    value={wmOpacity * 100}
                    onChange={(e) => setWmOpacity(Number(e.target.value) / 100)}
                    min={5}
                    max={80}
                    className="mt-1 block w-full"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">기울기 {wmAngle}°</span>
                  <input
                    type="range"
                    value={wmAngle}
                    onChange={(e) => setWmAngle(Number(e.target.value))}
                    min={-90}
                    max={90}
                    className="mt-1 block w-full"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">크기 {wmSize}pt</span>
                  <input
                    type="range"
                    value={wmSize}
                    onChange={(e) => setWmSize(Number(e.target.value))}
                    min={20}
                    max={120}
                    className="mt-1 block w-full"
                  />
                </label>
              </div>
            </div>
          )}
          {action === "strip-meta" && (
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Title·Author·Producer·CreationDate·XMP 메타 스트림 등 PDF에 박힌 작성자 정보를 모두 제거합니다.
            </div>
          )}
          {action === "encrypt" && (
            <label className="block">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                모든 PDF에 적용할 비밀번호 (AES-256)
              </span>
              <input
                type="password"
                value={encryptPwd}
                onChange={(e) => setEncryptPwd(e.target.value)}
                placeholder="동일한 비밀번호로 모든 파일 잠금"
                className="mt-1 block w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm font-mono"
              />
            </label>
          )}
        </div>

        {/* 파일 업로드 영역 */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition mb-4 ${
            dragOver
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
            className="hidden"
          />
          <div className="text-3xl mb-1">📚</div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            PDF 여러 개를 드래그하거나 클릭해서 추가
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            현재 {items.length}개 등록 · 권장 한도: 100개·합계 500MB
          </div>
        </label>

        {/* 파일 리스트 */}
        {items.length > 0 && (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 mb-4 max-h-72 overflow-y-auto">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-3 px-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-xs"
              >
                <div className="w-5 text-center">
                  {it.status === "pending" && <span className="text-slate-400">⏳</span>}
                  {it.status === "processing" && <span className="text-indigo-500">⚙️</span>}
                  {it.status === "done" && <span className="text-emerald-500">✓</span>}
                  {it.status === "error" && <span className="text-rose-500">✗</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{it.file.name}</div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {formatSize(it.file.size)}
                    {it.message && ` · ${it.message}`}
                  </div>
                </div>
                {it.status === "done" && (
                  <button
                    onClick={() => downloadOne(it)}
                    className="text-xs px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                  >
                    💾
                  </button>
                )}
                {!processing && (
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-xs text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 진행률 */}
        {processing && (
          <div className="mb-4">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              처리 중 · {progress.toFixed(0)}%
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* 결과 요약 + 액션 */}
        {!processing && (successCount > 0 || errorCount > 0) && (
          <div
            className={`rounded-lg p-3 mb-4 text-sm ${
              errorCount === 0
                ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
            }`}
          >
            ✓ 성공 {successCount}개 · ✗ 실패 {errorCount}개
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={runAll}
            disabled={items.length === 0 || processing}
            className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {processing ? "처리 중..." : `▶ ${items.length}개 일괄 처리 시작`}
          </button>
          {successCount > 0 && !processing && (
            <button
              onClick={downloadAllZip}
              className="px-4 py-3 rounded-lg border-2 border-indigo-600 text-indigo-700 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950"
            >
              📦 zip 일괄 다운로드
            </button>
          )}
          {items.length > 0 && !processing && (
            <button
              onClick={clearAll}
              className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
            >
              ↻ 전체 초기화
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>사용 예시</strong>: 100장 견적서에 페이지 번호 일괄 부여 · 회사 PDF 모음에 워터마크 통일 · 외부 발송 전 PDF 작성자·수정 이력 일괄 청소 · 기밀 PDF 폴더 통째로 비밀번호 잠금. 워터마크는 현재 영문·숫자만 지원합니다 (한글 폰트 임베드는 추후).
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: PDF가 서버로 전송되지 않습니다. 모든 처리는 브라우저 안에서.
      </div>
    </CalculatorLayout>
  );
}
