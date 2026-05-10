"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type CarType = "passenger" | "van" | "truck";

function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

// 승용차 cc당 세액
function passengerRatePerCc(cc: number): number {
  if (cc <= 1000) return 80;
  if (cc <= 1600) return 140;
  return 200;
}

// 차령 경감률 (3년차부터 매년 5%씩, 최대 50%)
function ageDiscount(yearsOld: number): number {
  if (yearsOld < 3) return 0;
  return Math.min(0.50, (yearsOld - 2) * 0.05);
}

export default function CarTaxPage() {
  const [cc, setCc] = useState("1998");
  const [yearsOld, setYearsOld] = useState("3");
  const [carType, setCarType] = useState<CarType>("passenger");

  const result = useMemo(() => {
    const c = parseFloat(cc);
    const y = parseFloat(yearsOld);
    if (!c || c <= 0 || isNaN(y) || y < 0) return null;

    let baseTax = 0;
    if (carType === "passenger") {
      baseTax = c * passengerRatePerCc(c);
    } else if (carType === "van") {
      baseTax = 65_000;
    } else {
      baseTax = c <= 1000 ? 6_600 : c <= 2000 ? 9_900 : c <= 3000 ? 19_800 : 39_600;
    }

    const discountRate = ageDiscount(y);
    // 본세에만 차령 경감 적용 → 경감된 본세 × 30% = 지방교육세
    const baseTaxAfterDiscount = baseTax * (1 - discountRate);
    const localEducation = baseTaxAfterDiscount * 0.30;
    const finalTax = baseTaxAfterDiscount + localEducation;
    const discount = baseTax * discountRate;

    return {
      baseTax,
      baseTaxAfterDiscount,
      localEducation,
      discountRate,
      discount,
      finalTax,
      halfYear: finalTax / 2,
    };
  }, [cc, yearsOld, carType]);

  return (
    <CalculatorLayout
      title="자동차세 계산기"
      description="배기량·연식 기준 연간 자동차세를 자동 계산합니다. 차령 경감률 (3년차부터 5%씩, 최대 50%) 자동 적용."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">배기량 (cc)</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="1998"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">차령 (년)</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={yearsOld}
              onChange={(e) => setYearsOld(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="3"
            />
          </label>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">차종</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "passenger", label: "승용차" },
              { v: "van", label: "승합차" },
              { v: "truck", label: "화물차" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setCarType(t.v as CarType)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                  carType === t.v
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">연간 자동차세 (지방교육세 포함)</div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-900">
                {formatKRW(result.finalTax)} 원
              </div>
              <div className="text-xs text-indigo-700 mt-2">
                6월·12월 분납 시 회당 {formatKRW(result.halfYear)} 원
              </div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">자동차세 본세 (정상)</span>
                <span className="font-semibold text-slate-900">{formatKRW(result.baseTax)} 원</span>
              </div>
              {result.discountRate > 0 && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">차령 경감 후 본세</span>
                  <span className="font-semibold text-slate-900">{formatKRW(result.baseTaxAfterDiscount)} 원</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">지방교육세 (경감 후 본세의 30%)</span>
                <span className="font-semibold text-slate-900">{formatKRW(result.localEducation)} 원</span>
              </div>
              {result.discountRate > 0 && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">차령 경감액 ({(result.discountRate * 100).toFixed(0)}%)</span>
                  <span className="text-emerald-600">- {formatKRW(result.discount)} 원</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">자동차세 계산 공식 (승용차)</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>1,000cc 이하: cc × 80원</li>
          <li>1,000 ~ 1,600cc: cc × 140원</li>
          <li>1,600cc 초과: cc × 200원</li>
          <li>+ 지방교육세 (본세의 30%)</li>
        </ul>
        <h2 className="font-semibold text-slate-800 text-base mt-4">차령 경감</h2>
        <p>3년차부터 매년 5%씩 경감, 최대 50% (12년차 이상). 친환경차·전기차는 별도 감면 정책 적용.</p>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 차종별 평균</strong>: 경차 (1,000cc) 약 13만원/년 / 2,000cc 승용차 약 52만원/년 / 3,000cc 약 78만원/년
        </div>
    </CalculatorLayout>
  );
}
