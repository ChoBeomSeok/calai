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
  const canonical = page === 1 ? "https://calai.kr/blog" : `https://calai.kr/blog?page=${page}`;
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

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">블로그</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
        세금·부동산·실업급여 같은 한국 사용자가 실제로 겪는 상황을 직접 정리한 글입니다. 광고성 일반론 대신 실수담·체크리스트·시점별 의사결정 위주로 씁니다.
      </p>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
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
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:border-indigo-400 hover:shadow-sm transition-all"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(post.publishedAt).toLocaleDateString("ko-KR")} · {post.readingTime}분
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {post.description}
                </p>
                {post.toolLinks && post.toolLinks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.toolLinks.map((t) => (
                      <span
                        key={t.slug}
                        className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
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
