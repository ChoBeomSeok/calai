import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "배란일 계산기, 가임기까지 한 달치 자동 표시",
  description: "마지막 생리일과 주기를 넣으면 배란일과 가임기(가임 가능성 높은 5일)를 달력 형태로 자동 표시. 임신 준비·피임 계획에.",
  openGraph: {
    title: "배란일 — 가임기 5일 한눈에",
    description: "생리 주기로 배란일·가임기 자동, 달력 형태로 확인.",
    url: "https://calai.kr/ovulation",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "배란일 — 가임기 5일 한눈에",
    description: "생리 주기로 배란일·가임기 자동, 달력 형태로 확인.",
  },
  alternates: { canonical: "https://calai.kr/ovulation" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "배란일 계산기",
  "description": "마지막 생리일과 주기를 넣으면 배란일과 가임기(가임 가능성 높은 5일)를 달력 형태로 자동 표시. 임신 준비·피임 계획에.",
  "url": "https://calai.kr/ovulation",
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
