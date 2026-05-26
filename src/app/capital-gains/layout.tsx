import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "양도소득세 계산기, 1주택·다주택 공제까지 정확히",
  description: "취득가·양도가·보유 기간·1주택/다주택 여부로 양도세를 자동 산출. 장기보유특별공제·기본공제 반영, 매도 전 필수 점검.",
  openGraph: {
    title: "양도세 — 공제·중과까지 자동",
    description: "1주택·다주택, 보유 기간별 공제 자동 반영해 양도세 계산.",
    url: "https://www.calai.kr/capital-gains",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "양도세 — 공제·중과까지 자동",
    description: "1주택·다주택, 보유 기간별 공제 자동 반영해 양도세 계산.",
  },
  alternates: { canonical: "https://www.calai.kr/capital-gains" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "양도소득세 계산기",
  "description": "취득가·양도가·보유 기간·1주택/다주택 여부로 양도세를 자동 산출. 장기보유특별공제·기본공제 반영, 매도 전 필수 점검.",
  "url": "https://www.calai.kr/capital-gains",
  "applicationCategory": "FinanceApplication",
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
