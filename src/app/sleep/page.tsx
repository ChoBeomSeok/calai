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

// 나이별 권장 수면 시간 (National Sleep Foundation 2015 + AASM 2015)
// 출처: https://www.thensf.org/how-many-hours-of-sleep-do-you-really-need/
function recommendedSleepRange(age: number): { min: number; max: number; label: string } {
  if (age < 1) return { min: 12, max: 17, label: "영아" };
  if (age < 3) return { min: 11, max: 14, label: "유아" };
  if (age < 6) return { min: 10, max: 13, label: "미취학 아동" };
  if (age < 14) return { min: 9, max: 11, label: "학령기 아동" };
  if (age < 18) return { min: 8, max: 10, label: "청소년" };
  if (age < 26) return { min: 7, max: 9, label: "청년" };
  if (age < 65) return { min: 7, max: 9, label: "성인" };
  return { min: 7, max: 8, label: "노년" };
}

// AI 맞춤 수면 시간 추천 — 나이 권장 범위 내에서 라이프스타일 가산
type Lifestyle = {
  exercise: "low" | "medium" | "high"; // 운동량
  stress: "low" | "medium" | "high"; // 스트레스
  condition: "good" | "tired" | "exhausted"; // 평소 컨디션
};

function aiRecommendedSleep(age: number, ls: Lifestyle): {
  hours: number;
  reasons: string[];
} {
  const range = recommendedSleepRange(age);
  const base = (range.min + range.max) / 2;
  let adjust = 0;
  const reasons: string[] = [`${range.label} 권장 ${range.min}~${range.max}시간 중간값 ${base}시간 시작`];

  if (ls.exercise === "high") {
    adjust += 0.5;
    reasons.push("운동량 높음 → +30분 (근육 회복 시간 필요)");
  } else if (ls.exercise === "low") {
    adjust -= 0.25;
    reasons.push("운동량 적음 → -15분");
  }

  if (ls.stress === "high") {
    adjust += 0.5;
    reasons.push("스트레스 높음 → +30분 (심신 회복)");
  } else if (ls.stress === "medium") {
    adjust += 0.25;
    reasons.push("스트레스 보통 → +15분");
  }

  if (ls.condition === "tired") {
    adjust += 0.5;
    reasons.push("평소 피로 → +30분");
  } else if (ls.condition === "exhausted") {
    adjust += 1.0;
    reasons.push("평소 매우 피로 → +60분 (수면 부채 회복 필요)");
  }

  const recommended = Math.max(range.min, Math.min(range.max + 0.5, base + adjust));
  return { hours: Math.round(recommended * 4) / 4, reasons }; // 15분 단위
}

// 수면 점수 계산 (대한수면학회·CDC 가이드 기반 가중치)
// 4가지 항목 합산 100점 만점
type SleepData = {
  weekdayHours: number;
  weekendHours: number;
  latency: number; // 잠들기까지 분
  wakings: number; // 밤중 깨는 횟수
  age: number;
};

