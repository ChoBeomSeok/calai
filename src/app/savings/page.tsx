"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type TaxType = "general" | "tax-free" | "tax-preferential";

const TAX_RATES: Record<TaxType, number> = {
  general: 15.4,
  "tax-free": 0,
  "tax-preferential": 9.5,
};

function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

// 정기적금 단리 만기수령액 = 월 적립액 × 개월수 + 월 적립액 × 연이율 / 12 × 개월수 × (개월수 + 1) / 2
function calcSavings(monthly: number, annualRate: number, months: number, taxRate: number) {
  const principal = monthly * months;
  const r = annualRate / 100 / 12;
  // 매월 적립한 금액의 단리 이자 합계
  const interestBeforeTax = monthly * r * (months * (months + 1)) / 2;
  const tax = interestBeforeTax * (taxRate / 100);
  const interestAfterTax = interestBeforeTax - tax;
  return {
    principal,
    interestBeforeTax,
    tax,
    interestAfterTax,
    totalAfterTax: principal + interestAfterTax,
  };
}

export default function SavingsPage() {
  const [monthly, setMonthly] = useState("500000");
  const [rate, setRate] = useState("3.5");
  const [months, setMonths] = useState("24");
  const [taxType, setTaxType] = useState<TaxType>("general");

  const result = useMemo(() => {
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const t = parseFloat(months);
    if (!m || isNaN(r) || !t || m <= 0 || t <= 0) return null;
    return calcSavings(m, r, t, TAX_RATES[taxType]);
  }, [monthly, rate, months, taxType]);

  return (
    <CalculatorLayout
      title="적금 만기 계산기"
      description="월 적립액·연 이자율·기간으로 만기 수령액과 세후 실수령을 즉시 계산합니다 (정기적금 단리 기준)."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block sm:col-span-3">
            <span className="text-sm font-medium text-slate-700">월 적립액 (원)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="500000"
            />
            {monthly && parseFloat(monthly) > 0 && (
              <span className="block mt-1 text-xs text-slate-500">{formatKRW(parseFloat(monthly))} 원</span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">연 이자율 (%)</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="3.5"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">기간 (개월)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="24"
            />
          </label>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">과세 구분</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "general", label: "일반과세 15.4%" },
              { v: "tax-preferential", label: "세금우대 9.5%" },
              { v: "tax-free", label: "비과세 0%" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setTaxType(t.v as TaxType)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  taxType === t.v
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">만기 수령액 (세후)</div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-900">
                {formatKRW(result.totalAfterTax)} 원
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">원금</div>
                <div className="font-bold text-slate-900">{formatKRW(result.principal)} 원</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">세전 이자</div>
                <div className="font-bold text-slate-900">{formatKRW(result.interestBeforeTax)} 원</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">세금</div>
                <div className="font-bold text-red-600">- {formatKRW(result.tax)} 원</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">세후 이자</div>
                <div className="font-bold text-emerald-600">{formatKRW(result.interestAfterTax)} 원</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">단리 vs 복리 차이</h2>
        <p>
          정기적금은 일반적으로 단리 기준 — 매월 적립한 금액의 잔여 기간만큼만 이자가 붙습니다.
          예: 1월 적립금은 12개월치 이자, 12월 적립금은 1개월치 이자. 정기예금(거치식)은 복리 옵션이 일부 있습니다.
        </p>
        <h2 className="font-semibold text-slate-800 text-base mt-4">과세 구분</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>일반과세 15.4%</strong>: 이자소득세 14% + 지방세 1.4% (대부분 적금)</li>
          <li><strong>세금우대 9.5%</strong>: 농협·새마을금고·신협 조합원 우대 (한도 3,000만원)</li>
          <li><strong>비과세 0%</strong>: 청년희망적금·청년도약계좌 등 정책 상품</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 (2026)</strong>: 시중은행 적금 평균 3.0~3.8% / 인터넷은행 3.5~4.5% / 청년희망적금 (비과세) 5~6%
        </div>
    </CalculatorLayout>
  );
}
