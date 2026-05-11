import type { Metadata } from "next";
import Link from "next/link";
import { getRecentPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "블로그 — 실제 경험에서 정리한 세금·부동산 가이드 | calai",
  description: "양도세·청약·전세사기·실업급여 등 한국 사용자가 실제로 겪는 상황을 직접 정리한 글. 광고·일반론 X, 실수담·체크리스트 위주.",
  openGraph: {
    title: "calai 블로그 — 실제 경험 가이드",
    description: "양도세·청약·전세사기·실업급여 실수담과 체크리스트.",
    url: "https://calai.kr/blog",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/blog" },
};

export default function BlogIndexPage() {
  const posts = getRecentPosts(50);

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
    </div>
  );
}
