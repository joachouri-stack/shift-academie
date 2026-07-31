import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/formations",
    "/formations/creer-son-entreprise",
    "/formations/integrer-ia-artisanat",
    "/financement",
    "/a-propos",
    "/inscription",
    "/mentions-legales",
    "/confidentialite",
    "/cgv",
  ];

  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
