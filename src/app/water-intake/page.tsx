"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function WaterIntakePage() {
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<"low" | "mid" | "high">("mid");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    const baseMl = w * 30; // kg당 30ml
    const extra = activity === "low" ? 0 : activity === "mid" ? 500 : 1000;
    const totalMl = baseMl + extra;
    return { totalMl, cups: totalMl / 200 };
  }, [weight, activity]);

  return (
    <CalculatorLayout title="수분 섭취량 계산기" description="체중·활동량으로 일일 권장 수분 섭취량 자동 계산 (kg당 30ml + 활동 보정).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block"><span className="text-sm font-medium text-slate-700">체중 (kg)</span><input type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">활동량</span>
          <div className="grid grid-cols-3 gap-2">
            {[{ v: "low", l: "낮음 (사무직)" }, { v: "mid", l: "보통 (주 3회 운동)" }, { v: "high", l: "높음 (매일 운동)" }].map((a) => (
              <button key={a.v} onClick={() => setActivity(a.v as "low" | "mid" | "high")} className={`px-2 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition ${activity === a.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{a.l}</button>
            ))}
          </div>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">일일 권장 수분 섭취량</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.totalMl)} ml</div>
              <div className="text-sm text-indigo-700 mt-2">≈ 약 {fmt(result.cups, 1)} 잔 (200ml 기준)</div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
