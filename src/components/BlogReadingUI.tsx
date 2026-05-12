"use client";

import { useState, useEffect } from "react";
import type { Heading } from "@/lib/blogRender";

export default function BlogReadingUI({ headings }: { headings: Heading[] }) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));

      // 현재 active 헤딩: 화면 상단 100px 기준 가장 가까운 것
      const offset = scrollY + 120;
      let current = "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.offsetTop <= offset) {
          current = h.id;
        }
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  return (
    <>
      {/* 진행 바 — sticky header(56px) 바로 아래 */}
      <div className="fixed top-14 left-0 right-0 z-40 h-0.5 bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-indigo-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 데스크탑 sticky TOC (xl 이상) — article 바깥 우측 고정 */}
      <aside
        className="hidden xl:block fixed top-24 max-h-[70vh] overflow-y-auto w-56"
        style={{ left: "calc(50% + 24rem + 24px)" }}
        aria-label="목차"
      >
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          📑 목차
        </div>
        <ul className="space-y-0.5">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
              <a
                href={`#${h.id}`}
                className={`block text-sm leading-snug py-1.5 border-l-2 pl-3 transition ${
                  activeId === h.id
                    ? "border-indigo-500 text-indigo-700 dark:text-indigo-400 font-semibold"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-400"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
