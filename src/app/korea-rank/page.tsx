"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  BIRTHS_BY_YEAR,
  HEIGHT_STATS,
  getHeightKey,
  findSurname,
  findNameStat,
  nameCommonness,
  normalCdf,
  cumulativeBirthsUntil,
  survivorsOfBirthYear,
} from "./data";

function formatNumber(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n);
}

function formatBigNumber(n: number): string {
  if (n >= 100000000) {
    const eok = n / 100000000;
    return `${eok.toFixed(2)}억`;
  }
  if (n >= 10000) {
    const man = Math.round(n / 10000);
    return `${formatNumber(man)}만`;
  }
  return formatNumber(n);
}

const COMMONNESS_LABEL: Record<string, { label: string; color: string }> = {
  very_common: { label: "매우 흔한 이름", color: "text-rose-600" },
  common: { label: "흔한 이름", color: "text-amber-600" },
  uncommon: { label: "비교적 드문 이름", color: "text-emerald-600" },
  rare: { label: "희귀한 이름", color: "text-indigo-600" },
};

export default function KoreaRankPage() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("1992-05-15");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [height, setHeight] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const [yStr, mStr, dStr] = birthDate.split("-");
    const year = parseInt(yStr);
    const month = parseInt(mStr);
    const day = parseInt(dStr);
    if (!year || !month || !day || year < 1925 || year > 2024) return null;

    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // 1. 같은 생일 동기
    const yearBirths = BIRTHS_BY_YEAR[year] ?? 0;
    const daysInYear =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
    const sameBirthday = Math.round(yearBirths / daysInYear);

    // 2. 현재 생존 동기
    const survivingPeers = survivorsOfBirthYear(year, currentYear);

    // 3. 한국 누적 출생 순번
    const birthOrder = cumulativeBirthsUntil(year, month, day);

    // 4. 본인보다 키 큰 한국인 %
    let tallerPercent: number | null = null;
    if (height) {
      const h = parseFloat(height);
      if (h > 0) {
        const key = getHeightKey(gender, age);
        const stats = HEIGHT_STATS[key];
        if (stats) {
          const z = (h - stats.mean) / stats.sd;
          const taller = 1 - normalCdf(z);
          tallerPercent = Math.round(taller * 1000) / 10;
        }
      }
    }

    // 5. 같은 성씨
    const surname = name ? findSurname(name) : null;
    const surnameSharePct = surname
      ? Math.round((surname.population / surname.total) * 10000) / 100
      : null;

    // 6. 이름 흔하기 — 행안부 시기별 인기 명단에서 본인 이름 점유율 매칭
    const nameStat = name ? findNameStat(name, year, gender) : null;
    const commonness = name ? nameCommonness(nameStat?.share ?? null) : null;
    // 동기 동명이인 (본인 생년 출생자 × 점유율)
    const peerNamesakes = nameStat
      ? Math.round((BIRTHS_BY_YEAR[year] ?? 0) * nameStat.share)
      : null;

    return {
      year,
      age,
      sameBirthday,
      survivingPeers,
      birthOrder,
      tallerPercent,
      surname,
      surnameSharePct,
      commonness,
      nameStat,
      peerNamesakes,
    };
  }, [name, birthDate, gender, height]);

  return (
    <CalculatorLayout
      title="한국에서 몇 번째? 진단"
      description="생년월일·이름·키로 한국에서 본인 위치 6가지를 한 페이지에 — 같은 생일 동기·키 분위·성씨 순위·누적 출생 순번까지."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">이름 (선택)</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="예: 김민준"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">생년월일</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              min="1925-01-01"
              max="2024-12-31"
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">성별</span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-3 py-3 rounded-lg text-sm font-medium border transition ${
                    gender === g
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                  }`}
                >
                  {g === "M" ? "남성" : "여성"}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">키 (cm, 선택)</span>
            <input
              type="number"
              min="100"
              max="220"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="173"
            />
          </label>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            <div className="text-center mb-2">
              <div className="text-xs text-slate-500">한국 {result.year}년생 {result.age}세 기준</div>
            </div>

            <div className="rounded-xl bg-indigo-50 p-5">
              <div className="text-xs text-indigo-700 mb-1">📅 같은 생일 동기</div>
              <div className="text-2xl font-bold text-indigo-900">
                약 {formatNumber(result.sameBirthday)}명
              </div>
              <div className="text-xs text-indigo-600 mt-1">
                {result.year}년 같은 날 한국에서 태어난 신생아 수 추정 (연 출생 {formatNumber(BIRTHS_BY_YEAR[result.year] ?? 0)}명 기준)
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 p-5">
              <div className="text-xs text-emerald-700 mb-1">👥 현재 생존 동기</div>
              <div className="text-2xl font-bold text-emerald-900">
                약 {formatBigNumber(result.survivingPeers)}명
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                같은 {result.year}년생 중 현재까지 생존한 한국인 추정
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-5">
              <div className="text-xs text-amber-700 mb-1">🔢 한국 누적 출생 순번</div>
              <div className="text-2xl font-bold text-amber-900">
                약 {formatNumber(result.birthOrder)}번째
              </div>
              <div className="text-xs text-amber-600 mt-1">
                1925년 1월 1일 이후 한국에서 태어난 누적 인원 중 본인 순번
              </div>
            </div>

            {result.tallerPercent !== null && (
              <div className="rounded-xl bg-sky-50 p-5">
                <div className="text-xs text-sky-700 mb-1">📏 본인보다 키 큰 한국인</div>
                <div className="text-2xl font-bold text-sky-900">
                  상위 {result.tallerPercent}%
                </div>
                <div className="text-xs text-sky-600 mt-1">
                  동성·동연령대 한국인 중 본인보다 큰 사람 비율 (국민건강영양조사 평균·표준편차 기준)
                </div>
              </div>
            )}

            {result.surname && result.surnameSharePct !== null && (
              <div className="rounded-xl bg-purple-50 p-5">
                <div className="text-xs text-purple-700 mb-1">👨‍👩‍👧 같은 성씨</div>
                <div className="text-2xl font-bold text-purple-900">
                  약 {formatBigNumber(result.surname.population)}명 · 전체 {result.surname.rank}위
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  한국 인구의 {result.surnameSharePct}%
                </div>
              </div>
            )}

            {result.commonness && (
              <div className="rounded-xl bg-rose-50 p-5">
                <div className="text-xs text-rose-700 mb-1">🏷️ 이름 흔하기</div>
                <div className={`text-2xl font-bold ${COMMONNESS_LABEL[result.commonness].color}`}>
                  {COMMONNESS_LABEL[result.commonness].label}
                </div>
                <div className="text-xs text-rose-600 mt-1">
                  {result.nameStat
                    ? `${result.year}년대 ${gender === "M" ? "남아" : "여아"} 인기 ${result.nameStat.rank}위 (출생 신고의 ${(result.nameStat.share * 100).toFixed(2)}%)`
                    : `행안부 공개 인기 명단(상위 약 30위) 밖`}
                </div>
              </div>
            )}

            {result.peerNamesakes !== null && result.peerNamesakes !== undefined && (
              <div className="rounded-xl bg-pink-50 p-5">
                <div className="text-xs text-pink-700 mb-1">👯 본인과 같은 이름 동기</div>
                <div className="text-2xl font-bold text-pink-900">
                  약 {formatBigNumber(result.peerNamesakes)}명
                </div>
                <div className="text-xs text-pink-600 mt-1">
                  {result.year}년생 한국인 중 본인과 같은 이름 추정 (행안부 출생 신고 점유율 기반)
                </div>
              </div>
            )}

            <div className="pt-3 text-xs text-slate-400 text-center leading-relaxed">
              기준 데이터: 통계청 인구동향조사 (출생) · 행정안전부 주민등록 인구통계 · 통계청 2015 인구주택총조사 (성씨) · 질병관리청 국민건강영양조사 8기 (키)
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
