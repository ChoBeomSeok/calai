import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF → 이미지 변환 (무료) — calai",
  description: "PDF 페이지를 JPG·PNG 이미지로 무료 변환. 화질 1x~3x 선택 가능.",
  openGraph: {
    title: "PDF → 이미지 변환 (무료) | calai",
    description: "PDF 페이지를 JPG·PNG 이미지로 무료 변환.",
    url: "https://calai.kr/pdf-to-image",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/pdf-to-image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF → 이미지 변환 (무료)",
  description: "PDF 페이지를 JPG·PNG로 무료 변환.",
  url: "https://calai.kr/pdf-to-image",
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
