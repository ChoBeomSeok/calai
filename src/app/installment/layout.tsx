import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "신용카드 할부 계산기, 월 청구액·총 수수료까지",
  description: "할부 원금·개월수·수수료율을 넣으면 매월 청구되는 금액과 누적 수수료가 즉시. 무이자 할부와의 차액 비교에 유용.",
  openGraph: {
    title: "카드 할부 — 월 청구·수수료",
    description: "원금·개월·수수료율로 매월 청구액과 총 수수료 자동.",
    url: "https://calai.kr/installment",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "카드 할부 — 월 청구·수수료",
    description: "원금·개월·수수료율로 매월 청구액과 총 수수료 자동.",
  },
  alternates: { canonical: "https://calai.kr/installment" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "신용카드 할부 계산기",
  "description": "할부 원금·개월수·수수료율을 넣으면 매월 청구되는 금액과 누적 수수료가 즉시. 무이자 할부와의 차액 비교에 유용.",
  "url": "https://calai.kr/installment",
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
