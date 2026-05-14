import type { Tool } from "./tools";

type CategoryColor = {
  // 평상시 — 옅은 카테고리 톤
  iconBg: string;
  iconText: string;
  // 마우스오버 — 진한 카테고리 색 + 흰 아이콘 (flip)
  iconBgHover: string;
  iconTextHover: string;
  // 카드 호버 시 보더
  borderHover: string;
  // 그라데이션 (히어로·featured 등에 미세 활용)
  glow: string;
};

export const CATEGORY_COLORS: Record<Tool["category"], CategoryColor> = {
  건강: {
    iconBg: "bg-rose-100 dark:bg-rose-950/50",
    iconText: "text-rose-600 dark:text-rose-300",
    iconBgHover: "group-hover:bg-rose-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-rose-300 dark:group-hover:border-rose-800",
    glow: "from-rose-500/15",
  },
  금융: {
    iconBg: "bg-emerald-100 dark:bg-emerald-950/50",
    iconText: "text-emerald-600 dark:text-emerald-300",
    iconBgHover: "group-hover:bg-emerald-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-emerald-300 dark:group-hover:border-emerald-800",
    glow: "from-emerald-500/15",
  },
  부동산: {
    iconBg: "bg-amber-100 dark:bg-amber-950/50",
    iconText: "text-amber-700 dark:text-amber-300",
    iconBgHover: "group-hover:bg-amber-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-amber-300 dark:group-hover:border-amber-800",
    glow: "from-amber-500/15",
  },
  자동차: {
    iconBg: "bg-sky-100 dark:bg-sky-950/50",
    iconText: "text-sky-600 dark:text-sky-300",
    iconBgHover: "group-hover:bg-sky-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-sky-300 dark:group-hover:border-sky-800",
    glow: "from-sky-500/15",
  },
  세금: {
    iconBg: "bg-stone-200 dark:bg-stone-800",
    iconText: "text-stone-700 dark:text-stone-300",
    iconBgHover: "group-hover:bg-stone-700",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-stone-400 dark:group-hover:border-stone-700",
    glow: "from-stone-500/15",
  },
  일상: {
    iconBg: "bg-violet-100 dark:bg-violet-950/50",
    iconText: "text-violet-600 dark:text-violet-300",
    iconBgHover: "group-hover:bg-violet-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-violet-300 dark:group-hover:border-violet-800",
    glow: "from-violet-500/15",
  },
  개발자: {
    iconBg: "bg-indigo-100 dark:bg-indigo-950/50",
    iconText: "text-indigo-600 dark:text-indigo-300",
    iconBgHover: "group-hover:bg-indigo-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-indigo-300 dark:group-hover:border-indigo-800",
    glow: "from-indigo-500/15",
  },
  여행: {
    iconBg: "bg-cyan-100 dark:bg-cyan-950/50",
    iconText: "text-cyan-600 dark:text-cyan-300",
    iconBgHover: "group-hover:bg-cyan-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-cyan-300 dark:group-hover:border-cyan-800",
    glow: "from-cyan-500/15",
  },
  라이프: {
    iconBg: "bg-pink-100 dark:bg-pink-950/50",
    iconText: "text-pink-600 dark:text-pink-300",
    iconBgHover: "group-hover:bg-pink-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-pink-300 dark:group-hover:border-pink-800",
    glow: "from-pink-500/15",
  },
  문서: {
    iconBg: "bg-blue-100 dark:bg-blue-950/50",
    iconText: "text-blue-600 dark:text-blue-300",
    iconBgHover: "group-hover:bg-blue-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-blue-300 dark:group-hover:border-blue-800",
    glow: "from-blue-500/15",
  },
  이미지: {
    iconBg: "bg-teal-100 dark:bg-teal-950/50",
    iconText: "text-teal-600 dark:text-teal-300",
    iconBgHover: "group-hover:bg-teal-500",
    iconTextHover: "group-hover:text-white",
    borderHover: "group-hover:border-teal-300 dark:group-hover:border-teal-800",
    glow: "from-teal-500/15",
  },
};

export function colorFor(category: Tool["category"]): CategoryColor {
  return CATEGORY_COLORS[category];
}
