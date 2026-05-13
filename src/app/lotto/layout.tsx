import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 번호 생성기 — calai",
  description: "로또 6/45 자동 번호 생성 + 보너스 번호 + 통계 기반 패턴.",
  openGraph: {
    title: "로또 번호 생성기 | calai",
    description: "로또 6/45 자동 번호 생성 + 보너스 번호 + 통계 기반 패턴.",
    url: "https://calai.kr/lotto",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/lotto" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "로또 번호 생성기",
  description: "로또 6/45 자동 번호 생성 + 보너스 번호 + 통계 기반 패턴.",
  url: "https://calai.kr/lotto",
  applicationCategory: "UtilitiesApplication",
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
