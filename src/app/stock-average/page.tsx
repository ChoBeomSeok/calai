"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function StockAveragePage() {
  const [price1, setPrice1] = useState("50000");
  const [qty1, setQty1] = useState("100");
  const [price2, setPrice2] = useState("40000");
  const [qty2, setQty2] = useState("100");

  const result = useMemo(() => {
    const p1 = parseFloat(price1);
    const q1 = parseFloat(qty1);
    const p2 = parseFloat(price2);
    const q2 = parseFloat(qty2);
    if (!p1 || !q1 || !p2 || !q2) return null;
    const totalQty = q1 + q2;
    const totalCost = p1 * q1 + p2 * q2;
    const avg = totalCost / totalQty;
    return { avg, totalQty, totalCost, change: ((p2 - p1) / p1) * 100 };
  }, [price1, qty1, price2, qty2]);

  return (
    <CalculatorLayout title="주식 평단가 계산기" description="기존 보유 + 추가 매수로 새 평균 단가 즉시 계산. 물타기·불타기 자동 판별.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-slate-800">① 기존 보유</div>
              <div className="text-xs text-slate-500">이미 매수한 주식 정보</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">기존 평균 단가 (원)</span>
                <input type="number" min="0" value={price1} onChange={(e) => setPrice1(e.target.value)} placeholder="예: 50,000" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <span className="text-xs text-slate-400 block mt-1">증권사 \"평균 매수단가\" 그대로</span>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">기존 보유 수량 (주)</span>
                <input type="number" min="0" value={qty1} onChange={(e) => setQty1(e.target.value)} placeholder="예: 100" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <span className="text-xs text-slate-400 block mt-1">정수 (주식 단위)</span>
              </label>
            </div>
            {parseFloat(price1) > 0 && parseFloat(qty1) > 0 && (
              <div className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                기존 투자금 = {fmt(parseFloat(price1) * parseFloat(qty1))} 원
              </div>
            )}
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-indigo-900">② 추가 매수 (이번 거래)</div>
              <div className="text-xs text-indigo-600">새로 사려는 주식 정보 — 물타기·불타기</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">추가 매수 단가 (원)</span>
                <input type="number" min="0" value={price2} onChange={(e) => setPrice2(e.target.value)} placeholder="예: 40,000" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <span className="text-xs text-slate-400 block mt-1">현재 매수하려는 가격</span>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">추가 매수 수량 (주)</span>
                <input type="number" min="0" value={qty2} onChange={(e) => setQty2(e.target.value)} placeholder="예: 100" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <span className="text-xs text-slate-400 block mt-1">새로 매수할 주식 수</span>
              </label>
            </div>
            {parseFloat(price2) > 0 && parseFloat(qty2) > 0 && (
              <div className="mt-3 text-xs text-indigo-700 bg-white rounded-lg p-2">
                추가 투자금 = {fmt(parseFloat(price2) * parseFloat(qty2))} 원
              </div>
            )}
          </div>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">새 평균 단가</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.avg, 0)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">총 {fmt(result.totalQty)}주 · 투자금 {fmt(result.totalCost)} 원</div>
            </div>
            <div className={`mt-4 rounded-xl p-4 text-sm text-center ${result.change < 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {result.change < 0 ? "📉 물타기" : "📈 불타기"} — 추가 매수가가 기존 대비 {fmt(Math.abs(result.change), 1)}% {result.change < 0 ? "낮음" : "높음"}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-2">
        <h2 className="font-semibold text-slate-800 text-base">물타기 vs 불타기</h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs">
          <li><strong>물타기</strong>: 손실 중에 평균 단가 낮추기 — 회복 빠르지만 추가 손실 위험</li>
          <li><strong>불타기</strong>: 상승 추세에 평균 단가 올리기 — 흐름 따라가지만 고점 매수 위험</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
