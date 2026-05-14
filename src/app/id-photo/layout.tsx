import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "증명사진 만들기, 여권·이력서·민증 9종 규격 자동",
  description: "여권·이력서·민증·비자 등 한국 9종 규격으로 사진을 자동 크롭. 배경색 변경, 300 DPI 인쇄 품질, 브라우저 안에서.",
  openGraph: {
    title: "증명사진 — 한국 9종 규격",
    description: "여권·이력서·민증·비자 9종 자동 크롭 + 배경색 + 300DPI.",
    url: "https://calai.kr/id-photo",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "증명사진 — 한국 9종 규격",
    description: "여권·이력서·민증·비자 9종 자동 크롭 + 배경색 + 300DPI.",
  },
  alternates: { canonical: "https://calai.kr/id-photo" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "증명사진 만들기",
  "description": "여권·이력서·민증·비자 등 한국 9종 규격으로 사진을 자동 크롭. 배경색 변경, 300 DPI 인쇄 품질, 브라우저 안에서.",
  "url": "https://calai.kr/id-photo",
  "applicationCategory": "MultimediaApplication",
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
