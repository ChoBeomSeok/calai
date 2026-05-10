import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 토큰 비용 계산기 — calai",
  description: "OpenAI·Claude·Gemini 입출력 토큰별 API 비용 즉시 비교.",
  openGraph: {
    title: "AI 토큰 비용 계산기 | calai",
    description: "OpenAI·Claude·Gemini 입출력 토큰별 API 비용 즉시 비교.",
    url: "https://calai.kr/ai-token",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/ai-token" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI 토큰 비용 계산기",
  description: "OpenAI·Claude·Gemini 입출력 토큰별 API 비용 즉시 비교.",
  url: "https://calai.kr/ai-token",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
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
