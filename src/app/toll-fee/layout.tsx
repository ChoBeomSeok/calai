import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고속도로 톨비 계산 — calai",
  description: "출발·도착 IC + 차종으로 통행료 추정 (서울→부산 등).",
  openGraph: {
    title: "고속도로 톨비 계산 | calai",
    description: "출발·도착 IC + 차종으로 통행료 추정 (서울→부산 등).",
    url: "https://calai.kr/toll-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/toll-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "고속도로 톨비 계산",
  description: "출발·도착 IC + 차종으로 통행료 추정 (서울→부산 등).",
  url: "https://calai.kr/toll-fee",
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
