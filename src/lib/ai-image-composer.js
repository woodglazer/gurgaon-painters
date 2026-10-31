"server-only";

import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { getDatabaseClient } from "./db";

/**
 * Escapes characters for safe SVG XML insertion.
 */
function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Splits text into lines of max characters, keeping words intact.
 */
function wrapText(text, maxCharsPerLine = 34) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.slice(0, 3); // Max 3 lines
}

/**
 * Generates an AI prompt tailored specifically for painting photography
 * based on the specific blog title, category, and city.
 */
function buildImagePrompt(title, city, category) {
  const cleanTitle = title.replace(/[^\w\s]/gi, " ").trim();
  const area = city === "noida" ? "Noida high-rise flat" : "Gurgaon modern condominium";
  
  // Specific scenes based on category keywords
  let sceneDetail = "fresh painted living room walls with modern Scandinavian furniture";
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("exterior") || category?.toLowerCase().includes("exterior")) {
    sceneDetail = "luxury Indian apartment building exterior facade freshly painted, sunlit day";
  } else if (lowerTitle.includes("waterproof") || lowerTitle.includes("seelan") || lowerTitle.includes("damp")) {
    sceneDetail = "flawless waterproofed painted wall corner next to a large balcony window, dry smooth finish";
  } else if (lowerTitle.includes("cost") || lowerTitle.includes("3bhk") || lowerTitle.includes("flat")) {
    sceneDetail = "spacious premium 3BHK flat interior with pristine freshly painted walls and designer lighting";
  } else if (lowerTitle.includes("wood") || lowerTitle.includes("texture")) {
    sceneDetail = "designer textured accent wall and luxury wood polish craftsmanship in modern room";
  }

  return `Ultra realistic architectural interior design photograph, ${sceneDetail}, situated in ${area}, clean painted surfaces, bright natural architectural sunlight, photorealistic 8k, professional interior magazine photography, no humans, no text, no watermark`;
}

/**
 * Fetches an AI generated image buffer with unique seed per blog.
 */
async function fetchBaseAiImage(prompt, title) {
  // Generate pseudo-random seed from title so each blog gets a unique image
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash) + Math.floor(Math.random() * 10000);
  const encodedPrompt = encodeURIComponent(prompt);
  const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=675&nologo=true&seed=${seed}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(aiUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "PaintersBrandedAI/2.0" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("[AI Image] Pollinations fetch skipped/timed out:", err?.message);
  }

  // Curated diverse photography fallbacks based on seed
  const fallbackCollection = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", // Modern luxury living
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop", // Elegant interior
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop", // Sunlit painted lounge
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop", // Luxury architecture
  ];
  const chosenFallback = fallbackCollection[seed % fallbackCollection.length];

  try {
    const fbRes = await fetch(chosenFallback);
    if (fbRes.ok) {
      const fbBuf = await fbRes.arrayBuffer();
      return Buffer.from(fbBuf);
    }
  } catch (fbErr) {
    console.warn("[AI Image] Fallback fetch failed:", fbErr?.message);
  }

  return null;
}

/**
 * Main function: Generates the banner image, analyzes image brightness,
 * sets high-contrast title color, overlays city logo cleanly,
 * saves to blog_images DB table, and returns the /api/blog/images/{id} URL.
 */
