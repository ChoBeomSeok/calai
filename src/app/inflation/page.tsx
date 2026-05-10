"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function InflationPage() {
  const [amount, setAmount] = useState("1000000");
  const [years, setYears] = useState("10");
  const [rate, setRate] = useState("3");
  const [direction, setDirection] = useState<"future" | "past">("future");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const y = parseFloat(years);
    const r = parseFloat(rate) / 100;
    if (!a || isNaN(y) || isNaN(r)) return null;
    if (direction === "future") {
      // 미래에 동일 구매력을 갖기 위한 명목 금액
      const equivalent = a * Math.pow(1 + r, y);
      // 미래 시점에서 오늘 명목금액의 실질 구매력 (가치 하락)
      const realValue = a / Math.pow(1 + r, y);
      return { equivalent, realValue };
    } else {
      // 과거 → 지금: 과거 N원의 현재 명목 가치 (인플레 보정)
      const equivalent = a * Math.pow(1 + r, y);
      return { equivalent, realValue: 0 };
    }
  }, [amount, years, rate, direction]);

  return (
    <CalculatorLayout title="인플레이션 환산" description="물가상승률 기반 미래 가치 / 과거 화폐 가치 환산. 한국 평균 인플레이션 약 2~3%/년.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ v: "future", l: "지금 → 미래 가치" }, { v: "past", l: "과거 → 지금 가치" }].map((d) => (
            <button key={d.v} onClick={() => setDirection(d.v as "future" | "past")} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${direction === d.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}>{d.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block sm:col-span-3"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">금액 (원)</span><input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /><MoneyHint value={amount} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">기간 (년)</span><input type="number" min="0" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /></label>
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">연 인플레이션률 (%)</span><input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
              <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">
                {direction === "future"
                  ? `${years}년 후 ${fmt(parseFloat(amount))}원과 같은 구매력 (명목 금액)`
                  : `과거 ${fmt(parseFloat(amount))}원의 현재 가치`}
              </div>
              <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(result.equivalent)} 원</div>
            </div>
            {direction === "future" && result.realValue > 0 && (
              <div className="mt-4 rounded-xl bg-rose-50 dark:bg-rose-950 p-4 text-center">
                <div className="text-xs text-rose-700 dark:text-rose-400 mb-1">
                  반대로: 오늘 {fmt(parseFloat(amount))}원의 {years}년 후 실질 구매력
                </div>
                <div className="text-2xl font-bold text-rose-900 dark:text-rose-300">{fmt(result.realValue)} 원</div>
                <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">→ 화폐 가치 {((1 - result.realValue / parseFloat(amount)) * 100).toFixed(1)}% 하락</div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 한국 평균 (통계청): 최근 10년 평균 인플레이션 약 1.8~2.5%/년. 2022~2023 한때 5%+ 기록.
      </div>
    </CalculatorLayout>
  );
}
