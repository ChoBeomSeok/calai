import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "코인 손익 계산기, 매수·매도가로 수익률·실현 수익",
  description: "매수가·매도가·수량을 넣으면 손익률(%)과 실현 수익 금액이 즉시. 수수료 반영 옵션으로 더 정확한 손익 확인.",
  openGraph: {
    title: "코인 손익 — 수익률·실현 수익",
    description: "매수·매도가·수량 입력만으로 손익률·실현 수익 자동.",
    url: "https://calai.kr/coin-pl",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "코인 손익 — 수익률·실현 수익",
    description: "매수·매도가·수량 입력만으로 손익률·실현 수익 자동.",
  },
  alternates: { canonical: "https://calai.kr/coin-pl" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "코인 손익 계산기",
  "description": "매수가·매도가·수량을 넣으면 손익률(%)과 실현 수익 금액이 즉시. 수수료 반영 옵션으로 더 정확한 손익 확인.",
  "url": "https://calai.kr/coin-pl",
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
