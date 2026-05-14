"use client";

import { useEffect, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultDone from "@/components/ResultDone";
import ProgressBar from "@/components/ProgressBar";

type Format = "png" | "jpeg";
type Result = { url: string; filename: string; format: Format; pageCount: number };

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("png");
  const [quality, setQuality] = useState(2); // 2x scale
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
    setFile(null);
    setError("");
    setProgress({ current: 0, total: 0 });
  };

  const handleFile = (f: File | null) => {
    setFile(f);
    setError("");
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const total = pdf.numPages;
      const mime = format === "png" ? "image/png" : "image/jpeg";
      const baseName = file.name.replace(/\.pdf$/i, "");
      setProgress({ current: 0, total });

      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: quality });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D를 사용할 수 없습니다.");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("이미지 변환 실패"))), mime, 0.92);
        });
        zip.file(`${baseName}_page-${i}.${format}`, blob);
        setProgress({ current: i, total });
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      setResult({
        url,
        filename: `${baseName}_images.zip`,
        format,
        pageCount: total,
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
        title="PDF → 이미지 변환 (무료)"
        description="PDF 페이지를 JPG·PNG 이미지로 무료 변환. 화질 1x~3x 선택 가능. 가입·워터마크 없음, 브라우저 내 처리."
      >
        <ResultDone
          title={`PDF ${result.pageCount}페이지를 이미지로 변환했습니다`}
          url={result.url}
          filename={result.filename}
          stats={[
            { label: "변환", value: `${result.pageCount}장` },
            { label: "형식", value: result.format.toUpperCase() },
            { label: "다운로드", value: "ZIP" },
          ]}
          currentSlug="/pdf-to-image"
          onReset={reset}
        />
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout
      title="PDF → 이미지 변환 (무료)"
      description="PDF 페이지를 JPG·PNG 이미지로 무료 변환. 화질 1x~3x 선택 가능. 가입·워터마크 없음, 브라우저 내 처리."
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
          <div className="text-5xl sm:text-6xl mb-4">🖼️</div>
          {file ? (
            <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">{file.name}</div>
          ) : (
            <>
              <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">PDF 파일을 드래그하거나 클릭해서 선택</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">100% 무료 · 브라우저 내 처리</div>
            </>
          )}
        </label>

        {file && (
          <>
            <div className="mt-5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">출력 형식</span>
              <div className="grid grid-cols-2 gap-2">
                {(["png", "jpeg"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                      format === f
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">화질 (해상도 배율)</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                      quality === q
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {q}x {q === 1 ? "(빠름)" : q === 2 ? "(균형)" : "(고화질)"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={processing}
              className="w-full mt-5 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? "처리 중..." : `🖼️ ${format.toUpperCase()}로 변환 (무료)`}
            </button>
            {processing && progress.total > 0 && (
              <ProgressBar
                label={`페이지 렌더링 중 (${progress.current}/${progress.total})`}
                current={progress.current}
                total={progress.total}
              />
            )}
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
