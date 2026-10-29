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

  return [
    { url: siteUrl },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/why-us` },
    { url: `${siteUrl}/contact` },
    { url: `${siteUrl}/cookies` },
    { url: `${siteUrl}/privacy-policy` },
    { url: `${siteUrl}/services` },
    ...services.map(({ slug }) => ({ url: `${siteUrl}/services/${slug}` })),
    { url: `${siteUrl}/areas` },
    ...areas.map(({ slug }) => ({ url: `${siteUrl}/areas/${slug}` })),
    { url: `${siteUrl}/blog` },
    ...articles.map(({ slug, updatedAt }) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: updatedAt,
    })),
  ];
}
