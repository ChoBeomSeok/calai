"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { tools, type Tool } from "@/lib/tools";

// 공백·특수기호 제거 + 소문자 정규화 — 띄어쓰기·기호 무관 매칭
function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s·.,\-_/()]+/g, "");
}

function matches(tool: Tool, q: string): boolean {
  if (!q) return true;
  const needle = normalize(q);
  if (!needle) return true;
  const haystack = normalize(
    tool.title + tool.shortTitle + tool.description + tool.category
  );
  return haystack.includes(needle);
}

export default function Home() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => tools.filter((t) => matches(t, query)), [query]);
  const categories = useMemo(
    () => Array.from(new Set(filtered.map((t) => t.category))),
    [filtered]
  );

  return (
    <div>
      {/* Hero with search */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            한국에서 가장 빠른
            <br />
            <span className="text-indigo-600">도구·계산기</span>
          </h1>

          <div className="mt-8 sm:mt-10 relative max-w-xl mx-auto">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="찾는 계산기를 검색 (예: 만 나이, 대출, 양도세)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition shadow-sm"
              autoFocus
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition flex items-center justify-center"
                aria-label="검색 초기화"
              >
                ×
              </button>
            )}
          </div>
          {query && (
            <div className="mt-3 text-sm text-slate-500">
              {filtered.length === 0
                ? `\"${query}\"에 맞는 도구가 없습니다`
                : `${filtered.length}개 도구 매칭됨`}
            </div>
          )}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {filtered.length === 0 && query ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-lg">검색 결과가 없습니다</div>
            <button
              onClick={() => setQuery("")}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
            >
              전체 도구 보기
            </button>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mb-10 last:mb-0">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered
                  .filter((t) => t.category === cat)
                  .map((tool) => (
                    <Link
                      key={tool.slug}
                      href={tool.slug}
                      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all"
                    >
                      <div className="text-3xl mb-3">{tool.icon}</div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-600 leading-snug">
                        {tool.description}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
