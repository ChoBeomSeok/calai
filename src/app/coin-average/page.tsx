"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

const COINS = ["BTC", "ETH", "XRP", "SOL", "DOGE", "ADA", "TRX", "AVAX", "MATIC", "DOT"];

function fmt(n: number, d = 4): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function CoinAveragePage() {
  const [coin, setCoin] = useState("BTC");
  const [price1, setPrice1] = useState("60000000");
  const [qty1, setQty1] = useState("0.1");
  const [price2, setPrice2] = useState("50000000");
  const [qty2, setQty2] = useState("0.1");
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/coin?market=KRW-${coin}`).then((r) => r.json()).then((json) => {
      if (!cancelled && json.data?.[0]) {
        setLivePrice(json.data[0].price);
        setUpdatedAt(new Date().toLocaleTimeString("ko-KR"));
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [coin]);

  const result = useMemo(() => {
    const p1 = parseFloat(price1);
    const q1 = parseFloat(qty1);
    const p2 = parseFloat(price2);
    const q2 = parseFloat(qty2);
    if (!p1 || !q1 || !p2 || !q2) return null;
    const totalQty = q1 + q2;
    const totalCost = p1 * q1 + p2 * q2;
    const avg = totalCost / totalQty;
    const livePL = livePrice ? ((livePrice - avg) / avg) * 100 : null;
    return { avg, totalQty, totalCost, livePL };
  }, [price1, qty1, price2, qty2, livePrice]);

  return (
    <CalculatorLayout title="가상화폐 평단가 계산기" description="기존 코인 + 추가 매수로 평균 매수가 + 업비트 실시간 시세로 즉시 손익률 표시.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <span className="text-sm font-medium text-slate-700 block mb-2 flex items-center justify-between">
            <span>코인 선택</span>
            {livePrice && <span className="text-xs text-emerald-600">📈 현재 {fmt(livePrice, 0)} 원 · {updatedAt}</span>}
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {COINS.map((c) => (
              <button key={c} onClick={() => setCoin(c)} className={`px-2 py-2 rounded-lg text-xs font-medium border transition ${coin === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-slate-800">① 기존 보유</div>
              <div className="text-xs text-slate-500">이미 매수해 갖고 있는 코인 정보</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">기존 평균 매수가 (원)</span>
                <input type="number" min="0" value={price1} onChange={(e) => setPrice1(e.target.value)} placeholder="예: 60,000,000" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={price1} />
                <span className="text-xs text-slate-400 block mt-1">거래소 \"평균 매수단가\" 그대로 입력</span>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">기존 보유 수량 ({coin})</span>
                <input type="number" min="0" step="0.00000001" value={qty1} onChange={(e) => setQty1(e.target.value)} placeholder="예: 0.1" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <span className="text-xs text-slate-400 block mt-1">소수점 8자리까지 (예: 0.00012345)</span>
              </label>
            </div>
            {parseFloat(price1) > 0 && parseFloat(qty1) > 0 && (
              <div className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                기존 투자금 = {fmt(parseFloat(price1) * parseFloat(qty1), 0)} 원
              </div>
            )}
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-indigo-900">② 추가 매수 (이번 거래)</div>
              <div className="text-xs text-indigo-600">새로 사려는 코인 정보 — 물타기·불타기</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">추가 매수가 (원)</span>
                <input type="number" min="0" value={price2} onChange={(e) => setPrice2(e.target.value)} placeholder="예: 50,000,000" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={price2} />
                <span className="text-xs text-slate-400 block mt-1">현재 매수하려는 가격</span>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600 block mb-1">추가 매수 수량 ({coin})</span>
                <input type="number" min="0" step="0.00000001" value={qty2} onChange={(e) => setQty2(e.target.value)} placeholder="예: 0.1" className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <span className="text-xs text-slate-400 block mt-1">새로 매수할 코인 개수</span>
              </label>
            </div>
            {parseFloat(price2) > 0 && parseFloat(qty2) > 0 && (
              <div className="mt-3 text-xs text-indigo-700 bg-white rounded-lg p-2">
                추가 투자금 = {fmt(parseFloat(price2) * parseFloat(qty2), 0)} 원
              </div>
            )}
          </div>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">새 평균 매수가</div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-900">{fmt(result.avg, 0)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">총 {fmt(result.totalQty, 8)} {coin} · 투자금 {fmt(result.totalCost, 0)} 원</div>
            </div>
            {result.livePL !== null && (
              <div className={`mt-4 rounded-xl p-4 text-center text-sm ${result.livePL >= 0 ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
                <strong>실시간 평가 손익률</strong>: {result.livePL >= 0 ? "+" : ""}{fmt(result.livePL, 2)}%
                <div className="text-xs mt-1 opacity-75">현재 시세 {fmt(livePrice!, 0)} 원 기준</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">평단가 계산 방법</h2>
        <p className="text-xs leading-relaxed bg-slate-50 rounded-lg p-3">
          새 평균 매수가 = (기존 매수가 × 기존 수량 + 추가 매수가 × 추가 수량) ÷ 총 수량
        </p>
        <h2 className="font-semibold text-slate-800 text-base mt-4">물타기 vs 불타기</h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs">
          <li><strong>물타기</strong>: 기존 매수가보다 낮은 가격에 추가 매수 → 평균 단가 ↓ (손실 회복 빠르게)</li>
          <li><strong>불타기</strong>: 기존 매수가보다 높은 가격에 추가 매수 → 평균 단가 ↑ (상승 추세 추가 진입)</li>
        </ul>
        <h2 className="font-semibold text-slate-800 text-base mt-4">실시간 평가 손익률</h2>
        <p className="text-xs">
          업비트 KRW 마켓 현재 시세 기준 자동 계산. 1분 캐시이며 실거래 시 거래소 가격·수수료 별도 확인 필수.
        </p>
      </div>
    </CalculatorLayout>
  );
}
