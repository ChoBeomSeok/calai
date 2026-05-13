"use client";

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Status = "idle" | "loading-model" | "processing" | "done" | "error";
type ModelKey = "isnet" | "isnet_fp16" | "isnet_quint8" | "rmbg14";
type OutFormat = "png" | "webp" | "jpeg";

const ISNET_MODELS: ModelKey[] = ["isnet_fp16", "isnet", "isnet_quint8"];

type Bg =
  | { kind: "transparent" }
  | { kind: "color"; color: string; label: string };

const BG_PRESETS: { key: string; bg: Bg }[] = [
  { key: "transparent", bg: { kind: "transparent" } },
  { key: "white", bg: { kind: "color", color: "#ffffff", label: "흰색" } },
  { key: "id-blue", bg: { kind: "color", color: "#3478F6", label: "증명 파랑" } },
  { key: "id-red", bg: { kind: "color", color: "#E53935", label: "증명 빨강" } },
  { key: "gray", bg: { kind: "color", color: "#E5E7EB", label: "회색" } },
  { key: "black", bg: { kind: "color", color: "#000000", label: "검정" } },
];

const MODEL_INFO: Record<ModelKey, { label: string; size: string; note: string }> = {
  isnet: { label: "고품질", size: "~30MB", note: "정확도 최고, 머리카락·털 세밀" },
  isnet_fp16: { label: "균형", size: "~15MB", note: "빠름 + 충분한 품질 (기본 추천)" },
  isnet_quint8: { label: "초고속", size: "~8MB", note: "모바일·저사양 최적화" },
  rmbg14: { label: "정밀 (RMBG-1.4)", size: "~80MB", note: "인물·아기·반려동물·푹신 디테일 특화" },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function detectWebGPU(): boolean {
  if (typeof navigator === "undefined") return false;
  return "gpu" in navigator;
}

type ProgressFn = (key: string, current: number, total: number) => void;

// ===== RMBG-1.4 모듈 레벨 캐시 (메모리 누수 방지) =====
// model/processor를 매 호출마다 새로 생성하면 wrapper 객체가 계속 쌓임.
// 모듈 스코프에서 한 번만 만들고 재사용.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedRmbgTf: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedRmbgModel: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedRmbgProcessor: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rmbgLoadingPromise: Promise<any> | null = null;

async function getRmbg(onProgress: ProgressFn) {
  if (cachedRmbgTf && cachedRmbgModel && cachedRmbgProcessor) {
    return { tf: cachedRmbgTf, model: cachedRmbgModel, processor: cachedRmbgProcessor };
  }
  // 동시 호출 시 race 방지 — 진행 중인 로딩 promise 공유
  if (rmbgLoadingPromise) return rmbgLoadingPromise;

  rmbgLoadingPromise = (async () => {
    const tf = await import("@huggingface/transformers");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tf.env as any).allowLocalModels = false;
    cachedRmbgTf = tf;

    onProgress("fetch:rmbg-model", 1, 100);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedRmbgModel = await (tf.AutoModel as any).from_pretrained("briaai/RMBG-1.4", {
      config: { model_type: "custom" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      progress_callback: (data: any) => {
        if (data?.status === "progress" && typeof data.progress === "number") {
          onProgress("fetch:rmbg-model", Math.max(1, Math.round(data.progress)), 100);
        }
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedRmbgProcessor = await (tf.AutoProcessor as any).from_pretrained("briaai/RMBG-1.4", {
      config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        image_std: [1, 1, 1],
        resample: 2,
        rescale_factor: 0.00392156862745098,
        size: { width: 1024, height: 1024 },
      },
    });

    return { tf, model: cachedRmbgModel, processor: cachedRmbgProcessor };
  })();

  try {
    return await rmbgLoadingPromise;
  } finally {
    rmbgLoadingPromise = null;
  }
}

// ===== SlimSAM (클릭 분리) 모듈 레벨 캐시 =====
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedSamTf: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedSamModel: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedSamProcessor: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let samLoadingPromise: Promise<any> | null = null;

const SAM_MODEL_ID = "Xenova/slimsam-77-uniform";

// ===== Swin2SR (2배 업스케일) 모듈 레벨 캐시 =====
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedSwin2SRTf: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedSwin2SRPipeline: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let swin2sLoadingPromise: Promise<any> | null = null;

// lightweight x2가 classical보다 메모리 1/3 (attention 채널 수가 적음)
// 화질 차이는 미미하지만 OOM 위험이 훨씬 적음
const SWIN2SR_MODEL_ID = "Xenova/swin2SR-lightweight-x2-64";

async function getSwin2SR(onProgress: (p: number) => void) {
  if (cachedSwin2SRTf && cachedSwin2SRPipeline) {
    return { tf: cachedSwin2SRTf, upscaler: cachedSwin2SRPipeline };
  }
  if (swin2sLoadingPromise) return swin2sLoadingPromise;
  swin2sLoadingPromise = (async () => {
    const tf = await import("@huggingface/transformers");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tf.env as any).allowLocalModels = false;
    cachedSwin2SRTf = tf;
    onProgress(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedSwin2SRPipeline = await (tf.pipeline as any)("image-to-image", SWIN2SR_MODEL_ID, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      progress_callback: (data: any) => {
        if (data?.status === "progress" && typeof data.progress === "number") {
          onProgress(Math.max(1, Math.round(data.progress)));
        }
      },
    });
    return { tf, upscaler: cachedSwin2SRPipeline };
  })();
  try {
    return await swin2sLoadingPromise;
  } finally {
    swin2sLoadingPromise = null;
  }
}

// 누끼 PNG (RGBA Blob) → 타일 단위 Swin2SR 처리로 큰 사진도 지원
// 256×256 타일 + 16px overlap → 각 타일 SR → fade 합성
async function upscaleCutoutBlob(blob: Blob, onProgress: ProgressFn): Promise<Blob> {
  // ONNX Runtime WASM heap 확보를 위해 다른 모델 캐시 해제
  cachedRmbgTf = null;
  cachedRmbgModel = null;
  cachedRmbgProcessor = null;
  rmbgLoadingPromise = null;
  cachedSamTf = null;
  cachedSamModel = null;
  cachedSamProcessor = null;
  samLoadingPromise = null;
  await new Promise((resolve) => setTimeout(resolve, 50));

  const { tf, upscaler } = await getSwin2SR((p) => onProgress("fetch:swin2sr", p, 100));

  onProgress("compute:upscale-load", 1, 100);
  const img = new Image();
  const url = URL.createObjectURL(blob);
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("업스케일 입력 로드 실패"));
      img.src = url;
    });
    const origW = img.naturalWidth;
    const origH = img.naturalHeight;

    const TILE = 256;
    const OVERLAP = 16;
    const STEP = TILE - OVERLAP * 2;
    const SCALE = 2;
    const newW = origW * SCALE;
    const newH = origH * SCALE;
    const fadePx = OVERLAP * SCALE;

    // 원본 RGBA 캔버스 + RGB 분리 캔버스 (흰 배경 합성으로 자연스러운 RGB)
    const orig = document.createElement("canvas");
    orig.width = origW;
    orig.height = origH;
    const octx = orig.getContext("2d");
    if (!octx) throw new Error("canvas context 실패");
    octx.drawImage(img, 0, 0);
    const origData = octx.getImageData(0, 0, origW, origH);

    const rgbCanvas = document.createElement("canvas");
    rgbCanvas.width = origW;
    rgbCanvas.height = origH;
    const rgbctx = rgbCanvas.getContext("2d");
    if (!rgbctx) throw new Error("canvas context 실패");
    rgbctx.fillStyle = "white";
    rgbctx.fillRect(0, 0, origW, origH);
    rgbctx.drawImage(img, 0, 0);

    // 결과 RGB 캔버스
    const finalRgb = document.createElement("canvas");
    finalRgb.width = newW;
    finalRgb.height = newH;
    const fctx = finalRgb.getContext("2d");
    if (!fctx) throw new Error("canvas context 실패");

    // 타일 좌표 리스트 생성 (마지막 타일은 끝까지 펼침)
    type TileCoord = { tx: number; ty: number; tw: number; th: number };
    const tiles: TileCoord[] = [];
    for (let y = 0; y < origH; y += STEP) {
      const ty = Math.max(0, Math.min(y - OVERLAP, origH - TILE));
      const th = Math.min(TILE, origH - ty);
      for (let x = 0; x < origW; x += STEP) {
        const tx = Math.max(0, Math.min(x - OVERLAP, origW - TILE));
        const tw = Math.min(TILE, origW - tx);
        tiles.push({ tx, ty, tw, th });
      }
    }
    // 중복 제거 (가장자리에서 같은 좌표 반복 가능)
    const uniqueTiles = tiles.filter(
      (t, i, arr) =>
        arr.findIndex((u) => u.tx === t.tx && u.ty === t.ty && u.tw === t.tw && u.th === t.th) === i,
    );

    let processedTiles = 0;
    for (const { tx, ty, tw, th } of uniqueTiles) {
      // 타일 추출
      const tile = document.createElement("canvas");
      tile.width = tw;
      tile.height = th;
      const tctx = tile.getContext("2d");
      if (!tctx) continue;
      tctx.drawImage(rgbCanvas, tx, ty, tw, th, 0, 0, tw, th);

      // Blob → SR
      const tileBlob = await new Promise<Blob>((res, rej) =>
        tile.toBlob((b) => (b ? res(b) : rej(new Error("타일 Blob 실패"))), "image/png"),
      );
      const raw = await tf.RawImage.fromBlob(tileBlob);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let upTile: any;
      try {
        upTile = await upscaler(raw);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (
          msg.includes("bad_alloc") ||
          msg.toLowerCase().includes("memory") ||
          msg.includes("OrtRun")
        ) {
          cachedSwin2SRTf = null;
          cachedSwin2SRPipeline = null;
          throw new Error(
            `메모리가 부족합니다 (타일 ${tw}×${th}). 페이지를 새로고침(F5)한 뒤 다시 시도해 주세요.`,
          );
        }
        throw e;
      }

      // 결과 타일에 가장자리 fade 적용 후 큰 캔버스에 합성
      const upCanvas = upTile.toCanvas() as HTMLCanvasElement | OffscreenCanvas;
      const upW = (upCanvas as HTMLCanvasElement).width;
      const upH = (upCanvas as HTMLCanvasElement).height;
      const masked = document.createElement("canvas");
      masked.width = upW;
      masked.height = upH;
      const mctx = masked.getContext("2d");
      if (!mctx) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mctx.drawImage(upCanvas as any, 0, 0);

      // 인접 타일이 있는 방향에만 fade 적용
      // destination-out: source 알파만큼 destination을 제거. fillRect 외부는 영향 없음
      // (destination-in은 fillRect 외부 alpha까지 0으로 만들어버려 사용 불가)
      const hasLeft = tx > 0;
      const hasTop = ty > 0;
      const hasRight = tx + tw < origW;
      const hasBottom = ty + th < origH;
      const applyEdgeFade = (
        x: number,
        y: number,
        w: number,
        h: number,
        dir: "l" | "t" | "r" | "b",
      ) => {
        let grad: CanvasGradient;
        if (dir === "l" || dir === "r") grad = mctx.createLinearGradient(x, 0, x + w, 0);
        else grad = mctx.createLinearGradient(0, y, 0, y + h);
        // 가장자리 끝(타일 경계)은 알파 1(완전 제거), 안쪽은 알파 0(보존)
        if (dir === "l" || dir === "t") {
          grad.addColorStop(0, "rgba(0,0,0,1)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
        } else {
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(1, "rgba(0,0,0,1)");
        }
        mctx.save();
        mctx.globalCompositeOperation = "destination-out";
        mctx.fillStyle = grad;
        mctx.fillRect(x, y, w, h);
        mctx.restore();
      };
      if (hasLeft) applyEdgeFade(0, 0, fadePx, upH, "l");
      if (hasTop) applyEdgeFade(0, 0, upW, fadePx, "t");
      if (hasRight) applyEdgeFade(upW - fadePx, 0, fadePx, upH, "r");
      if (hasBottom) applyEdgeFade(0, upH - fadePx, upW, fadePx, "b");

      const dx = tx * SCALE;
      const dy = ty * SCALE;
      fctx.drawImage(masked, dx, dy);

      processedTiles++;
      onProgress("compute:upscale-tile", processedTiles, uniqueTiles.length);
      // 매 타일 후 setTimeout 양보 — GC 트리거 + UI 갱신
      await new Promise((r) => setTimeout(r, 0));
    }

    onProgress("compute:upscale-alpha", 95, 100);
    // 알파 채널 2배 리사이즈
    const alphaSmall = document.createElement("canvas");
    alphaSmall.width = origW;
    alphaSmall.height = origH;
    const asctx = alphaSmall.getContext("2d");
    if (!asctx) throw new Error("canvas context 실패");
    const aData = asctx.createImageData(origW, origH);
    const ad = aData.data;
    const od = origData.data;
    for (let i = 0; i < origW * origH; i++) {
      ad[4 * i] = 255;
      ad[4 * i + 1] = 255;
      ad[4 * i + 2] = 255;
      ad[4 * i + 3] = od[4 * i + 3];
    }
    asctx.putImageData(aData, 0, 0);

    const alphaLarge = document.createElement("canvas");
    alphaLarge.width = newW;
    alphaLarge.height = newH;
    const alctx = alphaLarge.getContext("2d");
    if (!alctx) throw new Error("canvas context 실패");
    alctx.imageSmoothingEnabled = true;
    alctx.imageSmoothingQuality = "high";
    alctx.drawImage(alphaSmall, 0, 0, newW, newH);
    const largeAlphaData = alctx.getImageData(0, 0, newW, newH);

    // 최종 합성: SR RGB + 리사이즈된 알파
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = newW;
    finalCanvas.height = newH;
    const ffctx = finalCanvas.getContext("2d");
    if (!ffctx) throw new Error("canvas context 실패");
    ffctx.drawImage(finalRgb, 0, 0);

    const finalData = ffctx.getImageData(0, 0, newW, newH);
    const fd = finalData.data;
    const lad = largeAlphaData.data;
    for (let i = 0; i < newW * newH; i++) {
      fd[4 * i + 3] = lad[4 * i + 3];
    }
    ffctx.putImageData(finalData, 0, 0);

    onProgress("compute:upscale-done", 100, 100);
    return await new Promise<Blob>((resolve, reject) =>
      finalCanvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Blob 생성 실패"))),
        "image/png",
        1,
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

// 모든 모델 인스턴스 캐시 해제 — 페이지 unmount 시 호출되어 GC 가능 상태로 만듦
// 다음 방문 시 브라우저 IndexedDB 캐시에서 빠르게 재로딩됨 (모델 파일은 디스크 캐시에 남음)
function releaseModelCaches() {
  cachedRmbgTf = null;
  cachedRmbgModel = null;
  cachedRmbgProcessor = null;
  rmbgLoadingPromise = null;
  cachedSamTf = null;
  cachedSamModel = null;
  cachedSamProcessor = null;
  samLoadingPromise = null;
  cachedSwin2SRTf = null;
  cachedSwin2SRPipeline = null;
  swin2sLoadingPromise = null;
  // ISNet (@imgly/background-removal)는 라이브러리 내부 캐시. dynamic import된 모듈 자체는 살아있지만
  // 인스턴스/텐서는 다음 호출 시 새로 만들어지므로 명시적 dispose 없이도 GC가 회수함
  // (WebWorker로 분리 처리되어 메인 thread heap 비중도 낮음)
}

async function getSamCore(onProgress: (p: number) => void) {
  if (cachedSamTf && cachedSamModel && cachedSamProcessor) {
    return { tf: cachedSamTf, model: cachedSamModel, processor: cachedSamProcessor };
  }
  if (samLoadingPromise) return samLoadingPromise;
  samLoadingPromise = (async () => {
    const tf = await import("@huggingface/transformers");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tf.env as any).allowLocalModels = false;
    cachedSamTf = tf;
    onProgress(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedSamModel = await (tf.SamModel as any).from_pretrained(SAM_MODEL_ID, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      progress_callback: (data: any) => {
        if (data?.status === "progress" && typeof data.progress === "number") {
          onProgress(Math.max(1, Math.round(data.progress)));
        }
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedSamProcessor = await (tf.AutoProcessor as any).from_pretrained(SAM_MODEL_ID);
    return { tf, model: cachedSamModel, processor: cachedSamProcessor };
  })();
  try {
    return await samLoadingPromise;
  } finally {
    samLoadingPromise = null;
  }
}

// 이미지 임베딩: 한 사진 안에서는 클릭마다 재사용 (캐시)
type SamContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tf: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processor: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageInputs: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  embeddings: any;
};

async function prepareSamContext(blob: Blob, onProgress: (p: number) => void): Promise<SamContext> {
  const { tf, model, processor } = await getSamCore(onProgress);
  onProgress(80);
  const image = await tf.RawImage.fromBlob(blob);
  const imageInputs = await processor(image);
  const embeddings = await model.get_image_embeddings({ pixel_values: imageInputs.pixel_values });
  onProgress(100);
  return { tf, model, processor, image, imageInputs, embeddings };
}

type SamPoint = { x: number; y: number; label: 0 | 1 };

// 사용자 클릭 포인트들 → SAM 추론 → 가장 점수 높은 마스크 (원본 해상도 Uint8Array, 0/255)
async function runSam(
  ctx: SamContext,
  points: SamPoint[],
): Promise<{ data: Uint8Array; width: number; height: number } | null> {
  if (points.length === 0) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tf = ctx.tf as any;
  // input_points shape: [batch=1, point_batch=1, num_points, 2]
  const flatPoints = new Float32Array(points.length * 2);
  const flatLabels = new BigInt64Array(points.length);
  points.forEach((p, i) => {
    flatPoints[i * 2] = p.x;
    flatPoints[i * 2 + 1] = p.y;
    flatLabels[i] = BigInt(p.label);
  });
  const inputPoints = new tf.Tensor("float32", flatPoints, [1, 1, points.length, 2]);
  const inputLabels = new tf.Tensor("int64", flatLabels, [1, 1, points.length]);
  const outputs = await ctx.model({
    ...ctx.embeddings,
    input_points: inputPoints,
    input_labels: inputLabels,
  });
  const masks = await ctx.processor.post_process_masks(
    outputs.pred_masks,
    ctx.imageInputs.original_sizes,
    ctx.imageInputs.reshaped_input_sizes,
  );
  // masks[0]: Tensor dims [1, 3, H, W] (3 mask candidates) type "bool" data Uint8Array
  // iou_scores: Tensor dims [1, 1, 3]
  // 가장 높은 점수 마스크 선택
  const iouScores = outputs.iou_scores.data as Float32Array;
  let bestIdx = 0;
  let bestScore = iouScores[0];
  for (let i = 1; i < iouScores.length; i++) {
    if (iouScores[i] > bestScore) {
      bestScore = iouScores[i];
      bestIdx = i;
    }
  }
  const maskTensor = masks[0];
  // dims: [1, 3, H, W]
  const [, , H, W] = maskTensor.dims as number[];
  const total = H * W;
  const allData = maskTensor.data as Uint8Array;
  const out = new Uint8Array(total);
  const offset = bestIdx * total;
  for (let i = 0; i < total; i++) {
    out[i] = allData[offset + i] ? 255 : 0;
  }
  return { data: out, width: W, height: H };
}

// RMBG-1.4 (BRIA, Hugging Face Transformers.js) — 인물·아기 특화
async function removeWithRmbg(file: File, onProgress: ProgressFn): Promise<Blob> {
  const { tf, model, processor } = await getRmbg(onProgress);

  onProgress("compute:preprocess", 80, 100);
  const image = await tf.RawImage.fromBlob(file);
  const { pixel_values } = await processor(image);

  onProgress("compute:inference", 88, 100);
  const { output } = await model({ input: pixel_values });

  onProgress("compute:postprocess", 95, 100);
  // 마스크: output[0] (단일 채널 알파) → uint8 → 원본 크기로 리사이즈
  const mask = await tf.RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
    image.width,
    image.height,
  );

  // 합성: 원본 RGB는 그대로 두고, 알파 채널만 마스크 값으로 직접 갱신
  // (canvas globalCompositeOperation으로 합성하면 단일 채널 마스크가 RGBA 변환 시 손실됨)
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas context 실패");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx.drawImage(image.toCanvas() as any, 0, 0);

  const pixelData = ctx.getImageData(0, 0, image.width, image.height);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maskData = (mask as any).data as Uint8Array | Uint8ClampedArray;
  const n = maskData.length;
  for (let i = 0; i < n; i++) {
    pixelData.data[4 * i + 3] = maskData[i];
  }
  ctx.putImageData(pixelData, 0, 0);

  onProgress("compute:done", 100, 100);

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Blob 생성 실패"))), "image/png", 0.95),
  );
}

export default function RemoveBackgroundPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cutoutBlob, setCutoutBlob] = useState<Blob | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [bgKey, setBgKey] = useState<string>("transparent");
  const [customColor, setCustomColor] = useState("#a5b4fc");
  const [useCustom, setUseCustom] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // 1차 옵션
  const [model, setModel] = useState<ModelKey>("isnet_fp16");
  const [useGpu, setUseGpu] = useState(true);
  const [gpuActive, setGpuActive] = useState(false);
  const [preloaded, setPreloaded] = useState(false);

  // 2차 옵션
  const [smoothness, setSmoothness] = useState(0);
  const [shadow, setShadow] = useState(false);
  const [outFormat, setOutFormat] = useState<OutFormat>("png");
  const [alphaThreshold, setAlphaThreshold] = useState(0);

  // SAM (클릭 분리)
  const [isSamEditing, setIsSamEditing] = useState(false);

  // 2배 업스케일 (Swin2SR)
  const [upscale2x, setUpscale2x] = useState(false);
  const [upscaleStatus, setUpscaleStatus] = useState<{ active: boolean; label: string; pct: number }>(
    { active: false, label: "", pct: 0 },
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // SSR-safe: 서버에서는 false, 클라이언트 hydration 후 navigator.gpu 체크
  const webgpuSupported = useSyncExternalStore(
    () => () => {},
    () => detectWebGPU(),
    () => false,
  );

  // preload — 페이지 진입 후 idle 상태에서 백그라운드로 모델 다운로드 시작
  // RMBG-1.4는 ~80MB로 무거우므로 자동 preload 하지 않고 사용자 클릭 시점에만 받음
  useEffect(() => {
    if (preloaded) return;
    if (model === "rmbg14") return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const mod = await import("@imgly/background-removal");
        await mod.preload({
          model,
          device: useGpu && webgpuSupported ? "gpu" : "cpu",
        });
        if (!cancelled) setPreloaded(true);
      } catch (e) {
        console.warn("preload 실패 (무시):", e);
      }
    }, 800);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [model, useGpu, preloaded, webgpuSupported]);

  // cleanup blob URLs — 두 URL의 cleanup을 분리해야 한쪽 변경이 다른 쪽 revoke를 일으키지 않음
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);
  useEffect(() => {
    return () => {
      if (cutoutUrl) URL.revokeObjectURL(cutoutUrl);
    };
  }, [cutoutUrl]);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (cutoutUrl) URL.revokeObjectURL(cutoutUrl);
    setFile(null);
    setOriginalUrl(null);
    setCutoutBlob(null);
    setCutoutUrl(null);
    setStatus("idle");
    setProgress({ current: 0, total: 0, label: "" });
    setError("");
  }, [originalUrl, cutoutUrl]);

  const handleFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith("image/")) {
        setError("이미지 파일만 업로드할 수 있습니다 (JPG·PNG·WebP).");
        return;
      }
      if (f.size > 25 * 1024 * 1024) {
        setError("25MB 이하의 이미지만 처리할 수 있습니다.");
        return;
      }
      reset();
      setError("");
      setFile(f);
      setOriginalUrl(URL.createObjectURL(f));
    },
    [reset],
  );

  const runRemove = useCallback(async () => {
    if (!file) return;
    setError("");
    setStatus("loading-model");
    setProgress({ current: 0, total: 0, label: "모델 준비 중" });

    const onProgress: ProgressFn = (key, current, total) => {
      setStatus((prev) => (prev === "loading-model" && key.startsWith("compute") ? "processing" : prev));
      setProgress({
        current,
        total,
        label: key.startsWith("fetch")
          ? key.includes("rmbg")
            ? "RMBG-1.4 다운로드"
            : "모델 다운로드"
          : key.startsWith("compute")
            ? "AI 분석 중"
            : key,
      });
    };

    try {
      let blob: Blob;
      if (model === "rmbg14") {
        // 정밀 모드: BRIA RMBG-1.4 (Transformers.js)
        blob = await removeWithRmbg(file, onProgress);
        setGpuActive(false);
      } else {
        // 빠름 모드: ISNet (@imgly/background-removal)
        const desiredDevice: "gpu" | "cpu" = useGpu && webgpuSupported ? "gpu" : "cpu";
        const attempt = async (device: "gpu" | "cpu"): Promise<Blob> => {
          const mod = await import("@imgly/background-removal");
          return mod.removeBackground(file, {
            model: model as "isnet" | "isnet_fp16" | "isnet_quint8",
            device,
            progress: onProgress,
            output: { format: "image/png", quality: 0.95 },
          });
        };
        try {
          blob = await attempt(desiredDevice);
          setGpuActive(desiredDevice === "gpu");
        } catch (gpuErr) {
          if (desiredDevice === "gpu") {
            console.warn("GPU 실패, CPU로 폴백:", gpuErr);
            setProgress({ current: 0, total: 0, label: "GPU 폴백 → CPU 모드" });
            blob = await attempt("cpu");
            setGpuActive(false);
          } else {
            throw gpuErr;
          }
        }
      }
      setCutoutBlob(blob);
      setCutoutUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error
          ? `처리 실패: ${e.message}`
          : "처리 중 오류가 발생했습니다. 다른 사진으로 다시 시도해 주세요.",
      );
      setStatus("error");
    }
  }, [file, model, useGpu, webgpuSupported]);

  // ---- 합성 유틸 (2차: 스무딩 + 그림자 + 포맷) ----
  const composeFinal = useCallback(
    async (bg: Bg, fmt: OutFormat = outFormat): Promise<Blob> => {
      if (!cutoutBlob) throw new Error("처리된 이미지가 없습니다");
      const img = new Image();
      const url = URL.createObjectURL(cutoutBlob);
      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("이미지 디코딩 실패"));
          img.src = url;
        });

        // 1) 알파 채널 스무딩 적용된 cutout 캔버스 생성
        const cutout = document.createElement("canvas");
        cutout.width = img.naturalWidth;
        cutout.height = img.naturalHeight;
        const cctx = cutout.getContext("2d");
        if (!cctx) throw new Error("canvas context 실패");
        cctx.drawImage(img, 0, 0);

        if (alphaThreshold > 0) {
          applyAlphaThreshold(cutout, alphaThreshold);
        }
        if (smoothness > 0) {
          smoothAlphaChannel(cutout, smoothness);
        }

        // 2) 최종 합성 캔버스
        const out = document.createElement("canvas");
        out.width = img.naturalWidth;
        out.height = img.naturalHeight;
        const octx = out.getContext("2d");
        if (!octx) throw new Error("canvas context 실패");

        // 배경 채우기
        if (bg.kind === "color") {
          octx.fillStyle = bg.color;
          octx.fillRect(0, 0, out.width, out.height);
        }

        // 그림자 (배경 + 그림자 → cutout 순)
        if (shadow) {
          drawGroundShadow(octx, cutout);
        }

        // cutout 본체
        octx.drawImage(cutout, 0, 0);

        const mime =
          fmt === "webp" ? "image/webp" : fmt === "jpeg" ? "image/jpeg" : "image/png";
        return await new Promise<Blob>((resolve, reject) =>
          out.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Blob 생성 실패"))),
            mime,
            0.95,
          ),
        );
      } finally {
        URL.revokeObjectURL(url);
      }
    },
    [cutoutBlob, smoothness, shadow, outFormat, alphaThreshold],
  );

  // 미리보기 — bg/smooth/shadow 바뀔 때마다 합성
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // 현재 활성 previewUrl을 ref로 추적 → 다음 effect에서 확실히 revoke (state 비동기 race 회피)
  const activePreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const update = async () => {
      if (!cutoutBlob) {
        if (activePreviewUrlRef.current) {
          URL.revokeObjectURL(activePreviewUrlRef.current);
          activePreviewUrlRef.current = null;
        }
        setPreviewUrl(null);
        return;
      }
      const bg = currentBg(bgKey, useCustom, customColor);
      try {
        const composed = await composeFinal(bg, "png");
        if (cancelled) return;
        const url = URL.createObjectURL(composed);
        // 이전 URL revoke 후 새 URL 활성화
        if (activePreviewUrlRef.current) URL.revokeObjectURL(activePreviewUrlRef.current);
        activePreviewUrlRef.current = url;
        setPreviewUrl(url);
      } catch (e) {
        console.error(e);
      }
    };
    update();
    return () => {
      cancelled = true;
    };
  }, [cutoutBlob, bgKey, useCustom, customColor, composeFinal]);

  // 언마운트 시 마지막 previewUrl 정리 + 모델 캐시 해제 (다른 페이지로 이동 시 메모리 회수)
  useEffect(() => {
    return () => {
      if (activePreviewUrlRef.current) {
        URL.revokeObjectURL(activePreviewUrlRef.current);
        activePreviewUrlRef.current = null;
      }
      releaseModelCaches();
    };
  }, []);

  const handleDownload = async () => {
    if (!cutoutBlob) return;
    const bg = currentBg(bgKey, useCustom, customColor);
    // JPEG는 투명도 못 가짐 → 배경이 투명이면 PNG로 강제
    const effectiveFmt: OutFormat =
      outFormat === "jpeg" && bg.kind === "transparent" ? "png" : outFormat;

    try {
      // 1) 배경·마감 합성
      let blob = await composeFinal(bg, upscale2x ? "png" : effectiveFmt);

      // 2) (선택) 2배 업스케일
      if (upscale2x) {
        setUpscaleStatus({ active: true, label: "AI 모델 준비 중", pct: 0 });
        try {
          blob = await upscaleCutoutBlob(blob, (key, current, total) => {
            const pct = total > 0 ? Math.round((current / total) * 100) : 0;
            const label = key.startsWith("fetch")
              ? "화질 개선 모델 다운로드"
              : key.includes("upscale-tile") || key.includes("upscale-sr")
                ? "화질 개선 중"
                : key.includes("upscale-alpha") || key.includes("upscale-compose")
                  ? "후처리 중"
                  : "처리 중";
            setUpscaleStatus({ active: true, label, pct });
          });
          // 업스케일 후 포맷이 jpeg/webp면 다시 한 번 인코딩
          if (effectiveFmt !== "png") {
            const img = new Image();
            const u = URL.createObjectURL(blob);
            try {
              await new Promise<void>((res, rej) => {
                img.onload = () => res();
                img.onerror = () => rej(new Error("재인코딩 실패"));
                img.src = u;
              });
              const c = document.createElement("canvas");
              c.width = img.naturalWidth;
              c.height = img.naturalHeight;
              const cx = c.getContext("2d");
              if (cx) {
                cx.drawImage(img, 0, 0);
                blob = await new Promise<Blob>((res, rej) =>
                  c.toBlob(
                    (b) => (b ? res(b) : rej(new Error("Blob 실패"))),
                    effectiveFmt === "webp" ? "image/webp" : "image/jpeg",
                    0.95,
                  ),
                );
              }
            } finally {
              URL.revokeObjectURL(u);
            }
          }
        } finally {
          setUpscaleStatus({ active: false, label: "", pct: 0 });
        }
      }

      // 3) 다운로드
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = file?.name.replace(/\.[^.]+$/, "") || "background-removed";
      const ext = effectiveFmt === "jpeg" ? "jpg" : effectiveFmt;
      const tag = bg.kind === "transparent" ? "" : "-" + (bg.label || "bg");
      const upTag = upscale2x ? "-2x" : "";
      a.download = `${baseName}${tag}${upTag}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error(e);
      setUpscaleStatus({ active: false, label: "", pct: 0 });
      setError(e instanceof Error ? e.message : "다운로드 처리 실패");
    }
  };

  return (
    <CalculatorLayout
      title="사진 누끼 따기 (배경 제거, 무료)"
      description="가입·로그인 없이 브라우저에서 즉시 누끼 따기. 인물·상품·반려동물 자동 인식. 사진은 외부 전송 0건, 완전 무료."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">

        {/* 업로드 영역 */}
        {!file && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
              dragOver
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
            }`}
          >
            <div className="text-5xl mb-3">🖼️</div>
            <div className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
              사진을 끌어다 놓거나 클릭해서 업로드
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              JPG · PNG · WebP / 최대 25MB / 1장씩 처리
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-800 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* 처리 전: 원본 + 시작 버튼 */}
        {file && status === "idle" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4 flex items-center justify-center min-h-[260px]">
              {originalUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={originalUrl} alt="원본" className="max-h-[400px] max-w-full rounded-lg" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-600 dark:text-slate-400 truncate">
                <span className="font-medium">{file.name}</span> · {formatSize(file.size)}
              </div>
              <button onClick={reset} className="text-slate-500 hover:text-rose-600 text-xs">
                ✕ 다른 사진
              </button>
            </div>

            <details open className="rounded-xl border border-slate-200 dark:border-slate-700 group">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>⚙️ 처리 옵션 (모델·가속)</span>
                <span className="text-xs text-slate-400">
                  {MODEL_INFO[model].label}
                  {model !== "rmbg14" && ` · ${useGpu && webgpuSupported ? "GPU" : "CPU"}`}
                </span>
              </summary>
              <div className="px-4 pb-4 pt-1 space-y-4 text-sm">
                <div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                    빠른 모델 (ISNet) — 일반 객체용
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {ISNET_MODELS.map((k) => {
                      const info = MODEL_INFO[k];
                      return (
                        <button
                          key={k}
                          onClick={() => {
                            if (k !== model) {
                              setModel(k);
                              setPreloaded(false);
                            }
                          }}
                          className={`px-2 py-2 rounded-lg border text-xs text-left transition ${
                            model === k
                              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 ring-2 ring-indigo-200"
                              : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
                          }`}
                        >
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{info.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{info.size}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{info.note}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                    정밀 모델 — 인물·아기·반려동물 특화
                  </div>
                  <button
                    onClick={() => {
                      if (model !== "rmbg14") {
                        setModel("rmbg14");
                        setPreloaded(false);
                      }
                    }}
                    className={`w-full px-3 py-3 rounded-lg border text-left transition ${
                      model === "rmbg14"
                        ? "border-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950 ring-2 ring-fuchsia-200"
                        : "border-slate-300 dark:border-slate-600 hover:border-fuchsia-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          ✨ {MODEL_INFO.rmbg14.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {MODEL_INFO.rmbg14.note}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {MODEL_INFO.rmbg14.size}
                      </div>
                    </div>
                    <div className="text-[11px] text-fuchsia-700 dark:text-fuchsia-400 mt-1">
                      머리카락·털·푹신 디테일·옷 가장자리에 압도적으로 강함. 처음 사용 시 다운로드 후 캐시됨.
                    </div>
                  </button>
                </div>

                <label className={`flex items-start gap-2 ${model === "rmbg14" ? "opacity-40" : "cursor-pointer"}`}>
                  <input
                    type="checkbox"
                    checked={useGpu}
                    onChange={(e) => {
                      setUseGpu(e.target.checked);
                      setPreloaded(false);
                    }}
                    disabled={!webgpuSupported || model === "rmbg14"}
                    className="w-4 h-4 mt-0.5"
                  />
                  <span className="text-sm">
                    GPU 가속 (WebGPU){" "}
                    {!webgpuSupported && (
                      <span className="text-xs text-slate-400">— 이 브라우저에서 미지원, CPU로 자동 처리</span>
                    )}
                    {model === "rmbg14" && webgpuSupported && (
                      <span className="text-xs text-slate-400">— RMBG-1.4는 CPU/WASM 자동 처리</span>
                    )}
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Chrome 113+ / Edge 권장. ISNet에서 4K 사진 기준 5~10배 빠름.
                    </span>
                  </span>
                </label>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      model === "rmbg14"
                        ? "bg-amber-500"
                        : preloaded
                          ? "bg-emerald-500"
                          : "bg-slate-400 animate-pulse"
                    }`}
                  />
                  {model === "rmbg14"
                    ? "RMBG-1.4는 첫 사용 시점에 다운로드 (~80MB)"
                    : preloaded
                      ? "모델 캐시 준비 완료"
                      : "모델 백그라운드 다운로드 중..."}
                </div>
              </div>
            </details>

            <button
              onClick={runRemove}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 text-base transition"
            >
              ✨ 누끼 따기 시작
            </button>
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              {model === "rmbg14"
                ? `정밀 모델 (RMBG-1.4 ${MODEL_INFO.rmbg14.size}) — 처음 사용 시 다운로드 후 캐시됩니다`
                : preloaded
                  ? "모델 준비 완료 · 클릭 즉시 처리됩니다"
                  : `최초 1회 ${MODEL_INFO[model].size} 모델 다운로드 후 브라우저에 캐시됩니다`}
            </div>
          </div>
        )}

        {/* 진행 중 */}
        {(status === "loading-model" || status === "processing") && (
          <div className="py-10 text-center">
            <div className="text-4xl mb-4 animate-pulse">🤖</div>
            <div className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {status === "loading-model" ? "AI 모델 준비 중..." : "AI가 배경을 분석하고 있어요..."}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">{progress.label}</div>
            {progress.total > 0 && (
              <div className="max-w-md mx-auto">
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {Math.min(100, Math.round((progress.current / progress.total) * 100))}%
                </div>
              </div>
            )}
            <div className="mt-6 text-[11px] text-slate-400">사진은 외부로 전송되지 않습니다 (브라우저 내 처리)</div>
          </div>
        )}

        {/* SAM 클릭 분리 모드 */}
        {status === "done" && isSamEditing && cutoutBlob && file && (
          <SamEditor
            cutoutBlob={cutoutBlob}
            originalBlob={file}
            onSave={(newBlob) => {
              if (cutoutUrl) URL.revokeObjectURL(cutoutUrl);
              setCutoutBlob(newBlob);
              setCutoutUrl(URL.createObjectURL(newBlob));
              setIsSamEditing(false);
            }}
            onCancel={() => setIsSamEditing(false)}
          />
        )}

        {/* 결과 */}
        {status === "done" && !isSamEditing && cutoutUrl && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-2">원본</div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3 flex items-center justify-center min-h-[260px]">
                  {originalUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={originalUrl} alt="원본" className="max-h-[300px] max-w-full rounded-lg" />
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span>결과</span>
                  <span className="text-[10px] text-slate-400">
                    {model === "rmbg14" ? "WASM 처리" : gpuActive ? "GPU 처리" : "CPU 처리"} ·{" "}
                    {MODEL_INFO[model].label}
                  </span>
                </div>
                <div
                  className="rounded-xl p-3 flex items-center justify-center min-h-[260px]"
                  style={{
                    background:
                      bgKey === "transparent" && !useCustom
                        ? "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px"
                        : "#f1f5f9",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl || cutoutUrl}
                    alt="누끼 결과"
                    className="max-h-[300px] max-w-full rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 배경 선택 */}
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">배경</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {BG_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => {
                      setBgKey(p.key);
                      setUseCustom(false);
                    }}
                    className={`px-2 py-2 rounded-lg text-xs font-medium border transition flex flex-col items-center gap-1 ${
                      bgKey === p.key && !useCustom
                        ? "border-indigo-600 ring-2 ring-indigo-200"
                        : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
                    }`}
                  >
                    <span
                      className="block w-6 h-6 rounded border border-slate-300"
                      style={{
                        background:
                          p.bg.kind === "transparent"
                            ? "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 8px 8px"
                            : p.bg.color,
                      }}
                    />
                    {p.bg.kind === "transparent" ? "투명" : p.bg.label}
                  </button>
                ))}
              </div>
              <label className="mt-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">사용자 지정 색상</span>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  disabled={!useCustom}
                  className="w-10 h-8 rounded border border-slate-300 disabled:opacity-40"
                />
                <span className="text-xs text-slate-500">{useCustom ? customColor : "체크 후 선택"}</span>
              </label>
            </div>

            {/* 마감 옵션 (2차) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">마감 옵션</div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-600 dark:text-slate-400">알파 임계값 (잔존물 정리)</label>
                  <span className="text-xs text-slate-500">{alphaThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.45"
                  step="0.05"
                  value={alphaThreshold}
                  onChange={(e) => setAlphaThreshold(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  발 아래 받침·옅은 그림자 같은 흐릿한 잔존물 제거 (0=그대로, 권장 0.1~0.25)
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-600 dark:text-slate-400">엣지 스무딩</label>
                  <span className="text-xs text-slate-500">{smoothness.toFixed(1)} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={smoothness}
                  onChange={(e) => setSmoothness(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  가장자리·머리카락을 부드럽게 (0=원본 그대로, 권장 0.5~2)
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shadow}
                  onChange={(e) => setShadow(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">발밑 그림자 추가</span>
                <span className="text-[11px] text-slate-400 ml-1">상품·인물 합성 시 자연스러움 ↑</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50/50 dark:bg-fuchsia-950/30">
                <input
                  type="checkbox"
                  checked={upscale2x}
                  onChange={(e) => setUpscale2x(e.target.checked)}
                  className="w-4 h-4 mt-0.5"
                />
                <span className="text-sm">
                  <span className="text-slate-800 dark:text-slate-200 font-medium">🔍 화질 개선 (AI 2배)</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    AI로 결과 해상도를 2배로 확대해 머리카락·털·작은 디테일을 또렷하게 복원. 256×256 타일 분할 처리로 큰 사진도 가능.
                  </span>
                  <strong className="block text-[11px] text-fuchsia-700 dark:text-fuchsia-400 mt-1">
                    ⚠️ 체크만으로는 적용되지 않습니다 — 아래 <strong>⬇️ 다운로드</strong> 버튼을 눌러야 처리가 시작돼요.
                  </strong>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    처리 시간: 작은 사진 ~5초, 큰 사진(1000×1000+)은 ~30초~1분. 첫 사용 시 모델 ~25MB 다운로드.
                  </span>
                </span>
              </label>

              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">출력 포맷</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["png", "webp", "jpeg"] as OutFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setOutFormat(f)}
                      className={`px-2 py-2 rounded-lg border text-xs font-medium transition ${
                        outFormat === f
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950"
                          : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
                      }`}
                    >
                      {f === "png"
                        ? "PNG (투명 ✓)"
                        : f === "webp"
                          ? "WebP (작고 투명 ✓)"
                          : "JPG (가장 작음)"}
                    </button>
                  ))}
                </div>
                {outFormat === "jpeg" && bgKey === "transparent" && !useCustom && (
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    ⚠️ JPG는 투명도 불가 — 다운로드 시 자동으로 PNG로 저장됩니다
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDownload}
                disabled={upscaleStatus.active}
                className={`flex-1 rounded-xl font-semibold py-3 transition disabled:opacity-50 disabled:cursor-not-allowed text-white ${
                  upscale2x && !upscaleStatus.active
                    ? "bg-fuchsia-600 hover:bg-fuchsia-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {upscaleStatus.active
                  ? `${upscaleStatus.label}... ${upscaleStatus.pct}%`
                  : upscale2x
                    ? "🔍 화질 개선 후 다운로드"
                    : "⬇️ 결과 다운로드"}
              </button>
              <button
                onClick={() => setIsSamEditing(true)}
                disabled={upscaleStatus.active}
                className="rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-5 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✨ 클릭 분리
              </button>
              <button
                onClick={reset}
                disabled={upscaleStatus.active}
                className="rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium py-3 px-5 hover:border-indigo-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다른 사진
              </button>
            </div>
            {upscaleStatus.active && (
              <div className="h-1.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950 overflow-hidden">
                <div
                  className="h-full bg-fuchsia-600 transition-all"
                  style={{ width: `${upscaleStatus.pct}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 사용 방법 */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-4">사용 방법</h2>
        <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span>
              <strong>사진 업로드</strong> — 드래그앤드롭 또는 클릭. JPG·PNG·WebP, 최대 25MB
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span>
              <strong>모델 선택</strong> — 일반 객체는 <strong>빠른 모델(ISNet)</strong>, 인물·아기·반려동물·푹신
              디테일은 <strong>정밀 모델(RMBG-1.4)</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span>
              <strong>✨ 누끼 따기 시작</strong> 클릭 — 첫 사용 시 모델 다운로드 후 자동 처리
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <span>
              <strong>배경·마감 조정</strong> — 투명·흰색·증명 파랑·빨강 등 배경 변경, 엣지 스무딩·알파 임계값·그림자
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-700 dark:text-fuchsia-300 text-xs font-bold flex items-center justify-center">
              5
            </span>
            <span>
              <strong>(선택) ✨ 클릭 분리</strong> — 자동 누끼가 놓친 영역을 클릭으로 정밀 제거 (SAM)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
              6
            </span>
            <span>
              <strong>⬇️ 결과 다운로드</strong> — PNG·WebP(투명 ✓) 또는 JPG
            </span>
          </li>
        </ol>
      </div>

      {/* 사용 안내 */}
      <div className="mt-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">활용</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm">
          <li>중고거래·당근마켓·번개장터 상품 사진 깔끔하게</li>
          <li>블로그·인스타·유튜브 썸네일 인물·상품 컷아웃</li>
          <li>PPT·제안서·포트폴리오 이미지 배경 정리</li>
          <li>증명사진 배경색 (파랑·빨강·흰색) 즉시 변경</li>
          <li>반려동물·물건·인물 모두 자동 인식</li>
        </ul>
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base mt-4">개인정보·안전</h2>
        <p className="text-xs">
          사진은 서버로 업로드되지 않습니다. AI 모델이 브라우저로 다운로드되어 사용자의 기기 내에서만 처리됩니다.
          처리된 이미지·원본 모두 외부로 전송되지 않으며, 페이지를 닫으면 메모리에서 즉시 사라집니다.
        </p>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>팁</strong>: 인물·상품의 윤곽이 또렷한 사진일수록 결과가 깔끔합니다. 머리카락·털·반투명 물체는
        엣지 스무딩 슬라이더로 더 자연스럽게 다듬을 수 있어요.
      </div>
      <div className="mt-3 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950 border border-fuchsia-200 dark:border-fuchsia-800 p-3 text-xs text-fuchsia-900 dark:text-fuchsia-300">
        ✨ <strong>아기·반려동물·푹신 의상</strong>처럼 빠른 모델이 약한 케이스는 처리 옵션에서{" "}
        <strong>정밀 (RMBG-1.4)</strong> 모델로 바꿔보세요. 첫 사용 시 ~80MB 다운로드되지만 머리카락·털·옷
        가장자리가 훨씬 자연스러워집니다.
      </div>
    </CalculatorLayout>
  );
}


// ===== SamEditor — 클릭 분리 모드 =====
// 사용자가 사진 위 클릭 → SlimSAM이 해당 영역을 자동 인식 → 마스크 영역만큼 cutout에서 제거
// + 클릭(녹색): 빼내고 싶은 객체의 일부, − 클릭(빨강): 빼지 말아야 할 부분 (정제용)
function SamEditor({
  cutoutBlob,
  originalBlob,
  onSave,
  onCancel,
}: {
  cutoutBlob: Blob;
  originalBlob: Blob;
  onSave: (newBlob: Blob) => void;
  onCancel: () => void;
}) {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null); // 작업 중 cutout 표시
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null); // 마스크 오버레이
  const samCtxRef = useRef<SamContext | null>(null);

  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState<SamPoint[]>([]);
  const [pointMode, setPointMode] = useState<"add" | "exclude">("add");
  const [isComputing, setIsComputing] = useState(false);
  const [currentMask, setCurrentMask] = useState<{
    data: Uint8Array;
    width: number;
    height: number;
  } | null>(null);
  const [workingBlob, setWorkingBlob] = useState<Blob>(cutoutBlob);
  const [error, setError] = useState("");

  // Undo/Redo — workingBlob 히스토리 스택 (최대 20개)
  const historyRef = useRef<{ stack: Blob[]; index: number }>({ stack: [cutoutBlob], index: 0 });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const refreshUndoRedo = useCallback(() => {
    const h = historyRef.current;
    setCanUndo(h.index > 0);
    setCanRedo(h.index < h.stack.length - 1);
  }, []);

  // SAM 모델 + 이미지 임베딩 준비 (원본 기준)
  // 초기 state가 이미 "loading"/0이므로 effect 시작 시 setState 불필요
  useEffect(() => {
    let cancelled = false;
    prepareSamContext(originalBlob, (p) => {
      if (!cancelled) setProgress(p);
    })
      .then((ctx) => {
        if (cancelled) return;
        samCtxRef.current = ctx;
        setModelStatus("ready");
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "SAM 모델 로딩 실패");
          setModelStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [originalBlob]);

  // workingBlob을 base canvas에 그림
  // modelStatus가 "ready"가 되어야 캔버스가 DOM에 마운트되므로 deps에 포함시켜 캔버스 마운트 직후 그리도록 함
  useEffect(() => {
    if (modelStatus !== "ready") return;
    let cancelled = false;
    let objUrl: string | null = null;
    const draw = async () => {
      try {
        objUrl = URL.createObjectURL(workingBlob);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("cutout 로드 실패"));
          img.src = objUrl as string;
        });
        if (cancelled) return;
        const base = baseCanvasRef.current;
        const overlay = overlayCanvasRef.current;
        if (!base || !overlay) return;
        base.width = img.naturalWidth;
        base.height = img.naturalHeight;
        overlay.width = img.naturalWidth;
        overlay.height = img.naturalHeight;
        const bctx = base.getContext("2d");
        if (!bctx) return;
        bctx.clearRect(0, 0, base.width, base.height);
        bctx.drawImage(img, 0, 0);
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (objUrl) URL.revokeObjectURL(objUrl);
      }
    };
    draw();
    return () => {
      cancelled = true;
    };
  }, [workingBlob, modelStatus]);

  // 마스크 갱신 시 오버레이 그리기
  useEffect(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    if (!currentMask) return;
    // 마스크 → ImageData (반투명 빨강)
    const { data: mask, width: mw, height: mh } = currentMask;
    if (mw !== overlay.width || mh !== overlay.height) return;
    const imageData = ctx.createImageData(mw, mh);
    const d = imageData.data;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i]) {
        d[4 * i + 0] = 239; // red-500
        d[4 * i + 1] = 68;
        d[4 * i + 2] = 68;
        d[4 * i + 3] = 110; // ~43% alpha
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [currentMask]);

  // 포인트 변경 시 SAM 추론 (points가 빈 배열이면 호출 자체 skip — currentMask 초기화는 handler에서)
  useEffect(() => {
    if (modelStatus !== "ready") return;
    if (points.length === 0) return;
    const ctx = samCtxRef.current;
    if (!ctx) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setIsComputing(true);
    });
    runSam(ctx, points)
      .then((mask) => {
        if (cancelled) return;
        setCurrentMask(mask);
      })
      .catch((e) => {
        if (!cancelled) console.error(e);
      })
      .finally(() => {
        if (!cancelled) setIsComputing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [points, modelStatus]);

  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const rect = overlay.getBoundingClientRect();
    const scaleX = overlay.width / rect.width;
    const scaleY = overlay.height / rect.height;
    const clientX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.changedTouches[0].clientY : e.clientY;
    const x = Math.round((clientX - rect.left) * scaleX);
    const y = Math.round((clientY - rect.top) * scaleY);
    if (x < 0 || y < 0 || x >= overlay.width || y >= overlay.height) return;
    setPoints((prev) => [...prev, { x, y, label: pointMode === "add" ? 1 : 0 }]);
  };

  const handleReset = () => {
    setPoints([]);
    setCurrentMask(null);
  };

  const handleApplyMask = () => {
    if (!currentMask) return;
    const base = baseCanvasRef.current;
    if (!base) return;
    const ctx = base.getContext("2d");
    if (!ctx) return;
    const { data: mask, width: mw, height: mh } = currentMask;
    if (mw !== base.width || mh !== base.height) {
      setError("마스크 크기가 캔버스와 다릅니다");
      return;
    }
    const imageData = ctx.getImageData(0, 0, base.width, base.height);
    const d = imageData.data;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i]) d[4 * i + 3] = 0;
    }
    ctx.putImageData(imageData, 0, 0);
    base.toBlob(
      (b) => {
        if (b) {
          // 히스토리에 push (redo 분기 잘라내기)
          const h = historyRef.current;
          const newStack = h.stack.slice(0, h.index + 1);
          newStack.push(b);
          while (newStack.length > 20) newStack.shift();
          historyRef.current = { stack: newStack, index: newStack.length - 1 };
          refreshUndoRedo();
          setWorkingBlob(b);
        }
        setPoints([]);
        setCurrentMask(null);
      },
      "image/png",
      0.95,
    );
  };

  const handleUndo = () => {
    const h = historyRef.current;
    if (h.index <= 0) return;
    const newIndex = h.index - 1;
    historyRef.current = { stack: h.stack, index: newIndex };
    setWorkingBlob(h.stack[newIndex]);
    setPoints([]);
    setCurrentMask(null);
    refreshUndoRedo();
  };

  const handleRedo = () => {
    const h = historyRef.current;
    if (h.index >= h.stack.length - 1) return;
    const newIndex = h.index + 1;
    historyRef.current = { stack: h.stack, index: newIndex };
    setWorkingBlob(h.stack[newIndex]);
    setPoints([]);
    setCurrentMask(null);
    refreshUndoRedo();
  };

  const handleSave = () => {
    onSave(workingBlob);
  };

  return (
    <div className="space-y-3">
      {modelStatus === "loading" && (
        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 p-4 text-center">
          <div className="text-3xl mb-2 animate-pulse">🤖</div>
          <div className="text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-2">
            SlimSAM 모델 준비 중... ({progress}%)
          </div>
          <div className="h-2 max-w-md mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900 overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-2">
            첫 사용 시 ~75MB 다운로드 후 브라우저 캐시됩니다
          </div>
        </div>
      )}

      {modelStatus === "error" && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 p-4 text-sm text-rose-800">
          ⚠️ SAM 모델 로딩 실패: {error}
        </div>
      )}

      {modelStatus === "ready" && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
              <button
                onClick={() => setPointMode("add")}
                className={`px-3 py-2 text-sm font-medium ${
                  pointMode === "add"
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                + 빼낼 영역
              </button>
              <button
                onClick={() => setPointMode("exclude")}
                className={`px-3 py-2 text-sm font-medium border-l border-slate-300 dark:border-slate-600 ${
                  pointMode === "exclude"
                    ? "bg-rose-600 text-white"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                − 빼지 말 영역
              </button>
            </div>
            <button
              onClick={handleReset}
              disabled={points.length === 0}
              className="px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-600 hover:border-indigo-400 disabled:opacity-30"
            >
              포인트 초기화
            </button>
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-600 hover:border-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed"
              title="실행 취소"
            >
              ↶ 되돌리기
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-600 hover:border-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed"
              title="다시 실행"
            >
              ↷ 다시
            </button>
            <span className="text-xs text-slate-500 ml-auto">
              포인트 {points.length}개{isComputing && " · 분석 중..."}
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            사진 위에서 <strong>빼낼 영역(예: 발 받침 통나무)</strong>을 클릭하세요. SAM이 자동으로 객체를
            인식합니다. 너무 많이 잡히면 빼지 말 부분에 <strong>−</strong> 클릭으로 정제하세요.
          </div>

          <div
            className="rounded-xl p-3 relative overflow-auto max-h-[60vh]"
            style={{
              background:
                "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px",
            }}
          >
            <div className="relative inline-block mx-auto">
              <canvas ref={baseCanvasRef} className="max-w-full h-auto block" />
              <canvas
                ref={overlayCanvasRef}
                onClick={handleCanvasClick}
                onTouchEnd={handleCanvasClick}
                className="absolute inset-0 max-w-full h-auto block"
                style={{ cursor: "crosshair", touchAction: "none", pointerEvents: "auto" }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleApplyMask}
              disabled={!currentMask || isComputing}
              className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✂️ 선택 영역 빼기
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 transition"
            >
              ✓ 완료
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium py-3 px-5 hover:border-rose-400 transition"
            >
              취소
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function currentBg(bgKey: string, useCustom: boolean, customColor: string): Bg {
  if (useCustom) return { kind: "color", color: customColor, label: "custom" };
  const found = BG_PRESETS.find((p) => p.key === bgKey);
  return found ? found.bg : { kind: "transparent" };
}

// ---- 알파 임계값: 흐릿한 잔존물 제거 + 본체 강화 ----
// threshold=0.2 면, 알파 < 0.2 → 0 (완전 투명), 알파 > 0.8 → 255 (불투명), 사이는 선형 매핑
function applyAlphaThreshold(canvas: HTMLCanvasElement, threshold: number) {
  if (threshold <= 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const lower = Math.round(threshold * 255);
  const upper = 255 - lower;
  if (upper <= lower) return;
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 3; i < d.length; i += 4) {
    const a = d[i];
    if (a <= lower) d[i] = 0;
    else if (a >= upper) d[i] = 255;
    else d[i] = Math.round(((a - lower) / (upper - lower)) * 255);
  }
  ctx.putImageData(imageData, 0, 0);
}

// ---- 알파 채널만 가우시안 블러 ----
function smoothAlphaChannel(canvas: HTMLCanvasElement, radius: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  // 1) cutout의 알파 마스크를 흰색으로 추출
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const mctx = mask.getContext("2d");
  if (!mctx) return;
  mctx.drawImage(canvas, 0, 0);
  mctx.globalCompositeOperation = "source-in";
  mctx.fillStyle = "#ffffff";
  mctx.fillRect(0, 0, w, h);

  // 2) 마스크에 블러 적용 → 부드러운 알파 마스크
  const blurred = document.createElement("canvas");
  blurred.width = w;
  blurred.height = h;
  const bctx = blurred.getContext("2d");
  if (!bctx) return;
  bctx.filter = `blur(${radius}px)`;
  bctx.drawImage(mask, 0, 0);

  // 3) cutout 의 RGB 만 추출 (알파 무시)
  const rgb = document.createElement("canvas");
  rgb.width = w;
  rgb.height = h;
  const rctx = rgb.getContext("2d");
  if (!rctx) return;
  rctx.drawImage(canvas, 0, 0);

  // 4) 원본 캔버스 초기화 후 RGB 그리고, blurred mask 로 destination-in
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(rgb, 0, 0);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(blurred, 0, 0);
  ctx.globalCompositeOperation = "source-over";
}

// ---- 발밑 그림자 ----
function drawGroundShadow(target: CanvasRenderingContext2D, cutout: HTMLCanvasElement) {
  const w = cutout.width;
  const h = cutout.height;
  const shadow = document.createElement("canvas");
  shadow.width = w;
  shadow.height = h;
  const sctx = shadow.getContext("2d");
  if (!sctx) return;

  // cutout 형태를 살짝 아래로 + 강한 블러
  const offset = Math.round(h * 0.018);
  const blurPx = Math.round(Math.max(8, h * 0.025));
  sctx.filter = `blur(${blurPx}px)`;
  sctx.drawImage(cutout, 0, offset);
  sctx.filter = "none";
  // 형태만 남기고 검정으로 채움
  sctx.globalCompositeOperation = "source-in";
  sctx.fillStyle = "rgba(0,0,0,0.35)";
  sctx.fillRect(0, 0, w, h);
  sctx.globalCompositeOperation = "source-over";

  target.drawImage(shadow, 0, 0);
}
