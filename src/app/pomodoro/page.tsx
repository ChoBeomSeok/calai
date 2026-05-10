"use client";

import { useState, useEffect, useRef } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Phase = "work" | "rest";

export default function PomodoroPage() {
  const [workMin, setWorkMin] = useState(25);
  const [restMin, setRestMin] = useState(5);
  const [phase, setPhase] = useState<Phase>("work");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          // 타이머 종료
          if (phase === "work") {
            setPhase("rest");
            setCycles((c) => c + 1);
            try { new Notification("작업 완료! 5분 휴식하세요 ☕"); } catch {}
            return restMin * 60;
          } else {
            setPhase("work");
            try { new Notification("휴식 끝! 25분 집중 시작 🍅"); } catch {}
            return workMin * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, phase, workMin, restMin]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const reset = () => {
    setRunning(false);
    setPhase("work");
    setSeconds(workMin * 60);
    setCycles(0);
  };

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <CalculatorLayout title="포모도로 타이머" description="25분 집중 + 5분 휴식 자동 반복. 집중력·생산성 향상의 표준 기법.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className={`rounded-2xl p-8 text-center transition-colors ${phase === "work" ? "bg-rose-50 dark:bg-rose-950" : "bg-emerald-50 dark:bg-emerald-950"}`}>
          <div className={`text-sm mb-2 ${phase === "work" ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            {phase === "work" ? "🍅 작업 중" : "☕ 휴식 중"}
          </div>
          <div className={`text-7xl sm:text-8xl font-bold tabular-nums ${phase === "work" ? "text-rose-900 dark:text-rose-300" : "text-emerald-900 dark:text-emerald-300"}`}>
            {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </div>
          <div className="text-xs text-slate-500 mt-3">완료 {cycles} 사이클</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button onClick={() => setRunning(!running)} className={`px-4 py-3 rounded-lg font-medium transition ${running ? "bg-amber-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
            {running ? "⏸ 일시정지" : "▶ 시작"}
          </button>
          <button onClick={reset} className="px-4 py-3 rounded-lg font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition">↻ 리셋</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">작업 시간 (분)</span>
            <input type="number" min="1" value={workMin} onChange={(e) => { const v = parseInt(e.target.value) || 25; setWorkMin(v); if (phase === "work" && !running) setSeconds(v * 60); }} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">휴식 시간 (분)</span>
            <input type="number" min="1" value={restMin} onChange={(e) => setRestMin(parseInt(e.target.value) || 5)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />
          </label>
        </div>
      </div>
    </CalculatorLayout>
  );
}
