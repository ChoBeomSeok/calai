import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL 포매터 — calai",
  description: "압축된 SQL 쿼리 자동 들여쓰기·키워드 대문자 변환. MySQL·PostgreSQL·SQLite·BigQuery 8개 dialect 지원.",
  openGraph: {
    title: "SQL 포매터 | calai",
    description: "SQL 쿼리 자동 들여쓰기. 8개 dialect 지원.",
    url: "https://calai.kr/sql-format",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/sql-format" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL 포매터",
  description: "SQL 쿼리 자동 포매팅. 8개 dialect.",
  url: "https://calai.kr/sql-format",
  applicationCategory: "DeveloperApplication",
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
