"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type Type = "sale" | "jeonse" | "monthly";

// 2026 기준 매매·전세 법정 한도 (한국 부동산 중개수수료)
function getRateAndLimit(type: Type, amount: number): { rate: number; limit: number } {
  if (type === "sale") {
    if (amount < 50_000_000) return { rate: 0.6, limit: 250_000 };
    if (amount < 200_000_000) return { rate: 0.5, limit: 800_000 };
    if (amount < 900_000_000) return { rate: 0.4, limit: Infinity };
    if (amount < 1_200_000_000) return { rate: 0.5, limit: Infinity };
    if (amount < 1_500_000_000) return { rate: 0.6, limit: Infinity };
    return { rate: 0.7, limit: Infinity };
  }
  // 전세
  if (amount < 50_000_000) return { rate: 0.5, limit: 200_000 };
  if (amount < 100_000_000) return { rate: 0.4, limit: 300_000 };
  if (amount < 600_000_000) return { rate: 0.3, limit: Infinity };
  if (amount < 1_200_000_000) return { rate: 0.4, limit: Infinity };
  if (amount < 1_500_000_000) return { rate: 0.5, limit: Infinity };
  return { rate: 0.6, limit: Infinity };
}

export default function AgentFeePage() {
  const [type, setType] = useState<Type>("sale");
  const [amount, setAmount] = useState("500000000");
  const [deposit, setDeposit] = useState("10000000"); // 월세 보증금
  const [monthly, setMonthly] = useState("500000"); // 월세

  const result = useMemo(() => {
    if (type === "monthly") {
      const d = parseFloat(deposit);
      const m = parseFloat(monthly);
      if (!d && !m) return null;
      // 환산보증금 = 보증금 + (월세 × 100). 환산보증금이 5천만 미만이면 월세×70 특례 적용
      const tentative = d + m * 100;
      const eqAmount = tentative < 50_000_000 ? d + m * 70 : tentative;
      const { rate, limit } = getRateAndLimit("jeonse", eqAmount);
      const fee = Math.min(eqAmount * (rate / 100), limit);
      return { fee, rate, eqAmount, vat: fee * 0.1 };
    }
    const a = parseFloat(amount);
    if (!a) return null;
    const { rate, limit } = getRateAndLimit(type, a);
    const fee = Math.min(a * (rate / 100), limit);
    return { fee, rate, eqAmount: a, vat: fee * 0.1 };
  }, [type, amount, deposit, monthly]);

  return (
    <CalculatorLayout title="중개수수료 계산기" description="매매·전세·월세 거래액별 부동산 중개수수료 법정 한도 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[{ v: "sale", l: "매매" }, { v: "jeonse", l: "전세" }, { v: "monthly", l: "월세" }].map((t) => (
            <button key={t.v} onClick={() => setType(t.v as Type)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${type === t.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{t.l}</button>
          ))}
        </div>
        {type === "monthly" ? (
          <div className="grid grid-cols-2 gap-4">
            <label className="block"><span className="text-sm font-medium text-slate-700">보증금 (원)</span><input type="number"
              min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={deposit} /></label>
            <label className="block"><span className="text-sm font-medium text-slate-700">월세 (원)</span><input type="number"
              min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={monthly} /></label>
          </div>
        ) : (
          <label className="block"><span className="text-sm font-medium text-slate-700">{type === "sale" ? "매매가" : "전세보증금"} (원)</span><input type="number"
              min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={amount} /></label>
        )}
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">법정 한도 중개수수료</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.fee)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">상한 요율: {result.rate}% · 부가세 별도 {fmt(result.vat)} 원</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p>※ 월세는 보증금 + (월세 × 100) 환산 보증금 기준. 부동산 중개수수료는 법정 한도이며 협의 가능합니다.</p>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 참고</strong>: 법정 한도이며 협의 가능. 부가가치세 10% 별도. 매수·매도 양쪽 모두 지급.
        </div>
    </CalculatorLayout>
  );
}
