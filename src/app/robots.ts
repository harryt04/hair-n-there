import type { MetadataRoute } from "next";
import { business } from "@/data/business";
export default function robots(): MetadataRoute.Robots {
  return process.env.VERCEL_ENV === "preview"
    ? { rules: { userAgent: "*", disallow: "/" } }
    : {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: `${business.url}/sitemap.xml`,
      };
}
