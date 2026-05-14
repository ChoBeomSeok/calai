import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "정규식 테스터, 매칭·그룹·플래그 실시간 확인",
  description: "정규식 패턴과 테스트 문자열을 넣으면 매칭 결과·캡처 그룹·플래그(g·i·m)까지 실시간 표시. 정규식 학습·디버깅에.",
  openGraph: {
    title: "정규식 테스터 — 실시간 매칭",
    description: "패턴·문자열로 매칭 결과·캡처 그룹·플래그 실시간.",
    url: "https://calai.kr/regex-test",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "정규식 테스터 — 실시간 매칭",
    description: "패턴·문자열로 매칭 결과·캡처 그룹·플래그 실시간.",
  },
  alternates: { canonical: "https://calai.kr/regex-test" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "정규식 테스터",
  "description": "정규식 패턴과 테스트 문자열을 넣으면 매칭 결과·캡처 그룹·플래그(g·i·m)까지 실시간 표시. 정규식 학습·디버깅에.",
  "url": "https://calai.kr/regex-test",
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
