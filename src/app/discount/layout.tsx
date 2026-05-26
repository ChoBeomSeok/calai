import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "할인율 계산기, 정가·할인가·할인율 양방향",
  description: "정가·할인율·할인가 중 두 값만 넣으면 나머지가 즉시. 쇼핑·세일·가격 비교에서 진짜 할인이 얼마인지 빠르게.",
  openGraph: {
    title: "할인율 — 정가·할인가 양방향",
    description: "정가·할인가·할인율 중 두 값만 넣어도 나머지 자동.",
    url: "https://www.calai.kr/discount",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "할인율 — 정가·할인가 양방향",
    description: "정가·할인가·할인율 중 두 값만 넣어도 나머지 자동.",
  },
  alternates: { canonical: "https://www.calai.kr/discount" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "할인율 계산기",
  "description": "정가·할인율·할인가 중 두 값만 넣으면 나머지가 즉시. 쇼핑·세일·가격 비교에서 진짜 할인이 얼마인지 빠르게.",
  "url": "https://www.calai.kr/discount",
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
