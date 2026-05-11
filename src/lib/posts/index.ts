// 블로그 글 메타데이터 + 본문 인덱스
// 각 글은 별도 .ts 파일로 분리해 정성스러운 톤·구조 유지

import { post as yangdoseStory } from "./yangdose-story";
import { post as salaryParadox } from "./salary-paradox";
import { post as cheongyakFriend } from "./cheongyak-friend-65";
import { post as jeonseRiskLetter } from "./jeonse-risk-letter";
import { post as unemploymentDiary } from "./unemployment-diary";

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  publishedAt: string; // ISO date
  updatedAt?: string;
  readingTime: number; // 분
  toolLinks?: { slug: string; label: string }[]; // 연결된 도구
  content: string; // Markdown
};

export const POSTS: Post[] = [
  yangdoseStory,
  salaryParadox,
  cheongyakFriend,
  jeonseRiskLetter,
  unemploymentDiary,
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getRecentPosts(limit = 10): Post[] {
  return [...POSTS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export function getPostsByCategory(category: string): Post[] {
  return POSTS.filter((p) => p.category === category);
}
