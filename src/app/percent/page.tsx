"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "of" | "what-percent" | "change";

function fmt(n: number, d = 2): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function PercentPage() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");

  const result = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return null;
    if (mode === "of") return { value: (x / 100) * y, label: `${a}% of ${b}` };
    if (mode === "what-percent") {
      if (y === 0) return null;
      return { value: (x / y) * 100, label: `${a} ÷ ${b} × 100`, suffix: "%" };
    }
    if (y === 0) return null;
    return { value: ((y - x) / x) * 100, label: `(${b} - ${a}) ÷ ${a} × 100`, suffix: "%" };
  }, [mode, a, b]);

  return (
    <CalculatorLayout title="백분율 계산기" description="3가지 모드 — N% × 값 / N은 M의 몇% / 증감율 — 양방향 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { v: "of", label: "N% × 값" },
            { v: "what-percent", label: "N은 M의 몇%" },
            { v: "change", label: "증감율 (%)" },
          ].map((m) => (
            <button key={m.v} onClick={() => setMode(m.v as Mode)} className={`px-2 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition ${mode === m.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{m.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{mode === "of" ? "퍼센트 (%)" : mode === "what-percent" ? "부분값" : "원래값"}</span>
            <input type="number"
              min="0" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{mode === "of" ? "원래값" : mode === "what-percent" ? "전체값" : "변경값"}</span>
            <input type="number"
              min="0" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">{result.label}</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.value)}{result.suffix || ""}</div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
