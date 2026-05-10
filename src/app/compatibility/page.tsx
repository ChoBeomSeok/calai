"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const ZODIAC = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];

// 12지 궁합 (단순화 — 삼합/육합/충 기반)
const ZODIAC_SCORE: Record<string, Record<string, number>> = {};
const HARMONY: Record<string, string[]> = {
  "쥐": ["용", "원숭이"], "소": ["뱀", "닭"], "호랑이": ["말", "개"], "토끼": ["양", "돼지"],
  "용": ["원숭이", "쥐"], "뱀": ["닭", "소"], "말": ["개", "호랑이"], "양": ["돼지", "토끼"],
  "원숭이": ["쥐", "용"], "닭": ["소", "뱀"], "개": ["호랑이", "말"], "돼지": ["토끼", "양"],
};
const CONFLICT: Record<string, string> = {
  "쥐": "말", "소": "양", "호랑이": "원숭이", "토끼": "닭",
  "용": "개", "뱀": "돼지", "말": "쥐", "양": "소",
  "원숭이": "호랑이", "닭": "토끼", "개": "용", "돼지": "뱀",
};
ZODIAC.forEach((a) => {
  ZODIAC_SCORE[a] = {};
  ZODIAC.forEach((b) => {
    if (HARMONY[a]?.includes(b)) ZODIAC_SCORE[a][b] = 90;
    else if (CONFLICT[a] === b) ZODIAC_SCORE[a][b] = 30;
    else ZODIAC_SCORE[a][b] = 60;
  });
});

export default function CompatibilityPage() {
  const [date1, setDate1] = useState("1995-06-15");
  const [date2, setDate2] = useState("1996-08-20");

  const result = useMemo(() => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const z1 = ZODIAC[d1.getFullYear() % 12];
    const z2 = ZODIAC[d2.getFullYear() % 12];
    const score = ZODIAC_SCORE[z1][z2];
    const message =
      score >= 85 ? "💕 천생연분! 운명적 조합" :
      score >= 70 ? "💖 매우 좋은 궁합" :
      score >= 50 ? "💛 보통 궁합 — 노력으로 발전 가능" :
      "💔 어려움이 많은 조합 — 서로 이해 필요";
    return { z1, z2, score, message };
  }, [date1, date2]);

  return (
    <CalculatorLayout title="궁합 계산기" description="두 사람 생년월일로 12지(띠) 궁합 자동 분석. 동양 전통 삼합·육합·충 기반.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">나의 생년월일</span><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">상대 생년월일</span><input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg" /></label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-5 text-center">
              <div className="text-sm text-rose-700 dark:text-rose-400 mb-2">{result.z1}띠 ↔ {result.z2}띠</div>
              <div className="text-6xl font-bold text-rose-900 dark:text-rose-300 my-3">{result.score}<span className="text-2xl font-normal">점</span></div>
              <div className="text-sm text-rose-700 dark:text-rose-400 mt-2">{result.message}</div>
              <div className="mt-4 h-3 bg-rose-100 dark:bg-rose-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all" style={{ width: `${result.score}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        ⚠️ <strong>음력 기준 안내</strong>: 한국식 띠는 음력 1월 1일 기준입니다. 양력 1~2월 출생자는 전년 띠일 수 있어 결과가 다를 수 있습니다 (본 도구는 양력 연도 기준 단순 계산).
      </div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        ※ 12지 띠 궁합은 동양 전통 분석. 실제 관계는 성격·가치관·소통이 더 중요합니다 — 재미로만!
      </div>
    </CalculatorLayout>
  );
}
