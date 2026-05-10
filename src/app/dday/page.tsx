"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "diff" | "add";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default function DDayPage() {
  const [mode, setMode] = useState<Mode>("diff");
  // diff mode
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState("2026-12-31");
  // add mode
  const [baseDate, setBaseDate] = useState(todayISO());
  const [days, setDays] = useState("100");

  const diffResult = useMemo(() => {
    if (mode !== "diff") return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const ms = e.getTime() - s.getTime();
    const dayDiff = Math.round(ms / (1000 * 60 * 60 * 24));
    return {
      days: dayDiff,
      absDays: Math.abs(dayDiff),
      isPast: dayDiff < 0,
      weeks: Math.floor(Math.abs(dayDiff) / 7),
      remainDays: Math.abs(dayDiff) % 7,
    };
  }, [mode, startDate, endDate]);

  const addResult = useMemo(() => {
    if (mode !== "add") return null;
    const b = new Date(baseDate);
    const d = parseInt(days);
    if (isNaN(b.getTime()) || isNaN(d)) return null;
    const target = addDays(b, d);
    return { target, days: d };
  }, [mode, baseDate, days]);

  return (
    <CalculatorLayout
      title="D-Day 계산기"
      description="두 날짜 사이 일수 차이 또는 시작일에서 N일 후·전 날짜를 즉시 계산합니다."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { v: "diff", label: "두 날짜 차이" },
            { v: "add", label: "N일 후·전 날짜" },
          ].map((m) => (
            <button
              key={m.v}
              onClick={() => setMode(m.v as Mode)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                mode === m.v
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "diff" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">시작 날짜</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">목표 날짜</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">기준 날짜</span>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">일수 (음수 가능)</span>
              <input
                type="number"
                inputMode="numeric"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                placeholder="100"
              />
            </label>
          </div>
        )}

        {diffResult && mode === "diff" && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">{diffResult.isPast ? "지난 날" : "남은 날"}</div>
              <div className="text-4xl sm:text-5xl font-bold text-indigo-900">
                {diffResult.isPast ? "D+" : "D-"}{diffResult.absDays}
              </div>
              <div className="text-sm text-indigo-700 mt-3">
                {diffResult.absDays}일 = {diffResult.weeks}주 {diffResult.remainDays}일
              </div>
            </div>
          </div>
        )}

        {addResult && mode === "add" && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">
                {addResult.days >= 0 ? `${addResult.days}일 후` : `${Math.abs(addResult.days)}일 전`}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-indigo-900">
                {formatDate(addResult.target)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">자주 쓰는 케이스</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>기념일·시험일 D-Day (목표 날짜까지 며칠 남았는지)</li>
          <li>만난 지·결혼한 지·재직한 지 며칠 (지난 날 계산)</li>
          <li>제출 마감일 + N일 (기준일에서 N일 후 계산)</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
