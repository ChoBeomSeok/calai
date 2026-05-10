"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const ZONES = [
  { name: "준비 운동", min: 0.5, max: 0.6, color: "bg-sky-100 text-sky-700" },
  { name: "지방 연소", min: 0.6, max: 0.7, color: "bg-emerald-100 text-emerald-700" },
  { name: "유산소", min: 0.7, max: 0.8, color: "bg-amber-100 text-amber-700" },
  { name: "무산소", min: 0.8, max: 0.9, color: "bg-orange-100 text-orange-700" },
  { name: "최대 강도", min: 0.9, max: 1.0, color: "bg-red-100 text-red-700" },
];

export default function HeartRatePage() {
  const [age, setAge] = useState("30");

  const result = useMemo(() => {
    const a = parseInt(age);
    if (!a || a <= 0) return null;
    const max = 220 - a;
    return ZONES.map((z) => ({
      ...z,
      bpmMin: Math.round(max * z.min),
      bpmMax: Math.round(max * z.max),
    }));
  }, [age]);

  return (
    <CalculatorLayout title="심박수 운동 강도" description="나이로 최대 심박수 + 5단계 운동 강도별 권장 심박수 (Karvonen 공식 단순화).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block"><span className="text-sm font-medium text-slate-700">나이 (세)</span><input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-4 text-center mb-4">
              <div className="text-sm text-indigo-700">최대 심박수</div>
              <div className="text-3xl font-bold text-indigo-900">{220 - parseInt(age)} bpm</div>
            </div>
            <div className="space-y-2">
              {result.map((z) => (
                <div key={z.name} className={`rounded-xl p-3 flex justify-between items-center ${z.color}`}>
                  <div>
                    <div className="font-semibold">{z.name}</div>
                    <div className="text-xs opacity-70">{z.min * 100}~{z.max * 100}%</div>
                  </div>
                  <div className="font-bold">{z.bpmMin}~{z.bpmMax} bpm</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
