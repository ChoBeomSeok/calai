import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "calai — 한국에서 가장 빠른 도구·계산기",
    short_name: "calai",
    description: "BMI·대출·세금·환율·코인 등 60개+ 도구를 한 페이지에",
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
