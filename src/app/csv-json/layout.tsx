import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV ↔ JSON 변환, 헤더·구분자 자동 인식 양방향",
  description: "CSV ↔ JSON을 양방향 변환. 헤더 자동 인식·구분자 감지·숫자 타입 자동, 미리보기 테이블로 결과를 즉시 확인.",
  openGraph: {
    title: "CSV ↔ JSON — 양방향 자동",
    description: "CSV↔JSON 양방향, 헤더·구분자 자동 인식 + 미리보기.",
    url: "https://calai.kr/csv-json",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV ↔ JSON — 양방향 자동",
    description: "CSV↔JSON 양방향, 헤더·구분자 자동 인식 + 미리보기.",
  },
  alternates: { canonical: "https://calai.kr/csv-json" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CSV ↔ JSON 변환기",
  "description": "CSV ↔ JSON을 양방향 변환. 헤더 자동 인식·구분자 감지·숫자 타입 자동, 미리보기 테이블로 결과를 즉시 확인.",
  "url": "https://calai.kr/csv-json",
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
