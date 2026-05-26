import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "종합소득세 계산기, 누진세율 적용 즉시 산출",
  description: "사업·근로·이자·배당 등 합산 종합소득을 넣으면 6~45% 누진세율 구간별 세액을 자동 산출. 5월 신고 전 예상 세액 점검.",
  openGraph: {
    title: "종합소득세 — 누진 자동 계산",
    description: "종합소득 입력으로 6~45% 누진세율 적용 세액 즉시.",
    url: "https://www.calai.kr/income-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "종합소득세 — 누진 자동 계산",
    description: "종합소득 입력으로 6~45% 누진세율 적용 세액 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/income-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "종합소득세 계산기",
  "description": "사업·근로·이자·배당 등 합산 종합소득을 넣으면 6~45% 누진세율 구간별 세액을 자동 산출. 5월 신고 전 예상 세액 점검.",
  "url": "https://www.calai.kr/income-tax",
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
