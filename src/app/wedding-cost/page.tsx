"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

const ITEMS = [
  { key: "venue", label: "예식·식대 (1회)", avg: 25_000_000 },
  { key: "ring", label: "예물·예단", avg: 5_000_000 },
  { key: "studio", label: "스튜디오·드레스·메이크업", avg: 3_500_000 },
  { key: "honeymoon", label: "신혼여행", avg: 8_000_000 },
  { key: "house", label: "신혼집 셋업 (가전·가구)", avg: 30_000_000 },
  { key: "etc", label: "기타 (예복·청첩장·답례품 등)", avg: 3_000_000 },
];

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function WeddingCostPage() {
  const [costs, setCosts] = useState<Record<string, number>>(
    Object.fromEntries(ITEMS.map((i) => [i.key, i.avg]))
  );

  const total = useMemo(() => Object.values(costs).reduce((a, b) => a + (b || 0), 0), [costs]);

  return (
    <CalculatorLayout title="결혼 비용 계산기" description="예식·예물·신혼여행·신혼집 셋업 등 항목별 한국 평균 기반 결혼 총 비용 시뮬레이션.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="space-y-3">
          {ITEMS.map((it) => (
            <label key={it.key} className="block">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{it.label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">평균 {fmt(it.avg)}원</span>
              </div>
              <input type="number" min="0" value={costs[it.key]} onChange={(e) => setCosts({ ...costs, [it.key]: parseFloat(e.target.value) || 0 })} className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3" />
              <MoneyHint value={String(costs[it.key])} />
            </label>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
            <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">결혼 총 예상 비용</div>
            <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(total)} 원</div>
            <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">한국 평균 약 7,400만원 (2024 결혼정보회사 통계)</div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
