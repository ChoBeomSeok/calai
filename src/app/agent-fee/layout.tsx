import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "중개수수료 계산기, 매매·전세·월세 법정 한도 즉시",
  description: "매매·전세·월세 거래액별 법정 중개보수 한도를 자동 산출. 협의 한도와 실제 지불액 비교로 과다 수수료 방지에.",
  openGraph: {
    title: "중개수수료 — 법정 한도 즉시",
    description: "거래액·유형별 법정 중개보수 한도 자동, 과다 청구 방지.",
    url: "https://calai.kr/agent-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "중개수수료 — 법정 한도 즉시",
    description: "거래액·유형별 법정 중개보수 한도 자동, 과다 청구 방지.",
  },
  alternates: { canonical: "https://calai.kr/agent-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "중개수수료 계산기",
  "description": "매매·전세·월세 거래액별 법정 중개보수 한도를 자동 산출. 협의 한도와 실제 지불액 비교로 과다 수수료 방지에.",
  "url": "https://calai.kr/agent-fee",
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
