"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type Status = "single" | "multi";

const SINGLE_BRACKETS = [
  { upTo: 300_000_000, rate: 0.005, ded: 0 },
  { upTo: 600_000_000, rate: 0.007, ded: 600_000 },
  { upTo: 1_200_000_000, rate: 0.010, ded: 2_400_000 },
  { upTo: 5_000_000_000, rate: 0.014, ded: 7_200_000 },
  { upTo: 9_400_000_000, rate: 0.020, ded: 37_200_000 },
  { upTo: Infinity, rate: 0.027, ded: 102_800_000 },
];

const MULTI_BRACKETS = [
  { upTo: 300_000_000, rate: 0.006, ded: 0 },
  { upTo: 600_000_000, rate: 0.008, ded: 600_000 },
  { upTo: 1_200_000_000, rate: 0.012, ded: 2_400_000 },
  { upTo: 5_000_000_000, rate: 0.016, ded: 7_200_000 },
  { upTo: 9_400_000_000, rate: 0.022, ded: 37_200_000 },
  { upTo: Infinity, rate: 0.030, ded: 102_800_000 },
];

export default function ComprehensivePropertyTaxPage() {
  const [publicPrice, setPublicPrice] = useState("1500000000");
  const [status, setStatus] = useState<Status>("single");

  const result = useMemo(() => {
    const p = parseFloat(publicPrice);
    if (!p || p <= 0) return null;
    // 1주택자 공제 12억, 다주택자 9억
    const deduction = status === "single" ? 1_200_000_000 : 900_000_000;
    const taxBase = Math.max(0, (p - deduction) * 0.6); // 공정시장가액비율 60%
    const brackets = status === "single" ? SINGLE_BRACKETS : MULTI_BRACKETS;
    const b = brackets.find((x) => taxBase <= x.upTo)!;
    const tax = Math.max(0, taxBase * b.rate - b.ded);
    const ruralSpecial = tax * 0.20; // 농어촌특별세 20%
    return { taxBase, tax, ruralSpecial, total: tax + ruralSpecial };
  }, [publicPrice, status]);

  return (
    <CalculatorLayout title="종합부동산세 계산기" description="주택 공시가격·1주택/다주택으로 종부세 + 농어촌특별세 누진 계산 (2026 기준).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">주택 공시가격 합계 (원)</span>
          <input type="number" min="0" value={publicPrice} onChange={(e) => setPublicPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {[{ v: "single", l: "1주택자 (공제 12억)" }, { v: "multi", l: "다주택자 (공제 9억)" }].map((s) => (
            <button key={s.v} onClick={() => setStatus(s.v as Status)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${status === s.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{s.l}</button>
          ))}
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 종합부동산세 (총합)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.total)} 원</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>과세표준 (공시가-공제 × 60%)</span><span>{fmt(result.taxBase)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>종합부동산세</span><span>{fmt(result.tax)} 원</span></div>
              <div className="flex justify-between py-2"><span>농어촌특별세 (20%)</span><span>{fmt(result.ruralSpecial)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ 1주택자 12억·다주택 9억 공제. 공정시장가액비율 60%. 종부세는 12월 납부.</p>
      </div>
    </CalculatorLayout>
  );
}
