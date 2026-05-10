"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [0, 0, 0];
  let r = parseInt(m[1], 16) / 255;
  let g = parseInt(m[2], 16) / 255;
  let b = parseInt(m[3], 16) / 255;
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
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

type Scheme = "complement" | "triad" | "analogous" | "monochrome";

export default function ColorPalettePage() {
  const [base, setBase] = useState("#4f46e5");
  const [scheme, setScheme] = useState<Scheme>("triad");

  const palette = useMemo(() => {
    const [h, s, l] = hexToHsl(base);
    if (scheme === "complement") {
      return [base, hslToHex((h + 180) % 360, s, l)];
    } else if (scheme === "triad") {
      return [base, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    } else if (scheme === "analogous") {
      return [hslToHex((h - 30 + 360) % 360, s, l), base, hslToHex((h + 30) % 360, s, l)];
    } else {
      return [hslToHex(h, s, Math.max(20, l - 30)), hslToHex(h, s, Math.max(30, l - 15)), base, hslToHex(h, s, Math.min(80, l + 15)), hslToHex(h, s, Math.min(90, l + 30))];
    }
  }, [base, scheme]);

  return (
    <CalculatorLayout title="컬러 팔레트 생성기" description="기준 색에서 보색·삼각·유사·모노크롬 4가지 조화 자동 생성. 디자이너·개발자 필수 도구.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">기준 색상</span>
          <div className="flex gap-3 mt-1.5">
            <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-16 h-14 rounded-lg border border-slate-300 cursor-pointer" />
            <input type="text" value={base} onChange={(e) => setBase(e.target.value)} className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-mono" />
          </div>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          {[{ v: "complement", l: "보색 (2색)" }, { v: "triad", l: "삼각 (3색)" }, { v: "analogous", l: "유사 (3색)" }, { v: "monochrome", l: "모노 (5단계)" }].map((s) => (
            <button key={s.v} onClick={() => setScheme(s.v as Scheme)} className={`px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition ${scheme === s.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}>{s.l}</button>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 h-32 rounded-xl overflow-hidden">
            {palette.map((c, i) => (
              <div key={i} className="flex-1 flex items-end justify-center pb-3" style={{ backgroundColor: c }}>
                <button onClick={() => navigator.clipboard.writeText(c)} className="text-xs font-mono bg-black/30 text-white px-2 py-1 rounded hover:bg-black/50 transition">{c}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
