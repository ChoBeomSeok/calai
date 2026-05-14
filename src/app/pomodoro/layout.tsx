import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포모도로 타이머, 25분 집중·5분 휴식 자동 사이클",
  description: "25분 작업과 5분 휴식을 자동 반복하는 포모도로 기법 타이머. 화면을 닫지 않으면 알림으로 다음 단계를 알려줍니다.",
  openGraph: {
    title: "포모도로 — 25/5 자동 반복",
    description: "25분 집중·5분 휴식 자동 반복, 알림으로 다음 사이클.",
    url: "https://calai.kr/pomodoro",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "포모도로 — 25/5 자동 반복",
    description: "25분 집중·5분 휴식 자동 반복, 알림으로 다음 사이클.",
  },
  alternates: { canonical: "https://calai.kr/pomodoro" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "포모도로 타이머",
  "description": "25분 작업과 5분 휴식을 자동 반복하는 포모도로 기법 타이머. 화면을 닫지 않으면 알림으로 다음 단계를 알려줍니다.",
  "url": "https://calai.kr/pomodoro",
  "applicationCategory": "UtilitiesApplication",
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
