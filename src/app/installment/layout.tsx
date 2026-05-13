import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "신용카드 할부 계산기 — calai",
  description: "할부 원금·개월·수수료율로 월 청구액·총 수수료.",
  openGraph: {
    title: "신용카드 할부 계산기 | calai",
    description: "할부 원금·개월·수수료율로 월 청구액·총 수수료.",
    url: "https://calai.kr/installment",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/installment" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "신용카드 할부 계산기",
  description: "할부 원금·개월·수수료율로 월 청구액·총 수수료.",
  url: "https://calai.kr/installment",
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
