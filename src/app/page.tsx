"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { tools, type Tool } from "@/lib/tools";
import { useFavorites, useRecent } from "@/lib/useFavorites";
import CategoryIcon from "@/components/CategoryIcon";
import ToolTile from "@/components/ToolTile";
import SearchBox from "@/components/SearchBox";
import { colorFor } from "@/lib/categoryColors";

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s·.,\-_/()]+/g, "");
}

function matches(tool: Tool, q: string): boolean {
  if (!q) return true;
  const needle = normalize(q);
  if (!needle) return true;
  const haystack = normalize(tool.title + tool.shortTitle + tool.description + tool.category);
  return haystack.includes(needle);
}

const CATEGORY_ORDER: Tool["category"][] = [
  "문서", "이미지", "개발자", "부동산", "금융", "세금", "자동차", "건강", "라이프", "일상", "여행",
];

// 인기/대표 도구 — 첫 화면에 큰 카드로 노출
const FEATURED_SLUGS = [
  "/pdf-merge",
  "/remove-background",
  "/age",
  "/salary",
  "/capital-gains",
  "/cron",
  "/bmi",
  "/markdown",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Tool["category"] | null>(null);
  const { favorites, hydrated: favHydrated, isFav, toggle } = useFavorites();
  const { recent, hydrated: recentHydrated } = useRecent();

  const filtered = useMemo(() => {
    return tools.filter((t) => matches(t, query) && (!activeCat || t.category === activeCat));
  }, [query, activeCat]);

  const categories = useMemo(() => {
    const present = new Set(filtered.map((t) => t.category));
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    for (const c of present) {
      if (!ordered.includes(c)) ordered.push(c);
    }
    return ordered;
  }, [filtered]);

  const featured = useMemo(
    () => FEATURED_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter((t): t is Tool => !!t),
    [],
  );

  const favTools = favorites.map((slug) => tools.find((t) => t.slug === slug)).filter((t): t is Tool => !!t);
  const recentTools = recent.map((slug) => tools.find((t) => t.slug === slug)).filter((t): t is Tool => !!t);

  const showFeatured = !query && !activeCat;

  return (
    <div>
      {/* ── 히어로 ── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40"
          style={{
            background:
              "radial-gradient(45% 60% at 15% 10%, rgba(99, 102, 241, 0.10) 0%, transparent 70%), radial-gradient(40% 50% at 90% 100%, rgba(244, 114, 182, 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-14 sm:pb-20">
          <h1
            className="text-[40px] sm:text-[56px] tracking-tight text-slate-900 dark:text-slate-100 leading-[1.08]"
            style={{ fontFamily: "var(--font-playfair), var(--font-roboto), 'Noto Sans KR', 'Pretendard', serif", fontWeight: 800 }}
          >
            한국에서 가장 빠른
            <br />
            도구·계산기 {tools.length}개,
            <br />
            <span className="text-slate-500 dark:text-slate-400">브라우저 안에서.</span>
          </h1>
          <p className="mt-6 text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 leading-[1.7] max-w-lg">
            PDF·세금·실업급여·만 나이·SQL 포매터까지. 입력값은 서버로 전송되지 않습니다.
          </p>

          <div className="mt-10">
            <SearchBox query={query} onQueryChange={setQuery} resultCount={filtered.length} />
          </div>
        </div>
      </section>

      {/* ── 카테고리 칩 ── */}
      <section className="sticky top-14 z-30 bg-white/85 dark:bg-slate-950/85 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCat(null)}
            className={`shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${
              !activeCat
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
            }`}
          >
            전체 {tools.length}
          </button>
          {CATEGORY_ORDER.map((cat) => {
            const count = tools.filter((t) => t.category === cat).length;
            if (count === 0) return null;
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(active ? null : cat)}
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${
                  active
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                }`}
              >
                <CategoryIcon category={cat} className="w-3.5 h-3.5" />
                {cat} <span className="opacity-60 tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 본문 ── */}
      <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* 인기 도구 — featured */}
        {showFeatured && featured.length > 0 && (
          <div className="mb-16">
            <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              자주 찾는 도구
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((tool) => (
                <FeaturedCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* 즐겨찾기 */}
        {favHydrated && favTools.length > 0 && !query && !activeCat && (
          <div className="mb-14">
            <h2 className="text-[11px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-[0.22em] mb-5 flex items-center gap-2">
              <span>★</span> 즐겨찾기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} fav onToggleFav={() => toggle(tool.slug)} />
              ))}
            </div>
          </div>
        )}

        {/* 최근 사용 */}
        {recentHydrated && recentTools.length > 0 && !query && !activeCat && (
          <div className="mb-14">
            <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.22em] mb-5 flex items-center gap-2">
              최근 사용
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTools.slice(0, 3).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} fav={isFav(tool.slug)} onToggleFav={() => toggle(tool.slug)} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && query ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-lg">검색 결과가 없습니다</div>
            <button onClick={() => setQuery("")} className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
              전체 도구 보기
            </button>
          </div>
        ) : (
          categories.map((cat) => {
            const items = filtered.filter((t) => t.category === cat);
            return (
              <div key={cat} className="mb-16 last:mb-0">
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {cat}
                  </h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} fav={isFav(tool.slug)} onToggleFav={() => toggle(tool.slug)} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

function FeaturedCard({ tool }: { tool: Tool }) {
  const c = colorFor(tool.category);
  return (
    <Link
      href={tool.slug}
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:-translate-y-1 hover:shadow-xl ${c.borderHover} transition-all duration-200`}
    >
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      <div className="relative mb-4">
        <ToolTile tool={tool} size="sm" hover />
      </div>
      <div className="relative text-[14px] font-semibold text-slate-900 dark:text-slate-100 leading-snug">
        {tool.shortTitle}
      </div>
      <div className="relative text-[11px] text-slate-500 dark:text-slate-500 mt-1">{tool.category}</div>
    </Link>
  );
}

function ToolCard({ tool, fav, onToggleFav }: { tool: Tool; fav: boolean; onToggleFav: () => void }) {
  const c = colorFor(tool.category);
  return (
    <div className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:-translate-y-1 hover:shadow-xl ${c.borderHover} transition-all duration-200`}>
      <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(); }}
        className={`absolute top-4 right-4 text-base leading-none transition z-10 ${fav ? "text-amber-500" : "text-slate-300 dark:text-slate-700 hover:text-amber-500"}`}
        aria-label="즐겨찾기"
      >
        {fav ? "★" : "☆"}
      </button>
      <Link href={tool.slug} className="relative block p-5">
        <div className="mb-4">
          <ToolTile tool={tool} hover />
        </div>
        <h3 className="font-semibold text-[14.5px] text-slate-900 dark:text-slate-100 leading-snug pr-6 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {tool.title}
        </h3>
        <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{tool.description}</p>
      </Link>
    </div>
  );
}
