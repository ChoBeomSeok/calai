import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부가가치세 계산기 — calai",
  description: "공급가액 ↔ 부가세 ↔ 합계금액 즉시 변환 (10%).",
  openGraph: {
    title: "부가가치세 계산기 | calai",
    description: "공급가액 ↔ 부가세 ↔ 합계금액 즉시 변환 (10%).",
    url: "https://calai.kr/vat",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/vat" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "부가가치세 계산기",
  description: "공급가액 ↔ 부가세 ↔ 합계금액 즉시 변환 (10%).",
  url: "https://calai.kr/vat",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
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
