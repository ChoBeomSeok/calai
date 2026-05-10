"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Method = "equal-payment" | "equal-principal" | "balloon";

function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function calcEqualPayment(P: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  if (r === 0) {
    const monthly = P / months;
    return { monthly, totalInterest: 0, totalPayment: P };
  }
  const monthly = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = monthly * months;
  return {
    monthly,
    totalInterest: totalPayment - P,
    totalPayment,
  };
}

function calcEqualPrincipal(P: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  const principalPerMonth = P / months;
  const firstMonth = principalPerMonth + P * r;
  const lastMonth = principalPerMonth + principalPerMonth * r;
  let totalInterest = 0;
  let remaining = P;
  for (let i = 0; i < months; i++) {
    totalInterest += remaining * r;
    remaining -= principalPerMonth;
  }
  return {
    monthly: firstMonth,
    monthlyLast: lastMonth,
    totalInterest,
    totalPayment: P + totalInterest,
  };
}

function calcBalloon(P: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  const monthly = P * r;
  const totalInterest = monthly * months;
  return {
    monthly,
    totalInterest,
    totalPayment: P + totalInterest,
  };
}

export default function LoanPage() {
  const [amount, setAmount] = useState("100000000");
  const [rate, setRate] = useState("4.5");
  const [years, setYears] = useState("30");
  const [method, setMethod] = useState<Method>("equal-payment");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const months = parseFloat(years) * 12;
    if (!P || isNaN(r) || !months || P <= 0 || months <= 0) return null;
    if (method === "equal-payment") return { type: method as Method, ...calcEqualPayment(P, r, months) };
    if (method === "equal-principal") return { type: method as Method, ...calcEqualPrincipal(P, r, months) };
    return { type: method as Method, ...calcBalloon(P, r, months) };
  }, [amount, rate, years, method]);

  return (
    <CalculatorLayout
      title="대출 이자 계산기"
      description="원리금 균등·원금 균등·만기 일시 3가지 방식의 월 상환금과 총 이자를 한 번에 계산합니다."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block sm:col-span-3">
            <span className="text-sm font-medium text-slate-700">대출 원금 (원)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="100000000"
            />
            {amount && parseFloat(amount) > 0 && (
              <span className="block mt-1 text-xs text-slate-500">{formatKRW(parseFloat(amount))} 원</span>
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
              placeholder="4.5"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">대출 기간 (년)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="30"
            />
          </label>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 block mb-1.5">빠른 입력 (인기 조합)</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { l: "주담대 1억·30년·4.5%", p: "100000000", r: "4.5", y: "30" },
              { l: "주담대 3억·30년·4.5%", p: "300000000", r: "4.5", y: "30" },
              { l: "전세 1억·2년·4%", p: "100000000", r: "4", y: "2" },
              { l: "신용 5천·5년·6.5%", p: "50000000", r: "6.5", y: "5" },
            ].map((p) => (
              <button key={p.l} onClick={() => { setAmount(p.p); setRate(p.r); setYears(p.y); }} className="text-xs px-2 py-1.5 rounded-md bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition">
                {p.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">상환 방식</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "equal-payment", label: "원리금 균등" },
              { v: "equal-principal", label: "원금 균등" },
              { v: "balloon", label: "만기 일시" },
            ].map((m) => (
              <button
                key={m.v}
                onClick={() => setMethod(m.v as Method)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  method === m.v
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">월 상환금</div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-900">
                {formatKRW(result.monthly)} 원
              </div>
              {result.type === "equal-principal" && "monthlyLast" in result && (
                <div className="text-xs text-indigo-700 mt-2">
                  첫 달: {formatKRW(result.monthly)}원 → 마지막 달: {formatKRW(result.monthlyLast as number)}원
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">총 이자</div>
                <div className="font-bold text-slate-900">{formatKRW(result.totalInterest)} 원</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">총 상환금</div>
                <div className="font-bold text-slate-900">{formatKRW(result.totalPayment)} 원</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">상환 방식 비교</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>원리금 균등</strong>: 매월 동일 금액 상환 (한국 주택담보대출 표준)</li>
          <li><strong>원금 균등</strong>: 매월 원금 동일 + 이자 감소 → 첫 달 부담 ↑, 총 이자 ↓</li>
          <li><strong>만기 일시</strong>: 매월 이자만, 만기에 원금 일시 상환 → 단기·전세자금</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 (2026)</strong>: 주택담보대출 평균 금리 약 4.3~4.7% / 신용대출 평균 6~8% / 정책대출 (디딤돌·보금자리) 3~4%
        </div>
    </CalculatorLayout>
  );
}
