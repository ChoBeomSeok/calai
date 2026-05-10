"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

// 일반 누진세율
function calcRate(taxBase: number): { rate: number; deduction: number } {
  if (taxBase <= 60_000_000) return { rate: 0.001, deduction: 0 };
  if (taxBase <= 150_000_000) return { rate: 0.0015, deduction: 30_000 };
  if (taxBase <= 300_000_000) return { rate: 0.0025, deduction: 180_000 };
  return { rate: 0.004, deduction: 630_000 };
}

// 1세대 1주택 + 공시가 9억 이하 특례세율
function calcSpecialRate(taxBase: number): { rate: number; deduction: number } {
  if (taxBase <= 60_000_000) return { rate: 0.0005, deduction: 0 };
  if (taxBase <= 150_000_000) return { rate: 0.001, deduction: 30_000 };
  if (taxBase <= 300_000_000) return { rate: 0.002, deduction: 180_000 };
  return { rate: 0.0035, deduction: 630_000 };
}

export default function PropertyTaxPage() {
  const [publicPrice, setPublicPrice] = useState("500000000");
  const [singleHouse, setSingleHouse] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(publicPrice);
    if (!p || p <= 0) return null;
    const taxBase = p * 0.6; // 공시가격 × 공정시장가액비율 60%
    // 1세대 1주택 + 공시가 9억 이하 시 특례세율 적용 가능
    const specialEligible = singleHouse && p <= 900_000_000;
    const { rate, deduction } = specialEligible ? calcSpecialRate(taxBase) : calcRate(taxBase);
    const tax = Math.max(0, taxBase * rate - deduction);
    const cityTax = taxBase * 0.0014; // 도시지역분 0.14%
    const localEducation = tax * 0.20; // 지방교육세 (재산세의 20%)
    const total = tax + cityTax + localEducation;
    return { taxBase, tax, cityTax, localEducation, total, specialEligible, rate };
  }, [publicPrice, singleHouse]);

  return (
    <CalculatorLayout title="재산세 계산기" description="주택 공시가격 입력 시 재산세 + 도시지역분 + 지방교육세 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">주택 공시가격 (원)</span>
          <input type="number"
              min="0" value={publicPrice} onChange={(e) => setPublicPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={publicPrice} />
        </label>
        <label className="mt-4 flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 hover:border-indigo-400">
          <input type="checkbox" checked={singleHouse} onChange={(e) => setSingleHouse(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">1세대 1주택 특례세율 적용 (공시가 9억 이하 한정)</span>
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">연간 재산세 (총합)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.total)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">7월·9월 분납 시 회당 {fmt(result.total / 2)} 원</div>
              {result.specialEligible && (
                <div className="text-xs text-emerald-700 mt-2">✓ 1세대 1주택 특례세율 {(result.rate * 100).toFixed(2)}% 적용</div>
              )}
              {singleHouse && !result.specialEligible && (
                <div className="text-xs text-amber-700 mt-2">⚠️ 공시가 9억 초과 — 특례세율 적용 불가, 일반세율 적용</div>
              )}
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>과세표준 (공시가 × 60%)</span><span>{fmt(result.taxBase)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>재산세 본세</span><span>{fmt(result.tax)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>도시지역분 (0.14%)</span><span>{fmt(result.cityTax)} 원</span></div>
              <div className="flex justify-between py-2"><span>지방교육세 (재산세의 20%)</span><span>{fmt(result.localEducation)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800 text-base mb-2">재산세 누진 구간 (주택)</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>6,000만원 이하: 0.1%</li>
          <li>1.5억 이하: 0.15% - 30,000원</li>
          <li>3억 이하: 0.25% - 180,000원</li>
          <li>3억 초과: 0.4% - 630,000원</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
