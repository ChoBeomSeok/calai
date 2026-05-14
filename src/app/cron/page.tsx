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
    const dows = parseField(parts[4], 0, 6);

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
    (async () => {
      const trimmed = expr.trim();
      const partCount = trimmed ? trimmed.split(/\s+/).length : 0;

      if (partCount < 5) {
        await Promise.resolve();
        if (cancelled) return;
        setDescription("");
        setError(partCount === 0 ? "" : "Cron 표현식은 5개 필드가 필요합니다.");
        return;
      }

      try {
        const mod = (await import("cronstrue/i18n")) as unknown as {
          default: { toString: (e: string, o?: object) => string } & {
            default?: { toString: (e: string, o?: object) => string };
          };
        };
        const cron = mod.default?.default ?? mod.default;
        const desc = cron.toString(trimmed, { locale: "ko", use24HourTimeFormat: true });
        if (cancelled) return;
        setDescription(desc);
        setError("");
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "표현식을 해석할 수 없습니다.";
        setError(`해석 실패: ${msg}`);
        setDescription("");
      }
    })();
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
            className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 font-mono text-lg text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
          />
          <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">
            분(0-59) · 시(0-23) · 일(1-31) · 월(1-12) · 요일(0-6, 0=일)
          </span>
        </label>

        {description && (
          <div className="mt-5 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/40 px-5 py-4">
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1.5">한국어 해석</div>
            <div className="text-base sm:text-lg font-semibold text-indigo-950 dark:text-indigo-100 leading-snug">{description}</div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {nextRuns.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">다음 5회 실행 시간</div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
              {nextRuns.map((d, i) => {
                const formatted = new Intl.DateTimeFormat("ko-KR", {
                  timeZone: "Asia/Seoul",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  weekday: "short",
                  hour12: false,
                }).format(d);
                return (
                  <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2.5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-200 tabular-nums">{formatted}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-7 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">자주 쓰는 패턴</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => {
              const active = expr === p.expr;
              return (
                <button
                  key={p.expr}
                  onClick={() => setExpr(p.expr)}
                  className={`text-left rounded-lg border px-3.5 py-2.5 transition ${
                    active
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className={`font-mono text-sm ${active ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>{p.expr}</div>
                  <div className={`text-xs mt-1 ${active ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}>{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">Cron 문법 가이드</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">5개 필드 (왼쪽부터)</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">분(0-59) · 시(0-23) · 일(1-31) · 월(1-12) · 요일(0-6, 0=일)</div>
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">특수 문자</div>
            <ul className="space-y-1">
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">*</code> — 모든 값</li>
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">,</code> — 여러 값 (예: 1,3,5)</li>
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">-</code> — 범위 (예: 1-5)</li>
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">/</code> — 간격 (예: */15 = 15분마다)</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">예시</div>
            <ul className="space-y-1">
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">0 9 * * 1-5</code> — 평일 9시</li>
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">*/15 * * * *</code> — 15분마다</li>
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">0 0 1 * *</code> — 매월 1일 자정</li>
              <li><code className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-xs">0 12 * * 0</code> — 매주 일요일 정오</li>
            </ul>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
