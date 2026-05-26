import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "종합부동산세 계산기, 1주택·다주택 누진 자동",
  description: "공시가격 합계와 1주택·다주택 여부를 넣으면 종부세 누진세율과 농어촌특별세까지 합한 실 부담액이 즉시.",
  openGraph: {
    title: "종부세 — 1주택·다주택 누진",
    description: "공시가격·주택 수로 종부세 + 농특세 합산액 자동.",
    url: "https://www.calai.kr/comprehensive-property-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "종부세 — 1주택·다주택 누진",
    description: "공시가격·주택 수로 종부세 + 농특세 합산액 자동.",
  },
  alternates: { canonical: "https://www.calai.kr/comprehensive-property-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "종합부동산세 계산기",
  "description": "공시가격 합계와 1주택·다주택 여부를 넣으면 종부세 누진세율과 농어촌특별세까지 합한 실 부담액이 즉시.",
  "url": "https://www.calai.kr/comprehensive-property-tax",
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
