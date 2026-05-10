"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function TipPage() {
  const [bill, setBill] = useState("100000");
  const [serviceRate, setServiceRate] = useState("10");
  const [people, setPeople] = useState("4");

  const result = useMemo(() => {
    const b = parseFloat(bill);
    const s = parseFloat(serviceRate) || 0;
    const p = parseInt(people);
    if (!b || !p || b <= 0 || p <= 0) return null;
    const service = b * (s / 100);
    const total = b + service;
    const perPerson = total / p;
    return { service, total, perPerson };
  }, [bill, serviceRate, people]);

  return (
    <CalculatorLayout title="팁·N빵 계산기" description="총액·봉사료·인원으로 1인당 분담액 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block sm:col-span-3">
            <span className="text-sm font-medium text-slate-700">음식값·청구액 (원)</span>
            <input type="number"
              min="0" inputMode="numeric" value={bill} onChange={(e) => setBill(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={bill} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">봉사료·팁 (%)</span>
            <input type="number"
              min="0" inputMode="decimal" value={serviceRate} onChange={(e) => setServiceRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">인원 수</span>
            <input type="number"
              min="0" inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">1인당 분담액</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.perPerson)} 원</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">총 결제액</div><div className="font-bold">{fmt(result.total)} 원</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">봉사료</div><div className="font-bold">{fmt(result.service)} 원</div></div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
