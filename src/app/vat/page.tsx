"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type Mode = "supply-to-total" | "total-to-supply" | "vat-only";

export default function VatPage() {
  const [mode, setMode] = useState<Mode>("supply-to-total");
  const [value, setValue] = useState("100000");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!v || v < 0) return null;
    if (mode === "supply-to-total") {
      const vat = v * 0.1;
      return { supply: v, vat, total: v + vat };
    }
    if (mode === "total-to-supply") {
      const supply = v / 1.1;
      return { supply, vat: v - supply, total: v };
    }
    // vat-only: 부가세 = 공급가액 × 10%
    return { supply: v, vat: v * 0.1, total: v * 1.1 };
  }, [mode, value]);

  return (
    <CalculatorLayout title="부가가치세 계산기" description="공급가액 ↔ 부가세 ↔ 합계금액 즉시 변환 (10%).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ v: "supply-to-total", l: "공급가 → 합계" }, { v: "total-to-supply", l: "합계 → 공급가" }].map((m) => (
            <button key={m.v} onClick={() => setMode(m.v as Mode)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${mode === m.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{m.l}</button>
          ))}
        </div>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{mode === "total-to-supply" ? "합계금액" : "공급가액"} (원)</span>
          <input type="number"
              min="0" value={value} onChange={(e) => setValue(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={value} />
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">공급가액</div>
                <div className="font-bold text-sm">{fmt(result.supply)} 원</div>
              </div>
              <div className="rounded-xl bg-rose-50 p-4 text-center">
                <div className="text-xs text-rose-600 mb-1">부가세 (10%)</div>
                <div className="font-bold text-sm text-rose-700">{fmt(result.vat)} 원</div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4 text-center">
                <div className="text-xs text-indigo-700 mb-1">합계금액</div>
                <div className="font-bold text-sm text-indigo-900">{fmt(result.total)} 원</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
