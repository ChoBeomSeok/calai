"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Model = {
  name: string;
  vendor: "OpenAI" | "Anthropic" | "Google";
  inputPer1M: number;
  outputPer1M: number;
  note?: string;
};

// 2026년 5월 기준 (각 공식 페이지)
const MODELS: Model[] = [
  // OpenAI
  { name: "GPT-5", vendor: "OpenAI", inputPer1M: 1.25, outputPer1M: 10 },
  { name: "GPT-5 mini", vendor: "OpenAI", inputPer1M: 0.25, outputPer1M: 2 },
  { name: "GPT-5 nano", vendor: "OpenAI", inputPer1M: 0.05, outputPer1M: 0.40 },
  { name: "o3", vendor: "OpenAI", inputPer1M: 2, outputPer1M: 8, note: "추론 특화" },
  { name: "o4-mini", vendor: "OpenAI", inputPer1M: 1.1, outputPer1M: 4.4, note: "추론 특화" },
  { name: "GPT-4o", vendor: "OpenAI", inputPer1M: 2.5, outputPer1M: 10, note: "레거시" },
  // Anthropic
  { name: "Claude Opus 4.7", vendor: "Anthropic", inputPer1M: 15, outputPer1M: 75, note: "1M context" },
  { name: "Claude Sonnet 4.6", vendor: "Anthropic", inputPer1M: 3, outputPer1M: 15 },
  { name: "Claude Haiku 4.5", vendor: "Anthropic", inputPer1M: 1, outputPer1M: 5 },
  // Google
  { name: "Gemini 2.5 Pro", vendor: "Google", inputPer1M: 1.25, outputPer1M: 10, note: "200K↑ $2.5/$15" },
  { name: "Gemini 2.5 Flash", vendor: "Google", inputPer1M: 0.075, outputPer1M: 0.30 },
  { name: "Gemini 2.5 Flash-Lite", vendor: "Google", inputPer1M: 0.025, outputPer1M: 0.10 },
];

const VENDOR_COLOR: Record<Model["vendor"], string> = {
  OpenAI: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Anthropic: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Google: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
};

function fmt(n: number, d = 4): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function AiTokenPage() {
  const [inputTokens, setInputTokens] = useState(10000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [exchangeRate, setExchangeRate] = useState(1380);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string>("");
  const [rateError, setRateError] = useState<string>("");
  const [manualRate, setManualRate] = useState(false);

  // 환율 자동 fetch (USD → KRW)
  useEffect(() => {
    if (manualRate) return;
    let cancelled = false;
    const fetchRate = async () => {
      setRateLoading(true);
      setRateError("");
      try {
        const res = await fetch("/api/exchange?base=USD");
        if (!res.ok) throw new Error(`서버 ${res.status}`);
        const data: { rates: Record<string, number>; date: string; source: string } = await res.json();
        if (!data.rates?.KRW) throw new Error("KRW 환율 없음");
        if (!cancelled) {
          setExchangeRate(data.rates.KRW);
          setRateUpdatedAt(`${data.date} · ${data.source}`);
        }
      } catch (e) {
        if (!cancelled) setRateError(`조회 실패: ${(e as Error).message}`);
      } finally {
        if (!cancelled) setRateLoading(false);
      }
    };
    fetchRate();
    return () => {
      cancelled = true;
    };
  }, [manualRate]);

  const result = useMemo(() => {
    return MODELS.map((m) => {
      const inputCost = (inputTokens / 1_000_000) * m.inputPer1M;
      const outputCost = (outputTokens / 1_000_000) * m.outputPer1M;
      const totalUsd = inputCost + outputCost;
      const totalKrw = totalUsd * exchangeRate;
      return { ...m, totalUsd, totalKrw };
    }).sort((a, b) => a.totalUsd - b.totalUsd);
  }, [inputTokens, outputTokens, exchangeRate]);

  return (
    <CalculatorLayout
      title="AI 토큰 비용 계산기"
      description="OpenAI·Anthropic·Google 최신 모델별 입출력 토큰 비용 즉시 비교 + 실시간 USD/KRW 환율 자동 적용."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">입력 토큰</span>
            <input
              type="number"
              min="0"
              value={inputTokens}
              onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">출력 토큰</span>
            <input
              type="number"
              min="0"
              value={outputTokens}
              onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>USD/KRW 환율</span>
              {rateLoading && <span className="text-xs text-indigo-500 animate-pulse">조회 중...</span>}
              {!rateLoading && !manualRate && rateUpdatedAt && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ 실시간</span>
              )}
              {manualRate && (
                <button onClick={() => setManualRate(false)} className="text-xs text-indigo-600 hover:underline">
                  실시간으로 ↻
                </button>
              )}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={exchangeRate}
              onChange={(e) => {
                setExchangeRate(parseFloat(e.target.value) || 0);
                setManualRate(true);
              }}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
            {!manualRate && rateUpdatedAt && (
              <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">{rateUpdatedAt}</span>
            )}
            {rateError && <span className="block mt-1 text-xs text-amber-600">{rateError}</span>}
          </label>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {[1000, 5000, 10000, 50000, 100000, 500000].map((v) => (
            <button
              key={`in-${v}`}
              onClick={() => setInputTokens(v)}
              className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
            >
              입력 {v.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
          {result.map((r, i) => (
            <div
              key={r.name}
              className={`rounded-xl p-4 flex justify-between items-center ${
                i === 0 ? "bg-emerald-50 dark:bg-emerald-950" : "bg-slate-50 dark:bg-slate-700"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold ${i === 0 ? "text-emerald-900 dark:text-emerald-300" : "text-slate-900 dark:text-slate-100"}`}>
                    {i === 0 && "🏆 "}
                    {r.name}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${VENDOR_COLOR[r.vendor]}`}>{r.vendor}</span>
                  {r.note && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">· {r.note}</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ${r.inputPer1M}/M in · ${r.outputPer1M}/M out
                </div>
              </div>
              <div className="text-right ml-3">
                <div className="font-bold text-sm">${fmt(r.totalUsd, 4)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">≈ {fmt(r.totalKrw, 1)} 원</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>참고</strong>: 모델 가격은 2026년 5월 기준 (각 공식 페이지). 환율은 ECB 실시간 (1시간 캐시). 토큰 수 추정 — 한국어 1자 ≈ 1.5~3토큰, 영어 1단어 ≈ 1.3토큰. Prompt Caching·Batch API 사용 시 50~90% 추가 절감 가능.
      </div>
    </CalculatorLayout>
  );
}
