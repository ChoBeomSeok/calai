"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 1): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function RuleOf72Page() {
  const [rate, setRate] = useState("7");

  const result = useMemo(() => {
    const r = parseFloat(rate);
    if (!r || r <= 0) return null;
    return {
      doubleYears: 72 / r,
      tripleYears: 114 / r,
      quadrupleYears: 144 / r,
    };
  }, [rate]);

  return (
    <CalculatorLayout title="72의 법칙 계산기" description="복리 자산이 2배 되는 데 걸리는 기간 = 72 ÷ 연 수익률 (%). 투자·인플레이션·예금 비교에 유용.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">연 수익률 (%)</span>
          <input type="number" step="0.1" min="0" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[3, 5, 7, 10, 15, 20].map((v) => (
              <button key={v} onClick={() => setRate(String(v))} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 transition">{v}%</button>
            ))}
          </div>
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
              <div className="text-xs text-indigo-700 dark:text-indigo-400 mb-1">2배 (72의 법칙)</div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(result.doubleYears)}<span className="text-base font-normal ml-1">년</span></div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-5 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">3배 (114의 법칙)</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{fmt(result.tripleYears)}<span className="text-base font-normal ml-1">년</span></div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-5 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">4배 (144의 법칙)</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{fmt(result.quadrupleYears)}<span className="text-base font-normal ml-1">년</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-2">참고 평균 수익률</h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>정기예금 3~4% → 2배 약 18~24년</li>
          <li>코스피 장기 7% → 2배 약 10년</li>
          <li>S&P 500 장기 10% → 2배 약 7.2년</li>
          <li>인플레이션 2% → 화폐 가치 절반 약 36년</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
