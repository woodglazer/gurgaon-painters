import { getSiteUrl } from "./site-url";
import { services } from "./services/services";
import { getPublishedBlogPosts } from "@/lib/blogs";
import { connection } from "next/server";
import { areas } from "./areas/areas";

export default async function sitemap() {
  await connection();
  const siteUrl = getSiteUrl();

  if (!siteUrl) return [];

  const articles = await getPublishedBlogPosts();

  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...services.map(({ slug }) => ({
      url: `${siteUrl}/services/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    {
      url: `${siteUrl}/areas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...areas.map(({ slug }) => ({
      url: `${siteUrl}/areas/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...articles.map(({ slug, updatedAt }) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/why-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
