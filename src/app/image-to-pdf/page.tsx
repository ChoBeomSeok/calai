"use client";

import { useState, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type ImageItem = { id: string; file: File; url: string };
type PageSize = "fit" | "a4" | "letter";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const imgs = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) {
      setError("이미지 파일만 추가할 수 있습니다 (JPG·PNG).");
      return;
    }
    setError("");
    setImages((prev) => [
      ...prev,
      ...imgs.map((f) => ({ id: `${Date.now()}-${Math.random()}`, file: f, url: URL.createObjectURL(f) })),
    ]);
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (id: string, dir: "up" | "down") => {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const newIdx = dir === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();

      for (const item of images) {
        const bytes = await item.file.arrayBuffer();
        const isJpg = /jpeg|jpg/i.test(item.file.type) || /\.jpe?g$/i.test(item.file.name);
        const embedded = isJpg ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes);
        const { width, height } = embedded;

        let pw = width;
        let ph = height;
        if (pageSize === "a4") {
          pw = 595;
          ph = 842;
        } else if (pageSize === "letter") {
          pw = 612;
          ph = 792;
        }

        const page = pdf.addPage([pw, ph]);
        if (pageSize === "fit") {
          page.drawImage(embedded, { x: 0, y: 0, width: pw, height: ph });
        } else {
          // 비율 유지하며 페이지 안에 fit
          const scale = Math.min(pw / width, ph / height);
          const drawW = width * scale;
          const drawH = height * scale;
          const x = (pw - drawW) / 2;
          const y = (ph - drawH) / 2;
          page.drawImage(embedded, { x, y, width: drawW, height: drawH });
        }
      }

      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `images-${Date.now()}.pdf`;
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
      title="이미지 → PDF 변환 (무료)"
      description="JPG·PNG 여러 장을 하나의 PDF로 무료 변환. 순서 조정·페이지 크기 선택 가능. 가입·워터마크 없음, 브라우저 내 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-8 text-center transition">
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={(e) => e.target.files && addFiles(e.target.files)}
            className="hidden"
          />
          <div className="text-4xl mb-2">📷</div>
          <div className="font-semibold text-slate-700 dark:text-slate-200">JPG·PNG 이미지 선택</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">여러 장 선택 가능 · 100% 무료 · 브라우저 내 처리</div>
        </label>

        {images.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              이미지 {images.length}장 · 순서대로 PDF에 포함됩니다
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {images.map((item, i) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img src={item.url} alt={item.file.name} className="w-full h-32 object-cover" />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    <button
                      onClick={() => moveImage(item.id, "up")}
                      disabled={i === 0}
                      className="w-6 h-6 rounded bg-white/80 text-xs disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveImage(item.id, "down")}
                      disabled={i === images.length - 1}
                      className="w-6 h-6 rounded bg-white/80 text-xs disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeImage(item.id)}
                      className="w-6 h-6 rounded bg-rose-500 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">페이지 크기</span>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: "fit", l: "이미지 크기" },
                  { v: "a4", l: "A4" },
                  { v: "letter", l: "Letter" },
                ] as const).map((p) => (
                  <button
                    key={p.v}
                    onClick={() => setPageSize(p.v)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                      pageSize === p.v
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {p.l}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={processing}
              className="w-full mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? "처리 중..." : `📷 ${images.length}장을 PDF로 변환 (무료)`}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 이미지가 서버로 전송되지 않습니다.
      </div>
    </CalculatorLayout>
  );
}
