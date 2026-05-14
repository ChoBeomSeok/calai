import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부가가치세 계산기, 공급가↔부가세↔합계 양방향",
  description: "공급가액·부가세·합계금액 중 아무 값이나 넣으면 나머지가 즉시 채워집니다. 사업자 견적·세금계산서 작성 시 빠르게.",
  openGraph: {
    title: "부가세 — 10% 양방향 변환",
    description: "공급가↔부가세↔합계 어느 값이든 입력하면 나머지 자동.",
    url: "https://calai.kr/vat",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "부가세 — 10% 양방향 변환",
    description: "공급가↔부가세↔합계 어느 값이든 입력하면 나머지 자동.",
  },
  alternates: { canonical: "https://calai.kr/vat" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "부가가치세 계산기",
  "description": "공급가액·부가세·합계금액 중 아무 값이나 넣으면 나머지가 즉시 채워집니다. 사업자 견적·세금계산서 작성 시 빠르게.",
  "url": "https://calai.kr/vat",
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
