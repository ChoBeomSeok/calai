"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { tools, type Tool } from "@/lib/tools";
import ToolTile from "./ToolTile";

const POPULAR_QUERIES = [
  "만 나이", "PDF 합치기", "양도세", "연봉 실수령", "BMI",
  "누끼", "이미지 리사이즈", "Cron", "청약 가점",
];

const RECENT_KEY = "calai-recent-searches";
const MAX_RECENT = 6;

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s·.,\-_/()]+/g, "");
}

function matches(tool: Tool, q: string): boolean {
  if (!q) return false;
  const needle = normalize(q);
  if (!needle) return false;
  const haystack = normalize(tool.title + tool.shortTitle + tool.description + tool.category);
  return haystack.includes(needle);
}

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  resultCount: number;
};

export default function SearchBox({ query, onQueryChange, resultCount }: Props) {
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // localStorage에서 최근 검색어 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!focused) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [focused]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return tools.filter((t) => matches(t, query)).slice(0, 6);
  }, [query]);

  const persistRecent = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, MAX_RECENT);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setFocused(false);
      (e.target as HTMLInputElement).blur();
      return;
    }
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      const target = suggestions[highlight];
      persistRecent(query);
      window.location.href = target.slug;
    }
  };

  const handleQueryChip = (q: string) => {
    onQueryChange(q);
    persistRecent(q);
    setFocused(false);
  };

  const showDropdown = focused && (suggestions.length > 0 || (query === "" && (recent.length > 0 || POPULAR_QUERIES.length > 0)));

  return (
    <div className="relative max-w-xl" ref={ref}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setHighlight(-1);
        }}
        onFocus={() => setFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder="찾는 계산기를 검색 (예: 만 나이, 대출, 양도세)"
        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-[15px] focus:border-slate-900 dark:focus:border-slate-100 focus:outline-none focus:ring-0 transition"
        autoComplete="off"
      />
      <svg className="absolute left-4 top-[26px] -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      {query && (
        <button onClick={() => onQueryChange("")} className="absolute right-3 top-[26px] -translate-y-1/2 w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 transition flex items-center justify-center" aria-label="검색 초기화">×</button>
      )}

      {query && (
        <div className="mt-3 text-[13px] text-slate-500 dark:text-slate-400">
          {resultCount === 0 ? `"${query}"에 맞는 도구가 없습니다` : `${resultCount}개 도구 매칭됨`}
        </div>
      )}

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {/* 검색어 매칭 */}
          {suggestions.length > 0 && (
            <div className="py-1.5">
              {suggestions.map((tool, i) => (
                <Link
                  key={tool.slug}
                  href={tool.slug}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => persistRecent(query)}
                  className={`flex items-center gap-3 px-4 py-2.5 transition ${
                    highlight === i ? "bg-slate-50 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <ToolTile tool={tool} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {tool.shortTitle}
                    </div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-400 truncate">
                      {tool.category} · {tool.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 검색어 없을 때 — 최근 + 인기 */}
          {!query && (
            <div className="py-2">
              {recent.length > 0 && (
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 dark:text-slate-500">최근 검색</div>
                    <button onClick={clearRecent} className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition">전체 삭제</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recent.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQueryChip(q)}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-4 py-2">
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 dark:text-slate-500 mb-2">인기 검색어</div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_QUERIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQueryChip(q)}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-100 dark:border-slate-800"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
