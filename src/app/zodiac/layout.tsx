import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "띠·별자리 계산기 — calai",
  description: "생년월일로 띠 + 12별자리 + 혈액형 궁합.",
  openGraph: {
    title: "띠·별자리 계산기 | calai",
    description: "생년월일로 띠 + 12별자리 + 혈액형 궁합.",
    url: "https://calai.kr/zodiac",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/zodiac" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "띠·별자리 계산기",
  description: "생년월일로 띠 + 12별자리 + 혈액형 궁합.",
  url: "https://calai.kr/zodiac",
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
