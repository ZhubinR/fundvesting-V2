import type { MetadataRoute } from "next";
import { fetchPosts } from "@/features/content/api/content-api";
import { env } from "@/shared/lib/env";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "yearly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/compare", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fundRavand", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fundBar", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.5 },
  { path: "/news", changeFrequency: "weekly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, blog] = await Promise.all([fetchPosts("posts"), fetchPosts("blog")]);
  const now = new Date().toISOString();

  // Placeholder data is for showing visitors what the site looks like
  // when the backend is briefly unreachable — it must never be published
  // to search engines as if it were real content.
  const newsPosts = news.isDemo ? [] : news.value;
  const blogPosts = blog.isDemo ? [] : blog.value;

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${env.NEXT_PUBLIC_SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...newsPosts.map((post) => ({
      url: `${env.NEXT_PUBLIC_SITE_URL}/news/${post.slug}`,
      lastModified: new Date(post.date_created).toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.25,
    })),
    ...blogPosts.map((post) => ({
      url: `${env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date_created).toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.25,
    })),
  ];
}