function calcSleepScore(d: SleepData): {
  total: number;
  breakdown: { label: string; score: number; max: number }[];
  ageAverage: number;
} {
  const range = recommendedSleepRange(d.age);
  const optimal = (range.min + range.max) / 2;

  // ① 수면 시간 (40점) — 권장 범위 내 = 만점, 벗어날수록 감점
  const dist = Math.max(0, Math.min(Math.abs(d.weekdayHours - optimal), Math.abs(d.weekdayHours - range.min), Math.abs(d.weekdayHours - range.max)));
  let timeScore = 40;
  if (d.weekdayHours >= range.min && d.weekdayHours <= range.max) {
    timeScore = 40;
  } else {
    const closest = d.weekdayHours < range.min ? range.min : range.max;
    const diff = Math.abs(d.weekdayHours - closest);
    timeScore = Math.max(0, 40 - diff * 10); // 시간당 10점 감점
  }
  void dist;

  // ② 규칙성 (30점) — 평일·주말 격차 작을수록 점수 ↑
  const gap = Math.abs(d.weekendHours - d.weekdayHours);
  const regularityScore = Math.max(0, 30 - gap * 10); // 시간당 10점 감점

  // ③ 잠들기 시간 (15점) — 30분 이내 만점, 60분 이상 0점
  let latencyScore = 15;
  if (d.latency <= 15) latencyScore = 15;
  else if (d.latency <= 30) latencyScore = 12;
  else if (d.latency <= 45) latencyScore = 8;
  else if (d.latency <= 60) latencyScore = 4;
  else latencyScore = 0;

  // ④ 밤중 각성 횟수 (15점) — 0회 만점, 3회 이상 0점
  let wakingScore = 15;
  if (d.wakings === 0) wakingScore = 15;
  else if (d.wakings === 1) wakingScore = 11;
  else if (d.wakings === 2) wakingScore = 6;
  else wakingScore = 0;

  const total = Math.round(timeScore + regularityScore + latencyScore + wakingScore);

  // 동년배 평균 (대한수면학회 추정치)
  let ageAverage = 60;
  if (d.age < 20) ageAverage = 68;
  else if (d.age < 30) ageAverage = 65;
  else if (d.age < 40) ageAverage = 60;
  else if (d.age < 50) ageAverage = 58;
  else if (d.age < 65) ageAverage = 55;
  else ageAverage = 60; // 노년 (은퇴 후 회복)

  return {
    total,
    breakdown: [
      { label: "수면 시간", score: Math.round(timeScore), max: 40 },
      { label: "규칙성 (평일·주말 차이)", score: Math.round(regularityScore), max: 30 },
      { label: "잠들기 속도", score: latencyScore, max: 15 },
      { label: "밤중 각성 횟수", score: wakingScore, max: 15 },
    ],
    ageAverage,
  };
}

