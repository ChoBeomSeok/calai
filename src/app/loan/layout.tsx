import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대출 이자 계산기 — calai",
  description: "원리금 균등·원금 균등·만기 일시 3가지 방식.",
  openGraph: {
    title: "대출 이자 계산기 | calai",
    description: "원리금 균등·원금 균등·만기 일시 3가지 방식.",
    url: "https://calai.kr/loan",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/loan" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "대출 이자 계산기",
  description: "원리금 균등·원금 균등·만기 일시 3가지 방식.",
  url: "https://calai.kr/loan",
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
