import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF·이미지 메타데이터 제거, GPS·작성자 완전 삭제",
  description: "PDF·JPG·PNG·WebP의 작성자·GPS·카메라·수정 이력을 완전 제거. 처리 전후 비교와 재검증, 익명화 공유 전 필수.",
  openGraph: {
    title: "메타 제거 — GPS·작성자 완전",
    description: "PDF·이미지의 GPS·작성자·EXIF 완전 제거, 익명화용.",
    url: "https://www.calai.kr/strip-metadata",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "메타 제거 — GPS·작성자 완전",
    description: "PDF·이미지의 GPS·작성자·EXIF 완전 제거, 익명화용.",
  },
  alternates: { canonical: "https://www.calai.kr/strip-metadata" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "메타데이터 제거",
  "description": "PDF·JPG·PNG·WebP의 작성자·GPS·카메라·수정 이력을 완전 제거. 처리 전후 비교와 재검증, 익명화 공유 전 필수.",
  "url": "https://www.calai.kr/strip-metadata",
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
