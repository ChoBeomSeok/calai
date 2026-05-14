"use client";

import { useState, useCallback, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultDone from "@/components/ResultDone";
import ProgressBar from "@/components/ProgressBar";

type FileItem = { id: string; file: File; size: string };
type Result = { url: string; filename: string; pageCount: number; fileCount: number };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfMergePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setFiles([]);
    setError("");
    setProgress({ current: 0, total: 0 });
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const pdfs = Array.from(newFiles).filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) {
      setError("PDF 파일만 추가할 수 있습니다.");
      return;
    }
    setError("");
    setFiles((prev) => [
      ...prev,
      ...pdfs.map((f) => ({ id: `${Date.now()}-${Math.random()}`, file: f, size: formatSize(f.size) })),
    ]);
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const moveFile = (id: string, dir: "up" | "down") => {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const newIdx = dir === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("최소 2개 이상의 PDF 파일을 추가해주세요.");
      return;
    }
    setProcessing(true);
    setError("");
    setProgress({ current: 0, total: files.length });
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();
      let pageCount = 0;
      for (let i = 0; i < files.length; i++) {
        const bytes = await files[i].file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
        pageCount += pages.length;
        setProgress({ current: i + 1, total: files.length });
      }
      const out = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ url, filename: `merged-${Date.now()}.pdf`, pageCount, fileCount: files.length });
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <CalculatorLayout
        title="PDF 합치기 (무료)"
        description="여러 PDF 파일을 하나로 무료 결합합니다. 가입·로그인·워터마크 없음. 모든 처리는 브라우저 안에서 이뤄져 파일이 서버로 전송되지 않습니다."
      >
        <ResultDone
          title={`PDF ${result.fileCount}개가 하나로 합쳐졌습니다`}
          url={result.url}
          filename={result.filename}
          stats={[
            { label: "파일", value: `${result.fileCount}개` },
            { label: "총 페이지", value: `${result.pageCount}장` },
          ]}
          currentSlug="/pdf-merge"
          onReset={reset}
        />
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout
      title="PDF 합치기 (무료)"
      description="여러 PDF 파일을 하나로 무료 결합합니다. 가입·로그인·워터마크 없음. 모든 처리는 브라우저 안에서 이뤄져 파일이 서버로 전송되지 않습니다."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
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
          className={`block cursor-pointer rounded-xl border-2 border-dashed p-12 sm:p-16 text-center transition ${
            dragOver
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
          }`}
        >
          <input
            type="file"
            accept="application/pdf,.pdf"
            multiple
            onChange={(e) => e.target.files && addFiles(e.target.files)}
            className="hidden"
          />
          <div className="text-5xl sm:text-6xl mb-4">📑</div>
          <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">PDF 파일을 드래그하거나 클릭해서 추가</div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">여러 파일 선택 가능 · 100% 무료 · 브라우저 내 처리</div>
        </label>

        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              파일 {files.length}개 · 순서대로 합쳐집니다
            </div>
            {files.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                <span className="text-xs font-bold text-slate-500 w-6">{i + 1}</span>
                <span className="text-2xl">📄</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.file.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{item.size}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveFile(item.id, "up")}
                    disabled={i === 0}
                    className="px-2 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"
                    title="위로"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveFile(item.id, "down")}
                    disabled={i === files.length - 1}
                    className="px-2 py-1 text-xs rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"
                    title="아래로"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="px-2 py-1 text-xs text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950"
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleMerge}
              disabled={processing || files.length < 2}
              className="w-full mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "처리 중..." : `📑 ${files.length}개 PDF 합치기 (무료)`}
            </button>
            {processing && (
              <ProgressBar
                label={`PDF 결합 중 (${progress.current}/${progress.total})`}
                current={progress.current}
                total={progress.total}
              />
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 파일이 서버로 전송되지 않습니다. 모든 처리는 사용자 브라우저 안에서 이뤄지며, 결과 다운로드 후 즉시 메모리에서 사라집니다.
      </div>
    </CalculatorLayout>
  );
}
