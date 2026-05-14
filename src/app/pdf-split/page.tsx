"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "all" | "range";

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("all");
  const [rangeText, setRangeText] = useState("1-3, 5, 7-9");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

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

  const handleSplit = async () => {
    if (!file || pageCount === 0) return;
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });

      if (mode === "all") {
        // 각 페이지를 별도 PDF로
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(src, [i]);
          newPdf.addPage(page);
          const out = await newPdf.save();
          const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${file.name.replace(/\.pdf$/i, "")}_page-${i + 1}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          await new Promise((r) => setTimeout(r, 100));
        }
      } else {
        const pages = parseRange(rangeText, pageCount);
        if (pages.length === 0) {
          setError("유효한 페이지 범위를 입력해주세요. (예: 1-3, 5, 7-9)");
          setProcessing(false);
          return;
        }
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(src, pages.map((p) => p - 1));
        copied.forEach((p) => newPdf.addPage(p));
        const out = await newPdf.save();
        const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, "")}_split.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <CalculatorLayout
      title="PDF 분할 (무료)"
      description="PDF를 페이지 단위로 무료 분할. 전체 분할 또는 범위 지정 (예: 1-3, 5, 7-9). 가입·워터마크 없음, 브라우저 내 처리."
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
          <div className="text-5xl sm:text-6xl mb-4">✂️</div>
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
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("all")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  mode === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                }`}
              >
                전체 분할 ({pageCount}개 파일)
              </button>
              <button
                onClick={() => setMode("range")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  mode === "range"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                }`}
              >
                범위 지정 (1개 파일)
              </button>
            </div>

            {mode === "range" && (
              <label className="block mt-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  페이지 범위 (예: 1-3, 5, 7-9)
                </span>
                <input
                  type="text"
                  value={rangeText}
                  onChange={(e) => setRangeText(e.target.value)}
                  placeholder="1-3, 5, 7-9"
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-mono"
                />
                <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
                  총 {pageCount} 페이지 중 선택
                </span>
              </label>
            )}

            <button
              onClick={handleSplit}
              disabled={processing}
              className="w-full mt-5 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? "처리 중..." : `✂️ PDF 분할 (무료)`}
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 파일은 서버로 전송되지 않으며 브라우저 안에서만 처리됩니다.
      </div>
    </CalculatorLayout>
  );
}
