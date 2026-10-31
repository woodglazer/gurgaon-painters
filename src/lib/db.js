import "server-only";
import { neon } from "@neondatabase/serverless";

// Mock data for local testing when DATABASE_URL is not set
const mockEnquiries = [
  {
    id: "lead-g-1",
    name: "Rahul Sharma",
    phone: "+91 98111 22334",
    service: "Interior Painting",
    message: "Need 3BHK full apartment painting in DLF Phase 5.",
    status: "new",
    city: "gurgaon",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "lead-n-1",
    name: "Amit Verma",
    phone: "+91 99222 33445",
    service: "Exterior Painting",
    message: "Villa exterior waterproof painting needed in Sector 137.",
    status: "new",
    city: "noida",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "lead-n-2",
    name: "Pooja Gupta",
    phone: "+91 98765 43210",
    service: "Texture Painting",
    message: "Living room wall texture and stencil design in Sector 62.",
    status: "follow_up",
    city: "noida",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: "lead-g-2",
    name: "Vikram Malhotra",
    phone: "+91 98100 11223",
    service: "Waterproofing",
    message: "Balcony and ceiling dampness treatment in Golf Course Road.",
    status: "completed",
    city: "gurgaon",
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
  },
];

const mockBlogRows = [
  {
    id: "blog-1",
    slug: "choose-paint-finish-for-each-room",
    category: "Interior planning",
    title: "How to choose the right paint finish for each room",
    seo_title: "Choosing Paint Finishes in Gurgaon | Gurgaon Painters",
    description: "Choose a paint finish by balancing how a room is used, wall condition, appearance, and the product's care instructions.",
    body: "Paint finish affects how a wall reflects light and how visible small surface marks may be.",
    checks: "Decide how often the wall will be touched\nCheck the product label",
    image: "/images/service-interior.webp",
    image_alt: "Freshly painted home interior",
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "blog-2",
    slug: "exterior-house-repainting-checklist-gurgaon",
    category: "Exterior painting",
    title: "What to check before repainting your home's exterior",
    seo_title: "Exterior Repainting Checklist for Gurgaon | Gurgaon Painters",
    description: "Inspect the existing coating and resolve surface or moisture problems before selecting an exterior paint system.",
    body: "A good exterior repaint starts with an inspection, not just a new colour.",
    checks: "Look for peeling paint\nAsk what preparation is included",
    image: "/images/service-exterior.webp",
    image_alt: "Exterior house repaint",
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

function createMockSql() {
  const handler = async (strings, ...values) => {
    const raw = strings.join(" ");

    // Check if query is for blog posts count
    if (raw.includes("blog_posts") && raw.includes("COUNT(*)")) {
      return [{ published_count: mockBlogRows.filter((b) => b.published).length }];
    }

    // Check if query is for blog posts list
    if (raw.includes("blog_posts")) {
      return mockBlogRows;
    }

    // Check if query is for counts
    if (raw.includes("COUNT(*)")) {
      const cityFilter = values.find((v) => v === "gurgaon" || v === "noida");
      const list = cityFilter
        ? mockEnquiries.filter((e) => e.city === cityFilter)
        : mockEnquiries;

      return [
        {
          total: list.length,
          total_count: list.length,
          new_count: list.filter((e) => e.status === "new").length,
          follow_up: list.filter((e) => e.status === "follow_up").length,
          follow_up_count: list.filter((e) => e.status === "follow_up").length,
          completed: list.filter((e) => e.status === "completed").length,
        },
      ];
    }

    // Default: return list of enquiries
    const cityFilter = values.find((v) => v === "gurgaon" || v === "noida");
    if (cityFilter) {
      return mockEnquiries.filter((e) => e.city === cityFilter);
    }
    return mockEnquiries;
  };

  return handler;
}

export function getDatabaseClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    if (process.env.NODE_ENV === "development") {
      return createMockSql();
    }
    throw new Error("DATABASE_URL must be configured to use enquiry storage.");
  }

  return neon(databaseUrl);
}
