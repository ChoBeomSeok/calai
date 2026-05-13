import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/posts";
import { tools } from "@/lib/tools";
import { renderPost } from "@/lib/blogRender";
import BlogReadingUI from "@/components/BlogReadingUI";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "글 없음 | calai" };
  return {
    title: `${post.title} | calai`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://calai.kr/blog/${post.slug}`,
      siteName: "calai",
      locale: "ko_KR",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    alternates: { canonical: `https://calai.kr/blog/${post.slug}` },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { html, headings } = await renderPost(post.content);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: "https://calai.kr/opengraph-image",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: "calai", url: "https://calai.kr" },
    publisher: {
      "@type": "Organization",
      name: "calai",
      logo: { "@type": "ImageObject", url: "https://calai.kr/icon.svg" },
    },
    mainEntityOfPage: `https://calai.kr/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://calai.kr" },
      { "@type": "ListItem", position: 2, name: "블로그", item: "https://calai.kr/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://calai.kr/blog/${post.slug}` },
    ],
  };

  const relatedTools = post.toolLinks
    ?.map((t) => tools.find((tool) => tool.slug === t.slug))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="mb-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Link href="/" className="hover:text-indigo-600 transition">홈</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-indigo-600 transition">블로그</Link>
        <span>›</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium truncate">{post.title}</span>
      </nav>

      <div className="text-[12px] text-stone-500 dark:text-stone-400 mb-3" style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif" }}>
        {post.category}
      </div>

      <h1
        className="text-[26px] sm:text-[32px] text-stone-700 dark:text-stone-100 leading-[1.45]"
        style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), 'Apple SD Gothic Neo', sans-serif", fontWeight: 600, letterSpacing: "-0.015em", wordBreak: "keep-all" }}
      >
        {post.title}
      </h1>
      <p className="mt-4 text-[15.5px] sm:text-[16.5px] text-stone-600 dark:text-stone-300 leading-[1.75] max-w-prose"
         style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif", letterSpacing: "-0.01em", wordBreak: "keep-all" }}>
        {post.description}
      </p>
      <div className="mt-5 flex items-center gap-2 text-[12.5px] text-stone-500 dark:text-stone-400" style={{ fontFamily: "Pretendard, var(--font-noto-sans-kr), sans-serif" }}>
        <time className="tabular-nums">{new Date(post.publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</time>
        <span className="text-stone-300 dark:text-stone-700">·</span>
        <span>{post.readingTime}분 분량</span>
        {post.updatedAt && post.updatedAt !== post.publishedAt && (
          <>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-emerald-700 dark:text-emerald-400">업데이트 {new Date(post.updatedAt).toLocaleDateString("ko-KR")}</span>
          </>
        )}
      </div>

      {/* 진행 바 + 데스크탑 sticky TOC (xl 이상) */}
      <BlogReadingUI headings={headings} />

      {/* 모바일·태블릿 접이식 TOC (xl 미만) */}
      {headings.length > 2 && (
        <details className="xl:hidden mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 select-none">
            📑 목차 ({headings.length})
          </summary>
          <ul className="px-4 pb-4 space-y-1.5">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                <a
                  href={`#${h.id}`}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div
        className="markdown-preview blog-article mt-10 pt-10 border-t border-slate-200 dark:border-slate-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* 관련 도구 */}
      {relatedTools && relatedTools.length > 0 && (
        <aside className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            글에서 언급한 도구
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.slug}
                className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-indigo-400 hover:shadow-sm transition-all"
              >
                <div className="text-xl mb-1">{tool.icon}</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
                  {tool.shortTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tool.category}</div>
              </Link>
            ))}
          </div>
        </aside>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-block text-sm text-indigo-600 hover:underline"
        >
          ← 블로그 목록으로
        </Link>
      </div>
    </article>
  );
}
