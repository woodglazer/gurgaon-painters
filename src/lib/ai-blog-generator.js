"server-only";

import { getDatabaseClient } from "./db";

const DEFAULT_IMAGE_MAP = {
  interior: "/images/service-interior.webp",
  exterior: "/images/service-exterior.webp",
  waterproofing: "/images/service-waterproofing.webp",
  texture: "/images/service-texture.webp",
  wood: "/images/service-wood.webp",
};

/**
 * High-CTR Title Formulas:
 * 1. Number + Benefit + City (e.g., 5 Costly Painting Mistakes in Gurgaon & How to Avoid Them)
 * 2. Cost / Price transparency (e.g., House Painting Cost in Noida (2026 Price Breakdown))
 * 3. Before You Hire (e.g., Hiring Painters in Gurgaon? 7 Questions You Must Ask First)
 * 4. Specific Problem Solver (e.g., How to Stop Monsoon Wall Seelan in Noida High-Rise Flats)
 */
function buildHumanizedPrompt(city, existingSlugs) {
  const cityName = city === "noida" ? "Noida & Greater Noida" : "Gurgaon (Gurugram)";
  const brandName = city === "noida" ? "Noida Painters" : "Gurgaon Painters";

  return `
You are a senior residential painting contractor and architectural finishing consultant based in ${cityName}, India.
Write an authentic, highly practical, and engaging SEO-optimized blog post for ${brandName}.

TARGET CITY: ${cityName}
RESTRICTION: Do not write about these topics/slugs as they already exist: ${existingSlugs.slice(0, 15).join(", ")}.

HIGH-CTR SEO TITLE & META RULES (CRITICAL):
1. 'seoTitle' must be an irresistible, clickable headline designed to maximize Click-Through Rate (CTR) on Google search (between 50 to 60 characters).
   Use proven high-CTR copywriting patterns:
   - Specific Numbers & Years: e.g., "Cost of Painting 3BHK in Gurgaon (2026 Price List)"
   - Warning / Mistake avoidance: e.g., "5 Painting Mistakes Most Noida Homeowners Regret"
   - Curiosity & Direct Solution: e.g., "Wall Seelan in Noida? Real Fixes That Actually Work"
   - Branded Hook: End naturally with | ${brandName} if space permits.
2. 'description' (Meta Description): 145-155 characters. Must contain a compelling problem hook, a real metric or brand mention, and a clear action (e.g., "Discover actual per sq. ft. rates and expert tips before hiring.").
3. NEVER make titles clickbaity without delivering real substance in the article.

CRITICAL HUMANIZATION & ANTI-AI DETECTION RULES:
1. NEVER use generic AI cliches such as: "delve", "bustling", "moreover", "furthermore", "in conclusion", "it is important to note", "testament to", "game changer", "tapestry", "beacon".
2. Vary sentence length naturally: combine punchy 4-word sentences with descriptive 20-word observations. This high burstiness mimics human writing.
3. Include real ground-level NCR insights:
   - Specific local weather challenges: intense summer heat, dust storms, monsoon dampness (seelan), air pollution settling on facades.
   - Mention popular residential zones naturally (e.g. for Gurgaon: DLF Phase 1-5, Golf Course Road, Sohna Road, Sector 57, New Gurgaon; for Noida: Sector 62, 137, Expressway, Sector 50, Sector 150).
   - Practical paint recommendations: e.g., Asian Paints Royale Luxury Emulsion, Apex Ultima, Damp Sheath, Berger WeatherCoat, PU Italian Wood Polish.
4. Voice: Honest, experienced, reassuring, and consultative.

FAQS REQUIREMENT (FOR GOOGLE PAA):
Generate 3 to 4 hyper-relevant, high search-intent Frequently Asked Questions (FAQs) that local homeowners in ${cityName} actually search on Google.
Answers must be direct, crisp (40-65 words each), and mention realistic local estimates or practical timelines.

REQUIRED OUTPUT FORMAT:
You MUST respond with pure JSON only (no markdown code blocks, no backticks, no extra text).
The JSON object must have this exact structure:
{
  "title": "Clear readable post title with primary keyword (max 70 characters)",
  "slug": "url-friendly-slug-with-city-name-at-end",
  "category": "Interior Planning | Exterior Painting | Waterproofing | Colour Advice | Wood Finish",
  "seoTitle": "Irresistible High-CTR Clickable Google Title (50-60 characters)",
  "description": "Compelling meta description with keyword and CTR hook (145-155 characters)",
  "imageType": "interior | exterior | waterproofing | texture | wood",
  "imageAlt": "Specific descriptive alt text for the featured photo",
  "checks": [
    "Practical actionable tip 1",
    "Practical actionable tip 2",
    "Practical actionable tip 3",
    "Practical actionable tip 4"
  ],
  "faqs": [
    {
      "q": "Exact high-intent customer question?",
      "a": "Direct, practical, 40-60 word answer tailored for ${cityName} homeowners."
    },
    {
      "q": "Another pricing or process question?",
      "a": "Direct, helpful answer with realistic details."
    },
    {
      "q": "Third relevant question?",
      "a": "Direct, helpful answer with realistic details."
    }
  ],
  "body": "A comprehensive 700 to 1100 word detailed article written in well-structured paragraphs with natural line breaks (\\n\\n) between paragraphs and clear subheadings (formatted simply with bold like **Subheading Title**). Explain preparation, paint comparison, cost considerations, and maintenance."
}
`;
}

