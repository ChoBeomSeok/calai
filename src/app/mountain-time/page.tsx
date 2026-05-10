"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function fmtTime(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

export default function MountainTimePage() {
  const [distance, setDistance] = useState("8");
  const [ascent, setAscent] = useState("800");

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const a = parseFloat(ascent);
    if (!d || !a) return null;
    // Naismith 규칙: 5km/h + 600m 상승 시 1시간 추가
    const naismithMin = (d / 5) * 60 + (a / 600) * 60;
    // 휴식 포함 (Naismith의 1.3배 권장)
    const withRest = naismithMin * 1.3;
    return { naismith: naismithMin, withRest };
  }, [distance, ascent]);

  return (
    <CalculatorLayout title="등산 시간 계산기" description="거리·상승 고도로 예상 등산 소요 시간 (Naismith 규칙). 휴식 포함 추정도 제공.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">거리 (km)</span><input type="number" step="0.1" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">상승 고도 (m)</span><input type="number" min="0" value={ascent} onChange={(e) => setAscent(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">순수 시간 (Naismith)</div>
              <div className="text-2xl font-bold">{fmtTime(result.naismith)}</div>
            </div>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-4 text-center">
              <div className="text-xs text-indigo-700 dark:text-indigo-400 mb-1">휴식 포함 (실제)</div>
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{fmtTime(result.withRest)}</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 Naismith 규칙: 평지 5km/h + 600m 상승당 1시간 추가. 한국 산은 가파른 편이라 휴식 포함 (×1.3) 추정 권장.
      </div>
    </CalculatorLayout>
  );
}
