import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D-Day 계산기, 두 날짜 차이·N일 후 정확히",
  description: "두 날짜의 차이(일·주·달·년)와 특정 날짜에서 N일 후·전이 어떤 날인지 즉시. 시험·결혼·여행 D-Day 카운팅에.",
  openGraph: {
    title: "D-Day — 두 날짜 차이",
    description: "두 날짜 차이 + N일 후·전 날짜 양방향 즉시 계산.",
    url: "https://www.calai.kr/dday",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "D-Day — 두 날짜 차이",
    description: "두 날짜 차이 + N일 후·전 날짜 양방향 즉시 계산.",
  },
  alternates: { canonical: "https://www.calai.kr/dday" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "D-Day 계산기",
  "description": "두 날짜의 차이(일·주·달·년)와 특정 날짜에서 N일 후·전이 어떤 날인지 즉시. 시험·결혼·여행 D-Day 카운팅에.",
  "url": "https://www.calai.kr/dday",
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
