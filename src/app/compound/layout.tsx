import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "복리 계산기, 원금·이율·복리 주기로 미래 가치",
  description: "원금·연이율·기간·복리 주기(연·반기·분기·월·일)를 선택하면 시간에 따른 자산 증가 그래프와 미래 가치가 자동 표시.",
  openGraph: {
    title: "복리 — 미래 가치·증가 그래프",
    description: "원금·이율·기간 + 복리 주기 5가지 자동 미래 가치 계산.",
    url: "https://www.calai.kr/compound",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "복리 — 미래 가치·증가 그래프",
    description: "원금·이율·기간 + 복리 주기 5가지 자동 미래 가치 계산.",
  },
  alternates: { canonical: "https://www.calai.kr/compound" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "복리 계산기",
  "description": "원금·연이율·기간·복리 주기(연·반기·분기·월·일)를 선택하면 시간에 따른 자산 증가 그래프와 미래 가치가 자동 표시.",
  "url": "https://www.calai.kr/compound",
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
