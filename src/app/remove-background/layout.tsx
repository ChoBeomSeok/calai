import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사진 누끼 따기 (배경 제거, 무료) — calai",
  description:
    "가입·로그인 없이 브라우저에서 즉시 누끼 따기. 인물·상품·반려동물 자동 인식, 투명 PNG·증명사진 배경색 자동. 사진은 외부 전송 0건, 완전 무료.",
  keywords: [
    "누끼",
    "누끼 따기",
    "사진 누끼",
    "배경 제거",
    "배경 지우기",
    "사진 배경 지우기",
    "이미지 배경 제거",
    "AI 누끼",
    "무료 누끼",
    "투명 배경",
    "증명사진 배경",
    "remove background",
    "calai",
  ],
  openGraph: {
    title: "사진 누끼 따기 (배경 제거, 무료) | calai",
    description: "브라우저에서 AI로 즉시 누끼 따기. 가입·로그인·워터마크 없음. 사진은 외부 전송 X.",
    url: "https://calai.kr/remove-background",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/remove-background" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "사진 누끼 따기 (배경 제거, 무료)",
  description:
    "브라우저에서 AI로 사진 누끼를 따고 배경을 제거합니다. 인물·상품·반려동물 자동 인식, 투명 PNG·증명사진 배경색 변경 지원. 가입·로그인 없이 완전 무료.",
  url: "https://calai.kr/remove-background",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and modern browser with WebAssembly support",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
  featureList: [
    "AI 배경 자동 제거",
    "투명 PNG 다운로드",
    "증명사진용 배경색 (파랑·빨강·흰색)",
    "사용자 지정 배경색",
    "브라우저 내 처리 (사진 외부 전송 0)",
    "JPG·PNG·WebP 지원",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
