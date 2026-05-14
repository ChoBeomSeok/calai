import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 손글씨 서명, 마우스·터치로 무료 사인",
  description: "PDF에 손글씨 서명을 마우스·터치·펜으로 직접 그려 추가. 드래그·리사이즈로 정확한 위치 배치, 가입·설치 없이 무료.",
  openGraph: {
    title: "PDF 서명 — 손글씨로 무료",
    description: "PDF에 손글씨 서명 마우스·터치로 그려 무료 추가.",
    url: "https://calai.kr/pdf-sign",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 서명 — 손글씨로 무료",
    description: "PDF에 손글씨 서명 마우스·터치로 그려 무료 추가.",
  },
  alternates: { canonical: "https://calai.kr/pdf-sign" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 손글씨 서명",
  "description": "PDF에 손글씨 서명을 마우스·터치·펜으로 직접 그려 추가. 드래그·리사이즈로 정확한 위치 배치, 가입·설치 없이 무료.",
  "url": "https://calai.kr/pdf-sign",
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
