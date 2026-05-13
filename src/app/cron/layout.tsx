import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron 표현식 해석기 — calai",
  description: "Cron 표현식(0 9 * * 1) → 한국어 해석 + 다음 5회 실행 시간 미리보기. 5필드 표준 지원.",
  openGraph: {
    title: "Cron 표현식 해석기 | calai",
    description: "Cron 표현식 → 한국어 해석 + 다음 5회 실행 시간 미리보기.",
    url: "https://calai.kr/cron",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/cron" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cron 표현식 해석기",
  description: "Cron 표현식 한국어 해석 + 다음 실행 시간 미리보기.",
  url: "https://calai.kr/cron",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
