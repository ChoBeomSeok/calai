import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 분할 (무료) — calai",
  description: "PDF를 페이지 단위로 무료 분할. 전체 분할 또는 범위 지정. 가입·워터마크 없음.",
  openGraph: {
    title: "PDF 분할 (무료) | calai",
    description: "PDF를 페이지 단위로 무료 분할. 전체 분할 또는 범위 지정.",
    url: "https://calai.kr/pdf-split",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/pdf-split" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 분할 (무료)",
  description: "PDF를 페이지 단위로 무료 분할. 전체 분할 또는 범위 지정.",
  url: "https://calai.kr/pdf-split",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
