import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron 표현식 해석기, 한국어 + 다음 5회 실행 시간",
  description: "Cron 표현식(0 9 * * 1)을 한국어로 풀어 설명 + 다음 5회 실행 시간을 미리보기. 5필드 표준(분·시·일·월·요일) 지원.",
  openGraph: {
    title: "Cron 해석 — 한국어 + 미리보기",
    description: "Cron 식을 한국어로 풀고 다음 5회 실행 시간 미리보기.",
    url: "https://calai.kr/cron",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cron 해석 — 한국어 + 미리보기",
    description: "Cron 식을 한국어로 풀고 다음 5회 실행 시간 미리보기.",
  },
  alternates: { canonical: "https://calai.kr/cron" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Cron 표현식 해석기",
  "description": "Cron 표현식(0 9 * * 1)을 한국어로 풀어 설명 + 다음 5회 실행 시간을 미리보기. 5필드 표준(분·시·일·월·요일) 지원.",
  "url": "https://calai.kr/cron",
  "applicationCategory": "DeveloperApplication",
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