export async function generateAndStoreBrandedBlogImage({ title, city, category }) {
  const width = 1200;
  const height = 675;
  const isNoida = city?.toLowerCase() === "noida";
  const brandName = isNoida ? "Noida Painters" : "Gurgaon Painters";

  // 1. Fetch AI base image
  const prompt = buildImagePrompt(title, city, category);
  let baseBuffer = await fetchBaseAiImage(prompt, title);

  let baseImageSharp;
  if (baseBuffer) {
    baseImageSharp = sharp(baseBuffer).resize(width, height, { fit: "cover" });
  } else {
    baseImageSharp = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 35, g: 45, b: 60, alpha: 1 },
      },
    });
  }

  // 2. Read logo
  const logoFileName = isNoida
    ? "noida-logo-transparent.png"
    : "gurgaon-painters-logo-transparent.png";
  const logoPath = path.join(process.cwd(), "public", logoFileName);

  let logoBuffer = null;
  try {
    const rawLogo = await fs.readFile(logoPath);
    logoBuffer = await sharp(rawLogo)
      .resize({ width: 220, withoutEnlargement: true })
      .toBuffer();
  } catch (err) {
    console.warn(`[AI Image] Logo file not found at ${logoPath}:`, err?.message);
  }

  // 3. Analyze brightness of the bottom region where title is placed
  let textColor = "#FFFFFF";
  let subColor = "#F1F5F9";
  let dropShadowFilter = "drop-shadow(0 2px 8px rgba(0,0,0,0.85)) drop-shadow(0 4px 16px rgba(0,0,0,0.65))";
  let badgeColor = "#FB923C"; // vivid orange

  try {
    if (baseBuffer) {
      const bottomStats = await sharp(baseBuffer)
        .resize(width, height, { fit: "cover" })
        .extract({ left: 0, top: 420, width: 1200, height: 255 })
        .stats();
      
      const avgR = bottomStats.channels[0].mean;
      const avgG = bottomStats.channels[1].mean;
      const avgB = bottomStats.channels[2].mean;
      const perceivedBrightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;

      // If bottom image is very bright white/cream, use dark bold text
      if (perceivedBrightness > 165) {
        textColor = "#0F172A"; // Slate-900 high contrast
        subColor = "#334155";
        badgeColor = "#C2410C"; // Darker orange
        dropShadowFilter = "drop-shadow(0 1px 4px rgba(255,255,255,0.9)) drop-shadow(0 2px 10px rgba(255,255,255,0.7))";
      }
    }
  } catch (e) {
    console.warn("[AI Image] Brightness analysis fallback to default white text");
  }

  // 4. Wrap title text and prepare text SVG with crisp typography and clean drop-shadow (NO HEAVY BLACK OVERLAY)
  const titleLines = wrapText(title, 34);
  const lineHeight = 54;
  const startY = height - 70 - (titleLines.length - 1) * lineHeight;

  const titleSvgElements = titleLines
    .map(
      (line, idx) =>
        `<text x="64" y="${startY + idx * lineHeight}" class="title-text">${escapeXml(line)}</text>`
    )
    .join("\n");

  const badgeText = `${category ? category.toUpperCase() + " · " : ""}${brandName.toUpperCase()}`;

  const textSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Very subtle soft vignette at bottom for guaranteed text contrast without hiding image -->
        <linearGradient id="softBottom" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="60%" stop-color="#000000" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.55" />
        </linearGradient>
      </defs>
      <rect y="${height - 280}" width="${width}" height="280" fill="url(#softBottom)" />
      <style>
        .badge {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 17px;
          font-weight: 700;
          fill: ${badgeColor};
          letter-spacing: 2.5px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }
        .title-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 44px;
          font-weight: 800;
          fill: ${textColor};
          filter: ${dropShadowFilter};
        }
        .sub-tag {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 18px;
          font-weight: 600;
          fill: ${subColor};
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
        }
      </style>
      <text x="64" y="${startY - 32}" class="badge">${escapeXml(badgeText)}</text>
      ${titleSvgElements}
      <text x="64" y="${startY + titleLines.length * lineHeight - 10}" class="sub-tag">Verified Estimates · Expert Local Painters · Free Consultation</text>
    </svg>
  `);

  // 5. Composite logo and text
  const compositeLayers = [];

  if (logoBuffer) {
    compositeLayers.push({
      input: logoBuffer,
      top: 36,
      left: 64,
    });
  }

  compositeLayers.push({
    input: textSvg,
    top: 0,
    left: 0,
  });

  const finalWebpBuffer = await baseImageSharp
    .composite(compositeLayers)
    .webp({
      quality: 85,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer();

  // 6. Store directly in Neon DB blog_images table
  const sql = getDatabaseClient();
  const [storedRow] = await sql`
    INSERT INTO blog_images (content_type, image_data)
    VALUES ('image/webp', decode(${finalWebpBuffer.toString("base64")}, 'base64'))
    RETURNING id
  `;

  const finalImageUrl = `/api/blog/images/${storedRow.id}`;
  console.log(`[AI Image Composer] Generated & stored natural branded banner: ${finalImageUrl}`);
  return finalImageUrl;
}
