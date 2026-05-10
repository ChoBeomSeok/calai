"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { fullAnalyze, MBTI_TYPES } from "@/lib/mbtiAnalysis";

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

  const r = useMemo(() => fullAnalyze(t1, t2), [t1, t2]);

  return (
    <CalculatorLayout
      title="MBTI 궁합"
      description="두 MBTI의 4축 깊이 분석 + 사랑 표현·데이트 스타일·갈등 해결·스트레스 트리거·장기 관계 팁까지 한 페이지에."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">나의 MBTI</span>
            <select value={t1} onChange={(e) => setT1(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg">
              {MBTI_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">상대 MBTI</span>
            <select value={t2} onChange={(e) => setT2(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg">
              {MBTI_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>

        {/* 종합 점수 */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="rounded-xl bg-purple-50 dark:bg-purple-950 p-5 text-center">
            <div className="text-sm text-purple-700 dark:text-purple-400 mb-2">{t1} ↔ {t2}</div>
            <div className="text-6xl font-bold text-purple-900 dark:text-purple-300 my-3">{r.score}<span className="text-2xl font-normal">점</span></div>
            <div className="text-sm text-purple-700 dark:text-purple-400 mt-2">{r.type}</div>
            <div className="mt-4 h-3 bg-purple-100 dark:bg-purple-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all" style={{ width: `${r.score}%` }} />
            </div>
          </div>

          {/* 종합 설명 */}
          <p className="mt-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            {r.longDescription}
          </p>

          {/* 관계 유형별 점수 */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-4">
              <div className="text-xs text-rose-700 dark:text-rose-400 mb-2">💕 연애</div>
              <ScoreBar score={r.romance} color="bg-rose-500" />
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950 p-4">
              <div className="text-xs text-blue-700 dark:text-blue-400 mb-2">💼 직장</div>
              <ScoreBar score={r.work} color="bg-blue-500" />
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950 p-4">
              <div className="text-xs text-amber-700 dark:text-amber-400 mb-2">🤝 우정</div>
              <ScoreBar score={r.friendship} color="bg-amber-500" />
            </div>
          </div>
        </div>

        {/* 4축 깊이 분석 */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">📊 4축 깊이 분석</h3>
          <div className="space-y-4">
            {r.axes.map((axis, i) => (
              <div key={i} className={`rounded-xl border p-4 ${axis.matched ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30" : "border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/30"}`}>
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{axis.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${axis.matched ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"}`}>
                    {axis.matched ? "✓ 같음" : "↔ 다름"}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{axis.detail}</p>
                {axis.example && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-slate-900/40 rounded-lg p-2.5">{axis.example}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 사랑 표현 방식 */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-bold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">💕 서로의 사랑 표현 방식</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-4">
              <div className="text-xs text-rose-700 dark:text-rose-400 mb-1">{t1} (나)</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.loveExpression.yours}</p>
            </div>
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-4">
              <div className="text-xs text-rose-700 dark:text-rose-400 mb-1">{t2} (상대)</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.loveExpression.theirs}</p>
            </div>
          </div>
        </div>

        {/* 데이트 스타일 */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400 mb-3">🎨 추천 데이트 스타일</h3>
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.dateStyle}</p>
          </div>
        </div>

        {/* 갈등 해결 패턴 */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-3">⚡ 갈등 해결 패턴</h3>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.conflictPattern}</p>
          </div>
        </div>

        {/* 트리거 */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">🚨 스트레스 트리거 (피해야 할 행동)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-orange-50 dark:bg-orange-950 p-4">
              <div className="text-xs text-orange-700 dark:text-orange-400 mb-1">{t1} (나)가 싫어하는 것</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.triggers.yours}</p>
            </div>
            <div className="rounded-xl bg-orange-50 dark:bg-orange-950 p-4">
              <div className="text-xs text-orange-700 dark:text-orange-400 mb-1">{t2} (상대)가 싫어하는 것</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.triggers.theirs}</p>
            </div>
          </div>
        </div>

        {/* 장기 관계 팁 */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400 mb-3">🌱 장기 관계 유지 팁</h3>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.longTermTip}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        ※ MBTI는 성격 유형 참고용. 실제 관계는 가치관·소통·노력이 핵심이며, 이 분석은 일반적 경향성에 기반한 시뮬레이션입니다.
      </div>
    </CalculatorLayout>
  );
}
