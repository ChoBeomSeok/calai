import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "만 나이 계산기, 다음 생일 D-Day까지 한 번에",
  description: "생년월일만 넣으면 만 나이·연 나이·다음 생일까지 며칠 남았는지 즉시 표시. 2023년 만 나이 통일법 기준 반영.",
  openGraph: {
    title: "만 나이 — 생일 D-Day까지",
    description: "생년월일로 만 나이·연 나이·다음 생일 D-Day 한 번에.",
    url: "https://www.calai.kr/age",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "만 나이 — 생일 D-Day까지",
    description: "생년월일로 만 나이·연 나이·다음 생일 D-Day 한 번에.",
  },
  alternates: { canonical: "https://www.calai.kr/age" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "만 나이 계산기",
  "description": "생년월일만 넣으면 만 나이·연 나이·다음 생일까지 며칠 남았는지 즉시 표시. 2023년 만 나이 통일법 기준 반영.",
  "url": "https://www.calai.kr/age",
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
