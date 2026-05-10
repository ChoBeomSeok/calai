"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function EvChargePage() {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("5"); // km/kWh
  const [chargeRate, setChargeRate] = useState("330"); // 원/kWh (한국 평균)
  const [fuelComp, setFuelComp] = useState("12"); // 비교 연비 km/L
  const [fuelPrice, setFuelPrice] = useState("1700"); // 비교 기름값

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const cr = parseFloat(chargeRate);
    const fe = parseFloat(fuelComp);
    const fp = parseFloat(fuelPrice);
    if (!d || !e || !cr || d <= 0 || e <= 0) return null;
    const kWh = d / e;
    const evCost = kWh * cr;
    const fuelCost = fe && fp ? (d / fe) * fp : 0;
    const savings = fuelCost - evCost;
    return { kWh, evCost, fuelCost, savings, savingsPct: (savings / fuelCost) * 100 };
  }, [distance, efficiency, chargeRate, fuelComp, fuelPrice]);

  return (
    <CalculatorLayout title="전기차 충전 비용" description="주행거리·전비·요금제로 전기차 충전 비용 + 동일 거리 주유비 비교.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">주행거리 (km)</span><input type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">전비 (km/kWh)</span><input type="number" min="0" step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">충전 요금 (원/kWh)</span><input type="number" min="0" value={chargeRate} onChange={(e) => setChargeRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">비교 휘발유 연비 (km/L)</span><input type="number" min="0" step="0.1" value={fuelComp} onChange={(e) => setFuelComp(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">비교 기름값 (원/L)</span><input type="number" min="0" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">전기차 충전 비용</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.evCost)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">필요 충전량: {fmt(result.kWh, 1)} kWh</div>
            </div>
            {result.fuelCost > 0 && result.savings > 0 && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-center text-sm text-emerald-900">
                동일 거리 주유비 {fmt(result.fuelCost)}원 대비 <strong>{fmt(result.savings)}원 절감</strong> ({fmt(result.savingsPct, 1)}% ↓)
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
