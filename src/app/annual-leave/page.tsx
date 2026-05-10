"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AnnualLeavePage() {
  const [startDate, setStartDate] = useState("2024-03-01");
  const [baseDate, setBaseDate] = useState(todayISO());

  const result = useMemo(() => {
    const start = new Date(startDate);
    const base = new Date(baseDate);
    if (isNaN(start.getTime()) || isNaN(base.getTime()) || start > base) return null;
    const months = (base.getFullYear() - start.getFullYear()) * 12 + (base.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    // 1년 미만: 월 1일 (최대 11일)
    if (years < 1) {
      return { type: "monthly", days: Math.min(11, months), years, months };
    }
    // 1년 이상: 15일 + 2년마다 1일 추가 (최대 25일)
    const extra = Math.min(10, Math.floor((years - 1) / 2));
    return { type: "annual", days: 15 + extra, years, months };
  }, [startDate, baseDate]);

  return (
    <CalculatorLayout title="휴가 일수 계산" description="입사일 → 근로기준법 기준 연차 자동 계산. 1년 미만 월 1일 / 1년+ 15일부터 시작.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">입사일</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">기준일</span><input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
              <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">현재 발생 연차</div>
              <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{result.days}일</div>
              <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">재직 {result.years}년 {result.months % 12}개월 · {result.type === "monthly" ? "월차 (1년 미만)" : "연차 (1년+)"}</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-2">근로기준법 기준</h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>1년 미만: 월차 1일 × 개근월수 (최대 11일)</li>
          <li>1년 이상: 15일 (연차)</li>
          <li>3년차부터 2년마다 1일 추가 (최대 25일)</li>
          <li>5인 미만 사업장은 적용 X (회사 자체 규정 따름)</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
