"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const SERVICES = [
  { name: "은행 (KB·신한·하나)", flatFee: 5000, percentFee: 0.5, spreadPct: 1.5 },
  { name: "Wise", flatFee: 0, percentFee: 0.4, spreadPct: 0.4 },
  { name: "Western Union", flatFee: 4000, percentFee: 0.3, spreadPct: 2.0 },
  { name: "Wirebarley", flatFee: 0, percentFee: 0.5, spreadPct: 0.5 },
  { name: "Hanpass", flatFee: 0, percentFee: 0.4, spreadPct: 0.6 },
];

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function RemitFeePage() {
  const [amount, setAmount] = useState(1000);
  const [marketRate, setMarketRate] = useState(1380);

  const result = useMemo(() => {
    return SERVICES.map((s) => {
      const transferFee = s.flatFee + (amount * marketRate) * (s.percentFee / 100);
      const spreadCost = (amount * marketRate) * (s.spreadPct / 100);
      const totalCost = transferFee + spreadCost;
      const recipientUsd = amount;
      const youPay = (amount * marketRate) + totalCost;
      return { ...s, transferFee, spreadCost, totalCost, youPay, recipientUsd };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, [amount, marketRate]);

  return (
    <CalculatorLayout title="외환 송금 수수료" description="은행·Wise·Wirebarley·Western Union 등 송금 서비스별 총 비용 비교 (수수료 + 환율 스프레드).">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">송금액 (USD)</span><input type="number" min="0" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">시장 환율 (KRW)</span><input type="number" min="0" value={marketRate} onChange={(e) => setMarketRate(parseFloat(e.target.value) || 0)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
          {result.map((r, i) => (
            <div key={r.name} className={`rounded-xl p-4 ${i === 0 ? "bg-emerald-50 dark:bg-emerald-950" : "bg-slate-50 dark:bg-slate-700"}`}>
              <div className="flex justify-between items-center mb-2">
                <div className={`font-semibold ${i === 0 ? "text-emerald-900 dark:text-emerald-300" : "text-slate-900 dark:text-slate-100"}`}>{i === 0 && "🏆 "}{r.name}</div>
                <div className="font-bold">{fmt(r.totalCost)} 원 비용</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 grid grid-cols-3 gap-2">
                <div>수수료: {fmt(r.transferFee)}원</div>
                <div>환율 스프레드: {fmt(r.spreadCost)}원</div>
                <div>지불액: {fmt(r.youPay)}원</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ 각 서비스 평균 수수료·환율 스프레드 추정. 실제 가격은 송금 시점·금액·국가별 차이.
      </div>
    </CalculatorLayout>
  );
}
