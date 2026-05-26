import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 워터마크, 텍스트·위치·투명도 무료 추가",
  description: "PDF 전체 페이지에 텍스트 워터마크를 무료로 추가. 위치(대각선·중앙·모서리)와 투명도·색상·크기 자유롭게 설정.",
  openGraph: {
    title: "PDF 워터마크 — 자유 설정",
    description: "PDF에 텍스트 워터마크 자유 위치·투명도로 무료 추가.",
    url: "https://www.calai.kr/pdf-watermark",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 워터마크 — 자유 설정",
    description: "PDF에 텍스트 워터마크 자유 위치·투명도로 무료 추가.",
  },
  alternates: { canonical: "https://www.calai.kr/pdf-watermark" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 워터마크",
  "description": "PDF 전체 페이지에 텍스트 워터마크를 무료로 추가. 위치(대각선·중앙·모서리)와 투명도·색상·크기 자유롭게 설정.",
  "url": "https://www.calai.kr/pdf-watermark",
  "applicationCategory": "BusinessApplication",
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
