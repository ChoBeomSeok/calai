"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

// 단순화: 보완형 + 유사형 + 일반형 점수
const BEST_PAIRS: Record<string, string[]> = {
  "INTJ": ["ENFP", "ENTP"], "INTP": ["ENTJ", "ESTJ"], "ENTJ": ["INTP", "INFP"], "ENTP": ["INFJ", "INTJ"],
  "INFJ": ["ENFP", "ENTP"], "INFP": ["ENFJ", "ENTJ"], "ENFJ": ["INFP", "ISFP"], "ENFP": ["INTJ", "INFJ"],
  "ISTJ": ["ESFP", "ESTP"], "ISFJ": ["ESFP", "ESTP"], "ESTJ": ["ISFP", "ISTP"], "ESFJ": ["ISFP", "ISTP"],
  "ISTP": ["ESTJ", "ESFJ"], "ISFP": ["ENFJ", "ESFJ"], "ESTP": ["ISTJ", "ISFJ"], "ESFP": ["ISTJ", "ISFJ"],
};

function scorePair(a: string, b: string): { score: number; type: string } {
  if (a === b) return { score: 75, type: "유사형 — 편안하지만 자극 부족" };
  if (BEST_PAIRS[a]?.includes(b)) return { score: 95, type: "최고 궁합 — 서로 보완" };
  // 정반대 (예: INTJ ↔ ESFP)
  const opposite = a.split("").map((c, i) => {
    const pairs: Record<string, string> = { I: "E", E: "I", N: "S", S: "N", T: "F", F: "T", J: "P", P: "J" };
    return pairs[c];
  }).join("");
  if (b === opposite) return { score: 65, type: "정반대형 — 끌림 + 충돌" };
  // 같은 그룹 (NT·NF·ST·SF)
  if (a[1] === b[1] && a[2] === b[2]) return { score: 80, type: "같은 가치관·결정 방식" };
  return { score: 60, type: "보통 — 노력과 이해 필요" };
}

export default function MbtiCompatibilityPage() {
  const [t1, setT1] = useState("INTJ");
  const [t2, setT2] = useState("ENFP");

  const result = useMemo(() => scorePair(t1, t2), [t1, t2]);

  return (
    <CalculatorLayout title="MBTI 궁합" description="두 MBTI 16×16 매트릭스 기반 궁합 점수 + 관계 유형·팁.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">나의 MBTI</span>
            <select value={t1} onChange={(e) => setT1(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">상대 MBTI</span>
            <select value={t2} onChange={(e) => setT2(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="rounded-xl bg-purple-50 dark:bg-purple-950 p-5 text-center">
            <div className="text-sm text-purple-700 dark:text-purple-400 mb-2">{t1} ↔ {t2}</div>
            <div className="text-6xl font-bold text-purple-900 dark:text-purple-300 my-3">{result.score}<span className="text-2xl font-normal">점</span></div>
            <div className="text-sm text-purple-700 dark:text-purple-400 mt-2">{result.type}</div>
            <div className="mt-4 h-3 bg-purple-100 dark:bg-purple-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all" style={{ width: `${result.score}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ MBTI는 성격 유형 참고용. 실제 관계는 가치관·소통·노력이 핵심입니다.
      </div>
    </CalculatorLayout>
  );
}
