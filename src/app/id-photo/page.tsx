"use client";

import { useState, useRef, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

// 한국·해외 표준 증명사진 규격 (mm 단위, DPI 300 기준)
const PRESETS = [
  { id: "passport", name: "여권사진", w: 35, h: 45, note: "한국·국제표준 (35×45mm)" },
  { id: "id-card", name: "주민등록증", w: 35, h: 45, note: "민증 발급용 (35×45mm)" },
  { id: "driver", name: "운전면허증", w: 35, h: 45, note: "면허 발급·갱신 (35×45mm)" },
  { id: "resume", name: "이력서 반명함판", w: 25, h: 35, note: "이력서·자소서 (25×35mm)" },
  { id: "namecard", name: "명함판", w: 50, h: 70, note: "큰 증명사진 (50×70mm)" },
  { id: "student", name: "학생증", w: 30, h: 40, note: "학교·학원증 (30×40mm)" },
  { id: "visa-us", name: "미국 비자", w: 51, h: 51, note: "DS-160 표준 (51×51mm·2×2인치)" },
  { id: "visa-cn", name: "중국 비자", w: 33, h: 48, note: "중국 비자 (33×48mm)" },
  { id: "visa-jp", name: "일본 비자", w: 45, h: 45, note: "일본 비자 (45×45mm)" },
];

const DPI = 300;
const mmToPx = (mm: number) => Math.round((mm / 25.4) * DPI);

const BG_PRESETS = [
  { name: "흰색", color: "#ffffff" },
  { name: "오프화이트", color: "#f5f5f5" },
  { name: "하늘색", color: "#cfe2f3" },
  { name: "연파랑", color: "#a8c5e6" },
  { name: "회색", color: "#d9d9d9" },
  { name: "베이지", color: "#efe6d7" },
  { name: "연분홍", color: "#f8d7da" },
  { name: "민트", color: "#cdebd6" },
  { name: "여권 파랑", color: "#2a4d7e" },
  { name: "비자 빨강", color: "#c0392b" },
];

const isLightColor = (hex: string) => {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) return true;
  const r = parseInt(m[1].slice(0, 2), 16);
  const g = parseInt(m[1].slice(2, 4), 16);
  const b = parseInt(m[1].slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
};

const normalizeHex = (v: string) => {
  const s = v.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(s)) return "#" + s.split("").map((c) => c + c).join("").toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(s)) return "#" + s.toLowerCase();
  return null;
};

