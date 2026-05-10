"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const CITIES = [
  { name: "서울", tz: "Asia/Seoul" },
  { name: "도쿄", tz: "Asia/Tokyo" },
  { name: "베이징", tz: "Asia/Shanghai" },
  { name: "방콕", tz: "Asia/Bangkok" },
  { name: "두바이", tz: "Asia/Dubai" },
  { name: "런던", tz: "Europe/London" },
  { name: "파리", tz: "Europe/Paris" },
  { name: "뉴욕", tz: "America/New_York" },
  { name: "LA", tz: "America/Los_Angeles" },
  { name: "시드니", tz: "Australia/Sydney" },
];

function fmtInTz(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short",
    hour12: false,
  }).format(d);
}

function nowLocalISO(): string {
  // datetime-local input은 UTC가 아니라 로컬 시간을 그대로 받아야 함
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

export default function TimezonePage() {
  const [time, setTime] = useState<string>(nowLocalISO());
  const [autoUpdate, setAutoUpdate] = useState(true);

  // 1초마다 현재 시간 자동 갱신 (자동 모드일 때만)
  useEffect(() => {
    if (!autoUpdate) return;
    const interval = setInterval(() => {
      setTime(nowLocalISO());
    }, 1000);
    return () => clearInterval(interval);
  }, [autoUpdate]);

  const result = useMemo(() => {
    const d = new Date(time);
    if (isNaN(d.getTime())) return null;
    return CITIES.map((c) => ({ name: c.name, time: fmtInTz(d, c.tz) }));
  }, [time]);

  const handleManualChange = (v: string) => {
    setTime(v);
    setAutoUpdate(false);
  };

  const handleResetToNow = () => {
    setAutoUpdate(true);
    setTime(nowLocalISO());
  };

  return (
    <CalculatorLayout
      title="세계 시간 변환기"
      description="현재 한국 시간 기준 도쿄·베이징·방콕·런던·파리·뉴욕·LA·시드니 등 주요 도시 시간을 실시간으로 동시 표시."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
            기준 시간 (한국 시간)
            {autoUpdate ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                실시간 (1초 갱신)
              </span>
            ) : (
              <button
                onClick={handleResetToNow}
                className="text-xs text-indigo-600 hover:text-indigo-700 underline"
              >
                현재 시간으로 ↻
              </button>
            )}
          </span>
          <input
            type="datetime-local"
            step="1"
            value={time}
            onChange={(e) => handleManualChange(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-2">
            {result.map((r) => (
              <div
                key={r.name}
                className={`flex justify-between items-center rounded-lg p-3 ${
                  r.name === "서울" ? "bg-indigo-50" : "bg-slate-50"
                }`}
              >
                <span className="font-semibold text-slate-700">{r.name}</span>
                <span className="font-mono text-sm">{r.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ 기준 시간을 직접 변경하면 실시간 갱신이 멈춥니다. ↻ 버튼으로 현재 시간으로 복귀.</p>
      </div>
    </CalculatorLayout>
  );
}
