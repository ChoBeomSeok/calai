"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { tools, type Tool } from "@/lib/tools";
import { useFavorites, useRecent } from "@/lib/useFavorites";
import ToolGuide from "./ToolGuide";
import HowToSteps from "./HowToSteps";
import CategoryIcon from "./CategoryIcon";
import ToolTile from "./ToolTile";
import { colorFor } from "@/lib/categoryColors";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function getRelatedTools(currentTitle: string): Tool[] {
  const current = tools.find((t) => t.title === currentTitle);
  if (!current) return tools.slice(0, 6);
  const same = tools.filter((t) => t.category === current.category && t.title !== currentTitle).slice(0, 5);
  const others = tools.filter((t) => t.category !== current.category).slice(0, 6 - same.length);
  return [...same, ...others];
}

export default function CalculatorLayout({ title, description, children }: Props) {
  const related = getRelatedTools(title);
  const [copied, setCopied] = useState(false);
  const { isFav, toggle, hydrated } = useFavorites();
  const { track } = useRecent();
  const current = tools.find((t) => t.title === title);

  useEffect(() => {
    if (current) track(current.slug);
  }, [current, track]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${title} | calai`, url });
        return;
      } catch {}
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const fav = current ? isFav(current.slug) : false;

  // Breadcrumb JSON-LD (홈 > 카테고리 > 도구)
  const breadcrumbJsonLd = current ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://calai.kr" },
      { "@type": "ListItem", position: 2, name: current.category, item: `https://calai.kr/?cat=${encodeURIComponent(current.category)}` },
      { "@type": "ListItem", position: 3, name: title, item: `https://calai.kr${current.slug}` },
    ],
  } : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {/* Breadcrumb 화면 표시 */}
      {current && (
        <nav className="mb-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5" aria-label="이동 경로">
          <Link href="/" className="hover:text-indigo-600 transition">홈</Link>
          <span>›</span>
          <span className="text-slate-700 dark:text-slate-300">{current.category}</span>
          <span>›</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">{current.shortTitle}</span>
        </nav>
      )}
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
          ← 모든 도구
        </Link>
        <div className="flex items-center gap-2">
          {current && hydrated && (
            <button
              onClick={() => toggle(current.slug)}
              className={`text-xs px-2.5 py-1.5 rounded-md transition ${fav ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950" : "text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              title={fav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              {fav ? "★ 즐겨찾기" : "☆ 즐겨찾기"}
            </button>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            title="이 도구 공유하기"
          >
            {copied ? "✓ URL 복사됨" : "📤 공유"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 sm:gap-10 items-start">
        <div>
          {current && (
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-indigo-600 dark:text-indigo-400 mb-4" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
              <CategoryIcon category={current.category} className="w-3.5 h-3.5" />
              {current.category}
            </div>
          )}
          <h1
            className="text-[34px] sm:text-[46px] tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]"
            style={{ fontFamily: "var(--font-playfair), var(--font-roboto), 'Noto Sans KR', 'Pretendard', serif", fontWeight: 900 }}
          >
            {title}
          </h1>
          <p className="mt-5 text-[16px] sm:text-[18px] text-slate-600 dark:text-slate-400 leading-[1.75] max-w-prose"
             style={{ fontFamily: "var(--font-roboto), 'Noto Sans KR', 'Pretendard', sans-serif" }}>
            {description}
          </p>
        </div>
        {current && (
          <div className="hidden sm:block group">
            <ToolTile tool={current} size="lg" hover />
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.057 5.65 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zm3.707 7.066a1 1 0 00-1.414-1.413L9 10.836 7.707 9.543a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          100% 브라우저 처리
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          가입·로그인 불필요
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          영구 무료·워터마크 없음
        </span>
      </div>
      <div className="mt-8">{children}</div>

      {current && <HowToSteps category={current.category} />}

      <ToolGuide title={title} />

      <aside className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
        <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-indigo-600 dark:text-indigo-400 mb-5" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
          관련 도구
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {related.map((tool) => {
            const c = colorFor(tool.category);
            return (
              <Link
                key={tool.slug}
                href={tool.slug}
                className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 hover:-translate-y-0.5 hover:shadow-lg ${c.borderHover} transition-all duration-200`}
              >
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                <div className="relative mb-2.5">
                  <ToolTile tool={tool} size="sm" hover />
                </div>
                <div className="relative text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {tool.shortTitle}
                </div>
                <div className="relative text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{tool.category}</div>
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
