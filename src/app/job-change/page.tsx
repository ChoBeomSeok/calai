"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function JobChangePage() {
  const [currentSalary, setCurrentSalary] = useState("50000000");
  const [newSalary, setNewSalary] = useState("60000000");
  const [currentBonus, setCurrentBonus] = useState("3000000");
  const [newBonus, setNewBonus] = useState("5000000");
  const [currentCommute, setCurrentCommute] = useState("100000");
  const [newCommute, setNewCommute] = useState("200000");
  const [currentBenefit, setCurrentBenefit] = useState("2000000");
  const [newBenefit, setNewBenefit] = useState("3000000");

  const result = useMemo(() => {
    const cur = parseFloat(currentSalary) + parseFloat(currentBonus) + parseFloat(currentBenefit) - parseFloat(currentCommute) * 12;
    const next = parseFloat(newSalary) + parseFloat(newBonus) + parseFloat(newBenefit) - parseFloat(newCommute) * 12;
    if (isNaN(cur) || isNaN(next)) return null;
    return { current: cur, next, diff: next - cur, pct: ((next - cur) / cur) * 100 };
  }, [currentSalary, newSalary, currentBonus, newBonus, currentCommute, newCommute, currentBenefit, newBenefit]);

  return (
    <CalculatorLayout title="이직 손익 계산기" description="현재 vs 새 직장 — 연봉·성과급·통근비·복지 종합 비교. 진짜 이직 가치 계산.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">현재 직장</div>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">연봉</span><input type="number" min="0" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={currentSalary} /></label>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">연 성과급·보너스</span><input type="number" min="0" value={currentBonus} onChange={(e) => setCurrentBonus(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={currentBonus} /></label>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">연 복지 (식대·자기계발 등)</span><input type="number" min="0" value={currentBenefit} onChange={(e) => setCurrentBenefit(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={currentBenefit} /></label>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">월 통근비 (교통비·시간 비용)</span><input type="number" min="0" value={currentCommute} onChange={(e) => setCurrentCommute(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={currentCommute} /></label>
          </div>
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/30 p-4 space-y-3">
            <div className="text-sm font-bold text-indigo-900 dark:text-indigo-300">새 직장</div>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">연봉</span><input type="number" min="0" value={newSalary} onChange={(e) => setNewSalary(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={newSalary} /></label>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">연 성과급·보너스</span><input type="number" min="0" value={newBonus} onChange={(e) => setNewBonus(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={newBonus} /></label>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">연 복지</span><input type="number" min="0" value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={newBenefit} /></label>
            <label className="block"><span className="text-xs text-slate-600 dark:text-slate-400">월 통근비</span><input type="number" min="0" value={newCommute} onChange={(e) => setNewCommute(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" /><MoneyHint value={newCommute} /></label>
          </div>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className={`rounded-xl p-5 text-center ${result.diff >= 0 ? "bg-emerald-50 dark:bg-emerald-950" : "bg-rose-50 dark:bg-rose-950"}`}>
              <div className={`text-sm mb-1 ${result.diff >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>이직 후 연 순가치 변화</div>
              <div className={`text-4xl font-bold ${result.diff >= 0 ? "text-emerald-900 dark:text-emerald-300" : "text-rose-900 dark:text-rose-300"}`}>{result.diff >= 0 ? "+" : ""}{fmt(result.diff)} 원</div>
              <div className={`text-sm mt-2 ${result.diff >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>{result.diff >= 0 ? "+" : ""}{result.pct.toFixed(1)}%</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">현재 연 순가치</div>
                <div className="font-bold">{fmt(result.current)} 원</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">새 직장 연 순가치</div>
                <div className="font-bold text-indigo-900 dark:text-indigo-300">{fmt(result.next)} 원</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ 통근비 = 월 교통비 + 시간 비용 (왕복 1시간 추가 시 약 월 10~20만원 가치). 복지에 의료보험·휴가·재택근무·교육비 환산 포함 권장.
      </div>
    </CalculatorLayout>
  );
}
