"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { tools, type Tool } from "@/lib/tools";
import { useFavorites, useRecent } from "@/lib/useFavorites";
import ToolGuide from "./ToolGuide";

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
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      <div className="mt-8">{children}</div>

      <ToolGuide title={title} />

      <aside className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">관련 도구</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {related.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.slug}
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-indigo-400 hover:shadow-sm transition-all"
            >
              <div className="text-xl mb-1">{tool.icon}</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                {tool.shortTitle}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{tool.category}</div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
