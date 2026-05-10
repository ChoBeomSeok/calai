"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 1): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function OneRMPage() {
  const [weight, setWeight] = useState("80");
  const [reps, setReps] = useState("8");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    // Brzycki·Lander 공식은 r=1~12 범위 외에서 부정확/발산하므로 1~36 제한
    if (!w || !r || w <= 0 || r <= 0 || r >= 37) return null;
    // 4가지 공식 평균 (Epley·Brzycki·Lander·Lombardi)
    const epley = w * (1 + r / 30);
    const brzycki = w * (36 / (37 - r));
    // Lander 분모 0 방지 (r ≈ 37.94)
    const landerDen = 1.013 - 0.0267123 * r;
    const lander = landerDen > 0 ? w / landerDen : epley;
    const lombardi = w * Math.pow(r, 0.10);
    const avg = (epley + brzycki + lander + lombardi) / 4;
    // RM별 추정 무게
    const rmTable = [1, 2, 3, 5, 8, 10, 12, 15, 20].map((n) => ({
      reps: n,
      weight: avg / (1 + n / 30), // Epley 역산
    }));
    return { avg, epley, brzycki, lander, lombardi, rmTable };
  }, [weight, reps]);

  return (
    <CalculatorLayout title="1RM 계산기" description="든 무게·횟수로 1회 최대 중량 (1RM) 추정 + RM별 추천 무게표 (Epley·Brzycki·Lander·Lombardi 평균).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">든 무게 (kg)</span><input type="number"
              min="0" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">반복 횟수 (회)</span><input type="number"
              min="0" value={reps} onChange={(e) => setReps(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">추정 1RM</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.avg)} kg</div>
            </div>
            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-700 mb-2">RM별 추천 무게</div>
              <div className="grid grid-cols-3 gap-2">
                {result.rmTable.map((r) => (
                  <div key={r.reps} className="rounded-lg bg-slate-50 p-3 text-center">
                    <div className="text-xs text-slate-500">{r.reps}RM</div>
                    <div className="font-bold text-sm">{fmt(r.weight)} kg</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
