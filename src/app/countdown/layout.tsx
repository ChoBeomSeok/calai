import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "카운트다운 타이머, 원하는 시간 알람까지",
  description: "원하는 시간을 설정하면 0초까지 카운트다운하고 알림. 요리·운동·시험·발표 등 시간 제한 작업에 유용.",
  openGraph: {
    title: "카운트다운 — 시간 설정 알림",
    description: "원하는 시간 설정 후 0초 카운트다운 + 알림.",
    url: "https://calai.kr/countdown",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "카운트다운 — 시간 설정 알림",
    description: "원하는 시간 설정 후 0초 카운트다운 + 알림.",
  },
  alternates: { canonical: "https://calai.kr/countdown" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "카운트다운 타이머",
  "description": "원하는 시간을 설정하면 0초까지 카운트다운하고 알림. 요리·운동·시험·발표 등 시간 제한 작업에 유용.",
  "url": "https://calai.kr/countdown",
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