export default function IdPhotoPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [cutoutEl, setCutoutEl] = useState<HTMLImageElement | null>(null);
  const [useCutout, setUseCutout] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeStage, setRemoveStage] = useState("");
  const [removeProgress, setRemoveProgress] = useState(0);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [bgColor, setBgColor] = useState<string>(BG_PRESETS[0].color);
  const [hexInput, setHexInput] = useState<string>(BG_PRESETS[0].color);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }
    setError("");
    setCutoutEl(null);
    setUseCutout(false);
    const url = URL.createObjectURL(f);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      setImgEl(img);
      setScale(1);
      setOffsetX(0);
      setOffsetY(0);
    };
    img.src = url;
  };

  const handleRemoveBg = async () => {
    if (!src) return;
    setError("");
    setRemoving(true);
    setRemoveProgress(0);
    setRemoveStage("AI 모델 준비 중");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(src, {
        model: "isnet_fp16",
        output: { format: "image/png" },
        progress: (key, current, total) => {
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          setRemoveProgress(pct);
          if (key.startsWith("fetch")) setRemoveStage("AI 모델 다운로드 중 (최초 1회·약 22MB)");
          else if (key.startsWith("compute")) setRemoveStage("배경 분석 중");
          else setRemoveStage("처리 중");
        },
      });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        setCutoutEl(img);
        setUseCutout(true);
        setRemoving(false);
      };
      img.onerror = () => {
        setError("누끼 이미지 로드에 실패했습니다.");
        setRemoving(false);
      };
      img.src = url;
    } catch (e) {
      console.error(e);
      setError("배경 제거에 실패했습니다. 다른 사진을 시도해 주세요.");
      setRemoving(false);
    }
  };

  const drawImg = useCutout && cutoutEl ? cutoutEl : imgEl;

  // Canvas 그리기
  useEffect(() => {
    if (!drawImg || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = mmToPx(preset.w);
    const h = mmToPx(preset.h);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // 배경
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // 이미지 그리기 (Cover + 스케일 + 오프셋)
    const imgRatio = drawImg.width / drawImg.height;
    const canvasRatio = w / h;
    let drawW = w * scale;
    let drawH = h * scale;
    if (imgRatio > canvasRatio) {
      // 이미지가 더 넓음 → 높이 기준
      drawH = h * scale;
      drawW = drawH * imgRatio;
    } else {
      drawW = w * scale;
      drawH = drawW / imgRatio;
    }
    const dx = (w - drawW) / 2 + offsetX;
    const dy = (h - drawH) / 2 + offsetY;
    ctx.drawImage(drawImg, dx, dy, drawW, drawH);
  }, [drawImg, preset, bgColor, scale, offsetX, offsetY]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `증명사진_${preset.name}_${preset.w}x${preset.h}mm.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <CalculatorLayout
      title="증명사진 만들기 (무료)"
      description="한국·해외 9종 규격 자동 크롭 + 배경색 변경 + DPI 300 인쇄용. 여권·이력서·민증·비자 모두 한 곳에서. 가입·워터마크 없음."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {!src ? (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0] || null); }}
            className={`block cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition ${
              dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
            }`}
          >
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
            <div className="text-5xl mb-3">📸</div>
            <div className="font-semibold text-slate-700 dark:text-slate-200">사진을 드래그하거나 클릭해서 선택</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG·PNG·WebP · 가능한 정면 사진 권장</div>
          </label>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 미리보기 */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">미리보기 (실제 비율)</div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-900 p-4 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      backgroundColor: bgColor,
                    }}
                  />
                </div>
                <button
                  onClick={() => { setSrc(null); setImgEl(null); setCutoutEl(null); setUseCutout(false); }}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  ↻ 다른 사진 선택
                </button>
              </div>

              {/* 컨트롤 */}
              <div className="space-y-4">
                {/* 배경 자동 제거 */}
                <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      🎭 AI 배경 자동 제거
                    </div>
                    {cutoutEl && !removing && (
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useCutout}
                          onChange={(e) => setUseCutout(e.target.checked)}
                          className="accent-indigo-600"
                        />
                        누끼 적용
                      </label>
                    )}
                  </div>
                  {removing ? (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {removeStage} · {removeProgress}%
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all"
                          style={{ width: `${removeProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : !cutoutEl ? (
                    <button
                      onClick={handleRemoveBg}
                      className="w-full bg-indigo-600 text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      배경 제거 시작
                    </button>
                  ) : (
                    <div className="text-xs text-emerald-700 dark:text-emerald-400">
                      ✓ 누끼 완료 — 배경색이 실제로 반영됩니다
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    100% 브라우저 처리. 최초 1회 AI 모델 약 22MB 다운로드 (이후 캐시됨).
                  </div>
                </div>

                {/* 규격 선택 */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">📏 규격 선택</div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPreset(p)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-left transition ${
                          preset.id === p.id
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-indigo-400"
                        }`}
                      >
                        <div className="font-semibold">{p.name}</div>
                        <div className={`text-xs mt-0.5 ${preset.id === p.id ? "text-indigo-100" : "text-slate-500"}`}>
                          {p.w}×{p.h}mm
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{preset.note}</div>
                </div>

                {/* 배경색 */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">🎨 배경색</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {BG_PRESETS.map((c) => (
                      <button
                        key={c.color}
                        onClick={() => { setBgColor(c.color); setHexInput(c.color); }}
                        className={`h-10 rounded-lg border-2 transition relative ${
                          bgColor === c.color ? "border-indigo-500 scale-105" : "border-slate-200 dark:border-slate-600"
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.name}
                      >
                        {bgColor === c.color && (
                          <span
                            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                            style={{ color: isLightColor(c.color) ? "#1e293b" : "#ffffff" }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <label
                      className="relative h-10 w-12 shrink-0 rounded-lg border-2 border-slate-300 dark:border-slate-600 cursor-pointer overflow-hidden"
                      title="원하는 색 직접 선택"
                      style={{ backgroundColor: bgColor }}
                    >
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => { setBgColor(e.target.value); setHexInput(e.target.value); }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center text-base"
                        style={{ color: isLightColor(bgColor) ? "#1e293b" : "#ffffff" }}
                      >
                        🎨
                      </span>
                    </label>
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) => {
                        const v = e.target.value;
                        setHexInput(v);
                        const n = normalizeHex(v);
                        if (n) setBgColor(n);
                      }}
                      onBlur={() => {
                        const n = normalizeHex(hexInput);
                        if (n) setHexInput(n);
                        else setHexInput(bgColor);
                      }}
                      placeholder="#ffffff"
                      maxLength={7}
                      className="flex-1 h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 크기·위치 조정 */}
                <div>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">크기 조정: {(scale * 100).toFixed(0)}%</span>
                    <input
                      type="range"
                      min="80"
                      max="250"
                      value={scale * 100}
                      onChange={(e) => setScale(parseInt(e.target.value) / 100)}
                      className="block w-full mt-1"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs text-slate-600 dark:text-slate-400">좌우 이동: {offsetX}px</span>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={offsetX}
                      onChange={(e) => setOffsetX(parseInt(e.target.value))}
                      className="block w-full mt-1"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-slate-600 dark:text-slate-400">상하 이동: {offsetY}px</span>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      value={offsetY}
                      onChange={(e) => setOffsetY(parseInt(e.target.value))}
                      className="block w-full mt-1"
                    />
                  </label>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  💾 PNG 다운로드 (300 DPI 인쇄용)
                </button>
              </div>
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
        💡 <strong>여권사진 촬영 가이드</strong>: ① 머리·어깨까지 포함 ② 안경 X (반사) ③ 정면 응시 ④ 자연광 ⑤ 자연스러운 표정 (무표정 권장). 외무부 표준은 &quot;머리 32~36mm + 정수리에서 턱까지 32~36mm&quot;. <strong>AI 배경 제거를 사용하면 어떤 배경에서 찍어도 됩니다.</strong>
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 사진이 서버로 전송되지 않습니다. 모든 처리는 브라우저 안에서.
      </div>
    </CalculatorLayout>
  );
}
