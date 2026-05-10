import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LTV·DTI 계산기 — calai",
  description: "주택가·소득·기존 대출로 LTV·DTI·DSR 한도.",
  openGraph: {
    title: "LTV·DTI 계산기 | calai",
    description: "주택가·소득·기존 대출로 LTV·DTI·DSR 한도.",
    url: "https://calai.kr/ltv-dti",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/ltv-dti" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "LTV·DTI 계산기",
  description: "주택가·소득·기존 대출로 LTV·DTI·DSR 한도.",
  url: "https://calai.kr/ltv-dti",
  applicationCategory: "BusinessApplication",
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
