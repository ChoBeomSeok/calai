"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 1): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function CarbonFootprintPage() {
  const [carKm, setCarKm] = useState(50); // 주 km
  const [flights, setFlights] = useState(2); // 연 단거리 비행 횟수
  const [meatDays, setMeatDays] = useState(5); // 주 육식 일수
  const [electricityKwh, setElectricityKwh] = useState(300); // 월 kWh

  const result = useMemo(() => {
    // 한국 평균 배출 계수
    const carYearly = carKm * 52 * 0.21; // kg CO2/km
    const flightYearly = flights * 200; // kg CO2/단거리 1회
    const meatYearly = meatDays * 52 * 5; // kg CO2/육식 1일
    const electricYearly = electricityKwh * 12 * 0.4256; // kg CO2/kWh (한전 공식 2024)
    const total = carYearly + flightYearly + meatYearly + electricYearly;
    return {
      carYearly,
      flightYearly,
      meatYearly,
      electricYearly,
      total,
      tons: total / 1000,
      treesNeeded: Math.round(total / 22), // 나무 1그루 연 22kg 흡수
    };
  }, [carKm, flights, meatDays, electricityKwh]);

  return (
    <CalculatorLayout title="탄소 발자국 계산기" description="자동차·비행·식단·전기 사용으로 연 CO₂ 배출량 추정 + 흡수 필요 나무 수.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="block">
              <div className="flex justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">🚗 주 자동차 주행: {carKm} km</span></div>
              <input type="range" min="0" max="500" step="10" value={carKm} onChange={(e) => setCarKm(parseInt(e.target.value))} className="w-full mt-1" />
            </label>
          </div>
          <div>
            <label className="block">
              <div className="flex justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">✈️ 연 단거리 비행 횟수: {flights}회</span></div>
              <input type="range" min="0" max="20" value={flights} onChange={(e) => setFlights(parseInt(e.target.value))} className="w-full mt-1" />
            </label>
          </div>
          <div>
            <label className="block">
              <div className="flex justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">🍖 주 육식 일수: {meatDays}일</span></div>
              <input type="range" min="0" max="7" value={meatDays} onChange={(e) => setMeatDays(parseInt(e.target.value))} className="w-full mt-1" />
            </label>
          </div>
          <div>
            <label className="block">
              <div className="flex justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">💡 월 전기 사용: {electricityKwh} kWh</span></div>
              <input type="range" min="100" max="1000" step="50" value={electricityKwh} onChange={(e) => setElectricityKwh(parseInt(e.target.value))} className="w-full mt-1" />
            </label>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-5 text-center">
            <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">연 CO₂ 배출량</div>
            <div className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">{fmt(result.tons, 2)} 톤</div>
            <div className="text-sm text-emerald-700 dark:text-emerald-400 mt-2">
              상쇄 위해 약 <strong>{result.treesNeeded}그루</strong>의 나무 필요
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-sm"><div className="text-xs text-slate-500">자동차</div><div className="font-bold">{fmt(result.carYearly)} kg</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-sm"><div className="text-xs text-slate-500">비행</div><div className="font-bold">{fmt(result.flightYearly)} kg</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-sm"><div className="text-xs text-slate-500">육식</div><div className="font-bold">{fmt(result.meatYearly)} kg</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-3 text-sm"><div className="text-xs text-slate-500">전기</div><div className="font-bold">{fmt(result.electricYearly)} kg</div></div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ 한국 1인 평균 약 12톤/년. 글로벌 평균 4.7톤. 1.5°C 목표 달성 위해 1인당 2톤 이하 필요.
      </div>
    </CalculatorLayout>
  );
}
