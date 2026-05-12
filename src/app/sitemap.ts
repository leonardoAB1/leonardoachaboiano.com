import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Add entries here as pages are built:
    // { url: `${siteUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
    // { url: `${siteUrl}/about`,    changeFrequency: "yearly",  priority: 0.7 },
    // { url: `${siteUrl}/cv`,       changeFrequency: "yearly",  priority: 0.6 },
    // { url: `${siteUrl}/blog`,     changeFrequency: "weekly",  priority: 0.9 },
  ];
}
