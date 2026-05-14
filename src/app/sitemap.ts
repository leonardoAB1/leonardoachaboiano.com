import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";

const siteUrl = "https://leonardoachaboiano.com";

function getSlugs(dir: string): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), dir))
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const projectSlugs = getSlugs("src/content/projects");
  const postSlugs = getSlugs("src/content/posts");

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/cv`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), priority: 0.7 },
    { url: `${siteUrl}/media`, lastModified: new Date(), priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${siteUrl}/projects/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...postPages];
}
