"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

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

// 1주택자 고령자 세액공제 (만 60세+)
function ageCredit(age: number): number {
  if (age >= 70) return 0.4;
  if (age >= 65) return 0.3;
  if (age >= 60) return 0.2;
  return 0;
}

// 1주택자 장기보유 세액공제 (5년+)
function holdCredit(years: number): number {
  if (years >= 15) return 0.5;
  if (years >= 10) return 0.4;
  if (years >= 5) return 0.2;
  return 0;
}

export default function ComprehensivePropertyTaxPage() {
  const [publicPrice, setPublicPrice] = useState("1500000000");
  const [status, setStatus] = useState<Status>("single");
  const [age, setAge] = useState("0");
  const [holdYears, setHoldYears] = useState("0");

  const result = useMemo(() => {
    const p = parseFloat(publicPrice);
    if (!p || p <= 0) return null;
    // 1주택자 공제 12억, 다주택자 9억
    const deduction = status === "single" ? 1_200_000_000 : 900_000_000;
    const taxBase = Math.max(0, (p - deduction) * 0.6); // 공정시장가액비율 60%
    const brackets = status === "single" ? SINGLE_BRACKETS : MULTI_BRACKETS;
    const b = brackets.find((x) => taxBase <= x.upTo)!;
    const grossTax = Math.max(0, taxBase * b.rate - b.ded);
    // 1주택자만: 고령자 + 장기보유 합산 세액공제 (최대 80%)
    let creditRate = 0;
    if (status === "single") {
      const a = parseFloat(age) || 0;
      const h = parseFloat(holdYears) || 0;
      creditRate = Math.min(0.8, ageCredit(a) + holdCredit(h));
    }
    const credit = grossTax * creditRate;
    const tax = grossTax - credit;
    const ruralSpecial = tax * 0.20; // 농어촌특별세 20%
    return { taxBase, grossTax, credit, creditRate, tax, ruralSpecial, total: tax + ruralSpecial };
  }, [publicPrice, status, age, holdYears]);

  return (
    <CalculatorLayout title="종합부동산세 계산기" description="주택 공시가격·1주택/다주택으로 종부세 + 농어촌특별세 누진 계산 (2026 기준).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">주택 공시가격 합계 (원)</span>
          <input type="number" min="0" value={publicPrice} onChange={(e) => setPublicPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={publicPrice} />
        </label>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {[{ v: "single", l: "1주택자 (공제 12억)" }, { v: "multi", l: "다주택자 (공제 9억)" }].map((s) => (
            <button key={s.v} onClick={() => setStatus(s.v as Status)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${status === s.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{s.l}</button>
          ))}
        </div>

        {status === "single" && (
          <div className="mt-5 grid grid-cols-2 gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <label className="block">
              <span className="text-xs font-medium text-emerald-800">소유자 만 나이 (60세+ 공제)</span>
              <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="60·65·70" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-emerald-800">보유 기간 (년, 5년+ 공제)</span>
              <input type="number" min="0" value={holdYears} onChange={(e) => setHoldYears(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="5·10·15" />
            </label>
            <p className="col-span-2 text-xs text-emerald-700">고령(60·65·70세 → 20·30·40%) + 장기보유(5·10·15년 → 20·40·50%) 합산 최대 80% 세액공제</p>
          </div>
        )}

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 종합부동산세 (총합)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.total)} 원</div>
              {result.creditRate > 0 && (
                <div className="text-xs text-emerald-700 mt-2">✓ 1주택자 세액공제 {(result.creditRate * 100).toFixed(0)}% 적용 (절감 {fmt(result.credit)} 원)</div>
              )}
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>과세표준 (공시가-공제 × 60%)</span><span>{fmt(result.taxBase)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>산출 종합부동산세</span><span>{fmt(result.grossTax)} 원</span></div>
              {result.credit > 0 && (
                <div className="flex justify-between py-2 border-b border-slate-100 text-emerald-600"><span>1주택자 세액공제 ({(result.creditRate * 100).toFixed(0)}%)</span><span>-{fmt(result.credit)} 원</span></div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-100"><span>결정 종합부동산세</span><span>{fmt(result.tax)} 원</span></div>
              <div className="flex justify-between py-2"><span>농어촌특별세 (20%)</span><span>{fmt(result.ruralSpecial)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ 1주택자 12억·다주택 9억 공제. 공정시장가액비율 60%. 종부세는 12월 납부. 1주택자 고령자(60세+) + 장기보유(5년+) 세액공제 합산 최대 80% 가능.</p>
      </div>
    </CalculatorLayout>
  );
}
