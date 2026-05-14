import Link from "next/link";
import { getPostsForTool } from "@/lib/posts";

type Props = {
  toolSlug: string;
};

export default function RelatedPosts({ toolSlug }: Props) {
  const posts = getPostsForTool(toolSlug, 3);
  if (posts.length === 0) return null;

  return (
    <aside className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
      <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-indigo-600 dark:text-indigo-400 mb-5" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
        관련 읽을거리
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all"
          >
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                {post.category}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                {post.readingTime}분 읽기
              </span>
            </div>
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {post.title}
            </h3>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
