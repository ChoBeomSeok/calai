import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상속세 계산기, 상속재산·상속인 수 누진까지",
  description: "상속재산·상속인 수·관계별 공제를 반영해 상속세 누진세율(10~50%) 구간별 세액을 자동 산출. 상속 계획 사전 점검용.",
  openGraph: {
    title: "상속세 — 공제·누진 자동",
    description: "상속재산·상속인 수·관계별 공제 반영한 상속세 자동.",
    url: "https://calai.kr/inheritance-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "상속세 — 공제·누진 자동",
    description: "상속재산·상속인 수·관계별 공제 반영한 상속세 자동.",
  },
  alternates: { canonical: "https://calai.kr/inheritance-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "상속세 계산기",
  "description": "상속재산·상속인 수·관계별 공제를 반영해 상속세 누진세율(10~50%) 구간별 세액을 자동 산출. 상속 계획 사전 점검용.",
  "url": "https://calai.kr/inheritance-tax",
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
