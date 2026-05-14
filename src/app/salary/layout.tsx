import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기, 4대보험·세금 차감 후 월급",
  description: "연봉만 넣으면 국민연금·건강·고용·산재 4대보험과 소득세·지방세를 차감한 실제 월 실수령액이 즉시. 2026년 기준 반영.",
  openGraph: {
    title: "연봉 실수령액 — 월 손에 쥐는 돈",
    description: "4대보험·세금 차감 후 실제 월 실수령액 즉시 계산.",
    url: "https://calai.kr/salary",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "연봉 실수령액 — 월 손에 쥐는 돈",
    description: "4대보험·세금 차감 후 실제 월 실수령액 즉시 계산.",
  },
  alternates: { canonical: "https://calai.kr/salary" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "연봉 실수령액 계산기",
  "description": "연봉만 넣으면 국민연금·건강·고용·산재 4대보험과 소득세·지방세를 차감한 실제 월 실수령액이 즉시. 2026년 기준 반영.",
  "url": "https://calai.kr/salary",
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
