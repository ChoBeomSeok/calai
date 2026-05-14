import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프리랜서 3.3% 원천징수 + 종합소득세 추정",
  description: "프리랜서·작가·강사의 연 수익으로 원천징수 3.3%와 다음해 5월 종합소득세 예상액을 즉시 산출. 5월 신고 전 대비용.",
  openGraph: {
    title: "3.3% 원천 + 종소세 추정",
    description: "프리랜서 연 수익으로 원천징수와 종합소득세 동시 추정.",
    url: "https://calai.kr/freelancer-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "3.3% 원천 + 종소세 추정",
    description: "프리랜서 연 수익으로 원천징수와 종합소득세 동시 추정.",
  },
  alternates: { canonical: "https://calai.kr/freelancer-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "프리랜서 3.3% 원천징수",
  "description": "프리랜서·작가·강사의 연 수익으로 원천징수 3.3%와 다음해 5월 종합소득세 예상액을 즉시 산출. 5월 신고 전 대비용.",
  "url": "https://calai.kr/freelancer-tax",
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
