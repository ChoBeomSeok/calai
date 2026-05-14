import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "72의 법칙, 자산이 2배 되는 기간 즉시 계산",
  description: "현재 금리(연이율)만 넣으면 72의 법칙으로 자산이 2배로 불어나는 데 걸리는 햇수를 즉시 산출. 복리 투자의 직관적 계산.",
  openGraph: {
    title: "72의 법칙 — 자산 2배 기간",
    description: "연이율만 넣으면 자산이 2배 되는 햇수 즉시.",
    url: "https://calai.kr/rule-of-72",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "72의 법칙 — 자산 2배 기간",
    description: "연이율만 넣으면 자산이 2배 되는 햇수 즉시.",
  },
  alternates: { canonical: "https://calai.kr/rule-of-72" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "72의 법칙 계산기",
  "description": "현재 금리(연이율)만 넣으면 72의 법칙으로 자산이 2배로 불어나는 데 걸리는 햇수를 즉시 산출. 복리 투자의 직관적 계산.",
  "url": "https://calai.kr/rule-of-72",
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
