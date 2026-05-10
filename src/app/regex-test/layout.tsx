import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "정규식 테스터 — calai",
  description: "정규식 패턴 + 테스트 문자열로 매칭 결과 즉시.",
  openGraph: {
    title: "정규식 테스터 | calai",
    description: "정규식 패턴 + 테스트 문자열로 매칭 결과 즉시.",
    url: "https://calai.kr/regex-test",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/regex-test" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "정규식 테스터",
  description: "정규식 패턴 + 테스트 문자열로 매칭 결과 즉시.",
  url: "https://calai.kr/regex-test",
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
