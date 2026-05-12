import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/form-mapper"],
      },
    ],
    sitemap: "https://calai.kr/sitemap.xml",
    host: "https://calai.kr",
  };
}
