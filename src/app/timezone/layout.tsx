import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "세계 시간 변환기, 한국↔뉴욕·런던·도쿄 즉시",
  description: "한국 기준 시각을 넣으면 뉴욕·런던·도쿄·LA 등 주요 도시의 현지 시각이 즉시. 화상회의·해외 출장 일정 잡을 때.",
  openGraph: {
    title: "세계 시간 — 주요 도시 동시",
    description: "한국 시각 기준 뉴욕·런던·도쿄 주요 도시 시차 한 번에.",
    url: "https://www.calai.kr/timezone",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "세계 시간 — 주요 도시 동시",
    description: "한국 시각 기준 뉴욕·런던·도쿄 주요 도시 시차 한 번에.",
  },
  alternates: { canonical: "https://www.calai.kr/timezone" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "세계 시간 변환기",
  "description": "한국 기준 시각을 넣으면 뉴욕·런던·도쿄·LA 등 주요 도시의 현지 시각이 즉시. 화상회의·해외 출장 일정 잡을 때.",
  "url": "https://www.calai.kr/timezone",
  "applicationCategory": "UtilitiesApplication",
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
