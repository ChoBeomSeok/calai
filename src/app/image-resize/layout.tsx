import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이미지 크기 변경, 인스타·유튜브·블로그 프리셋까지",
  description: "사진 픽셀·비율을 무료로 변경. 인스타 1080·유튜브 썸네일·OG 1200x630·이력서 사진 등 프리셋 + 비율 유지·고화질 리샘플링. 사진은 서버로 전송되지 않습니다.",
  openGraph: {
    title: "이미지 리사이즈 — SNS 프리셋 + 고화질",
    description: "사진 픽셀·비율 무료 변경, 인스타·유튜브·OG 프리셋, 브라우저 안에서 처리.",
    url: "https://calai.kr/image-resize",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 리사이즈 — SNS 프리셋 + 고화질",
    description: "사진 픽셀·비율 무료 변경, 인스타·유튜브·OG 프리셋, 브라우저 안에서 처리.",
  },
  alternates: { canonical: "https://calai.kr/image-resize" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "이미지 크기 변경 (리사이즈)",
  description: "사진의 픽셀·비율을 무료로 변경. 인스타·유튜브·블로그·OG 이미지 등 프리셋 + 비율 유지·고화질 리샘플링. 100% 브라우저 처리.",
  url: "https://calai.kr/image-resize",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
  isAccessibleForFree: true,
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
