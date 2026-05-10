"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Sex = "male" | "female";
type Activity = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

const ACTIVITIES: { v: Activity; label: string; desc: string }[] = [
  { v: 1.2, label: "거의 활동 안 함", desc: "주로 앉아서 일·운동 X" },
  { v: 1.375, label: "가벼운 활동", desc: "주 1~3회 가벼운 운동" },
  { v: 1.55, label: "보통 활동", desc: "주 3~5회 중강도 운동" },
  { v: 1.725, label: "활발한 활동", desc: "주 6~7회 강도 높은 운동" },
  { v: 1.9, label: "매우 활발", desc: "매일 강도 높은 운동·육체노동" },
];

function format(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

// Mifflin-St Jeor BMR 공식
function bmrMifflin(weight: number, height: number, age: number, sex: Sex): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export default function CaloriePage() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<Activity>(1.55);

  const result = useMemo(() => {
    const a = parseInt(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) return null;
    const bmr = bmrMifflin(w, h, a, sex);
    const tdee = bmr * activity;
    return {
      bmr,
      tdee,
      diet: tdee - 500, // 0.5kg/주 감량
      maintain: tdee,
      bulk: tdee + 500, // 0.5kg/주 증량
      // 단백질 권장량 (g) — 체중 × 1.2 (일반) ~ 2.0 (헬스)
      proteinNormal: w * 1.2,
      proteinFitness: w * 2.0,
    };
  }, [sex, age, height, weight, activity]);

  return (
    <CalculatorLayout
      title="칼로리 계산기 (BMR · TDEE)"
      description="기초대사량(BMR)과 일일 소모 칼로리(TDEE)를 Mifflin-St Jeor 공식으로 계산합니다. 다이어트·유지·벌크업 권장 칼로리까지 자동."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { v: "male", label: "남성" },
            { v: "female", label: "여성" },
          ].map((s) => (
            <button
              key={s.v}
              onClick={() => setSex(s.v as Sex)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                sex === s.v
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">나이 (세)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">키 (cm)</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">체중 (kg)</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">활동량</span>
          <div className="space-y-2">
            {ACTIVITIES.map((a) => (
              <button
                key={a.v}
                onClick={() => setActivity(a.v)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                  activity === a.v
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-white border-slate-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{a.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
                  </div>
                  <div className="text-xs font-mono text-slate-400">×{a.v}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">기초대사량 (BMR)</div>
                <div className="text-2xl font-bold text-slate-900">{format(result.bmr)}<span className="text-sm font-normal text-slate-500"> kcal</span></div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4 text-center">
                <div className="text-xs text-indigo-700 mb-1">일일 소모 (TDEE)</div>
                <div className="text-2xl font-bold text-indigo-900">{format(result.tdee)}<span className="text-sm font-normal text-indigo-700"> kcal</span></div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: "다이어트 (주 0.5kg 감량)", sub: "TDEE - 500", val: result.diet, bg: "bg-rose-50", text: "text-rose-700", bar: "bg-rose-400" },
                { label: "체중 유지", sub: "TDEE", val: result.maintain, bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" },
                { label: "벌크업 (주 0.5kg 증량)", sub: "TDEE + 500", val: result.bulk, bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-400" },
              ].map((row) => {
                const max = result.bulk;
                const pct = (row.val / max) * 100;
                return (
                  <div key={row.label} className={`rounded-xl ${row.bg} p-4`}>
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <div className={`text-xs ${row.text}`}>{row.label}</div>
                        <div className={`text-xs ${row.text} opacity-70 mt-0.5`}>{row.sub}</div>
                      </div>
                      <div className={`font-bold ${row.text}`}>{format(row.val)} kcal</div>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className={`h-full ${row.bar} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <strong>일일 단백질 권장량</strong>: 일반 {format(result.proteinNormal)}g · 헬스·근성장 {format(result.proteinFitness)}g
              <div className="text-xs text-slate-500 mt-1">체중 × 1.2~2.0g (활동량 따라)</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">BMR vs TDEE 차이</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>BMR (Basal Metabolic Rate)</strong>: 누워서 아무것도 안 해도 소모되는 칼로리</li>
          <li><strong>TDEE (Total Daily Energy Expenditure)</strong>: BMR + 일상 활동·운동 합산</li>
          <li><strong>다이어트</strong>: TDEE - 500 (주 0.5kg 감량 안전 페이스)</li>
          <li><strong>벌크업</strong>: TDEE + 500 (주 0.5kg 증량, 근성장 우선)</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
