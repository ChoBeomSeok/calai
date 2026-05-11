"use client";

import { useState, useEffect, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Unit = "seconds" | "milliseconds" | "microseconds" | "nanoseconds";

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

function toKST(d: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

function toUTC(d: Date): string {
  return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

function toISO(d: Date): string {
  return d.toISOString();
}

function toRFC(d: Date): string {
  return d.toUTCString();
}

function toRelative(d: Date, now: Date): string {
  const diff = (d.getTime() - now.getTime()) / 1000;
  const abs = Math.abs(diff);
  const future = diff > 0;
  let result: string;
  if (abs < 60) result = `${Math.round(abs)}초`;
  else if (abs < 3600) result = `${Math.round(abs / 60)}분`;
  else if (abs < 86400) result = `${Math.round(abs / 3600)}시간`;
  else if (abs < 31536000) result = `${Math.round(abs / 86400)}일`;
  else result = `${Math.round(abs / 31536000)}년`;
  return future ? `${result} 후` : `${result} 전`;
}

export default function TimestampPage() {
  const [now, setNow] = useState(new Date());
  const [tsInput, setTsInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<Unit>("seconds");
  const [dateInput, setDateInput] = useState("");
  const [copied, setCopied] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 현재 시간 datetime-local 포맷 (로컬)
    const d = now;
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}:${pad(d.getSeconds())}`;
    if (!dateInput) setDateInput(local);
  }, [now, dateInput]);

  const tsResult = useMemo(() => {
    const v = parseFloat(tsInput);
    if (isNaN(v)) return null;
    let ms: number;
    if (unit === "seconds") ms = v * 1000;
    else if (unit === "milliseconds") ms = v;
    else if (unit === "microseconds") ms = v / 1000;
    else ms = v / 1_000_000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return {
      date: d,
      seconds: Math.floor(ms / 1000),
      milliseconds: Math.floor(ms),
      microseconds: Math.floor(ms * 1000),
      nanoseconds: Math.floor(ms * 1_000_000),
      kst: toKST(d),
      utc: toUTC(d),
      iso: toISO(d),
      rfc: toRFC(d),
      relative: toRelative(d, now),
    };
  }, [tsInput, unit, now]);

  const dateResult = useMemo(() => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    const ms = d.getTime();
    return {
      seconds: Math.floor(ms / 1000),
      milliseconds: ms,
      microseconds: ms * 1000,
      nanoseconds: ms * 1_000_000,
      iso: toISO(d),
    };
  }, [dateInput]);

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <CalculatorLayout
      title="Unix 타임스탬프 변환"
      description="Unix timestamp ↔ 날짜 양방향 변환. 초·밀리초·마이크로초·나노초 + KST·UTC·ISO·RFC 9가지 포맷 동시 표시."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 현재 시간 */}
        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-4 mb-6">
          <div className="text-xs text-indigo-700 dark:text-indigo-400 mb-1">⏱️ 현재 시간</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <button
              onClick={() => copy("now-sec", String(Math.floor(now.getTime() / 1000)))}
              className="text-left hover:underline"
            >
              <div className="text-xs text-indigo-700">초 (sec)</div>
              <div className="font-mono font-bold">{Math.floor(now.getTime() / 1000)}</div>
              {copied === "now-sec" && <span className="text-xs text-emerald-600">✓ 복사됨</span>}
            </button>
            <button
              onClick={() => copy("now-ms", String(now.getTime()))}
              className="text-left hover:underline"
            >
              <div className="text-xs text-indigo-700">밀리초 (ms)</div>
              <div className="font-mono font-bold">{now.getTime()}</div>
              {copied === "now-ms" && <span className="text-xs text-emerald-600">✓ 복사됨</span>}
            </button>
            <div>
              <div className="text-xs text-indigo-700">KST</div>
              <div className="font-mono text-xs">{toKST(now)}</div>
            </div>
            <div>
              <div className="text-xs text-indigo-700">UTC</div>
              <div className="font-mono text-xs">{toUTC(now)}</div>
            </div>
          </div>
        </div>

        {/* Timestamp → Date */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📅 Timestamp → 날짜</div>
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">Unix Timestamp</span>
              <input
                type="text"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-sm"
                placeholder="1700000000"
              />
            </label>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {(["seconds", "milliseconds", "microseconds", "nanoseconds"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`text-xs px-2 py-1.5 rounded ${
                    unit === u
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100"
                  }`}
                >
                  {u === "seconds" ? "초" : u === "milliseconds" ? "ms" : u === "microseconds" ? "μs" : "ns"}
                </button>
              ))}
            </div>
            {tsResult && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
                  <div className="text-xs text-slate-500">한국 시간 (KST, UTC+9)</div>
                  <div className="font-mono font-bold">{tsResult.kst}</div>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
                  <div className="text-xs text-slate-500">UTC</div>
                  <div className="font-mono text-xs">{tsResult.utc}</div>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
                  <div className="text-xs text-slate-500">ISO 8601</div>
                  <div className="font-mono text-xs">{tsResult.iso}</div>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
                  <div className="text-xs text-slate-500">RFC 2822</div>
                  <div className="font-mono text-xs">{tsResult.rfc}</div>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3">
                  <div className="text-xs text-amber-700">상대 시간</div>
                  <div className="font-mono font-bold text-amber-900">{tsResult.relative}</div>
                </div>
              </div>
            )}
          </div>

          {/* Date → Timestamp */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">⏰ 날짜 → Timestamp</div>
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">날짜·시간 선택</span>
              <input
                type="datetime-local"
                step="1"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-sm"
              />
            </label>
            {dateResult && (
              <div className="mt-4 space-y-2 text-sm">
                <button
                  onClick={() => copy("date-sec", String(dateResult.seconds))}
                  className="block w-full text-left rounded-lg bg-slate-50 dark:bg-slate-700 p-3 hover:bg-indigo-50"
                >
                  <div className="text-xs text-slate-500">초 (seconds)</div>
                  <div className="font-mono font-bold">{dateResult.seconds.toLocaleString()}</div>
                  {copied === "date-sec" && <span className="text-xs text-emerald-600">✓ 복사됨</span>}
                </button>
                <button
                  onClick={() => copy("date-ms", String(dateResult.milliseconds))}
                  className="block w-full text-left rounded-lg bg-slate-50 dark:bg-slate-700 p-3 hover:bg-indigo-50"
                >
                  <div className="text-xs text-slate-500">밀리초 (milliseconds)</div>
                  <div className="font-mono font-bold">{dateResult.milliseconds.toLocaleString()}</div>
                  {copied === "date-ms" && <span className="text-xs text-emerald-600">✓ 복사됨</span>}
                </button>
                <button
                  onClick={() => copy("date-us", String(dateResult.microseconds))}
                  className="block w-full text-left rounded-lg bg-slate-50 dark:bg-slate-700 p-3 hover:bg-indigo-50"
                >
                  <div className="text-xs text-slate-500">마이크로초 (μs)</div>
                  <div className="font-mono text-xs">{dateResult.microseconds.toLocaleString()}</div>
                  {copied === "date-us" && <span className="text-xs text-emerald-600">✓ 복사됨</span>}
                </button>
                <button
                  onClick={() => copy("date-ns", String(dateResult.nanoseconds))}
                  className="block w-full text-left rounded-lg bg-slate-50 dark:bg-slate-700 p-3 hover:bg-indigo-50"
                >
                  <div className="text-xs text-slate-500">나노초 (ns)</div>
                  <div className="font-mono text-xs">{dateResult.nanoseconds.toLocaleString()}</div>
                  {copied === "date-ns" && <span className="text-xs text-emerald-600">✓ 복사됨</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>참고</strong>: Unix Timestamp = 1970-01-01 UTC부터 경과한 초·밀리초. JavaScript는 ms 단위 / Java·Go·Python(time())은 sec 단위 / Java Instant는 nanos 지원. 한국 시간(KST)은 UTC + 9시간.
      </div>
    </CalculatorLayout>
  );
}
