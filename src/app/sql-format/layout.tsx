import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL 포매터, 8가지 dialect 자동 들여쓰기",
  description: "압축된 SQL 쿼리를 들여쓰기·키워드 대문자로 정돈. MySQL·PostgreSQL·SQLite·BigQuery 등 8가지 dialect 지원.",
  openGraph: {
    title: "SQL 포매터 — 8 dialect",
    description: "압축 SQL 자동 들여쓰기·대문자, 8가지 dialect 지원.",
    url: "https://calai.kr/sql-format",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL 포매터 — 8 dialect",
    description: "압축 SQL 자동 들여쓰기·대문자, 8가지 dialect 지원.",
  },
  alternates: { canonical: "https://calai.kr/sql-format" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SQL 포매터",
  "description": "압축된 SQL 쿼리를 들여쓰기·키워드 대문자로 정돈. MySQL·PostgreSQL·SQLite·BigQuery 등 8가지 dialect 지원.",
  "url": "https://calai.kr/sql-format",
  "applicationCategory": "DeveloperApplication",
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
