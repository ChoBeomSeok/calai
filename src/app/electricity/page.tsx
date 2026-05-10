"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

// 한전 주택용 저압 누진제 (2026 기준 추정 — 정책 변동 가능)
function calcEnergyCharge(kwh: number): number {
  let charge = 0;
  if (kwh <= 200) {
    charge = kwh * 120;
  } else if (kwh <= 400) {
    charge = 200 * 120 + (kwh - 200) * 215;
  } else {
    charge = 200 * 120 + 200 * 215 + (kwh - 400) * 320;
  }
  return charge;
}

function calcBaseCharge(kwh: number): number {
  if (kwh <= 200) return 910;
  if (kwh <= 400) return 1600;
  return 7300;
}

export default function ElectricityPage() {
  const [kwh, setKwh] = useState("300");

  const result = useMemo(() => {
    const k = parseFloat(kwh);
    if (!k || k < 0) return null;
    const base = calcBaseCharge(k);
    const energy = calcEnergyCharge(k);
    const subtotal = base + energy;
    const klimate = energy * 0.009; // 기후환경요금 약 9원/kWh의 단순화
    const fuel = energy * 0.005; // 연료비조정
    const beforeVat = subtotal + klimate + fuel;
    const vat = beforeVat * 0.1;
    const fund = beforeVat * 0.037;
    const total = beforeVat + vat + fund;
    return { base, energy, klimate, fuel, vat, fund, total };
  }, [kwh]);

  return (
    <CalculatorLayout title="전기요금 계산기" description="월 사용량 (kWh)로 한전 주택용 누진제 적용 월 전기요금 추정.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">월 사용량 (kWh)</span>
          <input type="number"
              min="0" inputMode="decimal" value={kwh} onChange={(e) => setKwh(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-2xl font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">월 전기요금 (예상)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.total)} 원</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600">기본요금</span><span>{fmt(result.base)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600">전력량요금</span><span>{fmt(result.energy)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600">기후환경요금</span><span>{fmt(result.klimate)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600">연료비조정</span><span>{fmt(result.fuel)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600">부가가치세 (10%)</span><span>{fmt(result.vat)} 원</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-600">전력산업기반기금 (3.7%)</span><span>{fmt(result.fund)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600 leading-relaxed">
        <h2 className="font-semibold text-slate-800 text-base mb-2">주택용 저압 누진제 (3단계)</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>1단계 (~200kWh): 120원/kWh + 기본 910원</li>
          <li>2단계 (~400kWh): 215원/kWh + 기본 1,600원</li>
          <li>3단계 (400kWh+): 320원/kWh + 기본 7,300원</li>
          <li>여름·겨울 누진 완화 정책 별도 적용 가능</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 사용량</strong>: 1인 가구 약 200kWh/월 / 4인 가구 약 350kWh/월 / 에어컨 가동기 (7~8월) +100~200kWh
        </div>
    </CalculatorLayout>
  );
}
