import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "취득세 계산기, 매매가·면적·주택수 즉시 반영",
  description: "매매가·전용면적·1주택/다주택 여부로 취득세율과 농어촌특별세·지방교육세까지 합산한 실 부담액 자동 산출.",
  openGraph: {
    title: "취득세 — 부속세까지 합산",
    description: "매매가·면적·주택수 반영해 취득세 + 부속세 실 부담액 자동.",
    url: "https://calai.kr/acquisition-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "취득세 — 부속세까지 합산",
    description: "매매가·면적·주택수 반영해 취득세 + 부속세 실 부담액 자동.",
  },
  alternates: { canonical: "https://calai.kr/acquisition-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "취득세 계산기",
  "description": "매매가·전용면적·1주택/다주택 여부로 취득세율과 농어촌특별세·지방교육세까지 합산한 실 부담액 자동 산출.",
  "url": "https://calai.kr/acquisition-tax",
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
