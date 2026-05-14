import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "인플레이션 환산, 과거 100만원의 현재·미래 가치",
  description: "특정 연도의 금액을 현재 화폐 가치로 환산하거나, 현재 자산의 미래 가치를 인플레이션 반영해 추정. 자산 계획에 필수.",
  openGraph: {
    title: "인플레이션 — 과거·미래 가치",
    description: "과거 금액의 현재가치·현재 자산의 미래가치 동시 환산.",
    url: "https://calai.kr/inflation",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "인플레이션 — 과거·미래 가치",
    description: "과거 금액의 현재가치·현재 자산의 미래가치 동시 환산.",
  },
  alternates: { canonical: "https://calai.kr/inflation" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "인플레이션 환산",
  "description": "특정 연도의 금액을 현재 화폐 가치로 환산하거나, 현재 자산의 미래 가치를 인플레이션 반영해 추정. 자산 계획에 필수.",
  "url": "https://calai.kr/inflation",
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
