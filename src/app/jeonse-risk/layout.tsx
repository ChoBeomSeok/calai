import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전세 사기 위험도 체크 — calai",
  description: "보증금·매매가·근저당·건축종류·보호장치 5가지 지표로 깡통전세 위험도 종합 진단. 계약 전 필수 체크.",
  openGraph: {
    title: "전세 사기 위험도 체크 | calai",
    description: "5가지 지표로 깡통전세 위험도 종합 진단. 계약 전 필수.",
    url: "https://calai.kr/jeonse-risk",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/jeonse-risk" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "전세 사기 위험도 체크",
  description: "5가지 지표로 깡통전세 위험도 0~100점 종합 진단.",
  url: "https://calai.kr/jeonse-risk",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
