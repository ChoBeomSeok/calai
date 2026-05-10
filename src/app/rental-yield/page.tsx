"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 2): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function RentalYieldPage() {
  const [price, setPrice] = useState("500000000");
  const [deposit, setDeposit] = useState("50000000");
  const [monthly, setMonthly] = useState("1500000");

  const result = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(deposit) || 0;
    const m = parseFloat(monthly) || 0;
    if (!p || p <= 0) return null;
    const annualRent = m * 12;
    const investment = p - d;
    if (investment <= 0) return null;
    const grossYield = (annualRent / p) * 100;
    const netYield = (annualRent / investment) * 100;
    return { annualRent, investment, grossYield, netYield };
  }, [price, deposit, monthly]);

  return (
    <CalculatorLayout title="임대수익률 계산기" description="매매가·보증금·월세로 연 임대수익률 (총수익률·실투자수익률) 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">매매가 (원)</span><input type="number"
              min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">보증금 (원)</span><input type="number"
              min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">월세 (원)</span><input type="number"
              min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-indigo-50 p-5 text-center">
                <div className="text-xs text-indigo-700 mb-1">실투자 수익률</div>
                <div className="text-3xl font-bold text-indigo-900">{fmt(result.netYield)}%</div>
                <div className="text-xs text-indigo-700 mt-1">보증금 차감 기준</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 text-center">
                <div className="text-xs text-slate-500 mb-1">총 수익률</div>
                <div className="text-3xl font-bold text-slate-900">{fmt(result.grossYield)}%</div>
                <div className="text-xs text-slate-500 mt-1">매매가 기준</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between py-1"><span className="text-slate-600">연 임대수입</span><span className="font-semibold">{new Intl.NumberFormat("ko-KR").format(Math.round(result.annualRent))} 원</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-600">실투자금</span><span className="font-semibold">{new Intl.NumberFormat("ko-KR").format(Math.round(result.investment))} 원</span></div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
