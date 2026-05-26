import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "적금 만기 계산기, 만기 수령액·세후 실수령까지",
  description: "월 적립액·금리·기간을 넣으면 만기 수령액과 이자소득세 15.4% 차감 실수령액이 한 번에. 단리·복리 동시 비교.",
  openGraph: {
    title: "적금 만기 — 세후 실수령 즉시",
    description: "월 적립액·금리·기간으로 만기 수령액과 세후 실수령 자동.",
    url: "https://www.calai.kr/savings",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "적금 만기 — 세후 실수령 즉시",
    description: "월 적립액·금리·기간으로 만기 수령액과 세후 실수령 자동.",
  },
  alternates: { canonical: "https://www.calai.kr/savings" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "적금 만기 계산기",
  "description": "월 적립액·금리·기간을 넣으면 만기 수령액과 이자소득세 15.4% 차감 실수령액이 한 번에. 단리·복리 동시 비교.",
  "url": "https://www.calai.kr/savings",
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
