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
 * Robust prompt instructions to bypass AI detectors and create high-ranking humanized content.
 */
function buildHumanizedPrompt(city, existingSlugs) {
  const cityName = city === "noida" ? "Noida & Greater Noida" : "Gurgaon (Gurugram)";
  const brandName = city === "noida" ? "Noida Painters" : "Gurgaon Painters";

  return `
You are a senior residential painting contractor and architectural finishing consultant based in ${cityName}, India.
Write an authentic, highly practical, and engaging SEO-optimized blog post for ${brandName}.

TARGET CITY: ${cityName}
RESTRICTION: Do not write about these topics/slugs as they already exist: ${existingSlugs.slice(0, 15).join(", ")}.

CRITICAL HUMANIZATION & ANTI-AI DETECTION RULES:
1. NEVER use generic AI cliches such as: "delve", "bustling", "moreover", "furthermore", "in conclusion", "it is important to note", "testament to", "game changer", "tapestry", "beacon".
2. Vary sentence length naturally: combine punchy 4-word sentences with descriptive 20-word observations. This high burstiness mimics human writing.
3. Include real ground-level NCR insights:
   - Specific local weather challenges: intense summer heat, dust storms, monsoon dampness (seelan), air pollution settling on facades.
   - Mention popular residential zones naturally (e.g. for Gurgaon: DLF Phase 1-5, Golf Course Road, Sohna Road, Sector 57, New Gurgaon; for Noida: Sector 62, 137, Expressway, Sector 50, Sector 150).
   - Practical paint recommendations: e.g., Asian Paints Royale Luxury Emulsion, Apex Ultima, Damp Sheath, Berger WeatherCoat, PU Italian Wood Polish.
4. Voice: Honest, experienced, reassuring, and consultative.

REQUIRED OUTPUT FORMAT:
You MUST respond with pure JSON only (no markdown code blocks, no backticks, no extra text).
The JSON object must have this exact structure:
{
  "title": "Natural title with primary keyword (max 70 characters)",
  "slug": "url-friendly-slug-with-city-name-at-end",
  "category": "Interior Planning | Exterior Painting | Waterproofing | Colour Advice | Wood Finish",
  "seoTitle": "High CTR SEO Meta Title (max 65 chars)",
  "description": "Engaging meta description with keyword and call to action (140-155 characters)",
  "imageType": "interior | exterior | waterproofing | texture | wood",
  "imageAlt": "Specific descriptive alt text for the featured photo",
  "checks": [
    "Practical actionable tip 1",
    "Practical actionable tip 2",
    "Practical actionable tip 3",
    "Practical actionable tip 4"
  ],
  "body": "A comprehensive 700 to 1100 word detailed article written in well-structured paragraphs with natural line breaks (\n\n) between paragraphs and clear subheadings (formatted simply with bold like **Subheading Title**). Explain preparation, paint comparison, cost considerations, and maintenance."
}
`;
}

export async function generateAIBlogPost(city, options = { autoPublish: false }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const sql = getDatabaseClient();

  // 1. Get existing slugs for this city to prevent duplicate topics
  const existingRows = await sql`
    SELECT slug FROM blog_posts WHERE LOWER(city) = LOWER(${city})
  `;
  const existingSlugs = existingRows.map((r) => r.slug);

  const prompt = buildHumanizedPrompt(city, existingSlugs);

  // Call Gemini 2.5 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.75,
        topP: 0.95,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
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
    // Strip markdown formatting if any was returned
    const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    generated = JSON.parse(cleaned);
  }

  // Ensure unique slug
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

  // Insert into blog_posts table
  const [newPost] = await sql`
    INSERT INTO blog_posts (
      slug, category, title, seo_title, description, body, checks,
      image, image_alt, published, city
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
      ${city}
    )
    RETURNING id, slug, title, city, published
  `;

  console.log(`[AI Blog Generated] -> ID: ${newPost.id}, City: ${city}, Published: ${newPost.published}`);
  return newPost;
}
