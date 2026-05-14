import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "해외 송금 수수료 비교, 은행·서비스별 실 부담액",
  description: "송금액·통화·은행/송금 서비스(와이즈·페이오니아 등)별 수수료와 환율 우대를 반영한 실 부담액을 한 표에서 비교.",
  openGraph: {
    title: "해외 송금 — 은행·서비스 비교",
    description: "수수료 + 환율 우대 반영 실 부담액을 서비스별 한 표 비교.",
    url: "https://calai.kr/remit-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "해외 송금 — 은행·서비스 비교",
    description: "수수료 + 환율 우대 반영 실 부담액을 서비스별 한 표 비교.",
  },
  alternates: { canonical: "https://calai.kr/remit-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "외환 송금 수수료",
  "description": "송금액·통화·은행/송금 서비스(와이즈·페이오니아 등)별 수수료와 환율 우대를 반영한 실 부담액을 한 표에서 비교.",
  "url": "https://calai.kr/remit-fee",
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
