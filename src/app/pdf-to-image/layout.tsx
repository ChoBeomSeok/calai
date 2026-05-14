import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF → JPG·PNG 이미지, 화질 선택 무료 변환",
  description: "PDF의 각 페이지를 JPG·PNG 이미지로 무료 변환. 화질·DPI 선택 가능, 브라우저 안에서만 처리되어 외부 전송 0.",
  openGraph: {
    title: "PDF → 이미지 — 화질 선택",
    description: "PDF 페이지를 JPG·PNG로 무료 변환, 화질·DPI 선택.",
    url: "https://calai.kr/pdf-to-image",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF → 이미지 — 화질 선택",
    description: "PDF 페이지를 JPG·PNG로 무료 변환, 화질·DPI 선택.",
  },
  alternates: { canonical: "https://calai.kr/pdf-to-image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF → 이미지",
  "description": "PDF의 각 페이지를 JPG·PNG 이미지로 무료 변환. 화질·DPI 선택 가능, 브라우저 안에서만 처리되어 외부 전송 0.",
  "url": "https://calai.kr/pdf-to-image",
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
