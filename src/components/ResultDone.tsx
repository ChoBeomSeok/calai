"use client";

import Link from "next/link";
import { tools, type Tool } from "@/lib/tools";

type Stat = { label: string; value: string };

type Props = {
  title?: string;
  url: string;
  filename: string;
  stats?: Stat[];
  currentSlug: string;
  onReset: () => void;
};

function relatedFor(slug: string): Tool[] {
  const current = tools.find((t) => t.slug === slug);
  if (!current) return tools.slice(0, 3);
  const same = tools.filter((t) => t.category === current.category && t.slug !== slug).slice(0, 3);
  if (same.length === 3) return same;
  const others = tools.filter((t) => t.category !== current.category && t.slug !== slug).slice(0, 3 - same.length);
  return [...same, ...others];
}

export default function ResultDone({ title = "처리가 완료되었습니다", url, filename, stats, currentSlug, onReset }: Props) {
  const related = relatedFor(currentSlug);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-sm text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mb-5">
        <svg className="w-9 h-9 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">파일은 서버로 전송되지 않았습니다.</p>

      {stats && stats.length > 0 && (
        <div className="mb-6 inline-flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {stats.map((s, i) => (
            <div key={i} className="flex items-baseline gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto">
        <a
          href={url}
          download={filename}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          다운로드
        </a>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          다시 시작
        </button>
      </div>

      {related.length > 0 && (
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700 text-left">
          <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-indigo-600 dark:text-indigo-400 mb-4 text-center">
            다음으로 해보세요
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={t.slug}
                className="group bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 hover:border-indigo-400 hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-1.5">{t.icon}</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition truncate">{t.shortTitle}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-snug">{t.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
