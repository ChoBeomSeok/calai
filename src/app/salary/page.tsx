"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

// 2026 기준 4대보험 요율 (근로자 부담분)
const RATE_NATIONAL_PENSION = 0.045; // 국민연금 4.5%
const RATE_HEALTH = 0.03545; // 건강보험 3.545%
const RATE_LONG_TERM_CARE = 0.1295; // 장기요양 (건강보험료의 12.95%)
const RATE_EMPLOYMENT = 0.009; // 고용보험 0.9%

// 종합소득세 누진세율 (2026)
const TAX_BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, ded: 0 },
  { upTo: 50_000_000, rate: 0.15, ded: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, ded: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, ded: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, ded: 19_940_000 },
  { upTo: 500_000_000, rate: 0.40, ded: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, ded: 35_940_000 },
  { upTo: Infinity, rate: 0.45, ded: 65_940_000 },
];

function calcProgressiveTax(base: number): number {
  if (base <= 0) return 0;
  const b = TAX_BRACKETS.find((x) => base <= x.upTo)!;
  return Math.max(0, base * b.rate - b.ded);
}

// 근로소득공제 (연 총급여 → 근로소득금액 변환)
function calcEarnedIncomeDeduction(totalSalary: number): number {
  let d = 0;
  if (totalSalary <= 5_000_000) d = totalSalary * 0.70;
  else if (totalSalary <= 15_000_000) d = 3_500_000 + (totalSalary - 5_000_000) * 0.40;
  else if (totalSalary <= 45_000_000) d = 7_500_000 + (totalSalary - 15_000_000) * 0.15;
  else if (totalSalary <= 100_000_000) d = 12_000_000 + (totalSalary - 45_000_000) * 0.05;
  else d = 14_750_000 + (totalSalary - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000); // 한도 2천만원
}

// 근로소득 세액공제 (산출세액 → 결정세액)
function calcEarnedIncomeTaxCredit(calculatedTax: number, totalSalary: number): number {
  // 산출세액 130만원 이하: 55%, 초과: 30%
  let credit = calculatedTax <= 1_300_000
    ? calculatedTax * 0.55
    : 715_000 + (calculatedTax - 1_300_000) * 0.30;

  // 한도 (총급여 구간별)
  let limit: number;
  if (totalSalary <= 33_000_000) limit = 740_000;
  else if (totalSalary <= 70_000_000) {
    limit = Math.max(660_000, 740_000 - (totalSalary - 33_000_000) * 0.008);
  } else if (totalSalary <= 120_000_000) {
    limit = Math.max(500_000, 660_000 - (totalSalary - 70_000_000) * 0.5 / 100);
  } else {
    limit = Math.max(200_000, 500_000 - (totalSalary - 120_000_000) * 0.5 / 100);
  }
  return Math.min(credit, limit);
}

