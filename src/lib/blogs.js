import "server-only";
import { getDatabaseClient } from "@/lib/db";

function toArticle(row) {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    seoTitle: row.seo_title,
    description: row.description,
    body: row.body,
    paragraphs: row.body.split(/\n\s*\n/).filter(Boolean),
    checks: row.checks.split("\n").filter(Boolean),
    image: row.image,
    imageAlt: row.image_alt,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublishedBlogPosts() {
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT id, slug, category, title, seo_title, description, body, checks,
      image, image_alt, published, created_at, updated_at
    FROM blog_posts
    WHERE published = true
    ORDER BY created_at DESC
  `;

  return rows.map(toArticle);
}

export async function getPublishedBlogPost(slug) {
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT id, slug, category, title, seo_title, description, body, checks,
      image, image_alt, published, created_at, updated_at
    FROM blog_posts
    WHERE slug = ${slug} AND published = true
    LIMIT 1
  `;

  return rows[0] ? toArticle(rows[0]) : null;
}

export async function getAdminBlogPosts() {
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT id, slug, category, title, seo_title, description, body, checks,
      image, image_alt, published, created_at, updated_at
    FROM blog_posts
    ORDER BY updated_at DESC
  `;

  return rows.map(toArticle);
}

export async function getAdminBlogPostBySlug(slug) {
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT id, slug, category, title, seo_title, description, body, checks,
      image, image_alt, published, created_at, updated_at
    FROM blog_posts
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return rows[0] ? toArticle(rows[0]) : null;
}
