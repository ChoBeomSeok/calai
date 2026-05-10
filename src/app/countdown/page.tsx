"use client";

import { useState, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function CountdownPage() {
  const [target, setTarget] = useState(60);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          try { new Notification("⏰ 카운트다운 종료!"); } catch {}
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <CalculatorLayout title="카운트다운 타이머" description="원하는 시간 설정 → 0초까지 카운트다운 + 알림. 시험·요리·운동 등 일상 다용도.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950 p-8 text-center">
          <div className="text-7xl sm:text-8xl font-bold text-indigo-900 dark:text-indigo-300 tabular-nums">
            {h > 0 && `${String(h).padStart(2, "0")}:`}
            {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button onClick={() => setRunning(!running)} className={`px-4 py-3 rounded-lg font-medium transition ${running ? "bg-amber-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
            {running ? "⏸ 일시정지" : "▶ 시작"}
          </button>
          <button onClick={() => { setRunning(false); setSeconds(target); }} className="px-4 py-3 rounded-lg font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition">↻ 리셋</button>
        </div>
        <div className="mt-4">
          <label className="block">
            <span className="text-sm text-slate-600 dark:text-slate-400">목표 시간 (초)</span>
            <input type="number" min="1" value={target} onChange={(e) => { const v = parseInt(e.target.value) || 60; setTarget(v); if (!running) setSeconds(v); }} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />
          </label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[30, 60, 180, 300, 600, 900, 1800, 3600].map((v) => (
              <button key={v} onClick={() => { setTarget(v); if (!running) setSeconds(v); }} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 transition">
                {v < 60 ? `${v}초` : v < 3600 ? `${v / 60}분` : `${v / 3600}시간`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
