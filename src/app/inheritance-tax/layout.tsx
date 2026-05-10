import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상속세 계산기 — calai",
  description: "상속재산·상속인 수로 상속세 누진 계산.",
  openGraph: {
    title: "상속세 계산기 | calai",
    description: "상속재산·상속인 수로 상속세 누진 계산.",
    url: "https://calai.kr/inheritance-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/inheritance-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "상속세 계산기",
  description: "상속재산·상속인 수로 상속세 누진 계산.",
  url: "https://calai.kr/inheritance-tax",
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
