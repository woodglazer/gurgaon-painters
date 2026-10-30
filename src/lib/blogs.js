import "server-only";
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
    body: `Paint finish affects how a wall reflects light and how visible small surface marks may be. Before choosing a sheen, consider how the room is used, the wall's condition, and the finish recommended for the paint product. There is no single finish that is right for every room.

For bedrooms and quieter spaces, many homeowners prefer a softer, less reflective look. Busy areas may need a finish that the manufacturer identifies as more washable. Kitchens, bathrooms, and utility areas also need product choices suitable for their moisture and cleaning conditions; paint alone does not solve leaks or persistent damp.

In Gurgaon homes, daylight, warm artificial lighting, and room orientation can make the same shade look different. Test a sample on the actual wall and view it at different times of day before confirming the colour. Ask your painter to assess unevenness, old coatings, cracks, or repairs, since surface preparation can affect the final appearance.`,
    paragraphs: [
      "Paint finish affects how a wall reflects light and how visible small surface marks may be. Before choosing a sheen, consider how the room is used, the wall's condition, and the finish recommended for the paint product. There is no single finish that is right for every room.",
      "For bedrooms and quieter spaces, many homeowners prefer a softer, less reflective look. Busy areas may need a finish that the manufacturer identifies as more washable. Kitchens, bathrooms, and utility areas also need product choices suitable for their moisture and cleaning conditions; paint alone does not solve leaks or persistent damp.",
      "In Gurgaon homes, daylight, warm artificial lighting, and room orientation can make the same shade look different. Test a sample on the actual wall and view it at different times of day before confirming the colour. Ask your painter to assess unevenness, old coatings, cracks, or repairs, since surface preparation can affect the final appearance.",
    ],
    checks: [
      "Decide how often the wall will be touched or cleaned.",
      "Check the product label for recommended surfaces and care guidance.",
      "Test the colour in the room's natural and evening light.",
      "Agree on repairs and preparation before the painting starts.",
    ],
    image: "/images/service-interior.webp",
    imageAlt: "Freshly painted home interior",
    published: true,
    createdAt: "2026-10-26T06:45:17.928Z",
    updatedAt: "2026-10-26T06:45:17.928Z",
  },
  {
    id: "fallback-exterior-repainting",
    slug: "exterior-house-repainting-checklist-gurgaon",
    category: "Exterior painting",
    title: "What to check before repainting your home's exterior",
    seoTitle: "Exterior Repainting Checklist for Gurgaon | Gurgaon Painters",
    description:
      "Inspect the existing coating and resolve surface or moisture problems before selecting an exterior paint system.",
    body: `A good exterior repaint starts with an inspection, not just a new colour. Look for peeling or blistering paint, powdery or chalky patches, cracks, flaking plaster, and stains that return after rain. These signs can have different causes, so identify the affected areas before covering them.

Ask what preparation is included in the quote: cleaning, removal of loose paint, crack or plaster repairs, primer, number of coats, and protection of nearby fixtures. The exact scope depends on the condition of the facade. Any recurring damp should be investigated and addressed at its source before repainting that area.

Gurgaon's heat, dust, monsoon rain, and sun exposure can affect when exterior work is practical. The surface needs to be suitable and dry for the selected product, and its instructions should guide application conditions. Ask the contractor to explain the proposed materials and sequence for your property rather than relying on a generic promise of durability.`,
    paragraphs: [
      "A good exterior repaint starts with an inspection, not just a new colour. Look for peeling or blistering paint, powdery or chalky patches, cracks, flaking plaster, and stains that return after rain. These signs can have different causes, so identify the affected areas before covering them.",
      "Ask what preparation is included in the quote: cleaning, removal of loose paint, crack or plaster repairs, primer, number of coats, and protection of nearby fixtures. The exact scope depends on the condition of the facade. Any recurring damp should be investigated and addressed at its source before repainting that area.",
      "Gurgaon's heat, dust, monsoon rain, and sun exposure can affect when exterior work is practical. The surface needs to be suitable and dry for the selected product, and its instructions should guide application conditions. Ask the contractor to explain the proposed materials and sequence for your property rather than relying on a generic promise of durability.",
    ],
    checks: [
      "Walk around the facade and note cracks, peeling, and damp marks.",
      "Confirm which repairs, primer, and coats are included in writing.",
      "Ask how windows, plants, flooring, and fixtures will be protected.",
      "Agree on timing based on site conditions and product instructions.",
    ],
    image: "/images/service-exterior.webp",
    imageAlt: "Exterior painting work on a modern home",
    published: true,
    createdAt: "2026-10-26T06:45:17.928Z",
    updatedAt: "2026-10-26T06:45:17.928Z",
  },
  {
    id: "fallback-wall-waterproofing",
    slug: "early-signs-wall-waterproofing-gurgaon",
    category: "Damp & waterproofing",
    title: "Early signs that a wall may need waterproofing",
    seoTitle: "Signs of Wall Damp in Gurgaon | Gurgaon Painters",
    description:
      "Recurring damp marks and peeling paint may signal moisture; find the source before repainting the wall.",
    body: `Watch for damp patches that return, paint that bubbles or peels, powdery white deposits, dark spotting, a persistent musty smell, or plaster that feels soft. These signs can be related to moisture, but they do not identify its source by themselves.

Moisture may come from a plumbing leak, a terrace or bathroom above, an exposed exterior wall, a window joint, or another building detail. Note when the patch appears and whether it changes after rain or water use. A qualified site inspection can help determine what should be checked next.

Painting over a damp patch can hide it temporarily while the underlying issue remains. Repair the source and allow the surface to reach the condition required by the chosen treatment and coating. For recurring or extensive damp, seek an appropriate building or plumbing professional; the right fix depends on the cause and site assessment.`,
    paragraphs: [
      "Watch for damp patches that return, paint that bubbles or peels, powdery white deposits, dark spotting, a persistent musty smell, or plaster that feels soft. These signs can be related to moisture, but they do not identify its source by themselves.",
      "Moisture may come from a plumbing leak, a terrace or bathroom above, an exposed exterior wall, a window joint, or another building detail. Note when the patch appears and whether it changes after rain or water use. A qualified site inspection can help determine what should be checked next.",
      "Painting over a damp patch can hide it temporarily while the underlying issue remains. Repair the source and allow the surface to reach the condition required by the chosen treatment and coating. For recurring or extensive damp, seek an appropriate building or plumbing professional; the right fix depends on the cause and site assessment.",
    ],
    checks: [
      "Photograph the area and note when the stain or smell occurs.",
      "Check nearby plumbing, bathrooms, balconies, windows, and terrace areas.",
      "Ask for the suspected source and proposed repair to be explained.",
      "Repaint only after the moisture issue and surface condition are addressed.",
    ],
    image: "/images/service-waterproofing.webp",
    imageAlt: "Waterproof coating being applied to a terrace",
    published: true,
    createdAt: "2026-10-26T06:45:17.928Z",
    updatedAt: "2026-10-26T06:45:17.928Z",
  },
];

function toArticle(row) {
  const body = row.body || "";
  const checks = row.checks || "";
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublishedBlogPosts() {
  try {
    const sql = getDatabaseClient();
    const rows = await sql`
      SELECT id, slug, category, title, seo_title, description, body, checks,
        image, image_alt, published, created_at, updated_at
      FROM blog_posts
      WHERE published = true
      ORDER BY created_at DESC
    `;

    return rows.map(toArticle);
  } catch (error) {
    console.error("Unable to query blog posts from database:", error?.message);
    return fallbackArticles;
  }
}

export async function getPublishedBlogPost(slug) {
  try {
    const sql = getDatabaseClient();
    const rows = await sql`
      SELECT id, slug, category, title, seo_title, description, body, checks,
        image, image_alt, published, created_at, updated_at
      FROM blog_posts
      WHERE slug = ${slug} AND published = true
      LIMIT 1
    `;

    if (rows[0]) {
      return toArticle(rows[0]);
    }
  } catch (error) {
    console.error(`Unable to query blog post "${slug}" from database:`, error?.message);
  }

  return fallbackArticles.find((article) => article.slug === slug) || null;
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
