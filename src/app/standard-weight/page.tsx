"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 1): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

type Sex = "male" | "female";

export default function StandardWeightPage() {
  const [height, setHeight] = useState("170");
  const [sex, setSex] = useState<Sex>("male");
  const [actual, setActual] = useState("70");

  const result = useMemo(() => {
    const h = parseFloat(height);
    const a = parseFloat(actual);
    if (!h || h <= 0) return null;
    const m = h / 100;
    // 브로카 (Broca): 표준 = (키 - 100) × 0.9 (남) / × 0.85 (여)
    const broca = (h - 100) * (sex === "male" ? 0.9 : 0.85);
    // 로러 (Rohrer): 표준 = 키(m)³ × 1300 (체중 = kg, 키 = m)
    const rohrer = Math.pow(m, 3) * 1300;
    // BMI 22 기준 (한국)
    const bmi22 = 22 * m * m;
    const bmi = a ? a / (m * m) : 0;
    return { broca, rohrer, bmi22, bmi };
  }, [height, sex, actual]);

  return (
    <CalculatorLayout title="표준 체중 계산기" description="키·성별로 표준 체중 (브로카·로러·BMI 22 공식 3가지) + 현재 체중과 비교.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ v: "male", l: "남성" }, { v: "female", l: "여성" }].map((s) => (
            <button key={s.v} onClick={() => setSex(s.v as Sex)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${sex === s.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{s.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">키 (cm)</span><input type="number"
              min="0" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">현재 체중 (kg)</span><input type="number"
              min="0" value={actual} onChange={(e) => setActual(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-indigo-50 p-4 text-center"><div className="text-xs text-indigo-700 mb-1">BMI 22 (한국)</div><div className="font-bold text-indigo-900">{fmt(result.bmi22)} kg</div></div>
              <div className="rounded-xl bg-slate-50 p-4 text-center"><div className="text-xs text-slate-500 mb-1">브로카</div><div className="font-bold">{fmt(result.broca)} kg</div></div>
              <div className="rounded-xl bg-slate-50 p-4 text-center"><div className="text-xs text-slate-500 mb-1">로러</div><div className="font-bold">{fmt(result.rohrer)} kg</div></div>
            </div>
            {result.bmi > 0 && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-900">
                현재 BMI: <strong>{fmt(result.bmi)}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
