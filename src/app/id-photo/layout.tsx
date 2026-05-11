import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "증명사진 만들기 (무료) — calai",
  description: "여권·이력서·민증·비자 한국 9종 규격 자동 크롭. 배경색 변경·DPI 300 인쇄용. 가입·워터마크 없음.",
  openGraph: {
    title: "증명사진 만들기 (무료) | calai",
    description: "여권·이력서·민증·비자 한국 9종 규격 자동 크롭.",
    url: "https://calai.kr/id-photo",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/id-photo" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "증명사진 만들기 (무료)",
  description: "여권·이력서·민증·비자 9종 규격 자동 크롭. DPI 300 인쇄용.",
  url: "https://calai.kr/id-photo",
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
