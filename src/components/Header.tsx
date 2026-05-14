"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import CategoryIcon from "./CategoryIcon";
import { tools, type Tool } from "@/lib/tools";

const CATEGORY_ORDER: Tool["category"][] = [
  "문서", "이미지", "개발자", "부동산", "금융", "세금", "자동차", "건강", "라이프", "일상", "여행",
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const byCategory = CATEGORY_ORDER
    .map((cat) => ({ cat, items: tools.filter((t) => t.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <header className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2"
          aria-label="calai 홈"
        >
          <svg className="w-7 h-7 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#4f46e5" />
            <text
              x="16"
              y="22"
              textAnchor="middle"
              fill="white"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif"
              fontWeight="800"
              fontSize="15"
            >
              c
            </text>
          </svg>
          <span className="inline-flex items-baseline text-[18px] font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            cal<span className="text-indigo-600 dark:text-indigo-400">ai</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:inline">
            홈
          </Link>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-expanded={open}
              aria-haspopup="true"
            >
              도구
              <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {open && (
              <div className="fixed sm:absolute inset-x-0 sm:inset-x-auto sm:right-0 top-14 sm:top-full sm:mt-2 sm:w-[640px] max-h-[calc(100vh-3.5rem)] sm:max-h-[70vh] overflow-y-auto bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-700 sm:rounded-xl shadow-lg p-5 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                  {byCategory.map((g) => (
                    <div key={g.cat}>
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        <CategoryIcon category={g.cat} className="w-3.5 h-3.5" />
                        {g.cat}
                      </div>
                      <ul className="space-y-1">
                        {g.items.map((t) => (
                          <li key={t.slug}>
                            <Link
                              href={t.slug}
                              onClick={() => setOpen(false)}
                              className="block text-[13px] text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate"
                            >
                              {t.shortTitle}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  <Link
                    href="/#tools"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    전체 {tools.length}개 도구 보기 →
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            블로그
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
