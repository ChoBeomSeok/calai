"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function calcKoreanAge(birth: Date, base: Date) {
  // 만 나이 = 기준일 - 생일. 생일이 안 지났으면 -1.
  let age = base.getFullYear() - birth.getFullYear();
  const baseMonth = base.getMonth();
  const birthMonth = birth.getMonth();
  if (baseMonth < birthMonth || (baseMonth === birthMonth && base.getDate() < birth.getDate())) {
    age--;
  }
  // 한국 연 나이 (지금은 폐지) = 기준연도 - 출생연도
  const yearAge = base.getFullYear() - birth.getFullYear();

  // 다음 생일까지
  const thisYearBirthday = new Date(base.getFullYear(), birthMonth, birth.getDate());
  const nextBirthday =
    thisYearBirthday >= base
      ? thisYearBirthday
      : new Date(base.getFullYear() + 1, birthMonth, birth.getDate());
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { age, yearAge, daysUntilBirthday };
}

export default function AgePage() {
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [baseDate, setBaseDate] = useState(todayISO());

  const result = useMemo(() => {
    const birth = new Date(birthDate);
    const base = new Date(baseDate);
    if (isNaN(birth.getTime()) || isNaN(base.getTime())) return null;
    if (birth > base) return null;
    return calcKoreanAge(birth, base);
  }, [birthDate, baseDate]);

  return (
    <CalculatorLayout
      title="만 나이 계산기"
      description="2023년 6월부터 한국에서도 만 나이가 표준입니다. 생년월일과 기준일을 입력하면 만 나이·연 나이·다음 생일 D-Day까지 즉시 계산합니다."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">생년월일</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">기준일</span>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">만 나이</div>
              <div className="text-5xl font-bold text-indigo-900">{result.age}<span className="text-lg ml-1">세</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">연 나이 (참고)</div>
                <div className="text-xl font-bold text-slate-900">{result.yearAge}세</div>
                <div className="text-xs text-slate-400 mt-0.5">기준연도 - 출생연도</div>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <div className="text-xs text-amber-700 mb-1">다음 생일까지</div>
                <div className="text-xl font-bold text-amber-900">D-{result.daysUntilBirthday}</div>
                <div className="text-xs text-amber-600 mt-0.5">{result.daysUntilBirthday}일 남음</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 text-base">만 나이 vs 한국식 나이 (폐지)</h2>
        <p>
          2023년 6월 28일부터 한국 행정·민사 모든 영역에서 만 나이가 표준이 됐어요.
          기존 \"한국식 나이\" (태어나자마자 1세 + 매년 1월 1일 +1세) 는 더 이상 공식 사용되지 않습니다.
        </p>
        <h2 className="font-semibold text-slate-800 text-base mt-4">만 나이 계산법</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>생일이 지났다면: 기준연도 - 출생연도</li>
          <li>생일이 아직 안 지났다면: 기준연도 - 출생연도 - 1</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
