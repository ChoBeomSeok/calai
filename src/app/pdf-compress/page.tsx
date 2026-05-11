"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number; url: string; name: string } | null>(null);

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      // 메타데이터 제거 + 객체 압축
      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("");
      pdf.setCreator("");
      const out = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({
        originalSize: file.size,
        compressedSize: blob.size,
        url,
        name: `${file.name.replace(/\.pdf$/i, "")}_compressed.pdf`,
      });
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <CalculatorLayout
      title="PDF 용량 줄이기 (무료)"
      description="PDF 파일 용량을 무료로 압축합니다. 메타데이터 제거 + 객체 스트림 최적화. 이메일 첨부·업로드 한도 회피에 유용. 브라우저 내 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-8 text-center transition">
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setResult(null);
              setError("");
            }}
            className="hidden"
          />
          <div className="text-4xl mb-2">🗜️</div>
          {file ? (
            <>
              <div className="font-semibold text-slate-700 dark:text-slate-200">{file.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">원본 {formatSize(file.size)}</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-slate-700 dark:text-slate-200">PDF 파일 선택</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">100% 무료 · 브라우저 내 처리</div>
            </>
          )}
        </label>

        {file && (
          <button
            onClick={handleCompress}
            disabled={processing}
            className="w-full mt-5 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {processing ? "압축 중..." : "🗜️ PDF 용량 줄이기 (무료)"}
          </button>
        )}

        {result && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-5">
              <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-2">압축 완료</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-slate-500">원본</div>
                  <div className="font-bold">{formatSize(result.originalSize)}</div>
                </div>
                <div className="text-2xl text-emerald-600 self-center">→</div>
                <div>
                  <div className="text-xs text-slate-500">압축 후</div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">
                    {formatSize(result.compressedSize)}
                  </div>
                </div>
              </div>
              <div className="text-center mt-3 text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
                {result.originalSize > result.compressedSize
                  ? `✓ ${(((result.originalSize - result.compressedSize) / result.originalSize) * 100).toFixed(1)}% 절감`
                  : "압축 효과 없음 (이미 최적화된 PDF)"}
              </div>
            </div>
            <a
              href={result.url}
              download={result.name}
              className="block w-full mt-4 bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition text-center"
            >
              💾 다운로드
            </a>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 브라우저 내 처리는 이미지 재압축이 어려워 절감률이 5~30% 수준입니다. 이미지가 많은 PDF는 \"이미지 → PDF\" 도구로 재변환 시 더 큰 절감 가능.
      </div>
    </CalculatorLayout>
  );
}
