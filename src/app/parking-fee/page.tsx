"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function ParkingFeePage() {
  const [baseTime, setBaseTime] = useState("30"); // 기본 시간 (분)
  const [baseFee, setBaseFee] = useState("2000"); // 기본 요금
  const [extraTime, setExtraTime] = useState("10"); // 초과 단위 (분)
  const [extraFee, setExtraFee] = useState("500"); // 초과 단위 요금
  const [totalMins, setTotalMins] = useState("90"); // 실제 주차 시간

  const result = useMemo(() => {
    const bt = parseFloat(baseTime);
    const bf = parseFloat(baseFee);
    const et = parseFloat(extraTime);
    const ef = parseFloat(extraFee);
    const tm = parseFloat(totalMins);
    if (!bt || !ef || !tm) return null;
    if (tm <= bt) return { fee: bf, base: bf, extra: 0 };
    const extraMins = tm - bt;
    const extraUnits = Math.ceil(extraMins / et);
    const extra = extraUnits * ef;
    return { fee: bf + extra, base: bf, extra };
  }, [baseTime, baseFee, extraTime, extraFee, totalMins]);

  return (
    <CalculatorLayout title="주차 요금 계산기" description="기본 요금·초과 단위·실제 주차 시간으로 총 주차비 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">기본 시간 (분)</span><input type="number" min="0" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">기본 요금 (원)</span><input type="number" min="0" value={baseFee} onChange={(e) => setBaseFee(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={baseFee} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">초과 단위 (분)</span><input type="number" min="0" value={extraTime} onChange={(e) => setExtraTime(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">초과 단위 요금 (원)</span><input type="number" min="0" value={extraFee} onChange={(e) => setExtraFee(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={extraFee} /></label>
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">실제 주차 시간 (분)</span><input type="number" min="0" value={totalMins} onChange={(e) => setTotalMins(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 주차비</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.fee)} 원</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">기본 요금</div><div className="font-bold">{fmt(result.base)} 원</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">초과 요금</div><div className="font-bold">{fmt(result.extra)} 원</div></div>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
