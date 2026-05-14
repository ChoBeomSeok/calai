"use client";

import { useEffect, useRef, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultDone from "@/components/ResultDone";
import ProgressBar from "@/components/ProgressBar";

type Preset = { name: string; w: number; h: number; group: "SNS" | "웹" | "문서" };

// 가장 자주 검색되는 사이즈 — 인스타 / 유튜브 / 페북 / OG / 이력서 등
const PRESETS: Preset[] = [
  { name: "인스타 정사각", w: 1080, h: 1080, group: "SNS" },
  { name: "인스타 세로", w: 1080, h: 1350, group: "SNS" },
  { name: "인스타 스토리", w: 1080, h: 1920, group: "SNS" },
  { name: "유튜브 썸네일", w: 1280, h: 720, group: "SNS" },
  { name: "페이스북 커버", w: 820, h: 312, group: "SNS" },
  { name: "X(트위터) 헤더", w: 1500, h: 500, group: "SNS" },
  { name: "OG 이미지", w: 1200, h: 630, group: "웹" },
  { name: "블로그 썸네일", w: 800, h: 450, group: "웹" },
  { name: "이력서 사진", w: 350, h: 450, group: "문서" },
  { name: "프로필(정사각)", w: 400, h: 400, group: "문서" },
];

type Fmt = "keep" | "jpeg" | "png" | "webp";
type Result = { url: string; filename: string; width: number; height: number; size: number; originalSize: number };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function ext(mime: string, fallback: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return fallback;
}

/**
 * 큰 → 작은 다운샘플은 한 번에 줄이면 aliasing/품질 손상.
 * 절반씩 단계적으로 줄여서 부드럽게 (Photoshop bicubic 흉내).
 */
async function highQualityResize(bitmap: ImageBitmap, targetW: number, targetH: number): Promise<HTMLCanvasElement> {
  let curW = bitmap.width;
  let curH = bitmap.height;
  let canvas = document.createElement("canvas");
  canvas.width = curW;
  canvas.height = curH;
  const ctx0 = canvas.getContext("2d");
  if (!ctx0) throw new Error("Canvas 2D를 사용할 수 없습니다.");
  ctx0.drawImage(bitmap, 0, 0);

  // 다운스케일 다단계: 절반씩 줄이되 목표보다 작아지지 않게
  while (curW > targetW * 2 && curH > targetH * 2) {
    const nextW = Math.max(Math.floor(curW / 2), targetW);
    const nextH = Math.max(Math.floor(curH / 2), targetH);
    const next = document.createElement("canvas");
    next.width = nextW;
    next.height = nextH;
    const nctx = next.getContext("2d");
    if (!nctx) throw new Error("Canvas 2D를 사용할 수 없습니다.");
    nctx.imageSmoothingEnabled = true;
    nctx.imageSmoothingQuality = "high";
    nctx.drawImage(canvas, 0, 0, nextW, nextH);
    canvas = next;
    curW = nextW;
    curH = nextH;
  }

  // 마지막 단계: 정확한 목표 크기로
  if (curW !== targetW || curH !== targetH) {
    const final = document.createElement("canvas");
    final.width = targetW;
    final.height = targetH;
    const fctx = final.getContext("2d");
    if (!fctx) throw new Error("Canvas 2D를 사용할 수 없습니다.");
    fctx.imageSmoothingEnabled = true;
    fctx.imageSmoothingQuality = "high";
    fctx.drawImage(canvas, 0, 0, targetW, targetH);
    canvas = final;
  }

  return canvas;
}

export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDim, setOriginalDim] = useState<{ w: number; h: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<Fmt>("keep");
  const [quality, setQuality] = useState(0.92);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [dragOver, setDragOver] = useState(false);
  // 비율 자동 보정 시 무한 루프 방지
  const lastEditedRef = useRef<"w" | "h">("w");

  // 원본 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [previewUrl, result]);

  const handleFile = async (f: File | null) => {
    setError("");
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!f) {
      setFile(null);
      setOriginalDim(null);
      setPreviewUrl(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      setError("이미지 파일만 추가할 수 있습니다 (JPG·PNG·WebP).");
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    try {
      // EXIF orientation 자동 적용
      const bitmap = await createImageBitmap(f, { imageOrientation: "from-image" });
      setOriginalDim({ w: bitmap.width, h: bitmap.height });
      setWidth(String(bitmap.width));
      setHeight(String(bitmap.height));
      bitmap.close();
    } catch {
      setError("이미지를 읽을 수 없습니다.");
    }
  };

  const onWidth = (v: string) => {
    lastEditedRef.current = "w";
    setWidth(v);
    if (lockRatio && originalDim) {
      const n = parseInt(v, 10);
      if (!isNaN(n) && n > 0) {
        const newH = Math.round((n * originalDim.h) / originalDim.w);
        setHeight(String(newH));
      } else if (v === "") {
        setHeight("");
      }
    }
  };

  const onHeight = (v: string) => {
    lastEditedRef.current = "h";
    setHeight(v);
    if (lockRatio && originalDim) {
      const n = parseInt(v, 10);
      if (!isNaN(n) && n > 0) {
        const newW = Math.round((n * originalDim.w) / originalDim.h);
        setWidth(String(newW));
      } else if (v === "") {
        setWidth("");
      }
    }
  };

  const applyScale = (pct: number) => {
    if (!originalDim) return;
    const w = Math.round((originalDim.w * pct) / 100);
    const h = Math.round((originalDim.h * pct) / 100);
    setWidth(String(w));
    setHeight(String(h));
  };

  const applyPreset = (p: Preset) => {
    setWidth(String(p.w));
    setHeight(String(p.h));
    setLockRatio(false);
  };

  const handleResize = async () => {
    if (!file || !originalDim) return;
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!w || !h || w < 1 || h < 1) {
      setError("올바른 크기를 입력해주세요.");
      return;
    }
    if (w > 10000 || h > 10000) {
      setError("한 변은 최대 10,000px까지 지원합니다.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const canvas = await highQualityResize(bitmap, w, h);
      bitmap.close();

      const outMime =
        format === "keep" ? (file.type || "image/png") :
        format === "jpeg" ? "image/jpeg" :
        format === "png" ? "image/png" :
        "image/webp";
      const useQuality = outMime === "image/jpeg" || outMime === "image/webp";

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("이미지 변환 실패"))),
          outMime,
          useQuality ? quality : undefined,
        );
      });

      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const outExt = ext(outMime, "jpg");
      setResult({
        url,
        filename: `${baseName}_${w}x${h}.${outExt}`,
        width: w,
        height: h,
        size: blob.size,
        originalSize: file.size,
      });
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setResult(null);
    setFile(null);
    setOriginalDim(null);
    setPreviewUrl(null);
    setWidth("");
    setHeight("");
    setError("");
  };

  if (result) {
    const change = result.size > result.originalSize
      ? `+${(((result.size - result.originalSize) / result.originalSize) * 100).toFixed(0)}%`
      : `−${(((result.originalSize - result.size) / result.originalSize) * 100).toFixed(0)}%`;
    return (
      <CalculatorLayout
        title="이미지 크기 변경 (리사이즈, 무료)"
        description="사진 픽셀·비율을 무료로 변경합니다. 인스타·유튜브·블로그·OG 프리셋 + 비율 유지·고화질 리샘플링. 모든 처리는 브라우저 안에서 이뤄집니다."
      >
        <ResultDone
          title="이미지 크기가 변경되었습니다"
          url={result.url}
          filename={result.filename}
          stats={[
            { label: "새 크기", value: `${result.width} × ${result.height}px` },
            { label: "파일", value: formatSize(result.size) },
            { label: "변화", value: change },
          ]}
          currentSlug="/image-resize"
          onReset={reset}
        />
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout
      title="이미지 크기 변경 (리사이즈, 무료)"
      description="사진 픽셀·비율을 무료로 변경합니다. 인스타·유튜브·블로그·OG 프리셋 + 비율 유지·고화질 리샘플링. 모든 처리는 브라우저 안에서 이뤄집니다."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 업로드 */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0] || null);
          }}
          className={`block cursor-pointer rounded-xl border-2 border-dashed p-12 sm:p-16 text-center transition ${
            dragOver
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {file && previewUrl ? (
            <div className="flex flex-col items-center gap-3">
              {(() => {
                const tw = parseInt(width, 10);
                const th = parseInt(height, 10);
                const ow = originalDim?.w ?? 1;
                const oh = originalDim?.h ?? 1;
                const previewW = tw > 0 ? tw : ow;
                const previewH = th > 0 ? th : oh;
                // 컨테이너 한계 안에서 비율 유지하면서 가장 크게
                const maxW = 240;
                const maxH = 180;
                const ratio = previewW / previewH;
                let w = maxW;
                let h = maxW / ratio;
                if (h > maxH) {
                  h = maxH;
                  w = maxH * ratio;
                }
                const distorted = originalDim ? Math.abs(ratio - originalDim.w / originalDim.h) > 0.01 : false;
                return (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="bg-slate-100 dark:bg-slate-900 rounded-md shadow-sm overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 transition-all duration-200"
                      style={{ width: `${w}px`, height: `${h}px` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt=""
                        className="w-full h-full"
                        style={{ objectFit: "fill" }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>미리보기</span>
                      <span>·</span>
                      <span>{previewW} × {previewH}px</span>
                      {distorted && (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                          비율 다름 (이미지 늘어남)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
              <div className="font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-100 truncate max-w-full">{file.name}</div>
              {originalDim && (
                <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  원본 {originalDim.w} × {originalDim.h}px · {formatSize(file.size)}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-5xl sm:text-6xl mb-4">📐</div>
              <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">이미지를 드래그하거나 클릭해서 선택</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">JPG·PNG·WebP · 100% 무료 · 브라우저 내 처리</div>
            </>
          )}
        </label>

        {file && originalDim && (
          <>
            {/* 새 크기 입력 */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">새 크기</div>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <label className="block">
                  <span className="text-xs text-slate-500 dark:text-slate-400">너비 (px)</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(e) => onWidth(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 font-mono text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 tabular-nums"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setLockRatio((v) => !v)}
                  className={`mb-1 inline-flex items-center justify-center w-9 h-9 rounded-lg border transition ${
                    lockRatio
                      ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                  }`}
                  title={lockRatio ? "비율 유지 켜짐" : "비율 유지 꺼짐"}
                  aria-pressed={lockRatio}
                >
                  {lockRatio ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 00-5 5v2H4a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2h-7V7a3 3 0 015.66-1.36 1 1 0 001.73-1A5 5 0 0010 2z" /></svg>
                  )}
                </button>
                <label className="block">
                  <span className="text-xs text-slate-500 dark:text-slate-400">높이 (px)</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) => onHeight(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 font-mono text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 tabular-nums"
                  />
                </label>
              </div>

              {/* 비율 % 빠른 버튼 */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[25, 50, 75, 100, 150, 200].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyScale(pct)}
                    className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* 프리셋 */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">프리셋</div>
              <div className="space-y-3">
                {(["SNS", "웹", "문서"] as const).map((g) => (
                  <div key={g}>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 font-semibold mb-1.5">{g}</div>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.filter((p) => p.group === g).map((p) => {
                        const active = parseInt(width, 10) === p.w && parseInt(height, 10) === p.h;
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => applyPreset(p)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition ${
                              active
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                            }`}
                          >
                            {p.name} <span className="opacity-60 tabular-nums">{p.w}×{p.h}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 포맷 + 품질 */}
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">출력 포맷</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as Fmt)}
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                >
                  <option value="keep">원본 유지</option>
                  <option value="jpeg">JPG (작은 용량)</option>
                  <option value="png">PNG (투명도 보존)</option>
                  <option value="webp">WebP (가장 작은 용량)</option>
                </select>
              </label>
              {(format === "jpeg" || format === "webp" || (format === "keep" && file.type !== "image/png")) && (
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">화질 {Math.round(quality * 100)}%</span>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.01"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="mt-3 w-full accent-indigo-600"
                  />
                </label>
              )}
            </div>

            {/* 업스케일 경고 */}
            {originalDim && parseInt(width, 10) > originalDim.w && (
              <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
                ⓘ 원본({originalDim.w}px)보다 크게 늘리면 화질이 떨어집니다.
              </div>
            )}

            <button
              onClick={handleResize}
              disabled={processing || !width || !height}
              className="w-full mt-6 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "리사이즈 중..." : `📐 ${width || "?"} × ${height || "?"}px로 변경`}
            </button>

            {processing && <ProgressBar label="이미지 리샘플링 중..." indeterminate />}
          </>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 사진이 서버로 전송되지 않습니다. EXIF 회전 정보는 자동 반영되어 모바일 사진도 똑바로 처리됩니다.
      </div>
    </CalculatorLayout>
  );
}
