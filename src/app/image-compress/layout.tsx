import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 압축 (무료) — calai",
  description: "JPG·PNG·WebP 용량 무료 압축. 일괄 처리·품질 조정·원본 비교. 브라우저 내 처리.",
  openGraph: {
    title: "이미지 압축 (무료) | calai",
    description: "JPG·PNG·WebP 용량 무료 압축. 일괄 처리·품질 조정.",
    url: "https://calai.kr/image-compress",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/image-compress" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "이미지 압축 (무료)",
  description: "JPG·PNG·WebP 무료 일괄 압축.",
  url: "https://calai.kr/image-compress",
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