export async function generateAIBlogPost(city, options = { autoPublish: false }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const sql = getDatabaseClient();

  const existingRows = await sql`
    SELECT slug FROM blog_posts WHERE LOWER(city) = LOWER(${city})
  `;
  const existingSlugs = existingRows.map((r) => r.slug);

  const prompt = buildHumanizedPrompt(city, existingSlugs);

  const candidateModels = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  let response;
  let lastError = "";

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8, // Slightly higher creativity for punchier hooks
            topP: 0.95,
            responseMimeType: "application/json",
          },
        }),
      });

      if (res.ok) {
        response = res;
        console.log(`[AI Generator] Successfully used model: ${model}`);
        break;
      } else {
        const errTxt = await res.text();
        lastError = `${model} (${res.status}): ${errTxt}`;
      }
    } catch (e) {
      lastError = e?.message || "Network error";
    }
  }

  if (!response) {
    throw new Error(`Gemini API error with all models: ${lastError}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini returned empty content.");
  }

  let generated;
  try {
    generated = JSON.parse(rawText);
  } catch (err) {
    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    generated = JSON.parse(cleaned);
  }

  let finalSlug = generated.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!finalSlug.includes(city)) {
    finalSlug = `${finalSlug}-${city}`;
  }

  const checkSlug = await sql`SELECT id FROM blog_posts WHERE slug = ${finalSlug} LIMIT 1`;
  if (checkSlug.length > 0) {
    finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
  }

  const image = DEFAULT_IMAGE_MAP[generated.imageType] || DEFAULT_IMAGE_MAP.interior;
  const checksString = Array.isArray(generated.checks) ? generated.checks.join("\n") : (generated.checks || "");
  const faqsJson = Array.isArray(generated.faqs) ? JSON.stringify(generated.faqs) : "[]";

  const [newPost] = await sql`
    INSERT INTO blog_posts (
      slug, category, title, seo_title, description, body, checks,
      image, image_alt, published, city, faqs
    ) VALUES (
      ${finalSlug},
      ${generated.category || "Painting Tips"},
      ${generated.title},
      ${generated.seoTitle || generated.title},
      ${generated.description},
      ${generated.body},
      ${checksString},
      ${image},
      ${generated.imageAlt || generated.title},
      ${options.autoPublish === true},
      ${city},
      ${faqsJson}::jsonb
    )
    RETURNING id, slug, title, city, published
  `;

  console.log(`[AI Blog Generated with High CTR SEO Title] -> ID: ${newPost.id}, City: ${city}`);
  return newPost;
}
