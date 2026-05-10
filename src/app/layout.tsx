import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://calai.kr"),
  title: {
    default: "calai — 한국에서 가장 빠른 도구·계산기 60개",
    template: "%s | calai",
  },
  description:
    "BMI·대출·적금·양도세·만 나이·연봉 실수령액·평수 변환·청약 가점·LTV/DTI·JSON 포매터 등 60개 도구를 한 페이지에 모았습니다. 가입·로그인 없이 무료로 즉시 사용.",
  keywords: [
    "계산기", "도구", "BMI", "대출 이자", "적금 만기", "양도세", "취득세",
    "만 나이", "연봉 실수령액", "평수 변환", "청약 가점", "LTV", "DTI",
    "전기요금", "자동차세", "JSON 포매터", "Base64", "JWT 디코더",
  ],
  authors: [{ name: "calai" }],
  openGraph: {
    title: "calai — 한국에서 가장 빠른 도구·계산기 60개",
    description:
      "BMI·대출·적금·양도세·만 나이·평수 변환 등 60개 도구를 한 페이지에. 가입 없이 무료.",
    url: "https://calai.kr",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "calai — 한국에서 가장 빠른 도구·계산기",
    description: "60개 도구를 한 페이지에. 가입 없이 무료.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "https://calai.kr" },
  verification: {
    google: "iyjeJCSlVSqTzjmxJvyg1JJy5dSfCcf5pjtdnjLoMp4",
    other: {
      "naver-site-verification": "bdf46184407524f311663c9de99af8d7c80daf48",
    },
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "calai",
  url: "https://calai.kr",
  inLanguage: "ko",
  description:
    "BMI·대출·적금·양도세·만 나이·평수 변환 등 60개 한국 도구·계산기를 한 페이지에 모은 사이트.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://calai.kr/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "calai",
  url: "https://calai.kr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('calai-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
