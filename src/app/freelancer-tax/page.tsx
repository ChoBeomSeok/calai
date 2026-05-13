"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function FreelancerTaxPage() {
  const [income, setIncome] = useState("3000000");

  const result = useMemo(() => {
    const v = parseFloat(income);
    if (!v || v <= 0) return null;
    const incomeTax = v * 0.03; // 원천 3%
    const localTax = v * 0.003; // 지방 0.3%
    const totalWithholding = incomeTax + localTax;
    const netReceived = v - totalWithholding;
    return { incomeTax, localTax, totalWithholding, netReceived };
  }, [income]);

  return (
    <CalculatorLayout title="프리랜서 3.3% 원천징수" description="프리랜서 수익 → 원천징수 3.3% 차감 후 실수령 + 다음 5월 종합소득세 신고 안내.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">계약 금액 (원)</span>
          <input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          {income && parseFloat(income) > 0 && <span className="block mt-1 text-xs text-slate-500">{fmt(parseFloat(income))} 원</span>}
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">실수령액 (원천 차감)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.netReceived)} 원</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>소득세 (3%)</span><span className="text-rose-600">- {fmt(result.incomeTax)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>지방소득세 (0.3%)</span><span className="text-rose-600">- {fmt(result.localTax)} 원</span></div>
              <div className="flex justify-between py-2 font-semibold"><span>원천징수 합계 (3.3%)</span><span className="text-rose-600">- {fmt(result.totalWithholding)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800 text-base mb-2">참고</h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs">
          <li>프리랜서·강사·인적용역의 표준 원천징수: 3% (소득세) + 0.3% (지방소득세) = 3.3%</li>
          <li>매년 5월 종합소득세 신고 시 정산 (다른 소득 합산 + 공제 적용)</li>
          <li>연간 7,500만원 이상 시 부가가치세 사업자 등록 의무</li>
        </ul>
      </div>
      <div className="mt-3 text-[11px] text-slate-400 text-right">
        2026년 소득세법 기준 · 최종 갱신: 2026-05-13
      </div>
    </CalculatorLayout>
  );
}
