import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "카운트다운 타이머 — calai",
  description: "원하는 시간 설정 → 0초 카운트다운 + 알림.",
  openGraph: {
    title: "카운트다운 타이머 | calai",
    description: "원하는 시간 설정 → 0초 카운트다운 + 알림.",
    url: "https://calai.kr/countdown",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/countdown" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "카운트다운 타이머",
  description: "원하는 시간 설정 → 0초 카운트다운 + 알림.",
  url: "https://calai.kr/countdown",
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
