"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type Period = 1 | 2 | 4 | 12 | 365;

export default function CompoundPage() {
  const [principal, setPrincipal] = useState("10000000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [period, setPeriod] = useState<Period>(12);

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(years);
    if (!P || isNaN(r) || !t) return null;
    const A = P * Math.pow(1 + r / 100 / period, period * t);
    return { future: A, interest: A - P };
  }, [principal, rate, years, period]);

  return (
    <CalculatorLayout title="복리 계산기" description="원금·이율·기간·복리 주기로 미래 가치 계산. 복리 마법(눈덩이 효과) 시각화.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block sm:col-span-3"><span className="text-sm font-medium text-slate-700">원금 (원)</span><input type="number"
              min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">연 이율 (%)</span><input type="number"
              min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">기간 (년)</span><input type="number"
              min="0" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">복리 주기</span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[{ v: 1, l: "연복리" }, { v: 2, l: "반기" }, { v: 4, l: "분기" }, { v: 12, l: "월복리" }, { v: 365, l: "일복리" }].map((p) => (
              <button key={p.v} onClick={() => setPeriod(p.v as Period)} className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium border transition ${period === p.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{p.l}</button>
            ))}
          </div>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">미래 가치</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.future)} 원</div>
              <div className="text-sm text-indigo-700 mt-2">총 이자: {fmt(result.interest)} 원</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 참고 수익률</strong>: 한국 코스피 장기 평균 약 7%/년 / S&P 500 약 10%/년 / 정기예금 3~4% / 국채 3~4%
        </div>
    </CalculatorLayout>
  );
}
