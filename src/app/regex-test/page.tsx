"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function RegexTestPage() {
  const [pattern, setPattern] = useState("\\d{3}-\\d{4}-\\d{4}");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("연락처: 010-1234-5678 / 사무실: 02-987-6543 / 본사: 070-9999-0000");

  const result = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...text.matchAll(new RegExp(pattern, flags.includes("g") ? flags : flags + "g"))];
      return { error: null, matches: matches.map((m) => ({ match: m[0], index: m.index, groups: m.slice(1) })) };
    } catch (e) {
      return { error: (e as Error).message, matches: [] };
    }
  }, [pattern, flags, text]);

  return (
    <CalculatorLayout title="정규식 테스터" description="정규식 패턴 + 테스트 문자열로 매칭 결과·캡처 그룹 즉시 확인.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-3 gap-3">
          <label className="block col-span-2">
            <span className="text-sm font-medium text-slate-700">정규식 패턴</span>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">플래그 (gimsuy)</span>
            <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </label>
        </div>
        <label className="block mt-4">
          <span className="text-sm font-medium text-slate-700">테스트 문자열</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        {result.error ? (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">패턴 오류: {result.error}</div>
        ) : (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-sm font-semibold text-slate-700 mb-2">매칭 결과 ({result.matches.length}개)</div>
            {result.matches.length === 0 ? (
              <div className="text-sm text-slate-500 py-3">매칭되는 결과 없음</div>
            ) : (
              <div className="space-y-2">
                {result.matches.map((m, i) => (
                  <div key={i} className="rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs text-emerald-400">
                    [{m.index}] {m.match}
                    {m.groups.length > 0 && <span className="text-amber-400 ml-2">groups: [{m.groups.join(", ")}]</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
