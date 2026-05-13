"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

const BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, ded: 0 },
  { upTo: 50_000_000, rate: 0.15, ded: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, ded: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, ded: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, ded: 19_940_000 },
  { upTo: 500_000_000, rate: 0.40, ded: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, ded: 35_940_000 },
  { upTo: Infinity, rate: 0.45, ded: 65_940_000 },
];

function calcTax(base: number) {
  if (base <= 0) return { rate: 0, tax: 0 };
  const b = BRACKETS.find((x) => base <= x.upTo)!;
  return { rate: b.rate * 100, tax: Math.max(0, base * b.rate - b.ded) };
}

// 근로소득공제 (2026 기준, 한도 2,000만원)
function workIncomeDeduction(totalSalary: number): number {
  let ded = 0;
  if (totalSalary <= 5_000_000) {
    ded = totalSalary * 0.70;
  } else if (totalSalary <= 15_000_000) {
    ded = 3_500_000 + (totalSalary - 5_000_000) * 0.40;
  } else if (totalSalary <= 45_000_000) {
    ded = 7_500_000 + (totalSalary - 15_000_000) * 0.15;
  } else if (totalSalary <= 100_000_000) {
    ded = 12_000_000 + (totalSalary - 45_000_000) * 0.05;
  } else {
    ded = 14_750_000 + (totalSalary - 100_000_000) * 0.02;
  }
  return Math.min(20_000_000, ded);
}

type Mode = "base" | "salary";

export default function IncomeTaxPage() {
  const [mode, setMode] = useState<Mode>("salary");
  const [taxableIncome, setTaxableIncome] = useState("80000000");
  const [totalSalary, setTotalSalary] = useState("60000000");
  const [dependents, setDependents] = useState("1");

  const result = useMemo(() => {
    if (mode === "base") {
      const t = parseFloat(taxableIncome);
      if (!t || t <= 0) return null;
      const { rate, tax } = calcTax(t);
      const local = tax * 0.10;
      return {
        mode: "base" as const,
        taxBase: t,
        rate,
        tax,
        local,
        total: tax + local,
      };
    }
    // salary mode: 총급여 → 근로소득공제 → 기본공제 → 과세표준
    const salary = parseFloat(totalSalary);
    const deps = Math.max(1, parseInt(dependents) || 1);
    if (!salary || salary <= 0) return null;
    const workDed = workIncomeDeduction(salary);
    const workIncome = salary - workDed; // 근로소득금액
    const personalDed = deps * 1_500_000; // 기본공제 (본인 + 부양가족 × 150만원)
    const taxBase = Math.max(0, workIncome - personalDed);
    const { rate, tax } = calcTax(taxBase);
    const local = tax * 0.10;
    return {
      mode: "salary" as const,
      salary,
      workDed,
      workIncome,
      personalDed,
      taxBase,
      rate,
      tax,
      local,
      total: tax + local,
    };
  }, [mode, taxableIncome, totalSalary, dependents]);

  return (
    <CalculatorLayout title="종합소득세 계산기" description="총급여 또는 과세표준 입력으로 종합소득세 + 지방소득세 누진세율 자동 계산 (2026년 세법 기준).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { v: "salary", l: "총급여 자동 계산" },
            { v: "base", l: "과세표준 직접 입력" },
          ].map((m) => (
            <button
              key={m.v}
              onClick={() => setMode(m.v as Mode)}
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

        {mode === "base" ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">과세표준 (원) — 소득공제 후</span>
            <input
              type="number"
              min="0"
              value={taxableIncome}
              onChange={(e) => setTaxableIncome(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <MoneyHint value={taxableIncome} />
          </label>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">연 총급여 (세전, 원)</span>
              <input
                type="number"
                min="0"
                value={totalSalary}
                onChange={(e) => setTotalSalary(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <MoneyHint value={totalSalary} />
              <span className="block mt-1 text-xs text-slate-500">근로소득공제·기본공제만 자동 적용. 세액공제·특별공제는 별도 차감 필요.</span>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">기본공제 대상자 수 (본인 + 부양가족)</span>
              <input
                type="number"
                min="1"
                max="10"
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <span className="block mt-1 text-xs text-slate-500">1인당 150만원. 부양가족 요건: 소득 100만원 이하, 직계존속(60세+)·직계비속(20세 이하)</span>
            </label>
          </div>
        )}

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">총 부담세액 (지방세 포함)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.total)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">적용 세율 구간: {result.rate.toFixed(0)}%</div>
            </div>
            {result.mode === "salary" && (
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">총급여</span>
                  <span>{fmt(result.salary)} 원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">근로소득공제</span>
                  <span className="text-emerald-600">- {fmt(result.workDed)} 원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">근로소득금액</span>
                  <span>{fmt(result.workIncome)} 원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">기본공제 ({dependents}인 × 150만원)</span>
                  <span className="text-emerald-600">- {fmt(result.personalDed)} 원</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 font-semibold">
                  <span className="text-slate-700">과세표준</span>
                  <span>{fmt(result.taxBase)} 원</span>
                </div>
              </div>
            )}
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>종합소득세 (산출세액)</span>
                <span>{fmt(result.tax)} 원</span>
              </div>
              <div className="flex justify-between py-2">
                <span>지방소득세 (10%)</span>
                <span>{fmt(result.local)} 원</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800 text-base mb-2">2026 종합소득세 누진 8구간</h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>1,400만원 이하: 6%</li>
          <li>5,000만원 이하: 15% - 126만원</li>
          <li>8,800만원 이하: 24% - 576만원</li>
          <li>1.5억 이하: 35% - 1,544만원</li>
          <li>3억 이하: 38% - 1,994만원</li>
          <li>5억 이하: 40% - 2,594만원</li>
          <li>10억 이하: 42% - 3,594만원</li>
          <li>10억 초과: 45% - 6,594만원</li>
        </ul>
        <h2 className="font-semibold text-slate-800 text-base mt-4 mb-2">근로소득공제 단계 (총급여 기준)</h2>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>500만원 이하: 70%</li>
          <li>500~1,500만원: 350만원 + 초과분의 40%</li>
          <li>1,500~4,500만원: 750만원 + 초과분의 15%</li>
          <li>4,500~10,000만원: 1,200만원 + 초과분의 5%</li>
          <li>1억 초과: 1,475만원 + 초과분의 2% (한도 2,000만원)</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
        ⚠️ 본 계산은 근로소득자 기본 시나리오 추정치. 신용카드·의료비·연금저축 등 특별공제·세액공제 미반영. 정확한 세액은 국세청 홈택스 모의계산 또는 세무사 상담.
      </div>
      <div className="mt-3 text-[11px] text-slate-400 text-right">
        2026년 소득세법 기준 · 최종 갱신: 2026-05-13
      </div>
    </CalculatorLayout>
  );
}
