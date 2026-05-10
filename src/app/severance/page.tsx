"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function SeverancePage() {
  const [years, setYears] = useState("5");
  const [months, setMonths] = useState("0");
  const [avgWage, setAvgWage] = useState("3500000");

  const result = useMemo(() => {
    const y = parseFloat(years) || 0;
    const m = parseFloat(months) || 0;
    const w = parseFloat(avgWage);
    if (!w || w <= 0 || (y === 0 && m === 0)) return null;
    const totalDays = y * 365 + m * 30;
    const dailyAvg = w / 30;
    const severance = dailyAvg * 30 * (totalDays / 365);
    return { totalDays, dailyAvg, severance };
  }, [years, months, avgWage]);

  return (
    <CalculatorLayout title="퇴직금 계산기" description="재직 기간 + 평균임금으로 법정 퇴직금 즉시 계산 (1일 평균임금 × 30일 × 재직년수).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">재직 기간 (년)</span><input type="number"
              min="0" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">개월</span><input type="number"
              min="0" value={months} onChange={(e) => setMonths(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">월 평균임금 (원)</span><input type="number"
              min="0" value={avgWage} onChange={(e) => setAvgWage(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={avgWage} /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 퇴직금</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.severance)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">재직 {result.totalDays}일 · 1일 평균임금 {fmt(result.dailyAvg)} 원</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p>※ 1년 미만 근무 시 퇴직금 지급 의무 X. 평균임금은 퇴직일 직전 3개월 임금의 1일 평균.</p>
      </div>
    </CalculatorLayout>
  );
}