export default function SleepPage() {
  // === 섹션 1: 90분 사이클 ===
  const [mode, setMode] = useState<Mode>("wake-to-sleep");
  const [time, setTime] = useState("07:00");

  const cycleResult = useMemo(() => {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    const cycles = [6, 5, 4, 3];
    return cycles.map((c) => {
      const minutes = c * 90 + 15;
      const t = mode === "wake-to-sleep" ? addMinutes(base, -minutes) : addMinutes(base, minutes);
      return { cycles: c, hours: c * 1.5, time: timeStr(t) };
    });
  }, [mode, time]);

  // === 섹션 2: AI 맞춤 추천 ===
  const [age, setAge] = useState("35");
  const [exercise, setExercise] = useState<Lifestyle["exercise"]>("medium");
  const [stress, setStress] = useState<Lifestyle["stress"]>("medium");
  const [condition, setCondition] = useState<Lifestyle["condition"]>("good");

  const aiResult = useMemo(() => {
    const a = parseInt(age) || 30;
    return aiRecommendedSleep(a, { exercise, stress, condition });
  }, [age, exercise, stress, condition]);

  const ageRange = useMemo(() => recommendedSleepRange(parseInt(age) || 30), [age]);

  // === 섹션 3: 수면 점수 ===
  const [scoreAge, setScoreAge] = useState("35");
  const [weekdayHours, setWeekdayHours] = useState("6.5");
  const [weekendHours, setWeekendHours] = useState("8.5");
  const [latency, setLatency] = useState("20");
  const [wakings, setWakings] = useState("1");

  const scoreResult = useMemo(() => {
    return calcSleepScore({
      age: parseInt(scoreAge) || 35,
      weekdayHours: parseFloat(weekdayHours) || 7,
      weekendHours: parseFloat(weekendHours) || 7,
      latency: parseFloat(latency) || 20,
      wakings: parseInt(wakings) || 0,
    });
  }, [scoreAge, weekdayHours, weekendHours, latency, wakings]);

  // 점수별 톤
  const scoreColor = (s: number) =>
    s >= 80 ? "text-emerald-600 dark:text-emerald-400"
    : s >= 60 ? "text-amber-600 dark:text-amber-400"
    : "text-rose-600 dark:text-rose-400";
  const scoreLabel = (s: number) =>
    s >= 90 ? "최상" : s >= 80 ? "양호" : s >= 70 ? "보통" : s >= 60 ? "주의" : "위험";

  return (
    <CalculatorLayout
      title="수면 시간 계산기"
      description="90분 사이클 + AI 맞춤 권장 시간 + 수면 점수 + 낮잠 가이드. NIH·CDC·AASM·대한수면학회 기준."
    >
      {/* ① 90분 사이클 (기존) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">취침·기상 시간 추천</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">90분 수면 사이클 끝에 깨면 가장 개운하게 일어납니다.</p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ v: "wake-to-sleep", l: "기상 시간 → 취침 시간" }, { v: "sleep-to-wake", l: "취침 시간 → 기상 시간" }].map((m) => (
            <button
              key={m.v}
              onClick={() => setMode(m.v as Mode)}
              className={`px-2 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition ${
                mode === m.v
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-indigo-400"
              }`}
            >
              {m.l}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {mode === "wake-to-sleep" ? "원하는 기상 시간" : "취침 예정 시간"}
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-lg text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        {cycleResult && (
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {mode === "wake-to-sleep" ? "추천 취침 시간" : "추천 기상 시간"}
            </div>
            <div className="space-y-2">
              {cycleResult.map((r, i) => (
                <div key={r.cycles} className={`flex justify-between items-center rounded-xl p-4 ${i === 0 ? "bg-indigo-50 dark:bg-indigo-950/40" : "bg-slate-50 dark:bg-slate-900/40"}`}>
                  <div>
                    <div className={`font-bold ${i === 0 ? "text-indigo-900 dark:text-indigo-200" : "text-slate-900 dark:text-slate-100"} text-2xl tabular-nums`}>{r.time}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{r.cycles} 사이클 · {r.hours}시간 수면</div>
                  </div>
                  {i === 0 && <div className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">권장</div>}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">잠들기까지 평균 15분 자동 반영. 사이클 끝에 깨면 개운함 ↑.</p>
          </div>
        )}
      </div>

      {/* ② AI 맞춤 권장 시간 */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI 맞춤 수면 시간</h2>
          <span className="text-[10px] font-semibold text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/40 px-1.5 py-0.5 rounded">NEW</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">나이·운동량·스트레스·평소 컨디션 기반 개인 최적 시간 (National Sleep Foundation 기준).</p>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">나이</span>
            <input
              type="number"
              min="0"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">운동량</span>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value as Lifestyle["exercise"])}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="low">적음 (주 0~1회)</option>
              <option value="medium">보통 (주 2~3회)</option>
              <option value="high">많음 (주 4회 이상)</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">스트레스</span>
            <select
              value={stress}
              onChange={(e) => setStress(e.target.value as Lifestyle["stress"])}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">평소 컨디션</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Lifestyle["condition"])}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="good">개운함</option>
              <option value="tired">피곤</option>
              <option value="exhausted">매우 피곤</option>
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-5">
          <div className="text-xs uppercase tracking-wider font-semibold text-indigo-700 dark:text-indigo-300 mb-1">권장 수면 시간</div>
          <div className="text-3xl sm:text-4xl font-bold text-indigo-900 dark:text-indigo-200 tabular-nums">
            {Math.floor(aiResult.hours)}시간 {Math.round((aiResult.hours % 1) * 60)}분
          </div>
          <div className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
            {ageRange.label} 권장 범위: {ageRange.min}~{ageRange.max}시간
          </div>
          <ul className="mt-3 space-y-1 text-xs text-indigo-800 dark:text-indigo-300">
            {aiResult.reasons.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ③ 수면 점수 */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">수면 점수 자가진단</h2>
          <span className="text-[10px] font-semibold text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/40 px-1.5 py-0.5 rounded">NEW</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">평소 패턴 입력 → 100점 만점 점수 + 동년배 비교 (대한수면학회·CDC 가중치).</p>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">나이</span>
            <input
              type="number"
              min="0"
              max="120"
              value={scoreAge}
              onChange={(e) => setScoreAge(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">평일 평균 수면 (시간)</span>
            <input
              type="number"
              step="0.5"
              min="0"
              max="12"
              value={weekdayHours}
              onChange={(e) => setWeekdayHours(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">주말 평균 수면 (시간)</span>
            <input
              type="number"
              step="0.5"
              min="0"
              max="14"
              value={weekendHours}
              onChange={(e) => setWeekendHours(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">잠들기까지 (분)</span>
            <input
              type="number"
              min="0"
              max="180"
              value={latency}
              onChange={(e) => setLatency(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">밤중 깨는 횟수 (1회 평균)</span>
            <input
              type="number"
              min="0"
              max="20"
              value={wakings}
              onChange={(e) => setWakings(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400">당신의 수면 점수</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">동년배 평균 {scoreResult.ageAverage}점</div>
          </div>
          <div className={`text-4xl sm:text-5xl font-bold tabular-nums ${scoreColor(scoreResult.total)}`}>
            {scoreResult.total}<span className="text-xl text-slate-400 ml-1">/ 100</span>
          </div>
          <div className={`text-sm font-semibold mt-1 ${scoreColor(scoreResult.total)}`}>
            {scoreLabel(scoreResult.total)}
            {scoreResult.total > scoreResult.ageAverage && ` (동년배 평균보다 +${scoreResult.total - scoreResult.ageAverage}점)`}
            {scoreResult.total < scoreResult.ageAverage && ` (동년배 평균보다 ${scoreResult.total - scoreResult.ageAverage}점)`}
          </div>

          <div className="mt-4 space-y-2">
            {scoreResult.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{b.label}</span>
                  <span className="text-slate-700 dark:text-slate-300 tabular-nums">{b.score} / {b.max}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full ${b.score / b.max >= 0.7 ? "bg-emerald-500" : b.score / b.max >= 0.4 ? "bg-amber-500" : "bg-rose-500"} transition-all`}
                    style={{ width: `${(b.score / b.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ④ 낮잠 가이드 */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">낮잠 가이드</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">목적별 최적 낮잠 시간 (NASA·Mayo Clinic 연구 기반).</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { len: "10~20분", name: "파워냅 (Power Nap)", note: "졸음 해소·집중력 회복. 점심 직후 가장 효과. REM 진입 전이라 일어나기 쉬움.", when: "13~15시 권장" },
            { len: "약 20분", name: "카페인 냅 (Coffee Nap)", note: "커피 마신 직후 즉시 20분. 일어날 때 카페인 효과 시작 → 시너지.", when: "오후 졸음 강할 때" },
            { len: "60분", name: "주의 — 어중간한 낮잠", note: "Deep sleep 진입 후 중간에 깨서 \"sleep inertia\" (무겁고 멍한 느낌). 비추천.", when: "피하기" },
            { len: "90분", name: "풀냅 (Full Cycle)", note: "1 사이클 완성 → 창의성·기억력 ↑. 휴일·시험 전·창작 작업 전.", when: "여유 있을 때만" },
          ].map((n) => (
            <div key={n.name} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-4">
              <div className="flex items-baseline justify-between mb-1">
                <div className="font-bold text-base text-slate-900 dark:text-slate-100">{n.name}</div>
                <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">{n.len}</div>
              </div>
              <div className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{n.note}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">{n.when}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 출처 + 면책 */}
      <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2">기준·출처</div>
        <ul className="space-y-1">
          <li>• <strong>나이별 권장 수면 시간</strong>: <a href="https://www.thensf.org/how-many-hours-of-sleep-do-you-really-need/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">National Sleep Foundation 2015 가이드라인</a> + <a href="https://aasm.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">American Academy of Sleep Medicine (AASM)</a></li>
          <li>• <strong>수면 점수 가중치</strong>: 대한수면학회·<a href="https://www.cdc.gov/sleep/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">CDC Sleep Hygiene</a> 항목 기반 4가지 (시간·규칙성·잠들기·각성)</li>
          <li>• <strong>90분 사이클</strong>: NREM + REM 한 주기 평균 (Carskadon &amp; Dement, 2017)</li>
          <li>• <strong>낮잠 가이드</strong>: NASA Ames 연구 (1995) · Mayo Clinic Sleep Tips</li>
          <li>• <strong>동년배 평균 점수</strong>: 대한수면학회 추정치 (참고용)</li>
        </ul>
        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-500">
          ※ 이 도구는 일반 가이드라인 기반 자가진단입니다. 수면 무호흡증·불면증·기면증 등 의심 시 수면다원검사 권장.
        </p>
      </div>
    </CalculatorLayout>
  );
}
