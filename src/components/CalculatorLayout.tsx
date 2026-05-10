"use client";

import Link from "next/link";
import { useState } from "react";
import { tools, type Tool } from "@/lib/tools";

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

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${title} | calai`, url });
        return;
      } catch {
        // 사용자 취소 시
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          ← 모든 도구
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-100"
          title="이 도구 공유하기"
        >
          {copied ? "✓ URL 복사됨" : "📤 공유"}
        </button>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-slate-600 leading-relaxed">{description}</p>
      <div className="mt-8">{children}</div>

      <aside className="mt-16 pt-10 border-t border-slate-200">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          관련 도구
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {related.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.slug}
              className="group bg-white border border-slate-200 rounded-lg p-3 hover:border-indigo-400 hover:shadow-sm transition-all"
            >
              <div className="text-xl mb-1">{tool.icon}</div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {tool.shortTitle}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tool.category}</div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
