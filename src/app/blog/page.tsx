import type { Metadata } from "next";
import Link from "next/link";
import { getRecentPosts } from "@/lib/posts";

const PER_PAGE = 5;

type SP = Promise<{ page?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1") || 1;
  const canonical = page === 1 ? "https://www.calai.kr/blog" : `https://www.calai.kr/blog?page=${page}`;
  const titleSuffix = page === 1 ? "" : ` (${page}페이지)`;
  return {
    title: `블로그${titleSuffix} — 실제 경험에서 정리한 세금·부동산 가이드 | calai`,
    description:
      "양도세·청약·전세사기·실업급여 등 한국 사용자가 실제로 겪는 상황을 직접 정리한 글. 광고·일반론 X, 실수담·체크리스트 위주.",
    openGraph: {
      title: `calai 블로그${titleSuffix} — 실제 경험 가이드`,
      description: "양도세·청약·전세사기·실업급여 실수담과 체크리스트.",
      url: canonical,
      siteName: "calai",
      locale: "ko_KR",
      type: "website",
    },
    alternates: { canonical },
  };
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const linkFor = (p: number) => (p === 1 ? "/blog" : `/blog?page=${p}`);
  const baseBtn =
    "min-w-9 h-9 px-3 inline-flex items-center justify-center rounded-lg text-sm border transition";
  const inactive =
    "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600";
  const active =
    "border-indigo-600 bg-indigo-600 text-white font-semibold";
  const disabled =
    "border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed";

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="페이지 네비게이션"
    >
      {currentPage > 1 ? (
        <Link
          href={linkFor(currentPage - 1)}
          className={`${baseBtn} ${inactive}`}
          aria-label="이전 페이지"
        >
          ← 이전
        </Link>
      ) : (
        <span className={`${baseBtn} ${disabled}`} aria-disabled="true">← 이전</span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={linkFor(p)}
          className={`${baseBtn} ${p === currentPage ? active : inactive}`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={linkFor(currentPage + 1)}
          className={`${baseBtn} ${inactive}`}
          aria-label="다음 페이지"
        >
          다음 →
        </Link>
      ) : (
        <span className={`${baseBtn} ${disabled}`} aria-disabled="true">다음 →</span>
      )}
    </nav>
  );
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { page: pageStr } = await searchParams;
  const all = getRecentPosts(200);
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const requested = parseInt(pageStr || "1") || 1;
  const currentPage = Math.max(1, Math.min(totalPages, requested));
  const start = (currentPage - 1) * PER_PAGE;
  const posts = all.slice(start, start + PER_PAGE);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Link href="/" className="hover:text-indigo-600 transition">홈</Link>
        <span>›</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">블로그</span>
      </nav>

      <h1
        className="text-[28px] sm:text-[34px] text-stone-700 dark:text-stone-100 leading-[1.35]"
        style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), 'Apple SD Gothic Neo', sans-serif", fontWeight: 600, letterSpacing: "-0.015em" }}
      >
        블로그
      </h1>
      <p className="mt-3 text-[15.5px] text-stone-600 dark:text-stone-300 leading-[1.75] max-w-prose"
         style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif", letterSpacing: "-0.01em", wordBreak: "keep-all" }}>
        세금·부동산·실업급여 같은 한국 사용자가 실제로 겪는 상황을 직접 정리한 글입니다. 광고성 일반론 대신 실수담·체크리스트·시점별 의사결정 위주로 씁니다.
      </p>
      <div className="mt-3 text-[12.5px] text-stone-500 dark:text-stone-400 tabular-nums" style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif" }}>
        총 {all.length}개 글 · {currentPage} / {totalPages} 페이지
      </div>

      <div className="mt-10 space-y-6">
        {posts.length === 0 ? (
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-8 text-center text-slate-500">
            글이 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="group border-b border-slate-200 dark:border-slate-800 pb-8 last:border-b-0"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-2 mb-3 text-[12px] text-stone-500 dark:text-stone-400 tabular-nums" style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif" }}>
                  <time>{new Date(post.publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</time>
                  <span className="text-stone-300 dark:text-stone-700">/</span>
                  <span>{post.category}</span>
                </div>
                <h2
                  className="text-[18.5px] sm:text-[20px] text-stone-700 dark:text-stone-100 leading-[1.5] group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors"
                  style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), 'Apple SD Gothic Neo', sans-serif", fontWeight: 600, letterSpacing: "-0.01em", wordBreak: "keep-all" }}
                >
                  {post.title}
                </h2>
                <p className="mt-2.5 text-[14.5px] text-stone-600 dark:text-stone-300 leading-[1.75] max-w-prose"
                   style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif", letterSpacing: "-0.01em", wordBreak: "keep-all" }}>
                  {post.description}
                </p>
                <div className="mt-3 text-[12px] text-stone-500 dark:text-stone-400" style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif" }}>
                  {post.readingTime}분 분량
                </div>
                {post.toolLinks && post.toolLinks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.toolLinks.map((t) => (
                      <span
                        key={t.slug}
                        className="text-[11.5px] px-2 py-0.5 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700"
                        style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif" }}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
