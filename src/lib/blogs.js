import "server-only";
import { revalidateTag, unstable_cacheTag as cacheTag } from "next/cache";
import { getDatabaseClient } from "@/lib/db";

const fallbackArticles = [
  {
    id: "fallback-choose-paint-finish",
    slug: "choose-paint-finish-for-each-room",
    category: "Interior planning",
    title: "How to choose the right paint finish for each room",
    seoTitle: "Choosing Paint Finishes in Gurgaon | Gurgaon Painters",
    description:
      "Choose a paint finish by balancing how a room is used, wall condition, appearance, and the product's care instructions.",
    body: `Paint finish affects how a wall reflects light and how visible small surface marks may be. Before choosing a sheen, consider how the room is used, the wall's condition, and the finish recommended for the paint product. There is no single finish that is right for every room.`,
    paragraphs: [
      "Paint finish affects how a wall reflects light and how visible small surface marks may be.",
    ],
    checks: [
      "Decide how often the wall will be touched or cleaned.",
      "Check the product label for recommended surfaces and care guidance.",
    ],
    image: "/images/service-interior.webp",
    imageAlt: "Freshly painted home interior",
    published: true,
    city: "gurgaon",
    faqs: [],
    createdAt: "2026-10-26T06:45:17.928Z",
    updatedAt: "2026-10-26T06:45:17.928Z",
  },
];

function toArticle(row) {
  const body = row.body || "";
  const checks = row.checks || "";
  let faqs = [];
  if (Array.isArray(row.faqs)) {
    faqs = row.faqs.map((f) => ({
      question: f.question || f.q || "",
      answer: f.answer || f.a || "",
    }));
  } else if (typeof row.faqs === "string") {
    try {
      const parsed = JSON.parse(row.faqs);
      if (Array.isArray(parsed)) {
        faqs = parsed.map((f) => ({
          question: f.question || f.q || "",
          answer: f.answer || f.a || "",
        }));
      }
    } catch {
      faqs = [];
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    seoTitle: row.seo_title,
    description: row.description,
    body: body,
    paragraphs: body.split(/\n\s*\n/).filter(Boolean),
    checks: checks.split("\n").filter(Boolean),
    image: row.image,
    imageAlt: row.image_alt,
    published: row.published,
    city: row.city || "gurgaon",
    faqs: Array.isArray(faqs) ? faqs : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublishedBlogPosts(city = "gurgaon") {
  "use cache";
  cacheTag("blog_posts", `blog_posts_${city}`);
  try {
    const sql = getDatabaseClient();
    const rows = await sql`
      SELECT id, slug, category, title, seo_title, description, body, checks,
        image, image_alt, published, city, faqs, created_at, updated_at
      FROM blog_posts
      WHERE published = true 
        AND LOWER(COALESCE(city, 'gurgaon')) = LOWER(${city})
      ORDER BY created_at DESC
    `;

    return rows.map(toArticle);
  } catch (error) {
    return [];
  }
}

export async function getPublishedBlogPost(slug, city = "gurgaon") {
  try {
    const sql = getDatabaseClient();
    const rows = await sql`
      SELECT id, slug, category, title, seo_title, description, body, checks,
        image, image_alt, published, city, faqs, created_at, updated_at
      FROM blog_posts
      WHERE slug = ${slug} 
        AND published = true
        AND LOWER(COALESCE(city, 'gurgaon')) = LOWER(${city})
      LIMIT 1
    `;

    if (rows[0]) {
      return toArticle(rows[0]);
    }
  } catch (error) {
    // fallback
  }

  return null;
}

export async function getAdminBlogPosts(filterCity) {
  const sql = getDatabaseClient();
  const isCityFiltered = filterCity === "gurgaon" || filterCity === "noida";

  const rows = isCityFiltered
    ? await sql`
        SELECT id, slug, category, title, seo_title, description, body, checks,
          image, image_alt, published, city, faqs, created_at, updated_at
        FROM blog_posts
        WHERE LOWER(COALESCE(city, 'gurgaon')) = LOWER(${filterCity})
        ORDER BY updated_at DESC
      `
    : await sql`
        SELECT id, slug, category, title, seo_title, description, body, checks,
          image, image_alt, published, city, faqs, created_at, updated_at
        FROM blog_posts
        ORDER BY updated_at DESC
      `;

  return rows.map(toArticle);
}

export async function getAdminBlogPostBySlug(slug) {
  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT id, slug, category, title, seo_title, description, body, checks,
      image, image_alt, published, city, faqs, created_at, updated_at
    FROM blog_posts
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return rows[0] ? toArticle(rows[0]) : null;
}
