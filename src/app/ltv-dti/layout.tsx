import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LTV·DTI·DSR 계산기, 대출 한도 한 화면에",
  description: "주택가·소득·기존 대출을 넣으면 LTV·DTI·DSR 세 가지 규제 비율과 가능한 최대 대출 한도를 한 번에 산출.",
  openGraph: {
    title: "LTV·DTI·DSR — 대출 한도",
    description: "주택가·소득·기존 대출로 세 규제 비율과 최대 한도 동시.",
    url: "https://calai.kr/ltv-dti",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "LTV·DTI·DSR — 대출 한도",
    description: "주택가·소득·기존 대출로 세 규제 비율과 최대 한도 동시.",
  },
  alternates: { canonical: "https://calai.kr/ltv-dti" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "LTV·DTI 계산기",
  "description": "주택가·소득·기존 대출을 넣으면 LTV·DTI·DSR 세 가지 규제 비율과 가능한 최대 대출 한도를 한 번에 산출.",
  "url": "https://calai.kr/ltv-dti",
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
