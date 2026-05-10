"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

const BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, ded: 0 },
  { upTo: 50_000_000, rate: 0.15, ded: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, ded: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, ded: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, ded: 19_940_000 },
  { upTo: 500_000_000, rate: 0.40, ded: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, ded: 35_940_000 },
  { upTo: Infinity, rate: 0.45, ded: 65_940_000 },
];

function calcTax(base: number) {
  if (base <= 0) return { rate: 0, tax: 0 };
  const b = BRACKETS.find((x) => base <= x.upTo)!;
  return { rate: b.rate * 100, tax: Math.max(0, base * b.rate - b.ded) };
}

export default function IncomeTaxPage() {
  const [taxableIncome, setTaxableIncome] = useState("80000000");

  const result = useMemo(() => {
    const t = parseFloat(taxableIncome);
    if (!t || t <= 0) return null;
    const { rate, tax } = calcTax(t);
    const local = tax * 0.10;
    return { rate, tax, local, total: tax + local };
  }, [taxableIncome]);

  return (
    <CalculatorLayout title="종합소득세 계산기" description="과세표준 입력 시 종합소득세 + 지방소득세 누진세율 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">과세표준 (원) — 소득공제 후</span>
          <input type="number"
              min="0" value={taxableIncome} onChange={(e) => setTaxableIncome(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={taxableIncome} />
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">총 부담세액</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.total)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">적용 세율 구간: {result.rate.toFixed(0)}%</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>종합소득세</span><span>{fmt(result.tax)} 원</span></div>
              <div className="flex justify-between py-2"><span>지방소득세 (10%)</span><span>{fmt(result.local)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800 text-base mb-2">2026 종합소득세 누진 8구간</h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>1,400만원 이하: 6%</li>
          <li>5,000만원 이하: 15% - 126만원</li>
          <li>8,800만원 이하: 24% - 576만원</li>
          <li>1.5억 이하: 35% - 1,544만원</li>
          <li>3억 이하: 38% - 1,994만원</li>
          <li>5억 이하: 40% - 2,594만원</li>
          <li>10억 이하: 42% - 3,594만원</li>
          <li>10억 초과: 45% - 6,594만원</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