export default function SalaryPage() {
  const [annualSalary, setAnnualSalary] = useState("50000000");
  const [nonTaxable, setNonTaxable] = useState("200000"); // 월 비과세액
  const [dependents, setDependents] = useState("1"); // 본인 포함
  const [children, setChildren] = useState("0"); // 8~20세 자녀 수

  const result = useMemo(() => {
    const annual = parseFloat(annualSalary);
    const nonTaxMonth = parseFloat(nonTaxable) || 0;
    const dep = parseInt(dependents) || 1;
    const ch = parseInt(children) || 0;
    if (!annual || annual <= 0) return null;

    const monthlyGross = annual / 12;
    const nonTaxAnnual = nonTaxMonth * 12;
    const totalSalary = annual - nonTaxAnnual; // 연 총급여 (비과세 제외)
    const monthlyTaxable = totalSalary / 12;

    // 1. 4대보험 (월 과세소득 기준)
    const nationalPension = Math.min(monthlyTaxable, 5_900_000) * RATE_NATIONAL_PENSION; // 상한 적용 (2026 추정)
    const health = monthlyTaxable * RATE_HEALTH;
    const longTermCare = health * RATE_LONG_TERM_CARE;
    const employment = monthlyTaxable * RATE_EMPLOYMENT;
    const insuranceMonthly = nationalPension + health + longTermCare + employment;
    const insuranceAnnual = insuranceMonthly * 12;

    // 2. 근로소득공제
    const earnedIncomeDeduction = calcEarnedIncomeDeduction(totalSalary);
    const earnedIncome = totalSalary - earnedIncomeDeduction;

    // 3. 인적공제 (본인 + 부양가족 1인당 150만원)
    const personalDeduction = dep * 1_500_000;

    // 4. 과세표준
    const taxBase = Math.max(0, earnedIncome - personalDeduction - insuranceAnnual);

    // 5. 산출세액
    const calculatedTax = calcProgressiveTax(taxBase);

    // 6. 근로소득 세액공제
    const earnedTaxCredit = calcEarnedIncomeTaxCredit(calculatedTax, totalSalary);

    // 7. 자녀세액공제 (8~20세 자녀)
    let childCredit = 0;
    if (ch === 1) childCredit = 250_000;
    else if (ch === 2) childCredit = 550_000;
    else if (ch >= 3) childCredit = 550_000 + (ch - 2) * 400_000;

    // 8. 결정세액 (연)
    const annualIncomeTax = Math.max(0, calculatedTax - earnedTaxCredit - childCredit);
    const monthlyIncomeTax = annualIncomeTax / 12;
    const monthlyLocalTax = monthlyIncomeTax * 0.10;

    const totalDeductionMonthly = insuranceMonthly + monthlyIncomeTax + monthlyLocalTax;
    const monthlyNet = monthlyGross - totalDeductionMonthly;
    const annualNet = monthlyNet * 12;

    return {
      monthlyGross,
      monthlyNet,
      annualNet,
      nationalPension,
      health,
      longTermCare,
      employment,
      insuranceMonthly,
      monthlyIncomeTax,
      monthlyLocalTax,
      totalDeductionMonthly,
    };
  }, [annualSalary, nonTaxable, dependents, children]);

  return (
    <CalculatorLayout
      title="연봉 실수령액 계산기"
      description="연봉 입력 시 4대보험·근로소득세를 차감한 월 실수령액을 국세청 표준 방식으로 계산합니다 (2026 기준)."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">연봉 (원)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
            {annualSalary && parseFloat(annualSalary) > 0 && (
              <span className="block mt-1 text-xs text-slate-500">{fmt(parseFloat(annualSalary))} 원</span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">월 비과세 (식대 등, 한도 20만원)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={nonTaxable}
              onChange={(e) => setNonTaxable(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">부양가족 (본인 포함)</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">8~20세 자녀 수 (자녀세액공제)</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">월 실수령액</div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-900">
                {fmt(result.monthlyNet)} 원
              </div>
              <div className="text-xs text-indigo-700 mt-2">연 환산: {fmt(result.annualNet)} 원</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">월 세전 급여</span>
                <span className="font-semibold text-slate-900">{fmt(result.monthlyGross)} 원</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">국민연금 (4.5%)</span>
                <span className="text-red-600">- {fmt(result.nationalPension)} 원</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">건강보험 (3.545%)</span>
                <span className="text-red-600">- {fmt(result.health)} 원</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">장기요양 (건강의 12.95%)</span>
                <span className="text-red-600">- {fmt(result.longTermCare)} 원</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">고용보험 (0.9%)</span>
                <span className="text-red-600">- {fmt(result.employment)} 원</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">근로소득세</span>
                <span className="text-red-600">- {fmt(result.monthlyIncomeTax)} 원</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">지방소득세 (10%)</span>
                <span className="text-red-600">- {fmt(result.monthlyLocalTax)} 원</span>
              </div>
              <div className="flex justify-between py-2 mt-1">
                <span className="font-semibold text-slate-700">총 공제</span>
                <span className="font-bold text-red-600">- {fmt(result.totalDeductionMonthly)} 원</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">계산 방식 (국세청 표준)</h2>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>총급여 = 연봉 - 비과세 (식대 월 20만원 등)</li>
          <li>근로소득공제 차감 → 근로소득금액</li>
          <li>인적공제 (본인 + 부양가족 1인당 150만원) + 4대보험료 공제</li>
          <li>과세표준 → 누진세율 (6~45%) → 산출세액</li>
          <li>근로소득 세액공제·자녀 세액공제 차감 → 결정세액</li>
          <li>지방소득세 = 결정세액 × 10%</li>
        </ol>
        <p className="text-xs text-slate-500 mt-3">
          ※ 추정치 — 실제 신용카드·의료비·기부금 등 추가 공제는 연말정산 시 환급. 실수령액은 잡코리아·사람인 결과와 ±5% 오차 가능.
        </p>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 (통계청 2025)</strong>: 근로자 평균 연봉 약 4,200만원 / 중위 연봉 3,500만원 / 신입 평균 3,200만원
        </div>
    </CalculatorLayout>
  );
}
