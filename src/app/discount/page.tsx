"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function DiscountPage() {
  const [original, setOriginal] = useState("100000");
  const [rate, setRate] = useState("30");

  const result = useMemo(() => {
    const o = parseFloat(original);
    const r = parseFloat(rate);
    if (!o || isNaN(r) || o <= 0) return null;
    const discount = o * (r / 100);
    const final = o - discount;
    return { discount, final };
  }, [original, rate]);

  return (
    <CalculatorLayout title="할인율 계산기" description="정가와 할인율 입력 시 할인 금액·최종가 즉시 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">정가 (원)</span>
            <input type="number"
              min="0" inputMode="numeric" value={original} onChange={(e) => setOriginal(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={original} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">할인율 (%)</span>
            <input type="number"
              min="0" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">최종 결제가</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.final)} 원</div>
            </div>
            <div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-900 text-center">
              할인 금액: <strong>{fmt(result.discount)} 원</strong>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
