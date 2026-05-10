"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function CarLoanPage() {
  const [carPrice, setCarPrice] = useState("30000000");
  const [downPayment, setDownPayment] = useState("5000000");
  const [months, setMonths] = useState("60");
  const [rate, setRate] = useState("4.5");

  const result = useMemo(() => {
    const p = parseFloat(carPrice);
    const dp = parseFloat(downPayment) || 0;
    const m = parseInt(months);
    const r = parseFloat(rate);
    if (!p || !m || isNaN(r) || p <= 0 || m <= 0) return null;
    const principal = p - dp;
    if (principal <= 0) return null;
    const monthRate = r / 100 / 12;
    let monthly: number;
    if (monthRate === 0) monthly = principal / m;
    else monthly = (principal * monthRate * Math.pow(1 + monthRate, m)) / (Math.pow(1 + monthRate, m) - 1);
    const total = monthly * m + dp;
    const interest = monthly * m - principal;
    return { principal, monthly, interest, total };
  }, [carPrice, downPayment, months, rate]);

  return (
    <CalculatorLayout title="자동차 할부 계산기" description="차량 가격·계약금·할부 기간으로 월 할부금·총 이자 즉시 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">차량 가격 (원)</span><input type="number"
              min="0" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">계약금 (원)</span><input type="number"
              min="0" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">할부 개월</span><input type="number"
              min="0" value={months} onChange={(e) => setMonths(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">연 이율 (%)</span><input type="number"
              min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">월 할부금</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.monthly)} 원</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">할부 원금</div><div className="font-bold">{fmt(result.principal)} 원</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">총 이자</div><div className="font-bold text-rose-600">{fmt(result.interest)} 원</div></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 (2026)</strong>: 캐피탈사 자동차 할부 금리 약 5~9% / 60개월 표준 / 신차 할부 한도 차량가의 90%
        </div>
    </CalculatorLayout>
  );
}
