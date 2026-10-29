"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";
import { getDatabaseClient } from "@/lib/db";

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

  try {
    const delta = JSON.parse(body);
    if (Array.isArray(delta?.ops)) {
      let textLength = 0;
      for (const operation of delta.ops) {
        if (!operation || typeof operation.insert !== "string") {
          return { error: "The article contains an unsupported content type." };
        }
        if (
          operation.attributes !== undefined &&
          (!operation.attributes ||
            typeof operation.attributes !== "object" ||
            Array.isArray(operation.attributes))
        ) {
          return { error: "The article formatting could not be read." };
        }
        for (const [format, value] of Object.entries(operation.attributes || {})) {
          const validFormat =
            ["bold", "italic", "underline", "strike", "blockquote"].includes(format)
              ? value === true
              : format === "link"
                ? typeof value === "string" && value.length <= 2048
                : format === "header"
                  ? value === 2 || value === 3
                  : format === "list"
                    ? value === "bullet" || value === "ordered"
                    : false;
          if (!validFormat) {
            return { error: "The article contains unsupported formatting." };
          }
        }
        textLength += operation.insert.length;
      }
      if (textLength > 20000) {
        return { error: "The article must be 20,000 characters or fewer." };
      }
      if (!delta.ops.some((operation) => operation.insert.trim())) {
        return { error: "Article body is required." };
      }
      return { body };
    }
  } catch {
    if (body.startsWith("{")) {
      return { error: "The article formatting could not be read. Please review it and try again." };
    }
  }

  if (body.length > 20000) {
    return { error: "The article must be 20,000 characters or fewer." };
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
      image_alt, published
    ) VALUES (
      ${result.post.slug}, ${result.post.category}, ${result.post.title},
      ${result.post.seoTitle}, ${result.post.description}, ${result.post.body},
      ${result.post.checks}, ${result.post.image}, ${result.post.imageAlt},
      ${result.post.published}
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
    SET slug = ${result.post.slug},
      category = ${result.post.category},
      title = ${result.post.title},
      seo_title = ${result.post.seoTitle},
      description = ${result.post.description},
      body = ${result.post.body},
      checks = ${result.post.checks},
      image = ${result.post.image},
      image_alt = ${result.post.imageAlt},
      published = ${result.post.published},
      updated_at = now()
    WHERE id = ${id}
  `;

  revalidateBlogPaths(existing[0].slug, result.post.slug);
  redirect("/admin/blog");
}

export async function setBlogPostStatus(formData) {
  await requireAdmin();
  const id = readText(formData, "id", 50);
  const slug = readText(formData, "slug", 180);
  const publishedValue = formData.get("published");
  if (!id || (publishedValue !== "true" && publishedValue !== "false")) {
    throw new Error("A valid blog post and publish status are required.");
  }

  const sql = getDatabaseClient();
  const updated = await sql`
    UPDATE blog_posts
    SET published = ${publishedValue === "true"}, updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;
  if (!updated.length) {
    throw new Error("This blog post could not be found.");
  }

  revalidateBlogPaths(slug);
}

export async function deleteBlogPost(formData) {
  await requireAdmin();
  const id = readText(formData, "id", 50);
  const slug = readText(formData, "slug", 180);
  if (!id) {
    throw new Error("A blog post must be selected before deleting.");
  }

  const sql = getDatabaseClient();
  const deleted = await sql`
    DELETE FROM blog_posts WHERE id = ${id} RETURNING id
  `;
  if (!deleted.length) {
    throw new Error("This blog post could not be found.");
  }

  revalidateBlogPaths(slug);
}
