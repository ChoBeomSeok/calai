import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "만 나이 계산기 — calai",
  description: "생년월일로 만 나이·연 나이·다음 생일 D-Day.",
  openGraph: {
    title: "만 나이 계산기 | calai",
    description: "생년월일로 만 나이·연 나이·다음 생일 D-Day.",
    url: "https://calai.kr/age",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/age" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "만 나이 계산기",
  description: "생년월일로 만 나이·연 나이·다음 생일 D-Day.",
  url: "https://calai.kr/age",
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
