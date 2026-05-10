"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function PregnancyPage() {
  const [lastPeriod, setLastPeriod] = useState("2026-02-01");

  const result = useMemo(() => {
    const lp = new Date(lastPeriod);
    if (isNaN(lp.getTime())) return null;
    const today = new Date();
    const dueDate = addDays(lp, 280); // 40주 = 280일
    const daysSince = Math.floor((today.getTime() - lp.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 0 || daysSince > 280) return null;
    const weeks = Math.floor(daysSince / 7);
    const days = daysSince % 7;
    const trimester = weeks < 14 ? 1 : weeks < 28 ? 2 : 3;
    const daysToDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { weeks, days, trimester, dueDate, daysToDue };
  }, [lastPeriod]);

  return (
    <CalculatorLayout title="임신 주차·출산 예정일 계산기" description="마지막 생리 시작일로 임신 주차·삼분기·출산 예정일 자동 계산 (40주 280일 기준).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">마지막 생리 시작일</span>
          <input type="date" value={lastPeriod} max={todayISO()} onChange={(e) => setLastPeriod(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">현재 임신 주차</div>
              <div className="text-4xl font-bold text-indigo-900">{result.weeks}주 {result.days}일</div>
              <div className="text-sm text-indigo-700 mt-2">{result.trimester === 1 ? "1삼분기 (안정기 진입 전)" : result.trimester === 2 ? "2삼분기 (안정기)" : "3삼분기 (출산 임박)"}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-rose-50 p-4 text-center"><div className="text-xs text-rose-700 mb-1">출산 예정일</div><div className="font-bold text-rose-900">{fmtDate(result.dueDate)}</div></div>
              <div className="rounded-xl bg-amber-50 p-4 text-center"><div className="text-xs text-amber-700 mb-1">D-Day</div><div className="font-bold text-amber-900">D-{result.daysToDue}</div></div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
