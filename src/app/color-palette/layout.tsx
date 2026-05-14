import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "컬러 팔레트 생성기, 보색·유사·삼각·사각 자동 5색",
  description: "기준 색 하나만 넣으면 보색·유사·삼각·사각 4가지 조화 규칙으로 5색 팔레트 자동 생성. 디자인 시안 시작점에.",
  openGraph: {
    title: "컬러 팔레트 — 4규칙 자동",
    description: "기준 색 하나로 보색·유사·삼각·사각 5색 팔레트 자동.",
    url: "https://calai.kr/color-palette",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "컬러 팔레트 — 4규칙 자동",
    description: "기준 색 하나로 보색·유사·삼각·사각 5색 팔레트 자동.",
  },
  alternates: { canonical: "https://calai.kr/color-palette" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "컬러 팔레트 생성기",
  "description": "기준 색 하나만 넣으면 보색·유사·삼각·사각 4가지 조화 규칙으로 5색 팔레트 자동 생성. 디자인 시안 시작점에.",
  "url": "https://calai.kr/color-palette",
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
