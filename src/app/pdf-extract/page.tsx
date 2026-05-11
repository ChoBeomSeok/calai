"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function PdfExtractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeText, setRangeText] = useState("1, 3-5");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

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

  const handleExtract = async () => {
    if (!file || pageCount === 0) return;
    const pages = parseRange(rangeText, pageCount);
    if (pages.length === 0) {
      setError("유효한 페이지 범위를 입력해주세요. (예: 1, 3-5)");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => newPdf.addPage(p));
      const out = await newPdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}_extracted.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <CalculatorLayout
      title="PDF 페이지 추출 (무료)"
      description="PDF에서 원하는 페이지만 무료로 추출해 새 파일로 생성합니다. 가입·워터마크 없음, 브라우저 내 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-8 text-center transition">
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="text-4xl mb-2">📄</div>
          {file ? (
            <>
              <div className="font-semibold text-slate-700 dark:text-slate-200">{file.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">총 {pageCount} 페이지</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-slate-700 dark:text-slate-200">PDF 파일 선택</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">100% 무료 · 브라우저 내 처리</div>
            </>
          )}
        </label>

        {file && pageCount > 0 && (
          <>
            <label className="block mt-5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">추출할 페이지 (예: 1, 3-5)</span>
              <input
                type="text"
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                placeholder="1, 3-5"
                className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-mono"
              />
              <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">총 {pageCount} 페이지 중 선택</span>
            </label>
            <button
              onClick={handleExtract}
              disabled={processing}
              className="w-full mt-5 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? "처리 중..." : "📄 페이지 추출 (무료)"}
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
        🔒 <strong>100% 안전</strong>: 파일이 서버로 전송되지 않습니다.
      </div>
    </CalculatorLayout>
  );
}
