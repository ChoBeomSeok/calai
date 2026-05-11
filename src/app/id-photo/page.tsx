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

const BG_COLORS = [
  { id: "white", name: "흰색", color: "#ffffff" },
  { id: "lightblue", name: "하늘색", color: "#cfe2f3" },
  { id: "gray", name: "회색", color: "#d9d9d9" },
  { id: "blue", name: "파랑", color: "#3b82f6" },
  { id: "red", name: "빨강", color: "#ef4444" },
];

export default function IdPhotoPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
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

  // Canvas 그리기
  useEffect(() => {
    if (!imgEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = mmToPx(preset.w);
    const h = mmToPx(preset.h);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // 배경
    ctx.fillStyle = bgColor.color;
    ctx.fillRect(0, 0, w, h);

    // 이미지 그리기 (Cover + 스케일 + 오프셋)
    const imgRatio = imgEl.width / imgEl.height;
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
    ctx.drawImage(imgEl, dx, dy, drawW, drawH);
  }, [imgEl, preset, bgColor, scale, offsetX, offsetY]);

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
                      backgroundColor: bgColor.color,
                    }}
                  />
                </div>
                <button
                  onClick={() => { setSrc(null); setImgEl(null); }}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  ↻ 다른 사진 선택
                </button>
              </div>

              {/* 컨트롤 */}
              <div className="space-y-4">
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
                    {BG_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setBgColor(c)}
                        className={`h-10 rounded-lg border-2 transition ${
                          bgColor.id === c.id ? "border-indigo-500 scale-105" : "border-slate-200 dark:border-slate-600"
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* 크기·위치 조정 */}
                <div>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">확대 / 축소: {(scale * 100).toFixed(0)}%</span>
                    <input
                      type="range"
                      min="50"
                      max="300"
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
        💡 <strong>여권사진 촬영 가이드</strong>: ① 흰색 배경 ② 머리·어깨까지 포함 ③ 안경 X (반사) ④ 정면 응시 ⑤ 자연광 ⑥ 자연스러운 표정 (무표정 권장). 외무부 표준은 \"머리 32~36mm + 정수리에서 턱까지 32~36mm\".
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 사진이 서버로 전송되지 않습니다. 모든 처리는 브라우저 안에서.
      </div>
    </CalculatorLayout>
  );
}
