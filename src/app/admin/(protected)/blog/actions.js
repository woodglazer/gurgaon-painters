"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";
import { getDatabaseClient } from "@/lib/db";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";

async function requireAdmin() {
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    throw new Error("You are not authorized to manage blog posts.");
  }
}

function readText(formData, name, maxLength) {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function getBlogBody(formData) {
  const value = formData.get("body");
  if (typeof value !== "string") {
    return { error: "Article body is required." };
  }

  const body = value.trim();
  if (body.length > 100000) {
    return { error: "The article is too long. Shorten it and try again." };
  }

  return body
    ? { body }
    : { error: "Article body is required." };
}

function readPost(formData) {
  const bodyResult = getBlogBody(formData);
  if (bodyResult.error) {
    return bodyResult;
  }

  const post = {
    title: readText(formData, "title", 180),
    slug: readText(formData, "slug", 180),
    category: readText(formData, "category", 100),
    seoTitle: readText(formData, "seoTitle", 180),
    description: readText(formData, "description", 320),
    body: bodyResult.body,
    checks: readText(formData, "checks", 5000),
    image: readText(formData, "image", 500),
    imageAlt: readText(formData, "imageAlt", 250),
    city: readText(formData, "city", 30) || "gurgaon",
    published: formData.get("published") === "true",
  };

  if (!post.title || !post.category || !post.description || !post.body) {
    return { error: "Title, category, description, and article body are required." };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    return { error: "Use a URL slug with lowercase letters, numbers, and hyphens." };
  }
  if (!post.image.startsWith("/") || post.image.startsWith("//")) {
    return { error: "Enter a local image path, for example /images/service-interior.webp." };
  }
  if (!post.imageAlt) {
    return { error: "Add descriptive alt text for the article image." };
  }

  return { post: { ...post, seoTitle: post.seoTitle || post.title } };
}

function revalidateBlogPaths(...slugs) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
  }
}

export async function createBlogPost(_previousState, formData) {
  await requireAdmin();
  const result = readPost(formData);
  if (result.error) {
    return result;
  }

  // If no city provided in form, use selected city from cookie
  const activeCity = await getSelectedAdminCity();
  const targetCity = result.post.city || (activeCity !== "all" ? activeCity : "gurgaon");

  const sql = getDatabaseClient();
  const existing = await sql`
    SELECT id FROM blog_posts WHERE slug = ${result.post.slug} LIMIT 1
  `;
  if (existing.length) {
    return { error: "That URL slug is already in use. Choose another one." };
  }

  await sql`
    INSERT INTO blog_posts (
      slug, category, title, seo_title, description, body, checks, image,
      image_alt, published, city
    ) VALUES (
      ${result.post.slug}, ${result.post.category}, ${result.post.title},
      ${result.post.seoTitle}, ${result.post.description}, ${result.post.body},
      ${result.post.checks}, ${result.post.image}, ${result.post.imageAlt},
      ${result.post.published}, ${targetCity}
    )
  `;

  revalidateBlogPaths(result.post.slug);
  redirect("/admin/blog");
}

export async function updateBlogPost(id, _previousState, formData) {
  await requireAdmin();
  const result = readPost(formData);
  if (result.error) {
    return result;
  }

  const sql = getDatabaseClient();
  const existing = await sql`
    SELECT id, slug FROM blog_posts WHERE id = ${id} LIMIT 1
  `;
  if (!existing.length) {
    return { error: "This blog post could not be found. Refresh and try again." };
  }
  const slugInUse = await sql`
    SELECT id FROM blog_posts
    WHERE slug = ${result.post.slug} AND id <> ${id}
    LIMIT 1
  `;
  if (slugInUse.length) {
    return { error: "That URL slug is already in use. Choose another one." };
  }

  await sql`
    UPDATE blog_posts
    SET
      slug = ${result.post.slug},
      category = ${result.post.category},
      title = ${result.post.title},
      seo_title = ${result.post.seoTitle},
      description = ${result.post.description},
      body = ${result.post.body},
      checks = ${result.post.checks},
      image = ${result.post.image},
      image_alt = ${result.post.imageAlt},
      published = ${result.post.published},
      city = ${result.post.city},
      updated_at = now()
    WHERE id = ${id}
  `;

  revalidateBlogPaths(existing[0].slug, result.post.slug);
  redirect("/admin/blog");
}

export async function setBlogPostStatus(formData) {
  await requireAdmin();
  const id = formData.get("id");
  const published = formData.get("published") === "true";

  if (!id || typeof id !== "string") {
    return;
  }

  const sql = getDatabaseClient();
  const [updated] = await sql`
    UPDATE blog_posts
    SET published = ${published}, updated_at = now()
    WHERE id = ${id}
    RETURNING slug
  `;

  if (updated?.slug) {
    revalidateBlogPaths(updated.slug);
  }
}

export async function deleteBlogPost(formData) {
  await requireAdmin();
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return;
  }

  const sql = getDatabaseClient();
  const [deleted] = await sql`
    DELETE FROM blog_posts
    WHERE id = ${id}
    RETURNING slug
  `;

  if (deleted?.slug) {
    revalidateBlogPaths(deleted.slug);
  }
}
