"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "wake-to-sleep" | "sleep-to-wake";

function timeStr(d: Date): string {
  return d.toTimeString().slice(0, 5);
}

function addMinutes(d: Date, mins: number): Date {
  return new Date(d.getTime() + mins * 60_000);
}

export default function SleepPage() {
  const [mode, setMode] = useState<Mode>("wake-to-sleep");
  const [time, setTime] = useState("07:00");

  const result = useMemo(() => {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    const cycles = [6, 5, 4, 3]; // 90분 사이클 × N
    const list = cycles.map((c) => {
      const minutes = c * 90 + 15; // +15분 잠들기 시간
      const t = mode === "wake-to-sleep" ? addMinutes(base, -minutes) : addMinutes(base, minutes);
      return { cycles: c, hours: c * 1.5, time: timeStr(t) };
    });
    return list;
  }, [mode, time]);

  return (
    <CalculatorLayout title="수면 시간 계산기" description="기상 시간 ↔ 취침 시간 — 90분 수면 사이클 기반 최적 시간 추천.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ v: "wake-to-sleep", l: "기상 시간 → 취침 시간" }, { v: "sleep-to-wake", l: "취침 시간 → 기상 시간" }].map((m) => (
            <button key={m.v} onClick={() => setMode(m.v as Mode)} className={`px-2 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition ${mode === m.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{m.l}</button>
          ))}
        </div>
        <label className="block"><span className="text-sm font-medium text-slate-700">{mode === "wake-to-sleep" ? "원하는 기상 시간" : "취침 예정 시간"}</span><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-sm font-semibold text-slate-700 mb-3">{mode === "wake-to-sleep" ? "추천 취침 시간" : "추천 기상 시간"}</div>
            <div className="space-y-2">
              {result.map((r, i) => (
                <div key={r.cycles} className={`flex justify-between items-center rounded-xl p-4 ${i === 0 ? "bg-indigo-50" : "bg-slate-50"}`}>
                  <div>
                    <div className={`font-bold ${i === 0 ? "text-indigo-900" : "text-slate-900"} text-2xl`}>{r.time}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.cycles} 사이클 · {r.hours}시간 수면</div>
                  </div>
                  {i === 0 && <div className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">권장</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p>※ 90분 수면 사이클 = NREM + REM 한 주기. 사이클 끝에 깨면 개운하게 일어남. 잠들기까지 약 15분 소요 자동 반영.</p>
      </div>
    </CalculatorLayout>
  );
}
