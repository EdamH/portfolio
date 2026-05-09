import type { MetadataRoute } from "next";
import { getFeaturedProjects } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = getFeaturedProjects().map((p) => ({
    url: `https://edamhamza.dev/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://edamhamza.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectRoutes,
  ];
}
