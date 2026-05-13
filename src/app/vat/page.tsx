"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type TaxType = "general" | "simplified";
type GeneralMode = "supply-to-total" | "total-to-supply";

// 간이과세자 업종별 부가가치율 (2021-07 개정, 2026 유효)
const VAT_INDUSTRIES = [
  { key: "retail", label: "소매·음식·재생용재료", rate: 0.15 },
  { key: "manufacturing", label: "제조·농임어·통신", rate: 0.20 },
  { key: "lodging", label: "숙박", rate: 0.25 },
  { key: "construction", label: "건설·운수·부동산임대", rate: 0.30 },
  { key: "finance", label: "금융보험·전문서비스", rate: 0.40 },
] as const;

const SIMPLIFIED_THRESHOLD = 104_000_000; // 간이과세 적용 한도 (연 매출, 2024 인상 후)

export default function VatPage() {
  const [taxType, setTaxType] = useState<TaxType>("general");
  const [mode, setMode] = useState<GeneralMode>("supply-to-total");
  const [value, setValue] = useState("100000");
  const [industry, setIndustry] = useState<typeof VAT_INDUSTRIES[number]["key"]>("retail");
  const [simplifiedSales, setSimplifiedSales] = useState("30000000");

  const generalResult = useMemo(() => {
    if (taxType !== "general") return null;
    const v = parseFloat(value);
    if (!v || v < 0) return null;
    if (mode === "supply-to-total") {
      const vat = v * 0.1;
      return { supply: v, vat, total: v + vat };
    }
    const supply = v / 1.1;
    return { supply, vat: v - supply, total: v };
  }, [taxType, mode, value]);

  const simplifiedResult = useMemo(() => {
    if (taxType !== "simplified") return null;
    const sales = parseFloat(simplifiedSales);
    if (!sales || sales < 0) return null;
    const industryInfo = VAT_INDUSTRIES.find((i) => i.key === industry)!;
    // 납부세액 = 공급대가 × 업종별 부가가치율 × 10%
    const payable = sales * industryInfo.rate * 0.1;
    const overThreshold = sales > SIMPLIFIED_THRESHOLD;
    return {
      sales,
      rate: industryInfo.rate,
      industryLabel: industryInfo.label,
      payable,
      overThreshold,
    };
  }, [taxType, simplifiedSales, industry]);

  return (
    <CalculatorLayout title="부가가치세 계산기" description="일반과세 (공급가 ↔ 부가세 ↔ 합계금액 10%) + 간이과세 업종별 부가가치율 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { v: "general", l: "일반과세 (10%)" },
            { v: "simplified", l: "간이과세 (업종별)" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTaxType(t.v as TaxType)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                taxType === t.v
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>

        {taxType === "general" && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { v: "supply-to-total", l: "공급가 → 합계" },
                { v: "total-to-supply", l: "합계 → 공급가" },
              ].map((m) => (
                <button
                  key={m.v}
                  onClick={() => setMode(m.v as GeneralMode)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                    mode === m.v
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                  }`}
                >
                  {m.l}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {mode === "total-to-supply" ? "합계금액" : "공급가액"} (원)
              </span>
              <input
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <MoneyHint value={value} />
            </label>
            {generalResult && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <div className="text-xs text-slate-500 mb-1">공급가액</div>
                    <div className="font-bold text-sm">{fmt(generalResult.supply)} 원</div>
                  </div>
                  <div className="rounded-xl bg-rose-50 p-4 text-center">
                    <div className="text-xs text-rose-600 mb-1">부가세 (10%)</div>
                    <div className="font-bold text-sm text-rose-700">{fmt(generalResult.vat)} 원</div>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-4 text-center">
                    <div className="text-xs text-indigo-700 mb-1">합계금액</div>
                    <div className="font-bold text-sm text-indigo-900">{fmt(generalResult.total)} 원</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {taxType === "simplified" && (
          <>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">연 매출액 (공급대가, 원)</span>
              <input
                type="number"
                min="0"
                value={simplifiedSales}
                onChange={(e) => setSimplifiedSales(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <MoneyHint value={simplifiedSales} />
              <span className="block mt-1 text-xs text-slate-500">간이과세 대상: 직전 연 매출 1억 400만원 미만</span>
            </label>

            <div className="mt-5">
              <span className="text-sm font-medium text-slate-700 block mb-2">업종</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VAT_INDUSTRIES.map((ind) => (
                  <button
                    key={ind.key}
                    onClick={() => setIndustry(ind.key)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition text-left ${
                      industry === ind.key
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                    }`}
                  >
                    {ind.label}
                    <span className="block text-xs opacity-75">부가가치율 {(ind.rate * 100).toFixed(0)}%</span>
                  </button>
                ))}
              </div>
            </div>

            {simplifiedResult && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="rounded-xl bg-indigo-50 p-5 text-center">
                  <div className="text-sm text-indigo-700 mb-1">예상 납부세액 (간이과세)</div>
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-900">
                    {fmt(simplifiedResult.payable)} 원
                  </div>
                  <div className="text-xs text-indigo-700 mt-2">
                    {fmt(simplifiedResult.sales)}원 × {(simplifiedResult.rate * 100).toFixed(0)}% × 10%
                  </div>
                </div>
                {simplifiedResult.overThreshold && (
                  <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                    ⚠️ 연 매출 1억 400만원 초과 — 간이과세 적용 대상이 아닙니다. 일반과세자로 전환됩니다.
                  </div>
                )}
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
                  <div>· 업종: {simplifiedResult.industryLabel}</div>
                  <div>· 부가가치율 (2021-07 개정 후): {(simplifiedResult.rate * 100).toFixed(0)}%</div>
                  <div>· 연 매출 4,800만원 미만 시 부가세 신고 의무는 있으나 납부세액 면제 (납부의무 면제 한도)</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-3 text-[11px] text-slate-400 text-right">
        2026년 부가가치세법 기준 · 최종 갱신: 2026-05-13
      </div>
    </CalculatorLayout>
  );
}
