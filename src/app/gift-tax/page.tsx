"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

const BRACKETS = [
  { upTo: 100_000_000, rate: 0.10, ded: 0 },
  { upTo: 500_000_000, rate: 0.20, ded: 10_000_000 },
  { upTo: 1_000_000_000, rate: 0.30, ded: 60_000_000 },
  { upTo: 3_000_000_000, rate: 0.40, ded: 160_000_000 },
  { upTo: Infinity, rate: 0.50, ded: 460_000_000 },
];

const RELATION_DEDUCTION: Record<string, number> = {
  spouse: 600_000_000,
  adult_child: 50_000_000,
  minor_child: 20_000_000,
  other_relative: 10_000_000,
  unrelated: 0,
};

const RELATION_LABEL: Record<string, string> = {
  spouse: "배우자",
  adult_child: "직계비속 (성인)",
  minor_child: "직계비속 (미성년)",
  other_relative: "기타 친족",
  unrelated: "친족 외",
};

export default function GiftTaxPage() {
  const [amount, setAmount] = useState("100000000");
  const [relation, setRelation] = useState("adult_child");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    if (!a || a <= 0) return null;
    const ded = RELATION_DEDUCTION[relation] || 0;
    const taxBase = Math.max(0, a - ded);
    const b = BRACKETS.find((x) => taxBase <= x.upTo)!;
    const tax = Math.max(0, taxBase * b.rate - b.ded);
    return { ded, taxBase, tax };
  }, [amount, relation]);

  return (
    <CalculatorLayout title="증여세 계산기" description="증여재산·관계별 공제 (배우자 6억·성인자녀 5천만원 등) 자동 적용 후 누진세 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">증여재산 (원)</span><input type="number"
              min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={amount} /></label>
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">증여 관계</span>
            <select value={relation} onChange={(e) => setRelation(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
              {Object.entries(RELATION_LABEL).map(([k, v]) => <option key={k} value={k}>{v} (공제 {fmt(RELATION_DEDUCTION[k])} 원)</option>)}
            </select>
          </label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 증여세</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.tax)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">공제 후 과세표준: {fmt(result.taxBase)} 원</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ 10년간 증여 합산 적용. 신고기한 3개월. 정확한 신고는 세무사 상담 권장.</p>
      </div>
    </CalculatorLayout>
  );
}
