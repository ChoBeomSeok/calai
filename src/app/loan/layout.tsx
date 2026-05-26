import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대출 이자 계산기, 원리금·원금·만기 일시 3가지 비교",
  description: "대출 원금·이율·기간을 넣으면 원리금 균등·원금 균등·만기 일시 3가지 방식의 월 상환액과 총 이자를 한 화면에서 비교.",
  openGraph: {
    title: "대출 이자 — 3가지 상환 방식 비교",
    description: "원리금·원금·만기 일시 방식의 월 상환액·총 이자 동시 비교.",
    url: "https://www.calai.kr/loan",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "대출 이자 — 3가지 상환 방식 비교",
    description: "원리금·원금·만기 일시 방식의 월 상환액·총 이자 동시 비교.",
  },
  alternates: { canonical: "https://www.calai.kr/loan" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "대출 이자 계산기",
  "description": "대출 원금·이율·기간을 넣으면 원리금 균등·원금 균등·만기 일시 3가지 방식의 월 상환액과 총 이자를 한 화면에서 비교.",
  "url": "https://www.calai.kr/loan",
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
