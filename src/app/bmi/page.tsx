"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type BmiCategory = {
  label: string;
  range: string;
  color: string;
};

function classifyKr(bmi: number): BmiCategory {
  if (bmi < 18.5) return { label: "저체중", range: "< 18.5", color: "text-sky-600" };
  if (bmi < 23) return { label: "정상", range: "18.5 ~ 22.9", color: "text-emerald-600" };
  if (bmi < 25) return { label: "과체중", range: "23 ~ 24.9", color: "text-amber-600" };
  if (bmi < 30) return { label: "비만 1단계", range: "25 ~ 29.9", color: "text-orange-600" };
  if (bmi < 35) return { label: "비만 2단계", range: "30 ~ 34.9", color: "text-red-600" };
  return { label: "비만 3단계 (고도)", range: "≥ 35", color: "text-red-700" };
}

function classifyWho(bmi: number): BmiCategory {
  if (bmi < 18.5) return { label: "저체중", range: "< 18.5", color: "text-sky-600" };
  if (bmi < 25) return { label: "정상", range: "18.5 ~ 24.9", color: "text-emerald-600" };
  if (bmi < 30) return { label: "과체중", range: "25 ~ 29.9", color: "text-amber-600" };
  if (bmi < 35) return { label: "비만 1단계", range: "30 ~ 34.9", color: "text-orange-600" };
  if (bmi < 40) return { label: "비만 2단계", range: "35 ~ 39.9", color: "text-red-600" };
  return { label: "비만 3단계 (고도)", range: "≥ 40", color: "text-red-700" };
}

export default function BmiPage() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");

  const result = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    const meters = h / 100;
    const bmi = w / (meters * meters);
    return {
      bmi: Math.round(bmi * 10) / 10,
      kr: classifyKr(bmi),
      who: classifyWho(bmi),
      ideal: {
        min: Math.round(18.5 * meters * meters * 10) / 10,
        max: Math.round(22.9 * meters * meters * 10) / 10,
      },
    };
  }, [height, weight]);

  return (
    <CalculatorLayout
      title="BMI 계산기"
      description="키·체중을 입력하면 비만도(체질량지수)와 한국·WHO 기준 분류를 즉시 보여드립니다."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">키 (cm)</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="170"
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
              placeholder="65"
            />
          </label>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-sm text-slate-500 mb-1">BMI</div>
              <div className="text-5xl font-bold text-slate-900">{result.bmi}</div>
            </div>

            <div className="mt-6">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div className="bg-sky-400" style={{ width: "23%" }} title="저체중 < 18.5" />
                <div className="bg-emerald-400" style={{ width: "11%" }} title="정상 18.5~22.9" />
                <div className="bg-amber-400" style={{ width: "5%" }} title="과체중 23~24.9" />
                <div className="bg-orange-500" style={{ width: "13%" }} title="비만 1단계 25~29.9" />
                <div className="bg-red-500" style={{ width: "13%" }} title="비만 2단계 30~34.9" />
                <div className="bg-red-700" style={{ width: "35%" }} title="비만 3단계 ≥35" />
              </div>
              <div className="relative h-4 mt-1">
                <div
                  className="absolute -translate-x-1/2 transition-all"
                  style={{ left: `${Math.min(100, (result.bmi / 40) * 100)}%` }}
                >
                  <div className="text-xl leading-none">▲</div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0</span><span>18.5</span><span>23</span><span>25</span><span>30</span><span>35</span><span>40+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">한국 (KSSO) 기준</div>
                <div className={`font-semibold ${result.kr.color}`}>{result.kr.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{result.kr.range}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">WHO 기준</div>
                <div className={`font-semibold ${result.who.color}`}>{result.who.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{result.who.range}</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
              <strong>표준 체중 (정상 BMI)</strong>: {result.ideal.min} ~ {result.ideal.max} kg
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">BMI 계산 공식</h2>
        <p>
          BMI = 체중(kg) ÷ 키(m)². 예: 키 170cm·체중 65kg → 65 ÷ (1.70)² = 22.5
        </p>
        <h2 className="font-semibold text-slate-800 text-base mt-4">한국 vs WHO 기준 차이</h2>
        <p>
          한국비만학회(KSSO) 는 아시아인의 체형 특성상 25 이상을 비만으로 분류합니다 (WHO 30 이상).
          이는 동일한 BMI 에서 한국인이 서구인보다 체지방률·당뇨·심혈관 위험이 높기 때문이에요.
        </p>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 성인 평균 (질병관리청)</strong>: 남성 평균 키 173cm·체중 75kg (BMI 25.0) / 여성 평균 키 160cm·체중 58kg (BMI 22.7)
        </div>
    </CalculatorLayout>
  );
}
