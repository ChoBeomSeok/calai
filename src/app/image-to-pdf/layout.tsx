import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG·PNG → PDF 변환, 여러 장 한 번에 무료",
  description: "JPG·PNG 여러 장을 하나의 PDF로 무료 변환. 드래그로 순서 조정, 페이지 크기·방향 선택 가능. 가입·설치 없음.",
  openGraph: {
    title: "이미지 → PDF — 여러 장 한 번에",
    description: "JPG·PNG 여러 장을 한 PDF로 무료, 순서·크기 조정.",
    url: "https://calai.kr/image-to-pdf",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 → PDF — 여러 장 한 번에",
    description: "JPG·PNG 여러 장을 한 PDF로 무료, 순서·크기 조정.",
  },
  alternates: { canonical: "https://calai.kr/image-to-pdf" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "이미지 → PDF",
  "description": "JPG·PNG 여러 장을 하나의 PDF로 무료 변환. 드래그로 순서 조정, 페이지 크기·방향 선택 가능. 가입·설치 없음.",
  "url": "https://calai.kr/image-to-pdf",
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
