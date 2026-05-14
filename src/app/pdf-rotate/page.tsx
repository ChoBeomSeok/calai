"use client";

import { useEffect, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultDone from "@/components/ResultDone";
import ProgressBar from "@/components/ProgressBar";

type Mode = "all" | "range";
type Result = { url: string; filename: string; angle: number; rotated: number; total: number };

export default function PdfRotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [mode, setMode] = useState<Mode>("all");
  const [rangeText, setRangeText] = useState("1-3");
  const [processing, setProcessing] = useState(false);
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
    setFile(null);
    setPageCount(0);
    setError("");
  };

  const handleFile = async (f: File | null) => {
    if (!f) return;
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setFile(f);
      setPageCount(pdf.getPageCount());
    } catch (e) {
      setError(`PDF 읽기 실패: ${(e as Error).message}`);
    }
  };

  const parseRange = (text: string, max: number): number[] => {
    const result = new Set<number>();
    text.split(",").forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      if (trimmed.includes("-")) {
        const [a, b] = trimmed.split("-").map((s) => parseInt(s.trim()));
        if (a && b) {
          for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
            if (i >= 1 && i <= max) result.add(i);
          }
        }
      } else {
        const n = parseInt(trimmed);
        if (n >= 1 && n <= max) result.add(n);
      }
    });
    return Array.from(result).sort((a, b) => a - b);
  };

  const handleRotate = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();

      const targetPages = mode === "all" ? Array.from({ length: pageCount }, (_, i) => i + 1) : parseRange(rangeText, pageCount);
      if (targetPages.length === 0) {
        setError("회전할 페이지를 입력해주세요.");
        setProcessing(false);
        return;
      }

      targetPages.forEach((p) => {
        const page = pages[p - 1];
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });

      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({
        url,
        filename: `${file.name.replace(/\.pdf$/i, "")}_rotated.pdf`,
        angle,
        rotated: targetPages.length,
        total: pageCount,
      });
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <CalculatorLayout
        title="PDF 회전 (무료)"
        description="PDF 페이지를 90·180·270도 무료 회전. 전체 또는 특정 페이지 선택 가능. 브라우저 내 처리."
      >
        <ResultDone
          title={`${result.rotated}페이지가 ${result.angle}° 회전되었습니다`}
          url={result.url}
          filename={result.filename}
          stats={[
            { label: "회전", value: `${result.angle}°` },
            { label: "적용", value: `${result.rotated} / ${result.total}페이지` },
          ]}
          currentSlug="/pdf-rotate"
          onReset={reset}
        />
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout
      title="PDF 회전 (무료)"
      description="PDF 페이지를 90·180·270도 무료 회전. 전체 또는 특정 페이지 선택 가능. 브라우저 내 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          className={`block cursor-pointer rounded-xl border-2 border-dashed p-12 sm:p-16 text-center transition ${
            dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
          }`}
        >
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="text-5xl sm:text-6xl mb-4">🔄</div>
          {file ? (
            <>
              <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">{file.name}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">총 {pageCount} 페이지</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">PDF 파일을 드래그하거나 클릭해서 선택</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">100% 무료 · 브라우저 내 처리</div>
            </>
          )}
        </label>

        {file && pageCount > 0 && (
          <>
            <div className="mt-5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">회전 각도</span>
              <div className="grid grid-cols-3 gap-2">
                {([90, 180, 270] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAngle(a)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                      angle === a
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {a}°
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("all")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  mode === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                }`}
              >
                전체 페이지
              </button>
              <button
                onClick={() => setMode("range")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  mode === "range"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                }`}
              >
                특정 페이지
              </button>
            </div>

            {mode === "range" && (
              <label className="block mt-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">페이지 (예: 1-3, 5)</span>
                <input
                  type="text"
                  value={rangeText}
                  onChange={(e) => setRangeText(e.target.value)}
                  placeholder="1-3, 5"
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-mono"
                />
              </label>
            )}

            <button
              onClick={handleRotate}
              disabled={processing}
              className="w-full mt-5 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? "처리 중..." : `🔄 ${angle}° 회전 (무료)`}
            </button>
            {processing && <ProgressBar label="회전 적용 중..." indeterminate />}
          </>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 파일이 서버로 전송되지 않습니다.
      </div>
    </CalculatorLayout>
  );
}
