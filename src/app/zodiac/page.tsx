"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const ZODIAC_ANIMALS = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];

const STAR_SIGNS = [
  { name: "물병자리", emoji: "♒", from: [1, 20], to: [2, 18] },
  { name: "물고기자리", emoji: "♓", from: [2, 19], to: [3, 20] },
  { name: "양자리", emoji: "♈", from: [3, 21], to: [4, 19] },
  { name: "황소자리", emoji: "♉", from: [4, 20], to: [5, 20] },
  { name: "쌍둥이자리", emoji: "♊", from: [5, 21], to: [6, 21] },
  { name: "게자리", emoji: "♋", from: [6, 22], to: [7, 22] },
  { name: "사자자리", emoji: "♌", from: [7, 23], to: [8, 22] },
  { name: "처녀자리", emoji: "♍", from: [8, 23], to: [9, 22] },
  { name: "천칭자리", emoji: "♎", from: [9, 23], to: [10, 22] },
  { name: "전갈자리", emoji: "♏", from: [10, 23], to: [11, 22] },
  { name: "사수자리", emoji: "♐", from: [11, 23], to: [12, 21] },
  { name: "염소자리", emoji: "♑", from: [12, 22], to: [1, 19] },
];

function getStarSign(month: number, day: number) {
  for (const s of STAR_SIGNS) {
    const [fromM, fromD] = s.from;
    const [toM, toD] = s.to;
    if (fromM === toM) {
      if (month === fromM && day >= fromD && day <= toD) return s;
    } else {
      if ((month === fromM && day >= fromD) || (month === toM && day <= toD)) return s;
    }
  }
  return STAR_SIGNS[11]; // 염소자리 (1/1~1/19 처리)
}

export default function ZodiacPage() {
  const [date, setDate] = useState("1990-06-15");

  const result = useMemo(() => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const zodiac = ZODIAC_ANIMALS[year % 12];
    const star = getStarSign(month, day);
    return { zodiac, star };
  }, [date]);

  return (
    <CalculatorLayout title="띠·별자리 계산기" description="생년월일로 한국 12간지 띠 + 서양 12별자리 자동 매칭.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">생년월일</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-xs text-indigo-700 mb-1">한국 띠</div>
              <div className="text-4xl mb-1">🐉</div>
              <div className="text-xl font-bold text-indigo-900">{result.zodiac}띠</div>
            </div>
            <div className="rounded-xl bg-amber-50 p-5 text-center">
              <div className="text-xs text-amber-700 mb-1">서양 별자리</div>
              <div className="text-4xl mb-1">{result.star.emoji}</div>
              <div className="text-xl font-bold text-amber-900">{result.star.name}</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
        ⚠️ <strong>띠는 음력 기준</strong>: 본 도구는 양력 연도 기준 단순 계산입니다. 양력 1~2월 출생자는 음력으로는 전년이 되어 띠가 다를 수 있습니다 (예: 양력 2024-02-09 출생 → 음력으론 2023년 토끼띠).
      </div>
    </CalculatorLayout>
  );
}
