"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AnnualLeavePage() {
  const [startDate, setStartDate] = useState("2024-03-01");
  const [baseDate, setBaseDate] = useState(todayISO());
  const [smallBusiness, setSmallBusiness] = useState(false);
  const [attendanceRate, setAttendanceRate] = useState("80"); // 출근율 (%)
  const [used1Y, setUsed1Y] = useState("0"); // 1년 미만 기간에 사용한 월차

  const result = useMemo(() => {
    const start = new Date(startDate);
    const base = new Date(baseDate);
    if (isNaN(start.getTime()) || isNaN(base.getTime()) || start > base) return null;

    const months = (base.getFullYear() - start.getFullYear()) * 12 + (base.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const attendance = parseFloat(attendanceRate) || 0;
    const used = parseFloat(used1Y) || 0;

    // 5인 미만 사업장: 법정 연차 의무 X
    if (smallBusiness) {
      return { type: "exempt", years, months };
    }

    // 1년 미만: 매월 만근 시 1일 (최대 11일)
    if (years < 1) {
      const monthly = Math.min(11, months);
      return {
        type: "monthly" as const,
        monthly,
        remaining1Y: Math.max(0, monthly - used),
        years,
        months,
      };
    }

    // 1년 이상: 80% 출근 요건 + 연차 발생
    if (attendance < 80) {
      // 80% 미만 출근 시 연차 발생 X (단 만근월에 대한 월차 1일 발생)
      return { type: "low-attendance" as const, years, months };
    }

    // 정상 연차 산정
    // 1년: 15일 / 3년차+ 2년에 1일 추가 (최대 25일)
    const extra = Math.min(10, Math.floor((years - 1) / 2));
    const annual = 15 + extra;

    // 입사 후 1년 시점 이내라면 \"누적 가능 일수\" 표시 (1년 미만 11일 + 1년차 15일)
    const showCumulative = years === 1 && months < 24;
    const cumulative1Y = showCumulative ? 11 + 15 : null;

    return {
      type: "annual" as const,
      annual,
      cumulative1Y,
      remaining1Y: Math.max(0, 11 - used),
      years,
      months,
      extra,
    };
  }, [startDate, baseDate, smallBusiness, attendanceRate, used1Y]);

  return (
    <CalculatorLayout
      title="연차·휴가 일수 계산기"
      description="입사일 + 출근율 + 5인 미만 여부로 근로기준법 정확한 연차 발생일수 자동 계산. 1년 미만 누적 + 1년차 26일 표시."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">입사일</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">기준일</span>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">1년 출근율 (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={attendanceRate}
              onChange={(e) => setAttendanceRate(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              80% 미만 시 연차 발생 X (육아휴직·산재 등은 출근 간주)
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">1년 미만 사용 월차 (일)</span>
            <input
              type="number"
              min="0"
              max="11"
              value={used1Y}
              onChange={(e) => setUsed1Y(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">잔여 연차 정확히 보려면 입력</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-indigo-400 sm:col-span-2">
            <input
              type="checkbox"
              checked={smallBusiness}
              onChange={(e) => setSmallBusiness(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">5인 미만 사업장 (상시 근로자 5명 미만)</span>
            <span className="text-xs text-slate-500 ml-auto">→ 법정 연차 의무 X</span>
          </label>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            {/* 5인 미만 */}
            {result.type === "exempt" && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950 p-5 text-center">
                <div className="text-base font-bold text-amber-900 dark:text-amber-300 mb-2">⚠️ 5인 미만 사업장 — 법정 연차 의무 X</div>
                <div className="text-sm text-amber-700 dark:text-amber-400">
                  근로기준법 제60조 (연차)는 5인 이상 사업장만 적용. 5인 미만은 회사 자체 규정·취업규칙에 따름.
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                  재직 {result.years}년 {result.months % 12}개월
                </div>
              </div>
            )}

            {/* 출근율 미달 */}
            {result.type === "low-attendance" && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950 p-5 text-center">
                <div className="text-base font-bold text-amber-900 dark:text-amber-300 mb-2">⚠️ 출근율 80% 미만 — 연차 발생 X</div>
                <div className="text-sm text-amber-700 dark:text-amber-400">
                  근로기준법상 1년 80% 이상 출근 시에만 15일 연차 발생. 단 만근월에 대한 \"월차 1일\"은 별도 발생 가능.
                </div>
              </div>
            )}

            {/* 1년 미만 */}
            {result.type === "monthly" && (
              <>
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
                  <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">현재 발생 월차</div>
                  <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{result.monthly}일</div>
                  <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">
                    재직 {result.years}년 {result.months % 12}개월 · 매월 만근 시 +1일 (최대 11일)
                  </div>
                </div>
                {parseInt(used1Y) > 0 && (
                  <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 p-4 text-center">
                    <div className="text-xs text-emerald-700">잔여 월차</div>
                    <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{result.remaining1Y}일</div>
                  </div>
                )}
                <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-sm">
                  <strong>💡 안내</strong>: 입사 1년 시점에 \"1년 미만 누적 11일 + 1년차 15일\" = <strong>최대 26일</strong>까지 보유 가능합니다 (사용촉진 미실시 시).
                </div>
              </>
            )}

            {/* 정상 연차 */}
            {result.type === "annual" && (
              <>
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
                  <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">현재 발생 연차</div>
                  <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{result.annual}일</div>
                  <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">
                    재직 {result.years}년 {result.months % 12}개월
                    {(result.extra ?? 0) > 0 && ` · 3년차 가산 +${result.extra}일`}
                  </div>
                </div>

                {/* 1년차 누적 안내 */}
                {result.cumulative1Y && (
                  <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 p-4">
                    <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">📌 1년 시점 누적 가능 일수</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">{result.cumulative1Y}일</div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400">
                        (1년 미만 11일 + 1년차 15일)
                      </div>
                    </div>
                    {parseInt(used1Y) > 0 && (
                      <div className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                        잔여: {result.cumulative1Y - parseInt(used1Y)}일 (1년 미만 사용 {used1Y}일 차감)
                      </div>
                    )}
                    <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                      ※ 회사가 \"연차사용촉진제도\"를 적법하게 시행한 경우 1년 미만 11일은 입사 1년 차 만료 시점에 소멸 가능
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div
        className="mt-10"
        style={{ fontFamily: "var(--font-roboto), 'Noto Sans KR', 'Pretendard', sans-serif" }}
      >
        <h2 className="text-[22px] sm:text-[26px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug mb-6" style={{ fontFamily: "var(--font-playfair), var(--font-roboto), 'Noto Sans KR', serif", fontWeight: 900 }}>
          근로기준법 제60조 핵심
        </h2>
        <dl className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {[
            { term: "1년 미만", desc: "매월 만근 시 월차 1일 (최대 11일)", ref: "제60조 제2항" },
            { term: "1년 이상 + 80% 출근", desc: "연차 15일", ref: "제60조 제1항" },
            { term: "3년차부터", desc: "2년에 1일 가산 (3년 16 · 5년 17 · 7년 18 · ... 21년+ 25일 상한)", ref: null },
            { term: "1년 시점 최대 26일", desc: "1년 미만 11일 + 1년차 15일 (사용촉진 미실시 시)", ref: null },
            { term: "5인 미만 사업장", desc: "법정 의무 X — 회사 자체 규정 적용", ref: null },
            { term: "80% 출근 요건", desc: "1년 80% 미달 시 연차 0일 (만근월 월차 1일은 별도)", ref: null },
            { term: "육아휴직 · 산재 · 출산휴가", desc: "출근 간주", ref: "제60조 제6항" },
            { term: "미사용 연차 수당", desc: "만료 시 통상임금 × 미사용 일수 (사용촉진 미실시 시)", ref: null },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-6 gap-y-1 py-4">
              <dt className="text-[14px] font-bold text-slate-900 dark:text-slate-100 leading-snug">{item.term}</dt>
              <dd className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
                {item.ref && <span className="ml-2 text-[11px] uppercase tracking-wider text-indigo-500 dark:text-indigo-400" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>· {item.ref}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <aside
        className="mt-8 border-l-2 border-amber-400 dark:border-amber-600 pl-5 py-2"
        style={{ fontFamily: "var(--font-roboto), 'Noto Sans KR', 'Pretendard', sans-serif" }}
      >
        <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mb-2">
          회계연도 기준 차이
        </div>
        <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-[1.85]">
          본 도구는 <strong className="font-semibold text-slate-900 dark:text-slate-100">입사일 기준</strong> (근로기준법 표준)입니다. 회사가 <strong className="font-semibold text-slate-900 dark:text-slate-100">회계연도 기준</strong> (1월 1일~12월 31일) 운영 시 일수가 약간 다를 수 있습니다. 단, 회계 기준이 입사일 기준보다 불리하면 안 됩니다 — 대법원 판례 2018다231536.
        </p>
      </aside>
    </CalculatorLayout>
  );
}
