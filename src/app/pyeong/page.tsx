"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Unit = "pyeong" | "sqm" | "hectare";

const PYEONG_TO_SQM = 3.305785;
const SQM_TO_PYEONG = 1 / PYEONG_TO_SQM;

function format(n: number, decimals = 2): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: decimals }).format(n);
}

export default function PyeongPage() {
  const [value, setValue] = useState("30");
  const [unit, setUnit] = useState<Unit>("pyeong");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!v || v < 0) return null;

    let sqm: number;
    if (unit === "pyeong") sqm = v * PYEONG_TO_SQM;
    else if (unit === "sqm") sqm = v;
    else sqm = v * 10000; // hectare → m²

    return {
      pyeong: sqm * SQM_TO_PYEONG,
      sqm,
      hectare: sqm / 10000,
      sqft: sqm * 10.7639,
    };
  }, [value, unit]);

  const examples = useMemo(() => {
    const v = parseFloat(value);
    if (!v) return null;
    let pyeong: number;
    if (unit === "pyeong") pyeong = v;
    else if (unit === "sqm") pyeong = v * SQM_TO_PYEONG;
    else pyeong = (v * 10000) * SQM_TO_PYEONG;

    if (pyeong < 6) return "원룸 (6평 미만)";
    if (pyeong < 10) return "1인 가구 오피스텔 (6~10평)";
    if (pyeong < 18) return "투룸·소형 아파트 (10~18평)";
    if (pyeong < 25) return "1.5룸·소형 아파트 (18~25평)";
    if (pyeong < 32) return "30평대 아파트 — 신혼·소가족";
    if (pyeong < 40) return "30평대 후반 아파트 — 4인 가족";
    if (pyeong < 50) return "40평대 아파트 — 중대형";
    return "50평+ 대형 아파트";
  }, [value, unit]);

  return (
    <CalculatorLayout
      title="평수·㎡ 변환기"
      description="㎡ ↔ 평 ↔ 헥타르 ↔ ft² 4가지 단위 즉시 변환. 분양·임대·이사 시 필수 도구."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">변환할 값</span>
          <input
            type="number"
              min="0"
            inputMode="decimal"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-2xl font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            placeholder="30"
          />
        </label>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">입력 단위</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "pyeong", label: "평" },
              { v: "sqm", label: "㎡ (제곱미터)" },
              { v: "hectare", label: "헥타르 (ha)" },
            ].map((u) => (
              <button
                key={u.v}
                onClick={() => setUnit(u.v as Unit)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  unit === u.v
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-indigo-50 p-4">
                <div className="text-xs text-indigo-700 mb-1">평</div>
                <div className="text-2xl font-bold text-indigo-900">{format(result.pyeong)}</div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4">
                <div className="text-xs text-indigo-700 mb-1">제곱미터 (㎡)</div>
                <div className="text-2xl font-bold text-indigo-900">{format(result.sqm)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">헥타르 (ha)</div>
                <div className="text-lg font-bold text-slate-900">{format(result.hectare, 4)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">평방피트 (ft²)</div>
                <div className="text-lg font-bold text-slate-900">{format(result.sqft)}</div>
              </div>
            </div>
            {examples && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                💡 <strong>참고</strong>: {examples}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">단위 환산 공식</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>1평 = 약 3.3058 ㎡ (정확히 400/121)</li>
          <li>1㎡ = 약 0.3025 평</li>
          <li>1헥타르 (ha) = 10,000 ㎡ = 약 3,025 평</li>
          <li>1 ft² = 약 0.0929 ㎡ = 약 0.0281 평</li>
        </ul>
        <h2 className="font-semibold text-slate-800 text-base mt-4">분양 면적 vs 전용 면적</h2>
        <p>
          한국 아파트의 \"30평\" 은 보통 분양면적 (공급면적). 실제 사용 가능한 전용면적은 약 80% 수준이라
          전용 24평 정도가 일반적입니다. 부동산 광고 표기 시 분양·전용 구분 확인 필수.
        </p>
      </div>
    </CalculatorLayout>
  );
}
