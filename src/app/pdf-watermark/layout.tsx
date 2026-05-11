import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 워터마크 (무료) — calai",
  description: "PDF에 텍스트 워터마크를 무료로 추가. 한글·영문 지원, 위치·투명도·회전 조정.",
  openGraph: {
    title: "PDF 워터마크 (무료) | calai",
    description: "PDF에 텍스트 워터마크를 무료로 추가. 한글·영문 지원.",
    url: "https://calai.kr/pdf-watermark",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/pdf-watermark" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 워터마크 (무료)",
  description: "PDF에 텍스트 워터마크 무료 추가. 한글·영문 지원.",
  url: "https://calai.kr/pdf-watermark",
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
