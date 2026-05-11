"use client";

import { useState, useEffect, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const PRESETS = [
  { expr: "* * * * *", desc: "매 분" },
  { expr: "0 * * * *", desc: "매시 정각" },
  { expr: "0 9 * * *", desc: "매일 오전 9시" },
  { expr: "0 9 * * 1", desc: "매주 월요일 오전 9시" },
  { expr: "0 0 1 * *", desc: "매월 1일 자정" },
  { expr: "*/15 * * * *", desc: "15분마다" },
  { expr: "0 9-18 * * 1-5", desc: "평일 9~18시 매시 정각" },
  { expr: "0 0 1 1 *", desc: "매년 1월 1일 자정" },
];

// Cron 다음 실행 시간 계산 (5필드 표준: 분 시 일 월 요일)
function parseField(field: string, min: number, max: number): number[] {
  if (field === "*") return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const result = new Set<number>();
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      const [range, stepStr] = part.split("/");
      const step = parseInt(stepStr);
      let start = min;
      let end = max;
      if (range !== "*") {
        if (range.includes("-")) {
          [start, end] = range.split("-").map((n) => parseInt(n));
        } else {
          start = parseInt(range);
          end = max;
        }
      }
      for (let i = start; i <= end; i += step) result.add(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map((n) => parseInt(n));
      for (let i = a; i <= b; i++) result.add(i);
    } else {
      const n = parseInt(part);
      if (!isNaN(n)) result.add(n);
    }
  }
  return [...result].filter((n) => n >= min && n <= max).sort((a, b) => a - b);
}

function getNextRuns(expr: string, count = 5): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  try {
    const minutes = parseField(parts[0], 0, 59);
    const hours = parseField(parts[1], 0, 23);
    const days = parseField(parts[2], 1, 31);
    const months = parseField(parts[3], 1, 12);
    const dows = parseField(parts[4], 0, 6); // 0=일, 6=토

    const results: Date[] = [];
    const now = new Date();
    const current = new Date(now);
    current.setSeconds(0, 0);
    current.setMinutes(current.getMinutes() + 1);

    let iter = 0;
    const maxIter = 100000;
    while (results.length < count && iter < maxIter) {
      const m = current.getMinutes();
      const h = current.getHours();
      const d = current.getDate();
      const mo = current.getMonth() + 1;
      const dow = current.getDay();

      if (
        minutes.includes(m) &&
        hours.includes(h) &&
        days.includes(d) &&
        months.includes(mo) &&
        dows.includes(dow)
      ) {
        results.push(new Date(current));
      }
      current.setMinutes(current.getMinutes() + 1);
      iter++;
    }
    return results;
  } catch {
    return [];
  }
}

export default function CronPage() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const interpret = async () => {
      try {
        const cronstrue = (await import("cronstrue/i18n")).default;
        const desc = cronstrue.toString(expr, { locale: "ko", use24HourTimeFormat: true });
        if (!cancelled) {
          setDescription(desc);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setError(`해석 실패: ${(e as Error).message}`);
          setDescription("");
        }
      }
    };
    interpret();
    return () => {
      cancelled = true;
    };
  }, [expr]);

  const nextRuns = useMemo(() => getNextRuns(expr, 5), [expr]);

  return (
    <CalculatorLayout
      title="Cron 표현식 해석기"
      description="Cron 표현식(예: 0 9 * * 1-5)을 한국어로 해석하고 다음 5회 실행 시간을 미리보기. 5필드 표준 (분 시 일 월 요일) 지원."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cron 표현식</span>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            spellCheck={false}
            placeholder="0 9 * * 1-5"
            className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-lg"
          />
          <span className="block mt-1 text-xs text-slate-500">분(0-59) 시(0-23) 일(1-31) 월(1-12) 요일(0-6, 0=일)</span>
        </label>

        {description && (
          <div className="mt-5 rounded-xl bg-indigo-50 dark:bg-indigo-950 p-4">
            <div className="text-xs text-indigo-700 dark:text-indigo-400 mb-1">📖 한국어 해석</div>
            <div className="text-lg font-bold text-indigo-900 dark:text-indigo-300">{description}</div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}

        {nextRuns.length > 0 && (
          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">📅 다음 5회 실행 시간</div>
            <div className="space-y-1.5">
              {nextRuns.map((d, i) => (
                <div key={i} className="flex justify-between items-center rounded-lg bg-slate-50 dark:bg-slate-700 px-4 py-2.5 text-sm">
                  <span className="font-bold text-indigo-600">#{i + 1}</span>
                  <span className="font-mono">
                    {new Intl.DateTimeFormat("ko-KR", {
                      timeZone: "Asia/Seoul",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      weekday: "short",
                      hour12: false,
                    }).format(d)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">⚡ 자주 쓰는 패턴</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.expr}
                onClick={() => setExpr(p.expr)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                  expr === p.expr
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-indigo-400"
                }`}
              >
                <div className="font-mono text-xs">{p.expr}</div>
                <div className={`text-xs mt-0.5 ${expr === p.expr ? "text-indigo-100" : "text-slate-500"}`}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-2">📌 Cron 문법 가이드</h2>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-4 space-y-2 text-xs">
          <div>
            <strong>5개 필드 (왼쪽부터)</strong>: 분(0-59) 시(0-23) 일(1-31) 월(1-12) 요일(0-6, 0=일)
          </div>
          <div>
            <strong>특수 문자</strong>:
            <ul className="list-disc list-inside mt-1 ml-2">
              <li><code>*</code> — 모든 값</li>
              <li><code>,</code> — 여러 값 (예: 1,3,5)</li>
              <li><code>-</code> — 범위 (예: 1-5)</li>
              <li><code>/</code> — 간격 (예: */15 = 15마다)</li>
            </ul>
          </div>
          <div>
            <strong>예시</strong>:
            <ul className="list-disc list-inside mt-1 ml-2">
              <li><code>0 9 * * 1-5</code> — 평일 9시</li>
              <li><code>*/15 * * * *</code> — 15분마다</li>
              <li><code>0 0 1 * *</code> — 매월 1일 자정</li>
              <li><code>0 12 * * 0</code> — 매주 일요일 정오</li>
            </ul>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
