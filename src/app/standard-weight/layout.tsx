import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "표준 체중 계산기, 키·성별로 적정 체중 즉시",
  description: "키·성별만 입력하면 브로카·로러 공식으로 표준 체중과 적정 범위를 자동 산출. 현재 체중과 비교한 비만도도 함께 표시.",
  openGraph: {
    title: "표준 체중 — 키·성별로 적정 범위",
    description: "브로카·로러 공식 표준 체중 + 비만도 비교까지 한 번에.",
    url: "https://www.calai.kr/standard-weight",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "표준 체중 — 키·성별로 적정 범위",
    description: "브로카·로러 공식 표준 체중 + 비만도 비교까지 한 번에.",
  },
  alternates: { canonical: "https://www.calai.kr/standard-weight" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "표준 체중 계산기",
  "description": "키·성별만 입력하면 브로카·로러 공식으로 표준 체중과 적정 범위를 자동 산출. 현재 체중과 비교한 비만도도 함께 표시.",
  "url": "https://www.calai.kr/standard-weight",
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
