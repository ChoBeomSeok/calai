import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "증여세 계산기, 관계별 공제·누진 한 번에",
  description: "증여재산·증여자와의 관계별 공제(배우자·자녀·직계존속 등)를 자동 반영해 증여세 누진세액을 즉시 산출.",
  openGraph: {
    title: "증여세 — 관계별 공제 자동",
    description: "증여재산·관계별 공제 반영해 증여세 누진세액 즉시.",
    url: "https://www.calai.kr/gift-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "증여세 — 관계별 공제 자동",
    description: "증여재산·관계별 공제 반영해 증여세 누진세액 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/gift-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "증여세 계산기",
  "description": "증여재산·증여자와의 관계별 공제(배우자·자녀·직계존속 등)를 자동 반영해 증여세 누진세액을 즉시 산출.",
  "url": "https://www.calai.kr/gift-tax",
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
