import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 토큰 비용 계산기, GPT·Claude·Gemini 한 표 비교",
  description: "입력·출력 토큰 수와 모델을 선택하면 OpenAI·Claude·Gemini API 비용이 한 표에서 비교. 가장 저렴한 모델을 한눈에.",
  openGraph: {
    title: "AI 토큰 비용 — 3사 비교",
    description: "GPT·Claude·Gemini의 토큰 비용을 한 표에서 즉시 비교.",
    url: "https://calai.kr/ai-token",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 토큰 비용 — 3사 비교",
    description: "GPT·Claude·Gemini의 토큰 비용을 한 표에서 즉시 비교.",
  },
  alternates: { canonical: "https://calai.kr/ai-token" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI 토큰 비용 계산기",
  "description": "입력·출력 토큰 수와 모델을 선택하면 OpenAI·Claude·Gemini API 비용이 한 표에서 비교. 가장 저렴한 모델을 한눈에.",
  "url": "https://calai.kr/ai-token",
  "applicationCategory": "DeveloperApplication",
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
