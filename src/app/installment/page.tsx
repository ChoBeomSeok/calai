"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function InstallmentPage() {
  const [amount, setAmount] = useState("1200000");
  const [months, setMonths] = useState("12");
  const [rate, setRate] = useState("15");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const m = parseInt(months);
    const r = parseFloat(rate);
    if (!a || !m || isNaN(r) || a <= 0 || m <= 0) return null;
    const monthRate = r / 100 / 12;
    if (monthRate === 0) {
      const monthly = a / m;
      return { monthly, fee: 0, total: a };
    }
    const monthly = (a * monthRate * Math.pow(1 + monthRate, m)) / (Math.pow(1 + monthRate, m) - 1);
    const total = monthly * m;
    return { monthly, fee: total - a, total };
  }, [amount, months, rate]);

  return (
    <CalculatorLayout title="신용카드 할부 계산기" description="할부 원금·개월수·수수료율로 월 청구액·총 수수료 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">할부 원금 (원)</span><input type="number"
              min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={amount} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">할부 개월</span><input type="number"
              min="0" value={months} onChange={(e) => setMonths(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">연 수수료율 (%) — 무이자 시 0</span><input type="number"
              min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">월 청구액</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.monthly)} 원</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">총 수수료</div><div className="font-bold text-rose-600">{fmt(result.fee)} 원</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">총 결제액</div><div className="font-bold">{fmt(result.total)} 원</div></div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
