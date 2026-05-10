"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

// 무주택 기간 (1년당 2점, 만 30세부터 카운트, 최대 32점 = 16년)
function noHomeScore(years: number): number {
  if (years < 1) return 2;
  return Math.min(32, 2 + Math.floor(years) * 2);
}

// 부양가족 (1인당 5점, 본인 제외, 최대 35점)
function familyScore(count: number): number {
  return Math.min(35, 5 + count * 5);
}

// 청약통장 가입 기간 (1년당 1점, 가입 6개월~15년 차등, 최대 17점)
function bankbookScore(years: number): number {
  if (years < 0.5) return 1;
  if (years < 1) return 2;
  return Math.min(17, 2 + Math.floor(years));
}

export default function CheongyakScorePage() {
  const [noHomeYears, setNoHomeYears] = useState("5");
  const [family, setFamily] = useState("2");
  const [bankbookYears, setBankbookYears] = useState("8");

  const result = useMemo(() => {
    const nh = parseFloat(noHomeYears);
    const fm = parseInt(family);
    const bb = parseFloat(bankbookYears);
    if (isNaN(nh) || isNaN(fm) || isNaN(bb)) return null;
    const noHome = noHomeScore(nh);
    const fam = familyScore(fm);
    const bank = bankbookScore(bb);
    const total = noHome + fam + bank;
    return { noHome, fam, bank, total };
  }, [noHomeYears, family, bankbookYears]);

  return (
    <CalculatorLayout title="청약 가점 계산기" description="무주택 기간 + 부양가족 + 청약통장 가입 기간으로 청약 가점 (만점 84점) 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="space-y-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">무주택 기간 (년) — 만 30세부터 카운트</span><input type="number" min="0" value={noHomeYears} onChange={(e) => setNoHomeYears(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">부양가족 수 (본인 제외)</span><input type="number" min="0" value={family} onChange={(e) => setFamily(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">청약통장 가입 기간 (년)</span><input type="number" min="0" step="0.5" value={bankbookYears} onChange={(e) => setBankbookYears(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">총 청약 가점</div>
              <div className="text-4xl font-bold text-indigo-900">{result.total} <span className="text-xl text-indigo-600">/ 84</span></div>
              <div className="mt-3 h-3 bg-indigo-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${result.total >= 60 ? "bg-emerald-500" : result.total >= 40 ? "bg-amber-500" : "bg-rose-400"}`}
                  style={{ width: `${(result.total / 84) * 100}%` }}
                />
              </div>
              <div className="text-xs text-indigo-700 mt-2">{result.total >= 60 ? "당첨 가능성 ↑ 인기 단지 도전" : result.total >= 40 ? "중간 — 비인기 단지·특별공급 추천" : "낮음 — 청약 종합저축 가입 + 무주택 유지"}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-3 text-center"><div className="text-xs text-slate-500">무주택</div><div className="font-bold">{result.noHome} / 32</div></div>
              <div className="rounded-xl bg-slate-50 p-3 text-center"><div className="text-xs text-slate-500">부양가족</div><div className="font-bold">{result.fam} / 35</div></div>
              <div className="rounded-xl bg-slate-50 p-3 text-center"><div className="text-xs text-slate-500">청약통장</div><div className="font-bold">{result.bank} / 17</div></div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
