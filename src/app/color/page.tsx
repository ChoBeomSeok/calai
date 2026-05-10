"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPage() {
  const [hex, setHex] = useState("#4f46e5");

  const result = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { rgb, hsl };
  }, [hex]);

  return (
    <CalculatorLayout title="색상 변환기" description="HEX ↔ RGB ↔ HSL 동시 변환 + 컬러 미리보기. 디자이너·개발자 필수.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">HEX 색상 코드</span>
          <div className="flex gap-3 mt-1.5">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-16 h-14 rounded-lg border border-slate-300 cursor-pointer" />
            <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-lg font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl h-32 mb-5 shadow-inner" style={{ backgroundColor: hex }}></div>
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">RGB</div>
                <div className="font-mono text-lg">rgb({result.rgb.r}, {result.rgb.g}, {result.rgb.b})</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">HSL</div>
                <div className="font-mono text-lg">hsl({result.hsl.h}, {result.hsl.s}%, {result.hsl.l}%)</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">Tailwind class</div>
                <div className="font-mono text-sm">bg-[{hex.toLowerCase()}]</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
