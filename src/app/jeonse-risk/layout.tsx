import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전세 사기 위험도 체크, 깡통전세 5지표 즉시 진단",
  description: "보증금·매매가·근저당·전세가율·신탁등기 등 5가지 지표를 종합해 깡통전세 위험도를 즉시 진단. 계약 전 필수 점검.",
  openGraph: {
    title: "전세 사기 위험도 — 5지표 진단",
    description: "보증금·매매가·근저당으로 깡통전세 위험도 종합 진단.",
    url: "https://www.calai.kr/jeonse-risk",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "전세 사기 위험도 — 5지표 진단",
    description: "보증금·매매가·근저당으로 깡통전세 위험도 종합 진단.",
  },
  alternates: { canonical: "https://www.calai.kr/jeonse-risk" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "전세 사기 위험도 체크",
  "description": "보증금·매매가·근저당·전세가율·신탁등기 등 5가지 지표를 종합해 깡통전세 위험도를 즉시 진단. 계약 전 필수 점검.",
  "url": "https://www.calai.kr/jeonse-risk",
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
