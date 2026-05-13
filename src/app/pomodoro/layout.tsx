import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포모도로 타이머 — calai",
  description: "25분 작업 + 5분 휴식 자동 반복. 집중력 향상 기법.",
  openGraph: {
    title: "포모도로 타이머 | calai",
    description: "25분 작업 + 5분 휴식 자동 반복. 집중력 향상 기법.",
    url: "https://calai.kr/pomodoro",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/pomodoro" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "포모도로 타이머",
  description: "25분 작업 + 5분 휴식 자동 반복. 집중력 향상 기법.",
  url: "https://calai.kr/pomodoro",
  applicationCategory: "UtilitiesApplication",
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
