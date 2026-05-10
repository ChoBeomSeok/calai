"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Sex = "male" | "female";
type Drink = { name: string; volume: number; abv: number };

const DRINKS: Drink[] = [
  { name: "소주 (1잔 50ml)", volume: 50, abv: 16.5 },
  { name: "소주 1병 (360ml)", volume: 360, abv: 16.5 },
  { name: "맥주 1잔 (200ml)", volume: 200, abv: 4.5 },
  { name: "맥주 1병 (500ml)", volume: 500, abv: 4.5 },
  { name: "와인 1잔 (150ml)", volume: 150, abv: 12 },
];

function fmt(n: number, d = 2): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function AlcoholPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [weight, setWeight] = useState("70");
  const [drinks, setDrinks] = useState([0, 0, 0, 0, 0]);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    // Widmark 공식: BAC (%) = (알코올량 g × 100) / (체중 kg × r × 1000)
    // r = 0.68 (남성) / 0.55 (여성)
    const r = sex === "male" ? 0.68 : 0.55;
    let totalAlcoholG = 0;
    DRINKS.forEach((d, i) => {
      const ml = d.volume * drinks[i];
      const alcoholMl = ml * (d.abv / 100);
      const alcoholG = alcoholMl * 0.789; // 알코올 밀도
      totalAlcoholG += alcoholG;
    });
    const bac = (totalAlcoholG * 100) / (w * r * 1000);
    // 분해 시간 = BAC / 0.015 (시간당 0.015% 분해)
    const hoursToZero = bac / 0.015;
    return { bac, totalAlcoholG, hoursToZero };
  }, [sex, weight, drinks]);

  return (
    <CalculatorLayout title="음주 알코올 분해 시간" description="성별·체중·음주량으로 혈중알코올농도(BAC)와 운전 가능 시간 추정 (Widmark 공식).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[{ v: "male", l: "남성" }, { v: "female", l: "여성" }].map((s) => (
            <button key={s.v} onClick={() => setSex(s.v as Sex)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${sex === s.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{s.l}</button>
          ))}
        </div>
        <label className="block mb-5"><span className="text-sm font-medium text-slate-700">체중 (kg)</span><input type="number"
              min="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        <div className="space-y-2">
          {DRINKS.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200">
              <span className="text-sm text-slate-700 flex-1">{d.name}</span>
              <input type="number" min="0" value={drinks[i]} onChange={(e) => { const v = [...drinks]; v[i] = parseInt(e.target.value) || 0; setDrinks(v); }} className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-center" />
            </div>
          ))}
        </div>
        {result && result.bac > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className={`rounded-xl p-5 text-center ${result.bac >= 0.08 ? "bg-red-50" : result.bac >= 0.03 ? "bg-amber-50" : "bg-emerald-50"}`}>
              <div className={`text-sm mb-1 ${result.bac >= 0.08 ? "text-red-700" : result.bac >= 0.03 ? "text-amber-700" : "text-emerald-700"}`}>예상 혈중알코올농도</div>
              <div className={`text-4xl font-bold ${result.bac >= 0.08 ? "text-red-900" : result.bac >= 0.03 ? "text-amber-900" : "text-emerald-900"}`}>{fmt(result.bac, 3)}%</div>
              <div className="text-xs mt-2">{result.bac >= 0.08 ? "면허 취소 (0.08%↑)" : result.bac >= 0.03 ? "면허 정지 (0.03~0.08%)" : "운전 가능 범위"}</div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              완전 분해까지: <strong>약 {fmt(result.hoursToZero, 1)}시간</strong> (시간당 0.015% 분해 기준)
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ Widmark 공식 기반 추정. 개인차·식사 여부에 따라 차이 큼. 음주 후 절대 운전 X.</p>
      </div>
    </CalculatorLayout>
  );
}
