import type { MetadataRoute } from "next";
import { getFeaturedProjects } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const projectRoutes: MetadataRoute.Sitemap = getFeaturedProjects().map(
    (p) => ({
      url: `${SITE_CONFIG.url}/projects/${p.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [
    {
      url: SITE_CONFIG.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectRoutes,
  ];
}
