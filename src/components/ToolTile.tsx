import type { Tool } from "@/lib/tools";
import { colorFor } from "@/lib/categoryColors";
import { iconFor } from "@/lib/toolIcons";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: string; icon: string }> = {
  sm: { box: "w-9 h-9 rounded-lg", icon: "w-[18px] h-[18px]" },
  md: { box: "w-11 h-11 rounded-xl", icon: "w-[22px] h-[22px]" },
  lg: { box: "w-14 h-14 rounded-2xl", icon: "w-7 h-7" },
};

type Props = {
  tool: Tool;
  size?: Size;
  /** 부모에 group 클래스가 있으면 hover 시 진한 카테고리 색으로 flip */
  hover?: boolean;
};

export default function ToolTile({ tool, size = "md", hover = false }: Props) {
  const c = colorFor(tool.category);
  const Icon = iconFor(tool.slug);
  const s = SIZES[size];
  const hoverClasses = hover ? `${c.iconBgHover} ${c.iconTextHover} group-hover:scale-105` : "";
  return (
    <div className={`inline-flex items-center justify-center ${s.box} ${c.iconBg} ${c.iconText} ${hoverClasses} transition-all duration-200`}>
      <Icon className={s.icon} strokeWidth={1.8} />
    </div>
  );
}
