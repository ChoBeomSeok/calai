import type { Tool } from "@/lib/tools";

type Props = {
  category: Tool["category"];
  className?: string;
};

/**
 * 카테고리별 추상 일러스트. 도구 페이지 hero 우측에 배치.
 * 디자인 원칙: 단일 톤 (slate + indigo accent) + 기하학적 도형 1~2개.
 * 시각적 디테일을 살짝 채우되 산만하지 않게.
 */
const ART: Record<Tool["category"], React.ReactNode> = {
  // 심전도 라인 + 작은 점
  건강: (
    <>
      <path d="M10 60 L40 60 L48 35 L62 88 L74 50 L82 65 L110 65" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="35" r="2.5" fill="currentColor" />
      <circle cx="74" cy="50" r="2" fill="currentColor" opacity="0.4" />
    </>
  ),
  // 동전 3개 스택 + 증가 화살표
  금융: (
    <>
      <ellipse cx="40" cy="80" rx="22" ry="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="40" cy="68" rx="22" ry="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="40" cy="56" rx="22" ry="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M75 60 L95 40 L95 50 M95 40 L85 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </>
  ),
  // 집 + 격자
  부동산: (
    <>
      <path d="M25 50 L55 25 L85 50 L85 85 L25 85 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M45 85 L45 65 L65 65 L65 85" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="100" y1="60" x2="115" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="100" y1="70" x2="115" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="100" y1="80" x2="115" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    </>
  ),
  // 자동차 옆모습
  자동차: (
    <>
      <path d="M15 65 L25 50 L75 50 L90 65 L100 65 L100 78 L15 78 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="32" cy="78" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="78" cy="78" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M28 50 L34 60 L66 60 L72 50" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    </>
  ),
  // 영수증 + 퍼센트
  세금: (
    <>
      <path d="M40 20 L80 20 L80 90 L72 84 L65 90 L58 84 L51 90 L44 84 L40 90 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <line x1="50" y1="38" x2="70" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="50" y1="52" x2="70" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="50" y1="66" x2="64" y2="66" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="95" cy="40" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="92" y1="55" x2="105" y2="35" stroke="currentColor" strokeWidth="2" />
      <circle cx="102" cy="52" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  // 시계 + 작은 별
  일상: (
    <>
      <circle cx="55" cy="55" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M55 38 L55 55 L70 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="55" cy="55" r="2.5" fill="currentColor" />
      <path d="M100 30 L102 36 L108 38 L102 40 L100 46 L98 40 L92 38 L98 36 Z" fill="currentColor" opacity="0.4" />
    </>
  ),
  // 코드 브래킷 + 점들
  개발자: (
    <>
      <path d="M35 30 L20 55 L35 80" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M75 30 L90 55 L75 80" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="50" y1="30" x2="60" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    </>
  ),
  // 비행기 아크
  여행: (
    <>
      <path d="M15 80 Q55 20 110 50" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 4" opacity="0.5" />
      <path d="M75 35 L98 48 L88 52 L92 65 L86 65 L80 53 L70 56 Z" fill="currentColor" />
      <circle cx="15" cy="80" r="3" fill="currentColor" opacity="0.5" />
    </>
  ),
  // 두 하트 + 작은 별
  라이프: (
    <>
      <path d="M30 50 Q22 42 30 35 Q38 35 42 42 Q46 35 54 35 Q62 42 54 50 L42 65 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M70 60 Q63 53 70 47 Q77 47 80 53 Q83 47 90 47 Q97 53 90 60 L80 73 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.5" />
      <path d="M95 30 L96 33 L99 34 L96 35 L95 38 L94 35 L91 34 L94 33 Z" fill="currentColor" opacity="0.4" />
    </>
  ),
  // 겹친 문서
  문서: (
    <>
      <path d="M25 25 L65 25 L80 40 L80 85 L25 85 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M65 25 L65 40 L80 40" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="35" y1="55" x2="68" y2="55" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="35" y1="65" x2="68" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="35" y1="75" x2="58" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M88 38 L102 38 L102 88 L48 88 L48 82" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.35" />
    </>
  ),
  // 풍경 프레임 + 해
  이미지: (
    <>
      <rect x="18" y="22" width="80" height="64" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="38" cy="42" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M22 78 L48 55 L62 67 L78 50 L94 78" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    </>
  ),
};

export default function CategoryArt({ category, className = "w-32 h-24" }: Props) {
  const art = ART[category];
  if (!art) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 120 100"
      fill="none"
      stroke="none"
      aria-hidden="true"
    >
      {art}
    </svg>
  );
}
