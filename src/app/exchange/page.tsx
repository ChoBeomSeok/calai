"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const CURRENCIES = ["USD", "EUR", "JPY", "CNY", "GBP", "AUD", "CAD", "CHF", "HKD", "SGD"];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1380, EUR: 1490, JPY: 9.2, CNY: 190, GBP: 1750, AUD: 910, CAD: 1010, CHF: 1560, HKD: 177, SGD: 1030,
};

function fmt(n: number, d = 2): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function ExchangePage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<string>("USD");
  const [rate, setRate] = useState(String(FALLBACK_RATES.USD));
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [manualEdit, setManualEdit] = useState(false);

  // 통화 변경 시 실시간 환율 자동 조회 (서버 사이드 Route Handler 통해 CORS 우회)
  useEffect(() => {
    if (manualEdit || !from) return;
    let cancelled = false;
    const fetchRate = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/exchange?from=${from}`);
        if (!res.ok) throw new Error(`서버 응답 ${res.status}`);
        const data: { rate: number; date: string; source: string } = await res.json();
        if (!data.rate) throw new Error("환율 데이터 없음");
        if (!cancelled) {
          setRate(String(data.rate.toFixed(2)));
          if (data.date === "fallback" || data.source.includes("fallback")) {
            setUpdatedAt("");
            setError("실시간 API 응답 없음 — 기본 환율 사용");
          } else {
            setUpdatedAt(`${data.date} · ${data.source}`);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(`조회 실패: ${(e as Error).message} — 기본 환율 사용`);
          setRate(String(FALLBACK_RATES[from] || 1));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRate();
    return () => {
      cancelled = true;
    };
  }, [from, manualEdit]);

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    if (!a || !r || a < 0 || r <= 0) return null;
    return { krw: a * r, perUnit: r };
  }, [amount, rate]);

  const handleRefresh = () => {
    setManualEdit(false);
    setFrom((prev) => prev); // 트리거
    // useEffect 재실행을 위해 from 임시 토글 대신, manualEdit 리셋
    const current = from;
    setFrom("");
    setTimeout(() => setFrom(current), 10);
  };

  return (
    <CalculatorLayout
      title="환율 변환기 (실시간)"
      description="외화 → 원화 즉시 변환. ECB(유럽중앙은행) 공식 데이터 자동 조회. 환율 수동 수정도 가능."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">금액</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div className="flex gap-1.5 mt-2">
              {[1, 10, 100, 1000].map((v) => (
                <button key={v} onClick={() => setAmount(String(v))} className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition">
                  {v.toLocaleString()}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">통화</span>
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setManualEdit(false);
              }}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block mt-4">
          <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
            1 {from || "?"} = ? 원
            {loading && <span className="text-xs text-indigo-500 animate-pulse">실시간 조회 중...</span>}
            {!loading && updatedAt && !manualEdit && (
              <span className="text-xs text-emerald-600">✓ {updatedAt} 기준</span>
            )}
            {manualEdit && <span className="text-xs text-amber-600">수동 입력</span>}
          </span>
          <div className="flex gap-2 mt-1.5">
            <input
              type="number"
              min="0"
              inputMode="decimal"
              step="0.01"
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
                setManualEdit(true);
              }}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-3 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition disabled:opacity-50"
              title="실시간 환율 다시 조회"
            >
              🔄
            </button>
          </div>
          {error && <span className="block mt-2 text-xs text-amber-600">{error}</span>}
        </label>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">{amount} {from} =</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.krw, 0)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">
                기준: 1 {from} = {fmt(result.perUnit, 2)} KRW
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">환율 데이터 출처</h2>
        <p>
          유럽중앙은행(ECB) Reference Rates를 매일 16시(CET) 발표 후 갱신.
          한국수출입은행 매매기준율과 ±0.5% 오차 가능. 실제 송금·환전 시 은행별 우대율 별도 적용.
        </p>
        <h2 className="font-semibold text-slate-800 text-base mt-4">주요 통화 안내</h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs">
          <li><strong>USD·EUR·JPY·CNY</strong>: 무역·여행 가장 흔한 4대 통화</li>
          <li><strong>JPY</strong>는 1엔 기준 (100엔 환율은 × 100)</li>
          <li><strong>HKD·SGD</strong>: 동남아 여행·송금 빈번</li>
          <li><strong>CHF</strong>: 스위스프랑, 안전자산 통화</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
