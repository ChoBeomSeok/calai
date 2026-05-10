"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const MODELS = [
  { name: "GPT-4o", inputPer1M: 5, outputPer1M: 15 },
  { name: "GPT-4o mini", inputPer1M: 0.15, outputPer1M: 0.60 },
  { name: "Claude Opus 4", inputPer1M: 15, outputPer1M: 75 },
  { name: "Claude Sonnet 4", inputPer1M: 3, outputPer1M: 15 },
  { name: "Claude Haiku 4.5", inputPer1M: 1, outputPer1M: 5 },
  { name: "Gemini 2.0 Flash", inputPer1M: 0.10, outputPer1M: 0.40 },
  { name: "Gemini 2.5 Pro", inputPer1M: 1.25, outputPer1M: 10 },
];

function fmt(n: number, d = 4): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function AiTokenPage() {
  const [inputTokens, setInputTokens] = useState(10000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [exchangeRate, setExchangeRate] = useState(1380);

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
    <CalculatorLayout title="AI 토큰 비용 계산기" description="OpenAI·Anthropic·Google AI 모델별 입출력 토큰 비용 즉시 비교 (2026 가격 기준).">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">입력 토큰</span><input type="number" min="0" value={inputTokens} onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">출력 토큰</span><input type="number" min="0" value={outputTokens} onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">USD/KRW 환율</span><input type="number" min="0" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" /></label>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
          {result.map((r, i) => (
            <div key={r.name} className={`rounded-xl p-4 flex justify-between items-center ${i === 0 ? "bg-emerald-50 dark:bg-emerald-950" : "bg-slate-50 dark:bg-slate-700"}`}>
              <div>
                <div className={`font-semibold ${i === 0 ? "text-emerald-900 dark:text-emerald-300" : "text-slate-900 dark:text-slate-100"}`}>
                  {i === 0 && "🏆 "}{r.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${r.inputPer1M}/M in · ${r.outputPer1M}/M out</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">${fmt(r.totalUsd, 4)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">≈ {fmt(r.totalKrw, 1)} 원</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ 모델 가격은 2026 기준. 정확한 최신 가격은 각 공식 페이지 확인. 토큰 수 추정: 한국어 1자 ≈ 2~3토큰, 영어 1단어 ≈ 1.3토큰.
      </div>
    </CalculatorLayout>
  );
}
