import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 압축, JPG·PNG·WebP 일괄 + 품질 조정",
  description: "JPG·PNG·WebP 이미지를 한 번에 일괄 압축. 품질 조정·원본 비교로 화질 손상 없이 용량만 줄임. 외부 전송 없음.",
  openGraph: {
    title: "이미지 압축 — 일괄·품질 조정",
    description: "JPG·PNG·WebP 일괄 압축, 품질·원본 비교로 화질 유지.",
    url: "https://calai.kr/image-compress",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 압축 — 일괄·품질 조정",
    description: "JPG·PNG·WebP 일괄 압축, 품질·원본 비교로 화질 유지.",
  },
  alternates: { canonical: "https://calai.kr/image-compress" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "이미지 압축",
  "description": "JPG·PNG·WebP 이미지를 한 번에 일괄 압축. 품질 조정·원본 비교로 화질 손상 없이 용량만 줄임. 외부 전송 없음.",
  "url": "https://calai.kr/image-compress",
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
