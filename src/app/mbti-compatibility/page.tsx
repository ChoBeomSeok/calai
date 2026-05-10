"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

const BEST_PAIRS: Record<string, string[]> = {
  "INTJ": ["ENFP", "ENTP"], "INTP": ["ENTJ", "ESTJ"], "ENTJ": ["INTP", "INFP"], "ENTP": ["INFJ", "INTJ"],
  "INFJ": ["ENFP", "ENTP"], "INFP": ["ENFJ", "ENTJ"], "ENFJ": ["INFP", "ISFP"], "ENFP": ["INTJ", "INFJ"],
  "ISTJ": ["ESFP", "ESTP"], "ISFJ": ["ESFP", "ESTP"], "ESTJ": ["ISFP", "ISTP"], "ESFJ": ["ISFP", "ISTP"],
  "ISTP": ["ESTJ", "ESFJ"], "ISFP": ["ENFJ", "ESFJ"], "ESTP": ["ISTJ", "ISFJ"], "ESFP": ["ISTJ", "ISFJ"],
};

type Analysis = {
  score: number;
  type: string;
  strengths: string[];
  conflicts: string[];
  tips: string[];
  romance: number;
  work: number;
  friendship: number;
};

function analyze(a: string, b: string): Analysis {
  const sameE = a[0] === b[0];
  const sameN = a[1] === b[1];
  const sameT = a[2] === b[2];
  const sameJ = a[3] === b[3];
  const matches = [sameE, sameN, sameT, sameJ].filter(Boolean).length;

  let score = 60;
  let type = "보통 — 노력과 이해 필요";
  if (a === b) { score = 75; type = "유사형 — 편안하지만 자극 부족"; }
  else if (BEST_PAIRS[a]?.includes(b)) { score = 95; type = "최고 궁합 — 서로 보완하는 황금 조합"; }
  else if (matches === 0) { score = 65; type = "정반대형 — 끌림과 충돌 공존"; }
  else if (matches >= 2) { score = 80; type = "유사 가치관 — 안정적"; }

  const strengths: string[] = [];
  const conflicts: string[] = [];
  const tips: string[] = [];

  if (sameE) {
    strengths.push(a[0] === "E" ? "둘 다 외향형(E) — 함께 사교 활동·여행 즐김, 에너지 채우는 방식 동일" : "둘 다 내향형(I) — 함께 있어도 조용함이 편안, 혼자 시간 존중");
  } else {
    conflicts.push("외향(E) ↔ 내향(I) — 한쪽은 사람 만나러 나가고 싶고, 한쪽은 집에서 충전 필요");
    tips.push("E는 I의 혼자 시간을 거부로 받아들이지 않기. I는 E의 사교 욕구를 인정하기");
  }

  if (sameN) {
    strengths.push(a[1] === "N" ? "둘 다 직관형(N) — 미래·추상·아이디어 대화 즐김, 깊이 있는 토론" : "둘 다 감각형(S) — 현실·구체·실용 가치관 일치, 일상 결정 빠름");
  } else {
    conflicts.push("직관(N) ↔ 감각(S) — 가장 큰 차이. N은 추상·가능성·미래, S는 구체·사실·현재. 대화에서 답답함 자주");
    tips.push("N은 구체 예시 들어 설명. S는 N의 추상 표현을 끝까지 듣기. 정보 처리 방식이 다름을 인정");
  }

  if (sameT) {
    strengths.push(a[2] === "T" ? "둘 다 사고형(T) — 갈등 시 논리적 해결, 객관적 토론 가능" : "둘 다 감정형(F) — 서로 공감 잘함, 감정 표현 자연스러움");
  } else {
    conflicts.push("사고(T) ↔ 감정(F) — 갈등 시 T는 옳고 그름, F는 마음·관계 우선. 같은 사건 해석 정반대");
    tips.push("T는 결론보다 \"네 마음은 어땠어?\" 먼저 물어보기. F는 T의 직설을 공격으로 받아들이지 말기");
  }

  if (sameJ) {
    strengths.push(a[3] === "J" ? "둘 다 판단형(J) — 계획·약속·정리 가치관 동일, 안정적 일상" : "둘 다 인식형(P) — 즉흥·자유·여유 추구, 서로 압박 안 함");
  } else {
    conflicts.push("판단(J) ↔ 인식(P) — J는 계획·마감, P는 즉흥·미루기. 데이트·여행 준비 방식 충돌");
    tips.push("J는 P의 \"천천히\"를 받아들이기. P는 중요 약속만큼은 J의 계획을 존중하기");
  }

  const isNF = a[1] === "N" && a[2] === "F";
  const bisNF = b[1] === "N" && b[2] === "F";
  const isNT = a[1] === "N" && a[2] === "T";
  const bisNT = b[1] === "N" && b[2] === "T";

  const romance = score + (isNF && bisNF ? 5 : 0) + (matches >= 3 ? 5 : 0) - (matches === 0 ? 10 : 0);
  const work = 60 + (sameN ? 15 : 0) + (sameT ? 10 : 0) + ((isNT && bisNT) ? 10 : 0);
  const friendship = 65 + (matches >= 2 ? 15 : 0) + (sameE ? 5 : 0);

  return {
    score, type, strengths, conflicts, tips,
    romance: Math.min(100, Math.max(20, romance)),
    work: Math.min(100, Math.max(20, work)),
    friendship: Math.min(100, Math.max(20, friendship)),
  };
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-end text-xs mb-1">
        <span className="font-bold">{score}점</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function MbtiCompatibilityPage() {
  const [t1, setT1] = useState("INTJ");
  const [t2, setT2] = useState("ENFP");

  const result = useMemo(() => analyze(t1, t2), [t1, t2]);

  return (
    <CalculatorLayout title="MBTI 궁합" description="두 MBTI의 4축 (E/I·N/S·T/F·J/P) 자동 분석 + 강점·갈등·소통 팁 + 연애·직장·우정 점수.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">나의 MBTI</span>
            <select value={t1} onChange={(e) => setT1(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">상대 MBTI</span>
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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-4">
              <div className="text-xs text-rose-700 dark:text-rose-400 mb-2">💕 연애</div>
              <ScoreBar score={result.romance} color="bg-rose-500" />
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950 p-4">
              <div className="text-xs text-blue-700 dark:text-blue-400 mb-2">💼 직장</div>
              <ScoreBar score={result.work} color="bg-blue-500" />
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950 p-4">
              <div className="text-xs text-amber-700 dark:text-amber-400 mb-2">🤝 우정</div>
              <ScoreBar score={result.friendship} color="bg-amber-500" />
            </div>
          </div>
        </div>

        {result.strengths.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">✨ 관계 강점</h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.conflicts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">⚠️ 자주 부딪히는 영역</h3>
            <ul className="space-y-2">
              {result.conflicts.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mt-0.5">!</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.tips.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2">💬 관계 개선 팁</h3>
            <ul className="space-y-2">
              {result.tips.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-indigo-500 mt-0.5">→</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">4축 매칭</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "외향·내향", a: t1[0], b: t2[0] },
              { label: "직관·감각", a: t1[1], b: t2[1] },
              { label: "사고·감정", a: t1[2], b: t2[2] },
              { label: "판단·인식", a: t1[3], b: t2[3] },
            ].map((axis, i) => (
              <div key={i} className={`rounded-lg p-3 text-center text-xs ${axis.a === axis.b ? "bg-emerald-50 dark:bg-emerald-950" : "bg-amber-50 dark:bg-amber-950"}`}>
                <div className="text-slate-600 dark:text-slate-400 mb-1">{axis.label}</div>
                <div className="font-bold">
                  <span className="text-slate-900 dark:text-slate-100">{axis.a}</span>
                  <span className="mx-1">{axis.a === axis.b ? "=" : "↔"}</span>
                  <span className="text-slate-900 dark:text-slate-100">{axis.b}</span>
                </div>
                <div className={`text-xs mt-1 ${axis.a === axis.b ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {axis.a === axis.b ? "같음" : "다름"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ MBTI는 성격 유형 참고용. 실제 관계는 가치관·소통·노력이 핵심입니다 — 분석은 일반적 경향성.
      </div>
    </CalculatorLayout>
  );
}
