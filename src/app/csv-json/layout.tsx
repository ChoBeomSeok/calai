import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV ↔ JSON 변환기 (무료) — 헤더 자동 인식 | calai",
  description:
    "CSV ↔ JSON 양방향 무료 변환. 헤더 자동 인식·구분자 감지(,;|탭)·숫자 자동 타입·미리보기 테이블. 파일 업로드·다운로드 지원, 100% 브라우저 처리.",
  keywords: [
    "CSV JSON 변환",
    "CSV to JSON",
    "JSON to CSV",
    "엑셀 JSON 변환",
    "CSV 파싱",
    "JSON 파서",
    "헤더 자동 인식",
    "TSV 변환",
    "데이터 변환",
  ],
  openGraph: {
    title: "CSV ↔ JSON 변환기 (무료) | calai",
    description: "헤더 자동 인식·구분자 감지·숫자 자동 타입·미리보기. 100% 브라우저 처리.",
    url: "https://calai.kr/csv-json",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV ↔ JSON 변환기 (무료)",
    description: "양방향 변환·헤더 자동 인식·미리보기 테이블.",
  },
  alternates: { canonical: "https://calai.kr/csv-json" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSV ↔ JSON 변환기",
  alternateName: ["CSV JSON 변환", "엑셀 JSON 변환"],
  description:
    "CSV ↔ JSON 양방향 무료 변환. 헤더 자동 인식·구분자 감지·숫자 자동 타입·미리보기 테이블. 100% 브라우저 처리.",
  url: "https://calai.kr/csv-json",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Data Converter",
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
