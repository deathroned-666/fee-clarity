import type { MetadataRoute } from "next";
import { pages, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-08-20"),
    changeFrequency: path.includes("calculator") || path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.includes("calculator") ? 0.9 : 0.7,
  }));
}
