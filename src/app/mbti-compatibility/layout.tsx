import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTI 궁합 — calai",
  description: "두 MBTI → 16×16 궁합 매트릭스 + 관계 팁.",
  openGraph: {
    title: "MBTI 궁합 | calai",
    description: "두 MBTI → 16×16 궁합 매트릭스 + 관계 팁.",
    url: "https://calai.kr/mbti-compatibility",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/mbti-compatibility" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MBTI 궁합",
  description: "두 MBTI → 16×16 궁합 매트릭스 + 관계 팁.",
  url: "https://calai.kr/mbti-compatibility",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
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
