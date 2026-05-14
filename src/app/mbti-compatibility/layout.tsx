import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTI 궁합, 16×16 매트릭스 + 관계 팁",
  description: "두 사람의 MBTI를 선택하면 16×16 궁합표 기반 관계 분석과 잘 지내기 위한 구체적 팁이 즉시. 연애·동료 관계용.",
  openGraph: {
    title: "MBTI 궁합 — 16×16 + 관계 팁",
    description: "MBTI 두 개로 16×16 궁합 매트릭스 + 관계 팁.",
    url: "https://calai.kr/mbti-compatibility",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI 궁합 — 16×16 + 관계 팁",
    description: "MBTI 두 개로 16×16 궁합 매트릭스 + 관계 팁.",
  },
  alternates: { canonical: "https://calai.kr/mbti-compatibility" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "MBTI 궁합",
  "description": "두 사람의 MBTI를 선택하면 16×16 궁합표 기반 관계 분석과 잘 지내기 위한 구체적 팁이 즉시. 연애·동료 관계용.",
  "url": "https://calai.kr/mbti-compatibility",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "inLanguage": "ko",
  "isAccessibleForFree": true
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
