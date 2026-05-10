import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "표준 체중 계산기 — calai",
  description: "키·성별 기준 표준 체중 + 비만도 (브로카·로러 공식).",
  openGraph: {
    title: "표준 체중 계산기 | calai",
    description: "키·성별 기준 표준 체중 + 비만도 (브로카·로러 공식).",
    url: "https://calai.kr/standard-weight",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/standard-weight" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "표준 체중 계산기",
  description: "키·성별 기준 표준 체중 + 비만도 (브로카·로러 공식).",
  url: "https://calai.kr/standard-weight",
  applicationCategory: "HealthApplication",
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
