import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "calai — 한국에서 가장 빠른 도구·계산기",
    short_name: "calai",
    description: "BMI·대출·세금·PDF·마크다운·SQL·Cron·타임스탬프 등 106개+ 무료 도구",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    lang: "ko",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
