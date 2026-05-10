"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Sex = "male" | "female";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 }).format(n);
}

export default function ChildHeightPage() {
  const [father, setFather] = useState("175");
  const [mother, setMother] = useState("162");
  const [sex, setSex] = useState<Sex>("male");

  const result = useMemo(() => {
    const f = parseFloat(father);
    const m = parseFloat(mother);
    if (!f || !m) return null;
    // Tanner 공식
    const predicted = sex === "male" ? (f + m + 13) / 2 : (f + m - 13) / 2;
    return { predicted, range: { min: predicted - 5, max: predicted + 5 } };
  }, [father, mother, sex]);

  return (
    <CalculatorLayout title="어린이 키 예측" description="부모 키·자녀 성별로 자녀의 예상 성인 키를 Tanner 공식으로 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ v: "male", l: "아들" }, { v: "female", l: "딸" }].map((s) => (
            <button key={s.v} onClick={() => setSex(s.v as Sex)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${sex === s.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{s.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">아빠 키 (cm)</span><input type="number" min="0" value={father} onChange={(e) => setFather(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">엄마 키 (cm)</span><input type="number" min="0" value={mother} onChange={(e) => setMother(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 성인 키</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.predicted)} cm</div>
              <div className="text-sm text-indigo-700 mt-2">±5cm 범위: {fmt(result.range.min)} ~ {fmt(result.range.max)} cm</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800 text-base mb-2">Tanner 공식</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>아들: (아빠 + 엄마 + 13) ÷ 2</li>
          <li>딸: (아빠 + 엄마 - 13) ÷ 2</li>
          <li>실제는 영양·운동·수면·유전자에 따라 ±5cm 변동</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
