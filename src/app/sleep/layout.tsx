import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "수면 시간 계산기, 기상 시간에서 거꾸로 90분 사이클",
  description: "기상하고 싶은 시간을 넣으면 90분 수면 사이클 기준 추천 취침 시간 4~5개를 자동 제시. 가벼운 기상에 도움.",
  openGraph: {
    title: "수면 사이클 — 90분 단위 추천",
    description: "기상 시간 기준 90분 사이클로 취침 시간 자동 추천.",
    url: "https://www.calai.kr/sleep",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "수면 사이클 — 90분 단위 추천",
    description: "기상 시간 기준 90분 사이클로 취침 시간 자동 추천.",
  },
  alternates: { canonical: "https://www.calai.kr/sleep" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "수면 시간 계산기",
  "description": "기상하고 싶은 시간을 넣으면 90분 수면 사이클 기준 추천 취침 시간 4~5개를 자동 제시. 가벼운 기상에 도움.",
  "url": "https://www.calai.kr/sleep",
  "applicationCategory": "HealthApplication",
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
