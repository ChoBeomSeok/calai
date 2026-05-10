"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type Mode = "to-monthly" | "to-jeonse";

export default function JeonseMonthlyPage() {
  const [mode, setMode] = useState<Mode>("to-monthly");
  const [jeonse, setJeonse] = useState("300000000");
  const [deposit, setDeposit] = useState("50000000");
  const [conversionRate, setConversionRate] = useState("5.5");

  const result = useMemo(() => {
    const j = parseFloat(jeonse);
    const d = parseFloat(deposit);
    const cr = parseFloat(conversionRate);
    if (mode === "to-monthly") {
      if (!j || !cr || j <= 0 || cr <= 0) return null;
      const remaining = j - (d || 0);
      if (remaining <= 0) return null;
      const monthly = (remaining * (cr / 100)) / 12;
      return { monthly, deposit: d || 0, remaining };
    } else {
      // 월세 → 전세 환산
      const m = parseFloat(deposit); // 보증금 입력란을 월세로 사용
      const dep = parseFloat(jeonse); // 전세 입력란을 보증금으로 사용
      if (!m || !cr || cr <= 0) return null;
      const equivalent = dep + (m * 12 * 100) / cr;
      return { equivalent, monthly: m };
    }
  }, [mode, jeonse, deposit, conversionRate]);

  return (
    <CalculatorLayout title="전월세 전환 계산기" description="전세보증금을 월세 보증금/월세로 환산. 전월세 전환율 입력 (한국 평균 5.0~6.0%).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ v: "to-monthly", l: "전세 → 월세" }, { v: "to-jeonse", l: "월세 → 전세" }].map((m) => (
            <button key={m.v} onClick={() => setMode(m.v as Mode)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${mode === m.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{m.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mode === "to-monthly" ? (
            <>
              <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">전세 보증금 (원)</span><input type="number"
              min="0" value={jeonse} onChange={(e) => setJeonse(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">월세 보증금 (원)</span><input type="number"
              min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
            </>
          ) : (
            <>
              <label className="block"><span className="text-sm font-medium text-slate-700">월세 보증금 (원)</span><input type="number"
              min="0" value={jeonse} onChange={(e) => setJeonse(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">월세 (원)</span><input type="number"
              min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
            </>
          )}
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">전월세 전환율 (%)</span><input type="number"
              min="0" step="0.1" value={conversionRate} onChange={(e) => setConversionRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              {mode === "to-monthly" && "monthly" in result && (
                <>
                  <div className="text-sm text-indigo-700 mb-1">예상 월세</div>
                  <div className="text-4xl font-bold text-indigo-900">{fmt(result.monthly)} 원</div>
                </>
              )}
              {mode === "to-jeonse" && "equivalent" in result && result.equivalent !== undefined && (
                <>
                  <div className="text-sm text-indigo-700 mb-1">전세 환산 보증금</div>
                  <div className="text-4xl font-bold text-indigo-900">{fmt(result.equivalent)} 원</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
