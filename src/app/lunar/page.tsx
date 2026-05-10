"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

// 한국 띠 (10간 12지)
const ZODIAC_ANIMALS = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
const HEAVENLY_STEMS = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];

function ganzi(year: number): string {
  const stem = HEAVENLY_STEMS[year % 10];
  const branch = ZODIAC_ANIMALS[year % 12];
  return `${stem}${branch}년`;
}

function zodiacOf(year: number): string {
  return ZODIAC_ANIMALS[year % 12];
}

export default function LunarPage() {
  const [date, setDate] = useState("1990-01-01");
  const d = new Date(date);
  const valid = !isNaN(d.getTime());

  return (
    <CalculatorLayout title="음력·양력·띠 변환기" description="양력 날짜 → 한국 띠 + 간지 자동. (정밀 음력 변환은 향후 추가 예정)">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">양력 생년월일</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        {valid && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">한국 띠</div>
              <div className="text-4xl font-bold text-indigo-900">{zodiacOf(d.getFullYear())}띠</div>
              <div className="text-sm text-indigo-700 mt-2">간지: {ganzi(d.getFullYear())}</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ 띠는 양력 연도 기준. 정확한 음력 변환은 양력 1월 ↔ 음력 12월·1월 경계에 차이가 있어, 정밀 변환은 추후 업데이트 예정.</p>
      </div>
    </CalculatorLayout>
  );
}
