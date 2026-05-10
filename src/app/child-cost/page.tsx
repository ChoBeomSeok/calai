"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function ChildCostPage() {
  const [babyMonthly, setBabyMonthly] = useState("1500000"); // 0~5세 월
  const [schoolMonthly, setSchoolMonthly] = useState("1200000"); // 6~12세 월
  const [teenMonthly, setTeenMonthly] = useState("1500000"); // 13~18세 월
  const [eduExtra, setEduExtra] = useState("500000"); // 추가 사교육
  const [govSupport, setGovSupport] = useState(true); // 정부 지원금 차감

  const result = useMemo(() => {
    const baby = parseFloat(babyMonthly) * 12 * 6;
    const school = parseFloat(schoolMonthly) * 12 * 7;
    const teen = parseFloat(teenMonthly) * 12 * 6;
    const edu = parseFloat(eduExtra) * 12 * 13; // 6~18세 사교육
    const gross = baby + school + teen + edu;
    // 정부 지원 (2026 기준)
    // 부모급여: 0세 월 100만 × 12 + 1세 월 50만 × 12 = 1,800만
    // 아동수당: 0~7세 월 10만 × 12 × 8 = 960만
    // 첫만남이용권: 1회 200만
    const support = govSupport ? (1_200 + 600 + 960 + 200) * 10_000 : 0;
    const total = Math.max(0, gross - support);
    return { baby, school, teen, edu, gross, support, total };
  }, [babyMonthly, schoolMonthly, teenMonthly, eduExtra, govSupport]);

  return (
    <CalculatorLayout title="자녀 양육비 계산" description="0~18세 누적 양육비 + 사교육비 시뮬레이션. 한국 평균 1인당 양육비 약 3억원 (육아정책연구소).">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="space-y-4">
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">월 양육비 — 영유아 (0~5세)</span><input type="number" min="0" value={babyMonthly} onChange={(e) => setBabyMonthly(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /><MoneyHint value={babyMonthly} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">월 양육비 — 초등 (6~12세)</span><input type="number" min="0" value={schoolMonthly} onChange={(e) => setSchoolMonthly(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /><MoneyHint value={schoolMonthly} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">월 양육비 — 중·고 (13~18세)</span><input type="number" min="0" value={teenMonthly} onChange={(e) => setTeenMonthly(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /><MoneyHint value={teenMonthly} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">월 추가 사교육비 (6~18세)</span><input type="number" min="0" value={eduExtra} onChange={(e) => setEduExtra(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /><MoneyHint value={eduExtra} /></label>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-indigo-400">
            <input type="checkbox" checked={govSupport} onChange={(e) => setGovSupport(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">정부 지원 차감 (부모급여·아동수당·첫만남이용권 = 약 2,960만원)</span>
          </label>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
            <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">0~18세 누적 부담액 {govSupport && "(정부지원 차감)"}</div>
            <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(result.total)} 원</div>
            {govSupport && (
              <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-2">정부 지원 -{fmt(result.support)} 원 차감 (총 양육비 {fmt(result.gross)}원)</div>
            )}
            <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">한국 평균 약 3억원 (대학교육 별도)</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-center text-sm"><div className="text-xs text-slate-500">영유아 6년</div><div className="font-bold">{fmt(result.baby)} 원</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-center text-sm"><div className="text-xs text-slate-500">초등 7년</div><div className="font-bold">{fmt(result.school)} 원</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-center text-sm"><div className="text-xs text-slate-500">중·고 6년</div><div className="font-bold">{fmt(result.teen)} 원</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-center text-sm"><div className="text-xs text-slate-500">추가 사교육 13년</div><div className="font-bold">{fmt(result.edu)} 원</div></div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
