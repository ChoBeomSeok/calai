// 블로그 글 메타데이터 + 본문 인덱스
// 각 글은 별도 .ts 파일로 분리해 정성스러운 톤·구조 유지

import { post as yangdoseStory } from "./yangdose-story";
import { post as salaryParadox } from "./salary-paradox";
import { post as cheongyakFriend } from "./cheongyak-friend-65";
import { post as jeonseRiskLetter } from "./jeonse-risk-letter";
import { post as unemploymentDiary } from "./unemployment-diary";
import { post as ageConfusion } from "./age-confusion";
import { post as acquisitionTaxBudget } from "./acquisition-tax-budget";
import { post as giftTaxParents } from "./gift-tax-parents";
import { post as carTaxAnnual } from "./car-tax-annual";
import { post as savingsPungcha } from "./savings-pungcha";
import { post as jongbuseMultiHouse } from "./jongbuse-multi-house";
import { post as weddingCostReal } from "./wedding-cost-real";
import { post as childCost2Years } from "./child-cost-2years";
import { post as annualLeave2027 } from "./annual-leave-2027";
import { post as ltvDtiLoan } from "./ltv-dti-loan";
import { post as severance7Years } from "./severance-7years";
import { post as coinPl2Years } from "./coin-pl-2years";
import { post as bmiCheckup } from "./bmi-checkup";
import { post as propertyTaxDetail } from "./property-tax-detail";
import { post as inflation30Years } from "./inflation-30years";
// 2026-05-15 신규
import { post as incomeTaxD15 } from "./income-tax-d15";
import { post as freelancerRefund5Years } from "./freelancer-refund-5years";
import { post as sidehustleTaxAunt } from "./sidehustle-tax-aunt";
import { post as propertyTaxInstallment } from "./property-tax-installment";
import { post as annualLeaveResignation } from "./annual-leave-resignation";
import { post as summerVacationPayQna } from "./summer-vacation-pay-qna";
import { post as capitalGains1House } from "./capital-gains-1house-12conditions";
import { post as jeonseExplainParents } from "./jeonse-explain-to-parents";
import { post as cheongyak3Way } from "./cheongyak-3way-compare";
import { post as businessVsFreelancer } from "./business-vs-freelancer-timeline";
import { post as pdfMergeSites } from "./pdf-merge-sites-compare";
import { post as nukkiSites } from "./nukki-sites-compare";

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
  // 2026-05-15 신규 (최상단 노출)
  incomeTaxD15,
  freelancerRefund5Years,
  sidehustleTaxAunt,
  propertyTaxInstallment,
  annualLeaveResignation,
  summerVacationPayQna,
  capitalGains1House,
  jeonseExplainParents,
  cheongyak3Way,
  businessVsFreelancer,
  pdfMergeSites,
  nukkiSites,
  // 기존
  yangdoseStory,
  salaryParadox,
  cheongyakFriend,
  jeonseRiskLetter,
  unemploymentDiary,
  ageConfusion,
  acquisitionTaxBudget,
  giftTaxParents,
  carTaxAnnual,
  savingsPungcha,
  jongbuseMultiHouse,
  weddingCostReal,
  childCost2Years,
  annualLeave2027,
  ltvDtiLoan,
  severance7Years,
  coinPl2Years,
  bmiCheckup,
  propertyTaxDetail,
  inflation30Years,
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

/** 특정 도구 슬러그와 연결된 글 — toolLinks 메타데이터 기준 */
export function getPostsForTool(toolSlug: string, limit = 3): Post[] {
  return POSTS.filter((p) => p.toolLinks?.some((l) => l.slug === toolSlug)).slice(0, limit);
}
