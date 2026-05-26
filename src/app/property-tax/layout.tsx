import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "재산세 계산기, 공시가격으로 재산세 + 도시지역분",
  description: "주택 공시가격을 넣으면 재산세 본세, 도시지역분, 지방교육세를 합한 연 재산세 총액이 즉시. 세 부담 미리 가늠하기.",
  openGraph: {
    title: "재산세 — 공시가격 한 줄로",
    description: "공시가격 입력만으로 재산세·도시분·지방교육세 합계 자동.",
    url: "https://www.calai.kr/property-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "재산세 — 공시가격 한 줄로",
    description: "공시가격 입력만으로 재산세·도시분·지방교육세 합계 자동.",
  },
  alternates: { canonical: "https://www.calai.kr/property-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "재산세 계산기",
  "description": "주택 공시가격을 넣으면 재산세 본세, 도시지역분, 지방교육세를 합한 연 재산세 총액이 즉시. 세 부담 미리 가늠하기.",
  "url": "https://www.calai.kr/property-tax",
  "applicationCategory": "FinanceApplication",
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
