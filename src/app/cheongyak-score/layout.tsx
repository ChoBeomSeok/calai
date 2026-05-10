import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "청약 가점 계산기 — calai",
  description: "무주택·부양가족·청약통장 기간으로 청약 가점 자동.",
  openGraph: {
    title: "청약 가점 계산기 | calai",
    description: "무주택·부양가족·청약통장 기간으로 청약 가점 자동.",
    url: "https://calai.kr/cheongyak-score",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/cheongyak-score" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "청약 가점 계산기",
  description: "무주택·부양가족·청약통장 기간으로 청약 가점 자동.",
  url: "https://calai.kr/cheongyak-score",
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
