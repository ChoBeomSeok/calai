"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function LtvDtiPage() {
  const [housePrice, setHousePrice] = useState("500000000");
  const [annualIncome, setAnnualIncome] = useState("60000000");
  const [existingLoan, setExistingLoan] = useState("0");
  const [ltvLimit, setLtvLimit] = useState("70");
  const [dsrLimit, setDsrLimit] = useState("40");

  const result = useMemo(() => {
    const hp = parseFloat(housePrice);
    const ai = parseFloat(annualIncome);
    const el = parseFloat(existingLoan) || 0;
    const ltv = parseFloat(ltvLimit) / 100;
    const dsr = parseFloat(dsrLimit) / 100;
    if (!hp || !ai) return null;
    // LTV 한도
    const ltvMax = hp * ltv;
    // DSR 단순화: 연 소득 × DSR 한도 = 연 원리금 상환 한도
    // 30년·5% 기준 원리금 균등 → 1억 대출 시 연 약 644만원 상환
    // 역산: 연 상환 가능액 / 6.44% = 대출 한도
    const monthlyRate = 0.05 / 12;
    const months = 30 * 12;
    const annualPayPer1억 =
      ((100_000_000 * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)) * 12;
    const dsrAvailable = ai * dsr - el * (annualPayPer1억 / 100_000_000);
    const dsrMax = (dsrAvailable / annualPayPer1억) * 100_000_000;
    const finalLimit = Math.min(ltvMax, Math.max(0, dsrMax));
    return { ltvMax, dsrMax: Math.max(0, dsrMax), finalLimit };
  }, [housePrice, annualIncome, existingLoan, ltvLimit, dsrLimit]);

  return (
    <CalculatorLayout title="LTV·DTI·DSR 계산기" description="주택가·소득·기존 대출로 LTV·DSR 한도 자동 계산. 실제 받을 수 있는 대출 한도 추정.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">주택 가격 (원)</span><input type="number" min="0" value={housePrice} onChange={(e) => setHousePrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={housePrice} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">연 소득 (원)</span><input type="number" min="0" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={annualIncome} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">기존 대출 잔액 (원)</span><input type="number" min="0" value={existingLoan} onChange={(e) => setExistingLoan(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={existingLoan} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">LTV 한도 (%)</span><input type="number" min="0" value={ltvLimit} onChange={(e) => setLtvLimit(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">DSR 한도 (%)</span><input type="number" min="0" value={dsrLimit} onChange={(e) => setDsrLimit(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">최종 대출 한도</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.finalLimit)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">LTV·DSR 중 더 작은 쪽 적용</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500 mb-1">LTV 한도</div><div className="font-bold">{fmt(result.ltvMax)} 원</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500 mb-1">DSR 한도</div><div className="font-bold">{fmt(result.dsrMax)} 원</div></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ DSR 30년·5% 원리금 균등 상환 가정. 실제 한도는 신용 등급·은행별 정책 따라 차이.</p>
      </div>
    </CalculatorLayout>
  );
}
