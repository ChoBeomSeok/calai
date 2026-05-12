import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "한국에서 몇 번째? 진단 — 같은 생일·이름·키 분위 진단 | calai",
  description:
    "생년월일·이름·키로 한국에서 본인 위치 7가지를 한 페이지에. 같은 생일 동기·같은 이름 동기·현재 생존 동기·키 분위·성씨 순위·누적 출생 순번까지 통계청·행정안전부·질병관리청 공공 통계 기반 즉시 진단.",
  keywords: [
    "한국 순위", "한국에서 몇 번째", "같은 생일 동기", "같은 이름 동기",
    "동기 동명이인", "한국 키 분위", "성씨 인구", "성씨 순위",
    "누적 출생 순번", "본인 한국 위치", "통계청 진단",
    "행정안전부 성씨 통계", "국민건강영양조사 키",
  ],
  openGraph: {
    title: "한국에서 몇 번째? — 같은 생일·이름·키 분위 진단",
    description:
      "같은 생일 동기·같은 이름 동기·키 분위·성씨 순위·누적 출생 순번을 통계청·행안부 공공 통계로 즉시 진단.",
    url: "https://calai.kr/korea-rank",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "한국에서 몇 번째? — 본인 위치 7가지 진단",
    description: "같은 생일·같은 이름·키 분위·성씨 순위·누적 출생 순번 한 페이지.",
  },
  alternates: { canonical: "https://calai.kr/korea-rank" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "한국에서 몇 번째? 진단",
  alternateName: ["한국 순위 진단", "같은 생일 동기 계산기", "성씨 순위 진단"],
  description:
    "생년월일·이름·키로 한국에서 본인 위치 7가지를 한 페이지에 — 같은 생일 동기·같은 이름 동기·현재 생존 동기·키 분위·성씨 순위·누적 출생 순번.",
  url: "https://calai.kr/korea-rank",
  applicationCategory: "UtilitiesApplication",
  applicationSubCategory: "Demographic Calculator",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Modern web browser.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
  isAccessibleForFree: true,
  creator: { "@type": "Organization", name: "calai", url: "https://calai.kr" },
  // 출처 명시 (Dataset 인용)
  citation: [
    "통계청 인구동향조사 — 출생 (KOSIS)",
    "행정안전부 주민등록 인구통계",
    "통계청 2015 인구주택총조사 — 성씨·본관별 인구",
    "질병관리청 국민건강영양조사 8기 (2019~2021)",
  ],
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
