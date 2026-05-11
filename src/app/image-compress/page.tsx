"use client";

import { useState, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type ImageItem = {
  id: string;
  file: File;
  url: string;
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  compressedUrl?: string;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageCompressPage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [format, setFormat] = useState<"keep" | "jpeg" | "webp">("keep");
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const imgs = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) {
      setError("이미지 파일만 추가할 수 있습니다.");
      return;
    }
    setError("");
    setItems((prev) => [
      ...prev,
      ...imgs.map((f) => ({
        id: `${Date.now()}-${Math.random()}`,
        file: f,
        url: URL.createObjectURL(f),
        originalSize: f.size,
        status: "pending" as const,
      })),
    ]);
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleCompress = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    setError("");
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const options = {
        maxSizeMB,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality,
        fileType: format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : undefined,
      };

      for (const item of items) {
        if (item.status === "done") continue;
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "processing" } : i)));
        try {
          const compressed = await imageCompression(item.file, options);
          const url = URL.createObjectURL(compressed);
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: "done",
                    compressedSize: compressed.size,
                    compressedBlob: compressed,
                    compressedUrl: url,
                  }
                : i
            )
          );
        } catch (e) {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: (e as Error).message } : i))
          );
        }
      }
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    items
      .filter((i) => i.status === "done" && i.compressedUrl)
      .forEach((i, idx) => {
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = i.compressedUrl!;
          const ext = format === "keep" ? i.file.name.split(".").pop() : format === "jpeg" ? "jpg" : "webp";
          a.download = `${i.file.name.replace(/\.[^.]+$/, "")}_compressed.${ext}`;
          a.click();
        }, idx * 200);
      });
  };

  const totalOriginal = items.reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressed = items.reduce((sum, i) => sum + (i.compressedSize || 0), 0);
  const totalSaved = totalOriginal - totalCompressed;
  const savedPct = totalOriginal > 0 ? (totalSaved / totalOriginal) * 100 : 0;

  return (
    <CalculatorLayout
      title="이미지 압축 (무료)"
      description="JPG·PNG·WebP 이미지 일괄 무료 압축. 품질·최대 용량 조정 가능. 가입·워터마크 없음, 브라우저 내 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          className={`block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
            dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
          }`}
        >
          <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />
          <div className="text-4xl mb-2">🗜️</div>
          <div className="font-semibold text-slate-700 dark:text-slate-200">이미지를 드래그하거나 클릭해서 추가</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG·PNG·WebP · 여러 장 일괄 · 100% 무료</div>
        </label>

        {items.length > 0 && (
          <>
            {/* 옵션 */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">품질: {(quality * 100).toFixed(0)}%</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality * 100}
                  onChange={(e) => setQuality(parseInt(e.target.value) / 100)}
                  className="block w-full mt-1"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">최대 용량</span>
                <select
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value={0.1}>100 KB</option>
                  <option value={0.5}>500 KB</option>
                  <option value={1}>1 MB</option>
                  <option value={2}>2 MB</option>
                  <option value={5}>5 MB</option>
                  <option value={10}>10 MB</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">출력 형식</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "keep" | "jpeg" | "webp")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="keep">원본 형식 유지</option>
                  <option value="jpeg">JPEG (호환성 최고)</option>
                  <option value="webp">WebP (압축 최강)</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCompress}
                disabled={processing}
                className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {processing ? "압축 중..." : `🗜️ ${items.length}장 일괄 압축 (무료)`}
              </button>
              {items.some((i) => i.status === "done") && (
                <button
                  onClick={handleDownloadAll}
                  className="bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  💾 모두 다운로드
                </button>
              )}
            </div>

            {/* 결과 통계 */}
            {totalCompressed > 0 && (
              <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 p-4 text-center">
                <div className="text-sm text-emerald-700 dark:text-emerald-400">
                  원본 {formatSize(totalOriginal)} → 압축 {formatSize(totalCompressed)} · <strong>{savedPct.toFixed(1)}% 절감</strong> ({formatSize(totalSaved)} 감소)
                </div>
              </div>
            )}

            {/* 이미지 목록 */}
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <img src={item.compressedUrl || item.url} alt={item.file.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.file.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatSize(item.originalSize)}
                      {item.compressedSize !== undefined && (
                        <>
                          {" → "}
                          <span className="text-emerald-600 font-bold">{formatSize(item.compressedSize)}</span>
                          {" "}
                          <span className="text-emerald-600">
                            ({(((item.originalSize - item.compressedSize) / item.originalSize) * 100).toFixed(0)}% ↓)
                          </span>
                        </>
                      )}
                    </div>
                    {item.status === "processing" && (
                      <div className="text-xs text-indigo-500 animate-pulse mt-0.5">압축 중...</div>
                    )}
                    {item.error && <div className="text-xs text-rose-500 mt-0.5">오류: {item.error}</div>}
                  </div>
                  {item.compressedUrl && (
                    <a
                      href={item.compressedUrl}
                      download={`${item.file.name.replace(/\.[^.]+$/, "")}_compressed.${
                        format === "keep" ? item.file.name.split(".").pop() : format === "jpeg" ? "jpg" : "webp"
                      }`}
                      className="text-xs px-2.5 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      💾
                    </a>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 px-2 py-1.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>형식 선택 가이드</strong>: JPEG = 사진 (호환성 최고) / WebP = 30~50% 더 압축 (최신 브라우저만) / 원본 유지 = 투명도·메타데이터 보존.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 이미지가 서버로 전송되지 않습니다. Web Worker 기반 브라우저 내 처리.
      </div>
    </CalculatorLayout>
  );
}
