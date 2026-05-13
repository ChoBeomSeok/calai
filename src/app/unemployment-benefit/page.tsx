"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

// 2026년 고용보험법 기준 (고용노동부 고시 · 2025-07 최저임금위원회 결정)
// 1일 상한: 66,000원 (2019년 1월부터 유지)
// 1일 하한: 최저임금의 80% × 8시간 (퇴직 시점 최저시급 기준)
// 2026 최저시급: 10,320원 (전년 대비 +2.9%, 2025-07-14 결정·고시)
// ※ 2026년부터 하한액 > 상한액 역전 → 실무상 하한액이 우선 적용됨
const UPPER_LIMIT = 66_000;
const MIN_WAGE_2026 = 10_320;
const LOWER_LIMIT = Math.floor(MIN_WAGE_2026 * 0.8 * 8); // 66,048원

// 소정급여일수 (만 나이·고용보험 가입기간별)
function getDays(age: number, insuredYears: number): number {
  const isOlder = age >= 50;
  if (insuredYears < 1) return 120;
  if (insuredYears < 3) return isOlder ? 180 : 150;
  if (insuredYears < 5) return isOlder ? 210 : 180;
  if (insuredYears < 10) return isOlder ? 240 : 210;
  return isOlder ? 270 : 240;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function UnemploymentBenefitPage() {
  const [avgWage, setAvgWage] = useState("3500000");
  const [age, setAge] = useState("35");
  const [insuredMonths, setInsuredMonths] = useState("24");
  const [voluntary, setVoluntary] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(avgWage);
    const a = parseInt(age);
    const m = parseInt(insuredMonths);
    if (!w || !a || !m || w <= 0 || a < 18 || m < 6) return null;

    // 1일 평균임금 = 월 평균임금 / 30
    const dailyAvg = w / 30;
    // 구직급여 1일 = 평균임금의 60%
    const rawDaily = dailyAvg * 0.6;
    // 상한·하한 적용 — 하한 우선 (2026년 하한 > 상한 역전 케이스 대응)
    const cappedDaily = Math.min(UPPER_LIMIT, rawDaily);
    const daily = Math.max(LOWER_LIMIT, cappedDaily);

    const years = m / 12;
    const days = getDays(a, years);
    const totalAmount = daily * days;

    // 수급 자격 체크
    const eligible = m >= 6 && !voluntary;

    return {
      dailyAvg,
      daily,
      days,
      totalAmount,
      eligible,
      isUpper: rawDaily > UPPER_LIMIT,
      isLower: rawDaily < LOWER_LIMIT,
      years,
    };
  }, [avgWage, age, insuredMonths, voluntary]);

  return (
    <CalculatorLayout
      title="실업급여 계산기 (2026)"
      description="평균임금·고용보험 가입기간·연령으로 1일 수급액·총 지급액·소정급여일수 자동 계산. 2026년 고용보험법 기준."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">월 평균임금 (퇴직 직전 3개월 평균, 원)</span>
            <input
              type="number"
              min="0"
              value={avgWage}
              onChange={(e) => setAvgWage(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
            <MoneyHint value={avgWage} />
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
              기본급 + 정기상여 + 비과세 제외한 &quot;평균임금&quot;. 회사 급여명세서 기준.
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">만 나이 (세)</span>
            <input
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">50세+ 시 수급기간 연장</span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">고용보험 가입기간 (개월)</span>
            <input
              type="number"
              min="0"
              value={insuredMonths}
              onChange={(e) => setInsuredMonths(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
            <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">최소 180일(약 6개월) 필요</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-indigo-400 sm:col-span-2">
            <input type="checkbox" checked={voluntary} onChange={(e) => setVoluntary(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">자발적 퇴직 (사직)</span>
            <span className="text-xs text-slate-500 ml-auto">→ 원칙적으로 수급 불가</span>
          </label>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            {!result.eligible ? (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-5 text-center">
                <div className="text-base font-bold text-rose-900 dark:text-rose-300 mb-2">⚠️ 수급 자격 부족</div>
                <div className="text-sm text-rose-700 dark:text-rose-400">
                  {voluntary
                    ? "자발적 퇴직은 원칙상 실업급여 X (예외: 임금체불·통근곤란·질병·가족돌봄 등 \"정당한 사유\" 인정 시 가능)"
                    : "고용보험 가입 180일(약 6개월) 이상 필요"}
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
                  <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">예상 총 실업급여</div>
                  <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(result.totalAmount)} 원</div>
                  <div className="text-sm text-indigo-700 dark:text-indigo-400 mt-2">
                    1일 {fmt(result.daily)}원 × {result.days}일 ({(result.days / 30).toFixed(1)}개월)
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400">1일 수급액</div>
                    <div className="font-bold text-lg">{fmt(result.daily)} 원</div>
                    {result.isUpper && <div className="text-xs text-amber-600 mt-0.5">⚠️ 상한 적용</div>}
                    {result.isLower && <div className="text-xs text-emerald-600 mt-0.5">✓ 하한 적용</div>}
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400">소정급여일수</div>
                    <div className="font-bold text-lg">{result.days} 일</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {parseInt(age) >= 50 ? "50세 이상 (연장)" : "일반"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">월 평균임금</span>
                    <span>{fmt(parseFloat(avgWage))} 원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">1일 평균임금</span>
                    <span>{fmt(result.dailyAvg)} 원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">평균임금 60% (산정 기준)</span>
                    <span>{fmt(result.dailyAvg * 0.6)} 원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">상한액 / 하한액</span>
                    <span>
                      {fmt(UPPER_LIMIT)} / {fmt(LOWER_LIMIT)} 원
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400">가입기간</span>
                    <span>{result.years.toFixed(1)} 년</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">2026 실업급여 핵심 정보</h2>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-4 space-y-2 text-xs">
          <div>
            <strong>수급 자격</strong>: ① 고용보험 가입 180일 이상 ② 비자발적 이직 (해고·계약만료·권고사직) ③ 적극적 구직활동 ④ 근로 의사·능력 보유
          </div>
          <div>
            <strong>1일 수급액</strong>: 평균임금 × 60% (상한 66,000원 / 하한 66,048원 = 2026 최저시급 10,320원 × 80% × 8h)
            <div className="mt-1 text-amber-700 dark:text-amber-400">
              ※ 2026년부터 하한액(66,048원) &gt; 상한액(66,000원) 역전 → 사실상 모든 수급자 66,048원 적용
            </div>
          </div>
          <div>
            <strong>소정급여일수</strong>: 가입기간 + 만 나이에 따라 120~270일
            <ul className="list-disc list-inside mt-1 ml-2">
              <li>1년 미만: 120일</li>
              <li>1~3년: 150일 (50세+ 180일)</li>
              <li>3~5년: 180일 (50세+ 210일)</li>
              <li>5~10년: 210일 (50세+ 240일)</li>
              <li>10년+: 240일 (50세+ 270일)</li>
            </ul>
          </div>
          <div>
            <strong>신청·수급</strong>: 이직일로부터 12개월 이내 워크넷·고용센터 신청. 7일 대기 후 수급 시작.
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        ⚠️ <strong>주의</strong>: 본 도구는 추정치입니다. 정확한 금액은 고용보험공단 마이페이지(고용24) 조회. 자발적 퇴직도 &quot;정당한 사유&quot; (임금체불·통근곤란·질병 등) 인정 시 수급 가능 — 고용센터 상담 권장.
      </div>
      <div className="mt-3 text-[11px] text-slate-400 text-right">
        2026년 고용보험법 기준 · 최종 갱신: 2026-05-13
      </div>
    </CalculatorLayout>
  );
}
