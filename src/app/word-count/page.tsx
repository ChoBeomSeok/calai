"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

// 자소서·SNS 글자수 한도 (한국·글로벌 표준)
const LIMITS = [
  { name: "트위터/X", limit: 280, type: "공백포함" },
  { name: "인스타 캡션", limit: 2200, type: "공백포함" },
  { name: "유튜브 제목", limit: 100, type: "공백포함" },
  { name: "유튜브 설명", limit: 5000, type: "공백포함" },
  { name: "네이버 블로그 제목", limit: 100, type: "공백포함" },
  { name: "이력서 자소서 (보통)", limit: 1500, type: "공백포함" },
  { name: "삼성 SDS 자소서", limit: 1000, type: "공백포함" },
  { name: "현대차 자소서", limit: 700, type: "공백포함" },
  { name: "공기업 자소서", limit: 500, type: "공백포함" },
];

function countBytes(text: string, encoding: "utf-8" | "euc-kr"): number {
  if (encoding === "utf-8") {
    return new TextEncoder().encode(text).length;
  }
  // EUC-KR 추정: 한글·한자 2바이트, 그 외 1바이트
  let bytes = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code > 127) bytes += 2;
    else bytes += 1;
  }
  return bytes;
}

function countJamo(text: string): number {
  // 한글 음절을 자모 단위로 분해 (NFD 정규화)
  return [...text.normalize("NFD")].filter((ch) => /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(ch)).length;
}

export default function WordCountPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const noSpaces = text.replace(/\s/g, "");
    const noWhitespace = text.replace(/[\s\n\r\t]/g, "");
    const chars = text.length;
    const charsNoSpaces = noSpaces.length;
    const charsNoWhitespace = noWhitespace.length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const lines = text === "" ? 0 : text.split("\n").length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?。！？]+/).filter((s) => s.trim()).length;
    const bytesUtf8 = countBytes(text, "utf-8");
    const bytesEucKr = countBytes(text, "euc-kr");
    const jamoCount = countJamo(text);

    // 원고지 매수 (200자/400자/600자)
    const manuscript200 = Math.ceil(charsNoWhitespace / 200);
    const manuscript400 = Math.ceil(charsNoWhitespace / 400);
    const manuscript600 = Math.ceil(charsNoWhitespace / 600);

    // 예상 읽기 시간 (한국어 평균 분당 700~900자, 안전하게 700)
    const readingMinutes = Math.ceil(charsNoSpaces / 700);
    // 예상 음성 낭독 시간 (분당 약 400자)
    const speakingMinutes = Math.ceil(charsNoSpaces / 400);

    return {
      chars,
      charsNoSpaces,
      charsNoWhitespace,
      words,
      lines,
      paragraphs,
      sentences,
      bytesUtf8,
      bytesEucKr,
      jamoCount,
      manuscript200,
      manuscript400,
      manuscript600,
      readingMinutes,
      speakingMinutes,
    };
  }, [text]);

  return (
    <CalculatorLayout
      title="글자수 세기 (무료)"
      description="공백 포함·제외, 바이트 수, 원고지 매수, 자소서·SNS 한도까지 실시간 표시. 자소서·논문·블로그 작성 필수 도구."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 글을 입력하거나 붙여넣으세요. 글자수가 실시간으로 카운트됩니다."
          rows={10}
          className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setText("")}
            className="text-xs px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950 transition"
          >
            🗑️ 지우기
          </button>
          <button
            onClick={() => navigator.clipboard.readText().then((t) => setText(t)).catch(() => {})}
            className="text-xs px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
          >
            📋 클립보드에서 붙여넣기
          </button>
        </div>

        {/* 주요 카운트 */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-4 text-center">
              <div className="text-xs text-indigo-700 dark:text-indigo-400 mb-1">전체 (공백 포함)</div>
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{stats.chars.toLocaleString()}</div>
              <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">자</div>
            </div>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-4 text-center">
              <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">공백 제외</div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{stats.charsNoSpaces.toLocaleString()}</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">자</div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">단어 수</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.words.toLocaleString()}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">단어</div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">줄 / 문단</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.lines} / {stats.paragraphs}
              </div>
            </div>
          </div>

          {/* 상세 카운트 */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">바이트 (UTF-8)</div>
              <div className="font-bold">{stats.bytesUtf8.toLocaleString()} byte</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">바이트 (EUC-KR)</div>
              <div className="font-bold">{stats.bytesEucKr.toLocaleString()} byte</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">한글 자모 수</div>
              <div className="font-bold">{stats.jamoCount.toLocaleString()} 자모</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">문장 수</div>
              <div className="font-bold">{stats.sentences.toLocaleString()} 문장</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">예상 읽기 시간</div>
              <div className="font-bold">{stats.readingMinutes} 분</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">예상 낭독 시간</div>
              <div className="font-bold">{stats.speakingMinutes} 분</div>
            </div>
          </div>

          {/* 원고지 매수 */}
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 p-4">
            <div className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">📜 원고지 매수 (공백 제외 기준)</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-amber-700 dark:text-amber-400">200자 원고지</div>
                <div className="font-bold text-amber-900 dark:text-amber-300">{stats.manuscript200} 매</div>
              </div>
              <div>
                <div className="text-xs text-amber-700 dark:text-amber-400">400자 원고지</div>
                <div className="font-bold text-amber-900 dark:text-amber-300">{stats.manuscript400} 매</div>
              </div>
              <div>
                <div className="text-xs text-amber-700 dark:text-amber-400">600자 원고지</div>
                <div className="font-bold text-amber-900 dark:text-amber-300">{stats.manuscript600} 매</div>
              </div>
            </div>
          </div>

          {/* 자소서·SNS 한도 */}
          {stats.chars > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">📊 자소서·SNS 한도 대비</div>
              <div className="space-y-1.5">
                {LIMITS.map((l) => {
                  const pct = (stats.chars / l.limit) * 100;
                  const over = stats.chars > l.limit;
                  return (
                    <div key={l.name} className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {l.name} ({l.limit.toLocaleString()}자)
                        </span>
                        <span className={`text-xs font-bold ${over ? "text-rose-600" : pct > 80 ? "text-amber-600" : "text-emerald-600"}`}>
                          {stats.chars.toLocaleString()} / {l.limit.toLocaleString()} ({pct.toFixed(0)}%)
                          {over && ` · ${(stats.chars - l.limit).toLocaleString()}자 초과`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${over ? "bg-rose-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 무료·안전</strong>: 입력 텍스트가 서버로 전송되지 않습니다. 모든 카운트는 브라우저 안에서 즉시 처리됩니다.
      </div>
    </CalculatorLayout>
  );
}
