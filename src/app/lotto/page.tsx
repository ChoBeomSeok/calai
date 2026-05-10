"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function generateNumbers(): { numbers: number[]; bonus: number } {
  const all = Array.from({ length: 45 }, (_, i) => i + 1);
  // Fisher-Yates 셔플 (각 swap마다 독립적인 암호학적 난수)
  const rand = new Uint32Array(45);
  crypto.getRandomValues(rand);
  for (let i = all.length - 1; i > 0; i--) {
    const j = rand[i] % (i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }
  const numbers = all.slice(0, 6).sort((a, b) => a - b);
  const bonus = all[6];
  return { numbers, bonus };
}

function ballColor(n: number): string {
  if (n <= 10) return "bg-amber-400 text-white";
  if (n <= 20) return "bg-sky-500 text-white";
  if (n <= 30) return "bg-rose-500 text-white";
  if (n <= 40) return "bg-slate-700 text-white";
  return "bg-emerald-500 text-white";
}

export default function LottoPage() {
  const [sets, setSets] = useState<{ numbers: number[]; bonus: number }[]>([generateNumbers()]);
  const [count, setCount] = useState(5);

  const handleGenerate = () => {
    const arr: { numbers: number[]; bonus: number }[] = [];
    for (let i = 0; i < count; i++) arr.push(generateNumbers());
    setSets(arr);
  };

  return (
    <CalculatorLayout title="로또 번호 생성기" description="로또 6/45 자동 번호 생성. 브라우저 crypto API 진정 난수, 1~5세트 한 번에.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">생성할 세트 수: {count}</span>
          <input type="range" min="1" max="10" value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="mt-1.5 block w-full" />
        </label>
        <button onClick={handleGenerate} className="w-full mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">🎰 번호 생성</button>
        <div className="mt-6 space-y-3">
          {sets.map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{i + 1}세트</div>
              <div className="flex flex-wrap gap-2 items-center">
                {s.numbers.map((n) => (
                  <div key={n} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${ballColor(n)}`}>{n}</div>
                ))}
                <span className="text-slate-400 mx-1">+</span>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${ballColor(s.bonus)} ring-2 ring-amber-300`}>{s.bonus}</div>
                <span className="text-xs text-slate-500 ml-1">보너스</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CalculatorLayout>
  );
}
