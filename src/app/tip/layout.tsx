import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "팁·N빵 계산기, 봉사료 + 인원 분담 즉시",
  description: "총액·봉사료(%)·인원을 넣으면 1인당 분담액이 즉시. 회식·해외 식사·여행 정산에서 머리 안 굴려도 끝.",
  openGraph: {
    title: "팁·N빵 — 1인당 분담 즉시",
    description: "총액·봉사료·인원으로 1인당 분담액 즉시, 회식 정산용.",
    url: "https://www.calai.kr/tip",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "팁·N빵 — 1인당 분담 즉시",
    description: "총액·봉사료·인원으로 1인당 분담액 즉시, 회식 정산용.",
  },
  alternates: { canonical: "https://www.calai.kr/tip" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "팁·N빵 계산기",
  "description": "총액·봉사료(%)·인원을 넣으면 1인당 분담액이 즉시. 회식·해외 식사·여행 정산에서 머리 안 굴려도 끝.",
  "url": "https://www.calai.kr/tip",
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
