"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function fmtDate(d: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default function OvulationPage() {
  const [lastPeriod, setLastPeriod] = useState("2026-05-01");
  const [cycle, setCycle] = useState("28");

  const result = useMemo(() => {
    const lp = new Date(lastPeriod);
    const c = parseInt(cycle);
    if (isNaN(lp.getTime()) || !c || c < 21 || c > 40) return null;
    const ovulation = addDays(lp, c - 14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    const nextPeriod = addDays(lp, c);
    return { ovulation, fertileStart, fertileEnd, nextPeriod };
  }, [lastPeriod, cycle]);

  return (
    <CalculatorLayout title="배란일 계산기" description="마지막 생리일·평균 주기로 배란일·가임기·다음 생리예정일 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">마지막 생리 시작일</span><input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">평균 생리 주기 (일)</span><input type="number" value={cycle} onChange={(e) => setCycle(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" min="21" max="40" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-rose-50 p-5 text-center">
              <div className="text-sm text-rose-700 mb-1">예상 배란일</div>
              <div className="text-3xl font-bold text-rose-900">{fmtDate(result.ovulation)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-amber-50 p-4 text-center"><div className="text-xs text-amber-700 mb-1">가임기 시작</div><div className="font-bold text-sm">{fmtDate(result.fertileStart)}</div></div>
              <div className="rounded-xl bg-amber-50 p-4 text-center"><div className="text-xs text-amber-700 mb-1">가임기 끝</div><div className="font-bold text-sm">{fmtDate(result.fertileEnd)}</div></div>
            </div>
            <div className="mt-4 rounded-xl bg-indigo-50 p-4 text-center"><div className="text-xs text-indigo-700 mb-1">다음 생리 예정</div><div className="font-bold text-indigo-900">{fmtDate(result.nextPeriod)}</div></div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p>※ 표준 28일 주기 기준 배란은 다음 생리 예정 14일 전. 가임기는 배란일 -5일 ~ +1일. 생리 주기·배란은 개인차가 있으므로 임신 계획 시 의료 검진 권장.</p>
      </div>
    </CalculatorLayout>
  );
}
