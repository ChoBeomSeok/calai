import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";

const BASE_URL = "https://calai.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...tools.map((t) => ({
      url: `${BASE_URL}${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
