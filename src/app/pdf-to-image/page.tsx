"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Format = "png" | "jpeg";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("png");
  const [quality, setQuality] = useState(2); // 2x scale
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null) => {
    setFile(f);
    setError("");
    setProgress("");
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setProgress("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      // Worker 설정 (CDN 사용)
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const total = pdf.numPages;
      const mime = format === "png" ? "image/png" : "image/jpeg";

      for (let i = 1; i <= total; i++) {
        setProgress(`${i} / ${total} 페이지 변환 중...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: quality });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, mime, 0.92));
        if (!blob) continue;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, "")}_page-${i}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise((r) => setTimeout(r, 100));
      }
      setProgress(`완료! ${total}개 이미지 다운로드`);
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

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
          className={`block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
            dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
          }`}
        >
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="text-4xl mb-2">🖼️</div>
          {file ? (
            <div className="font-semibold text-slate-700 dark:text-slate-200">{file.name}</div>
          ) : (
            <>
              <div className="font-semibold text-slate-700 dark:text-slate-200">PDF 파일을 드래그하거나 클릭해서 선택</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">100% 무료 · 브라우저 내 처리</div>
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
              {processing ? progress || "처리 중..." : `🖼️ ${format.toUpperCase()}로 변환 (무료)`}
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
        {progress && !processing && !error && (
          <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-sm text-emerald-700 dark:text-emerald-400">
            ✓ {progress}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 파일이 서버로 전송되지 않습니다.
      </div>
    </CalculatorLayout>
  );
}
