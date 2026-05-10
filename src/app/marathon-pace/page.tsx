"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const DISTANCES = [
  { name: "5km", km: 5 },
  { name: "10km", km: 10 },
  { name: "하프 (21.0975km)", km: 21.0975 },
  { name: "풀 (42.195km)", km: 42.195 },
];

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

function fmtTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  return h > 0 ? `${h}시간 ${m}분 ${s}초` : `${m}분 ${s}초`;
}

function fmtPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}'${String(s).padStart(2, "0")}"/km`;
}

export default function MarathonPacePage() {
  const [paceMin, setPaceMin] = useState(5);
  const [paceSec, setPaceSec] = useState(30);

  const result = useMemo(() => {
    const secPerKm = paceMin * 60 + paceSec;
    if (secPerKm <= 0) return null;
    return DISTANCES.map((d) => ({
      name: d.name,
      km: d.km,
      time: secPerKm * d.km,
    }));
  }, [paceMin, paceSec]);

  return (
    <CalculatorLayout title="마라톤 페이스 계산기" description="km당 페이스 → 5km·10km·하프·풀 마라톤 완주 시간 자동 계산.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">목표 페이스 (km당)</div>
        <div className="flex items-end gap-2">
          <label className="block flex-1">
            <span className="text-xs text-slate-500">분</span>
            <input type="number" min="1" max="20" value={paceMin} onChange={(e) => setPaceMin(parseInt(e.target.value) || 0)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-2xl font-bold text-center" />
          </label>
          <div className="text-3xl font-bold pb-2">'</div>
          <label className="block flex-1">
            <span className="text-xs text-slate-500">초</span>
            <input type="number" min="0" max="59" value={paceSec} onChange={(e) => setPaceSec(parseInt(e.target.value) || 0)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-2xl font-bold text-center" />
          </label>
          <div className="text-2xl font-bold pb-2">"/km</div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {[{ m: 4, s: 0 }, { m: 4, s: 30 }, { m: 5, s: 0 }, { m: 5, s: 30 }, { m: 6, s: 0 }, { m: 7, s: 0 }].map((p, i) => (
            <button key={i} onClick={() => { setPaceMin(p.m); setPaceSec(p.s); }} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 transition">{p.m}'{String(p.s).padStart(2, "0")}"</button>
          ))}
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {result.map((r) => (
              <div key={r.name} className="flex justify-between items-center rounded-lg bg-slate-50 dark:bg-slate-700 p-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{r.name}</span>
                <span className="font-bold text-indigo-900 dark:text-indigo-300">{fmtTime(r.time)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 한국 평균: 풀마라톤 일반 러너 4시간 30분 (페이스 6'25"/km). 보스턴 마라톤 자격선 3시간 (4'15"/km).
      </div>
    </CalculatorLayout>
  );
}
