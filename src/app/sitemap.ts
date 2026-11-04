import type { MetadataRoute } from "next";
import { business } from "@/data/business";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/quote", "/contact", "/terms", "/privacy"].map((path) => ({
    url: `${business.url}${path}`,
    changeFrequency: path ? "monthly" : "weekly",
    priority: path ? 0.6 : 1,
  }));
}
