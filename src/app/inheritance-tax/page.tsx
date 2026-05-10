"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

const INH_BRACKETS = [
  { upTo: 100_000_000, rate: 0.10, ded: 0 },
  { upTo: 500_000_000, rate: 0.20, ded: 10_000_000 },
  { upTo: 1_000_000_000, rate: 0.30, ded: 60_000_000 },
  { upTo: 3_000_000_000, rate: 0.40, ded: 160_000_000 },
  { upTo: Infinity, rate: 0.50, ded: 460_000_000 },
];

function calcInhTax(base: number) {
  if (base <= 0) return 0;
  const b = INH_BRACKETS.find((x) => base <= x.upTo)!;
  return Math.max(0, base * b.rate - b.ded);
}

export default function InheritanceTaxPage() {
  const [estate, setEstate] = useState("1500000000");
  const [hasSpouse, setHasSpouse] = useState(true);
  const [children, setChildren] = useState("2");

  const result = useMemo(() => {
    const e = parseFloat(estate);
    const c = parseInt(children) || 0;
    if (!e || e <= 0) return null;
    // 기초공제 2억 + 인적공제 (자녀 1인당 5천만원, 직계존비속)
    const basicDeduction = 200_000_000;
    const childDeduction = c * 50_000_000;
    const personalDeduction = basicDeduction + childDeduction;
    // 일괄공제 5억 vs 기초+인적공제 중 큰 쪽 적용
    const generalDeduction = Math.max(500_000_000, personalDeduction);
    // 배우자공제 — 최저 5억 (실제는 법정 상속분 기준 최대 30억)
    const spouseDeduction = hasSpouse ? 500_000_000 : 0;
    const totalDeduction = generalDeduction + spouseDeduction;
    const taxBase = Math.max(0, e - totalDeduction);
    const tax = calcInhTax(taxBase);
    return { taxBase, tax, deduction: totalDeduction, generalDeduction, spouseDeduction };
  }, [estate, hasSpouse, children]);

  return (
    <CalculatorLayout title="상속세 계산기" description="상속재산·배우자·자녀 수로 상속세 누진 계산. 일괄공제·배우자공제 자동 적용.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">상속재산 가액 (원)</span>
          <input type="number"
              min="0" value={estate} onChange={(e) => setEstate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={estate} />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 hover:border-indigo-400">
            <input type="checkbox" checked={hasSpouse} onChange={(e) => setHasSpouse(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">배우자 상속 (5억 추가공제)</span>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">자녀 수</span>
            <input type="number"
              min="0" value={children} onChange={(e) => setChildren(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
          </label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 상속세</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.tax)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">공제 합계: {fmt(result.deduction)} 원</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800 text-base mb-2">참고 (단순 추정)</h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>일괄공제 5억 (배우자 + 자녀가 있을 때)</li>
          <li>배우자공제 최저 5억 (실제 상속분에 따라 최대 30억)</li>
          <li>누진세율: 1억↓ 10% / 5억↓ 20% / 10억↓ 30% / 30억↓ 40% / 30억↑ 50%</li>
          <li>실제 신고는 세무사 상담 권장</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
