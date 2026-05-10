"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const COINS = ["BTC", "ETH", "XRP", "SOL", "DOGE", "ADA", "TRX", "AVAX", "MATIC", "DOT"];

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function CoinPLPage() {
  const [coin, setCoin] = useState("BTC");
  const [buyPrice, setBuyPrice] = useState("60000000");
  const [sellPrice, setSellPrice] = useState("70000000");
  const [qty, setQty] = useState("0.1");
  const [feeRate, setFeeRate] = useState("0.05");
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  // 코인 변경 시 현재 시세 자동 조회
  useEffect(() => {
    let cancelled = false;
    const fetchPrice = async () => {
      setLiveLoading(true);
      try {
        const res = await fetch(`/api/coin?market=KRW-${coin}`);
        const json = await res.json();
        if (!cancelled && json.data?.[0]) {
          setLivePrice(json.data[0].price);
          setUpdatedAt(new Date().toLocaleTimeString("ko-KR"));
        }
      } catch {
        // 무시
      } finally {
        if (!cancelled) setLiveLoading(false);
      }
    };
    fetchPrice();
    return () => { cancelled = true; };
  }, [coin]);

  const result = useMemo(() => {
    const b = parseFloat(buyPrice);
    const s = parseFloat(sellPrice);
    const q = parseFloat(qty);
    const f = parseFloat(feeRate) / 100 || 0;
    if (!b || !s || !q) return null;
    const buyTotal = b * q;
    const sellTotal = s * q;
    const buyFee = buyTotal * f;
    const sellFee = sellTotal * f;
    const profit = sellTotal - buyTotal - buyFee - sellFee;
    const profitPct = (profit / buyTotal) * 100;
    return { buyTotal, sellTotal, buyFee, sellFee, profit, profitPct };
  }, [buyPrice, sellPrice, qty, feeRate]);

  const useLivePrice = () => {
    if (livePrice) setSellPrice(String(livePrice));
  };

  return (
    <CalculatorLayout title="코인 손익 계산기" description="매수가·매도가·수량·수수료로 실현 손익률 계산. 업비트 실시간 시세 자동 조회 (1분 캐시).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <span className="text-sm font-medium text-slate-700 block mb-2 flex items-center justify-between">
            <span>코인 선택</span>
            {liveLoading && <span className="text-xs text-indigo-500 animate-pulse">시세 조회 중...</span>}
            {livePrice && !liveLoading && (
              <span className="text-xs text-emerald-600">📈 현재 {fmt(livePrice)} 원 · {updatedAt}</span>
            )}
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {COINS.map((c) => (
              <button key={c} onClick={() => setCoin(c)} className={`px-2 py-2 rounded-lg text-xs font-medium border transition ${coin === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700">매수가 (원)</span><input type="number" min="0" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 flex items-center justify-between">
              <span>매도가 (원)</span>
              {livePrice && <button onClick={useLivePrice} className="text-xs text-indigo-600 hover:text-indigo-700 underline">현재 시세 사용</button>}
            </span>
            <input type="number" min="0" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
          <label className="block"><span className="text-sm font-medium text-slate-700">수량</span><input type="number" min="0" step="0.00000001" value={qty} onChange={(e) => setQty(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">거래 수수료 (%)</span><input type="number" min="0" step="0.001" value={feeRate} onChange={(e) => setFeeRate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className={`rounded-xl p-5 text-center ${result.profit >= 0 ? "bg-emerald-50" : "bg-rose-50"}`}>
              <div className={`text-sm mb-1 ${result.profit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>실현 손익 (수수료 차감)</div>
              <div className={`text-4xl font-bold ${result.profit >= 0 ? "text-emerald-900" : "text-rose-900"}`}>{result.profit >= 0 ? "+" : ""}{fmt(result.profit)} 원</div>
              <div className={`text-sm mt-2 ${result.profit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>수익률 {result.profit >= 0 ? "+" : ""}{fmt(result.profitPct, 2)}%</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>매수 총액</span><span>{fmt(result.buyTotal)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>매도 총액</span><span>{fmt(result.sellTotal)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>매수 수수료</span><span className="text-rose-600">- {fmt(result.buyFee)} 원</span></div>
              <div className="flex justify-between py-2"><span>매도 수수료</span><span className="text-rose-600">- {fmt(result.sellFee)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ 시세는 업비트 KRW 마켓 실시간 (1분 캐시). 거래소별 가격 ±0.5% 차이.</p>
      </div>
    </CalculatorLayout>
  );
}
