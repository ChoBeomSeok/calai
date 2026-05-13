import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "메타데이터 제거 (PDF·JPG·PNG·WebP) — 작성자·GPS 완전 청소 | calai",
  description:
    "PDF·JPG·PNG·WebP 메타데이터 완전 제거 (무료). 작성자·GPS 위치·카메라 모델·소프트웨어·수정 이력 제거. 처리 전후 비교 표 + 결과 재검증. 100% 브라우저 처리, 서버 전송 X.",
  keywords: [
    "메타데이터 제거",
    "EXIF 제거",
    "GPS 정보 제거",
    "PDF 작성자 제거",
    "익명화",
    "사진 위치 정보 제거",
    "PDF 메타데이터",
    "XMP 제거",
    "민감정보 제거",
    "프라이버시 도구",
  ],
  openGraph: {
    title: "메타데이터 제거 (PDF·이미지) | calai",
    description: "작성자·GPS·카메라·수정 이력 완전 제거. 처리 전후 비교 + 재검증. 100% 브라우저 처리.",
    url: "https://calai.kr/strip-metadata",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "메타데이터 제거 (PDF·이미지)",
    description: "작성자·GPS·카메라·소프트웨어 이력 완전 제거. 처리 전후 비교.",
  },
  alternates: { canonical: "https://calai.kr/strip-metadata" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "메타데이터 제거 (PDF·이미지)",
  alternateName: ["EXIF 제거", "GPS 정보 제거", "PDF 작성자 제거"],
  description:
    "PDF·JPG·PNG·WebP 메타데이터 완전 제거. 작성자·GPS·카메라·소프트웨어·수정 이력 제거 후 재파싱 검증. 100% 브라우저 처리.",
  url: "https://calai.kr/strip-metadata",
  applicationCategory: "UtilitiesApplication",
  applicationSubCategory: "Privacy Tool",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Modern web browser.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
  isAccessibleForFree: true,
  creator: { "@type": "Organization", name: "calai", url: "https://calai.kr" },
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
