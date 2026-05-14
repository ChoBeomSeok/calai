import Link from "next/link";
import { tools } from "@/lib/tools";

const POPULAR = [
  "/pdf-merge", "/pdf-compress", "/age", "/salary",
  "/capital-gains", "/markdown", "/remove-background", "/cron",
];

export default function Footer() {
  const popularTools = POPULAR
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
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
              <span className="inline-flex items-baseline text-[18px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
                cal<span className="text-indigo-600 dark:text-indigo-400">ai</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              한국어 도구·계산기 {tools.length}개. 가입·로그인 없이 브라우저에서.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 mb-4">자주 쓰는 도구</div>
            <ul className="space-y-2.5">
              {popularTools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.slug}
                    className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
                  >
                    {t.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 mb-4">서비스</div>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">홈</Link></li>
              <li><Link href="/#tools" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">전체 도구</Link></li>
              <li><Link href="/blog" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">블로그</Link></li>
              <li><Link href="/about" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">소개</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 mb-4">정책</div>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">개인정보 처리방침</Link></li>
              <li><Link href="/terms" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">이용약관</Link></li>
              <li><Link href="/contact" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">문의</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-slate-400 dark:text-slate-500">
          <div>© {new Date().getFullYear()} calai</div>
          <div>계산 결과는 참고용입니다. 세무·금융·의료 결정은 전문가 상담을 권장합니다.</div>
        </div>
      </div>
    </footer>
  );
}
