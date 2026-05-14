import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고속도로 통행료 계산기, 출발·도착 IC 차종별",
  description: "출발·도착 IC와 차종(1~5종)을 넣으면 예상 통행료가 즉시. 서울→부산 같은 장거리 여행 전 예산 가늠에 유용.",
  openGraph: {
    title: "고속도로 통행료 — IC·차종별",
    description: "출발·도착 IC + 차종으로 통행료 즉시, 장거리 여행 예산용.",
    url: "https://calai.kr/toll-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "고속도로 통행료 — IC·차종별",
    description: "출발·도착 IC + 차종으로 통행료 즉시, 장거리 여행 예산용.",
  },
  alternates: { canonical: "https://calai.kr/toll-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "고속도로 톨비 계산",
  "description": "출발·도착 IC와 차종(1~5종)을 넣으면 예상 통행료가 즉시. 서울→부산 같은 장거리 여행 전 예산 가늠에 유용.",
  "url": "https://calai.kr/toll-fee",
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
