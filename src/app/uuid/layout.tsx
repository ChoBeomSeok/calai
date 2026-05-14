import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID 생성기, v4 1~100개 일괄 즉시",
  description: "표준 UUID v4를 한 번에 1~100개까지 일괄 생성. 복사 버튼 한 번으로 모두 클립보드, 임시 키·테스트 데이터에.",
  openGraph: {
    title: "UUID v4 — 1~100개 일괄",
    description: "UUID v4 표준 형식으로 한 번에 100개까지 일괄 생성.",
    url: "https://calai.kr/uuid",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID v4 — 1~100개 일괄",
    description: "UUID v4 표준 형식으로 한 번에 100개까지 일괄 생성.",
  },
  alternates: { canonical: "https://calai.kr/uuid" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "UUID 생성기",
  "description": "표준 UUID v4를 한 번에 1~100개까지 일괄 생성. 복사 버튼 한 번으로 모두 클립보드, 임시 키·테스트 데이터에.",
  "url": "https://calai.kr/uuid",
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
