"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type HouseStatus = "single-resided" | "single-not-resided" | "multi";

function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

// 누진세율 (2026 기준)
const TAX_BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, deduction: 0 },
  { upTo: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { upTo: 500_000_000, rate: 0.40, deduction: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { upTo: Infinity, rate: 0.45, deduction: 65_940_000 },
];

function calcProgressiveTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.upTo)!;
  return Math.max(0, taxBase * bracket.rate - bracket.deduction);
}

// 장기보유특별공제 (1주택 거주자) — 보유년수와 거주년수 합산
function longHoldDeductionRate(holdYears: number, resideYears: number, isSingleResided: boolean): number {
  if (!isSingleResided) {
    // 일반: 보유 3년 이상 6% × 보유년수, 최대 30% (15년)
    if (holdYears < 3) return 0;
    return Math.min(0.30, holdYears * 0.02);
  }
  // 1주택 거주자: 보유 4% × 년수 (최대 40%) + 거주 4% × 년수 (최대 40%) = 최대 80%
  const holdRate = Math.min(0.40, Math.max(0, holdYears) * 0.04);
  const resideRate = Math.min(0.40, Math.max(0, resideYears) * 0.04);
  return holdRate + resideRate;
}

export default function CapitalGainsPage() {
  const [salePrice, setSalePrice] = useState("1500000000");
  const [acquisitionPrice, setAcquisitionPrice] = useState("800000000");
  const [expenses, setExpenses] = useState("30000000");
  const [holdYears, setHoldYears] = useState("10");
  const [resideYears, setResideYears] = useState("5");
  const [status, setStatus] = useState<HouseStatus>("single-resided");

  const result = useMemo(() => {
    const sale = parseFloat(salePrice);
    const acq = parseFloat(acquisitionPrice);
    const exp = parseFloat(expenses) || 0;
    const hY = parseFloat(holdYears) || 0;
    const rY = parseFloat(resideYears) || 0;
    if (!sale || !acq) return null;

    const gain = sale - acq - exp;
    if (gain <= 0) {
      return { gain, taxableGain: 0, longHoldDeduction: 0, taxBase: 0, tax: 0, localTax: 0, totalTax: 0, taxFreeNote: null };
    }

    // 1주택 12억 이하 비과세 (거주·보유 2년 조건 충족 시)
    if (status === "single-resided" && sale <= 1_200_000_000 && hY >= 2 && rY >= 2) {
      return {
        gain,
        taxableGain: 0,
        longHoldDeduction: 0,
        taxBase: 0,
        tax: 0,
        localTax: 0,
        totalTax: 0,
        taxFreeNote: "1주택자 12억원 이하 + 2년 거주·보유 조건 충족 → 양도세 비과세",
      };
    }

    let taxableGain = gain;
    // 1주택 12억 초과 — 12억 초과분 비율로 과세
    if (status === "single-resided" && sale > 1_200_000_000) {
      const taxableRatio = (sale - 1_200_000_000) / sale;
      taxableGain = gain * taxableRatio;
    }

    const longHoldRate = longHoldDeductionRate(hY, rY, status === "single-resided");
    const longHoldDeduction = taxableGain * longHoldRate;
    const taxBase = Math.max(0, taxableGain - longHoldDeduction - 2_500_000); // 기본공제 250만원
    const tax = calcProgressiveTax(taxBase);
    const localTax = tax * 0.10; // 지방소득세 10%
    const totalTax = tax + localTax;

    return { gain, taxableGain, longHoldDeduction, taxBase, tax, localTax, totalTax, taxFreeNote: null };
  }, [salePrice, acquisitionPrice, expenses, holdYears, resideYears, status]);

  return (
    <CalculatorLayout
      title="양도소득세 계산기"
      description="1주택·다주택 양도소득세를 보유·거주 기간별 장기보유특별공제까지 자동 적용해 계산합니다 (2026년 세법 기준)."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">양도가액 (원)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
            {salePrice && parseFloat(salePrice) > 0 && (
              <span className="block mt-1 text-xs text-slate-500">{formatKRW(parseFloat(salePrice))} 원</span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">취득가액 (원)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={acquisitionPrice}
              onChange={(e) => setAcquisitionPrice(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
            {acquisitionPrice && parseFloat(acquisitionPrice) > 0 && (
              <span className="block mt-1 text-xs text-slate-500">{formatKRW(parseFloat(acquisitionPrice))} 원</span>
            )}
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">필요경비 (취득세·중개수수료·인테리어 등, 원)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">보유 기간 (년)</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              step="0.1"
              value={holdYears}
              onChange={(e) => setHoldYears(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">거주 기간 (년)</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              step="0.1"
              value={resideYears}
              onChange={(e) => setResideYears(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">주택 보유 상태</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { v: "single-resided", label: "1주택 (거주)" },
              { v: "single-not-resided", label: "1주택 (미거주)" },
              { v: "multi", label: "다주택" },
            ].map((s) => (
              <button
                key={s.v}
                onClick={() => setStatus(s.v as HouseStatus)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  status === s.v
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            {result.taxFreeNote ? (
              <div className="rounded-xl bg-emerald-50 p-5 text-center">
                <div className="text-sm text-emerald-700 mb-1">예상 양도세</div>
                <div className="text-3xl font-bold text-emerald-700">0 원 (비과세)</div>
                <div className="text-xs text-emerald-600 mt-2">{result.taxFreeNote}</div>
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-indigo-50 p-5 text-center">
                  <div className="text-sm text-indigo-700 mb-1">예상 양도세 (지방세 포함)</div>
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-900">
                    {formatKRW(result.totalTax)} 원
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">양도차익</div>
                    <div className="font-semibold text-slate-900">{formatKRW(result.gain)} 원</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">과세 양도차익</div>
                    <div className="font-semibold text-slate-900">{formatKRW(result.taxableGain)} 원</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">장기보유특별공제</div>
                    <div className="font-semibold text-emerald-600">- {formatKRW(result.longHoldDeduction)} 원</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">과세표준</div>
                    <div className="font-semibold text-slate-900">{formatKRW(result.taxBase)} 원</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">참고 사항</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>1주택 12억원 이하 + 2년 거주·보유 조건 충족 시 비과세</li>
          <li>1주택 12억 초과 시 초과분 비율만큼만 과세</li>
          <li>장기보유특별공제 — 1주택 거주자는 보유·거주 각 최대 40% (총 80%)</li>
          <li>다주택 + 조정대상지역의 경우 중과세율 (+10~30%) 추가 적용 가능</li>
          <li>본 계산은 추정치이며 실제 신고는 세무사 상담 권장</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 매매가 (2026 5월)</strong>: 서울 아파트 평균 약 11억 / 수도권 약 6억 / 전국 평균 약 4억
        </div>
    </CalculatorLayout>
  );
}
