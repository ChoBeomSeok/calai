"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const ROUTES = [
  { from: "서울", to: "부산", distance: 405, fee: { car: 23000, suv: 23800, truck: 38000 } },
  { from: "서울", to: "대구", distance: 295, fee: { car: 16800, suv: 17400, truck: 27800 } },
  { from: "서울", to: "광주", distance: 320, fee: { car: 18900, suv: 19600, truck: 31300 } },
  { from: "서울", to: "강릉", distance: 235, fee: { car: 12100, suv: 12600, truck: 20300 } },
  { from: "서울", to: "전주", distance: 245, fee: { car: 13800, suv: 14300, truck: 23000 } },
  { from: "서울", to: "대전", distance: 165, fee: { car: 9500, suv: 9800, truck: 15800 } },
  { from: "서울", to: "춘천", distance: 100, fee: { car: 5500, suv: 5800, truck: 9300 } },
  { from: "부산", to: "광주", distance: 270, fee: { car: 17500, suv: 18100, truck: 29000 } },
];

type CarType = "car" | "suv" | "truck";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n);
}

export default function TollFeePage() {
  const [routeIdx, setRouteIdx] = useState(0);
  const [carType, setCarType] = useState<CarType>("car");

  const route = ROUTES[routeIdx];
  const fee = route.fee[carType];
  const hipassDiscount = Math.round(fee * 0.05);

  return (
    <CalculatorLayout title="고속도로 톨비 계산" description="주요 노선·차종별 통행료 추정 + 하이패스 5% 할인 자동 계산.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">노선 선택</span>
          <select value={routeIdx} onChange={(e) => setRouteIdx(parseInt(e.target.value))} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg">
            {ROUTES.map((r, i) => <option key={i} value={i}>{r.from} → {r.to} ({r.distance}km)</option>)}
          </select>
        </label>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[{ v: "car", l: "승용차" }, { v: "suv", l: "SUV·승합차" }, { v: "truck", l: "화물차" }].map((c) => (
            <button key={c.v} onClick={() => setCarType(c.v as CarType)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${carType === c.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}>{c.l}</button>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
            <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">예상 통행료 (편도)</div>
            <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(fee)} 원</div>
            <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">하이패스 시 약 {fmt(fee - hipassDiscount)} 원 (−{fmt(hipassDiscount)})</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">왕복 (현금)</div>
              <div className="font-bold">{fmt(fee * 2)} 원</div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">왕복 (하이패스)</div>
              <div className="font-bold text-emerald-600">{fmt((fee - hipassDiscount) * 2)} 원</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ 한국도로공사 표준 통행료 추정. 실제는 출발/도착 IC 위치에 따라 ±10% 차이.
      </div>
    </CalculatorLayout>
  );
}
