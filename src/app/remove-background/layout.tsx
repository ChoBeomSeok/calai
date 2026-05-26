import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사진 누끼 따기, AI 자동 배경 제거 무료",
  description: "브라우저에서 AI로 즉시 누끼 따기. 인물·상품·반려동물 자동 인식, 투명 PNG·증명사진 배경색 변경. 사진 외부 전송 0.",
  openGraph: {
    title: "누끼 따기 — AI 자동, 외부 X",
    description: "AI 자동 인식으로 누끼 따기, 투명 PNG·배경색, 외부 전송 0.",
    url: "https://www.calai.kr/remove-background",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "누끼 따기 — AI 자동, 외부 X",
    description: "AI 자동 인식으로 누끼 따기, 투명 PNG·배경색, 외부 전송 0.",
  },
  alternates: { canonical: "https://www.calai.kr/remove-background" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "사진 누끼 따기 (배경 제거)",
  "description": "브라우저에서 AI로 즉시 누끼 따기. 인물·상품·반려동물 자동 인식, 투명 PNG·증명사진 배경색 변경. 사진 외부 전송 0.",
  "url": "https://www.calai.kr/remove-background",
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
