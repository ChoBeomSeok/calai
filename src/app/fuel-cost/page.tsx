"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(Math.round(n));
}

export default function FuelCostPage() {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("12");
  const [fuelPrice, setFuelPrice] = useState("1700");

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const p = parseFloat(fuelPrice);
    if (!d || !e || !p || d <= 0 || e <= 0 || p <= 0) return null;
    const liters = d / e;
    const cost = liters * p;
    return { liters, cost, perKm: cost / d };
  }, [distance, efficiency, fuelPrice]);

  return (
    <CalculatorLayout title="주유비 계산기" description="주행거리·연비·기름값으로 총 주유비와 km당 비용 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">주행거리 (km)</span><input type="number"
              min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">연비 (km/L)</span><input type="number"
              min="0" step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">기름값 (원/L)</span><input type="number"
              min="0" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">총 주유비</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.cost)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">필요 연료: {fmt(result.liters, 2)} L · km당 {fmt(result.perKm, 1)} 원</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 기름값 (2026 5월)</strong>: 휘발유 1,650~1,750원/L · 경유 1,500~1,600원/L · LPG 1,000원/L · 평균 연비 12 km/L
        </div>
    </CalculatorLayout>
  );
}
