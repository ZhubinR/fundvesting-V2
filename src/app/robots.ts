import type { MetadataRoute } from "next";
import { env } from "@/shared/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["*?*", "*/dashboard", "*/auth", "*/api", "*/_next"],
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
