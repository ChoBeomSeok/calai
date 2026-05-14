"use client";

import { useEffect, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultDone from "@/components/ResultDone";
import ProgressBar from "@/components/ProgressBar";

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
    setError("");
  };

  const handleFile = (f: File | null) => {
    setFile(f);
    setResult(null);
    setError("");
  };

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

  if (result) {
    const saved = result.originalSize > result.compressedSize
      ? `${(((result.originalSize - result.compressedSize) / result.originalSize) * 100).toFixed(1)}%`
      : "0%";
    return (
      <CalculatorLayout
        title="PDF 용량 줄이기 (무료)"
        description="PDF 파일 용량을 무료로 압축합니다. 메타데이터 제거 + 객체 스트림 최적화. 이메일 첨부·업로드 한도 회피에 유용. 브라우저 내 처리."
      >
        <ResultDone
          title="PDF 용량이 줄었습니다"
          url={result.url}
          filename={result.name}
          stats={[
            { label: "원본", value: formatSize(result.originalSize) },
            { label: "압축 후", value: formatSize(result.compressedSize) },
            { label: "절감", value: saved },
          ]}
          currentSlug="/pdf-compress"
          onReset={reset}
        />
        <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
          💡 브라우저 내 처리는 이미지 재압축이 어려워 절감률이 5~30% 수준입니다. 이미지가 많은 PDF는 &quot;이미지 → PDF&quot; 도구로 재변환 시 더 큰 절감 가능.
        </div>
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout
      title="PDF 용량 줄이기 (무료)"
      description="PDF 파일 용량을 무료로 압축합니다. 메타데이터 제거 + 객체 스트림 최적화. 이메일 첨부·업로드 한도 회피에 유용. 브라우저 내 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0] || null);
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
          <div className="text-5xl sm:text-6xl mb-4">🗜️</div>
          {file ? (
            <>
              <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">{file.name}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">원본 {formatSize(file.size)}</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">PDF 파일을 드래그하거나 클릭해서 선택</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">100% 무료 · 브라우저 내 처리</div>
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

        {processing && <ProgressBar label="압축 중..." indeterminate />}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 브라우저 내 처리는 이미지 재압축이 어려워 절감률이 5~30% 수준입니다. 이미지가 많은 PDF는 &quot;이미지 → PDF&quot; 도구로 재변환 시 더 큰 절감 가능.
      </div>
    </CalculatorLayout>
  );
}
