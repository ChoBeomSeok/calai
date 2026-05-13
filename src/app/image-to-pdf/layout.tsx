import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 → PDF 변환 (무료) — calai",
  description: "JPG·PNG 여러 장을 하나의 PDF로 무료 변환. 순서·페이지 크기 조정.",
  openGraph: {
    title: "이미지 → PDF 변환 (무료) | calai",
    description: "JPG·PNG 여러 장을 하나의 PDF로 무료 변환.",
    url: "https://calai.kr/image-to-pdf",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/image-to-pdf" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "이미지 → PDF 변환 (무료)",
  description: "JPG·PNG 여러 장을 PDF로 무료 변환.",
  url: "https://calai.kr/image-to-pdf",
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
