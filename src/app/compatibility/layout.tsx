import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "궁합 계산기 — calai",
  description: "두 사람 생년월일 → 동·서양 궁합 자동 분석.",
  openGraph: {
    title: "궁합 계산기 | calai",
    description: "두 사람 생년월일 → 동·서양 궁합 자동 분석.",
    url: "https://calai.kr/compatibility",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/compatibility" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "궁합 계산기",
  description: "두 사람 생년월일 → 동·서양 궁합 자동 분석.",
  url: "https://calai.kr/compatibility",
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
