import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mittalaistudio.com";
  const now = new Date();
  const publicRoutes = ["", "/services", "/portfolio", "/pricing", "/process", "/about", "/contact"];

  return publicRoutes.map((route, index) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: index === 0 ? "weekly" : "monthly",
      priority: index === 0 ? 1 : 0.8,
    }));
}
