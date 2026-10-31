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
function wrapText(text, maxCharsPerLine = 38) {
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
 * Generates an AI prompt tailored for painting photography based on the blog title and city.
 */
function buildImagePrompt(title, city, category) {
  const cleanTitle = title.replace(/[^\w\s]/gi, " ").trim();
  const area = city === "noida" ? "Noida" : "Gurgaon";
  return `Ultra realistic architectural photograph of ${cleanTitle}, modern luxury Indian apartment interior in ${area}, smooth freshly painted walls, elegant warm ambient lighting, clean professional painting finish, 8k resolution, cinematic interior design photography, photorealistic, no text, no watermark`;
}

/**
 * Fetches an AI generated image buffer from Pollinations Flux model or fallback.
 */
async function fetchBaseAiImage(prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=675&nologo=true&model=flux`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const res = await fetch(aiUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "GurgaonPaintersBlogAI/1.0" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("[AI Image] Pollinations fetch timed out or failed:", err?.message);
  }

  // Graceful fallback to Unsplash painting/interior buffer
  try {
    const fallbackUrl = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop";
    const fbRes = await fetch(fallbackUrl);
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
 * Main function: Generates the banner image, overlays city logo and blog title,
 * saves to blog_images DB table, and returns the /api/blog/images/{id} URL.
 */
export async function generateAndStoreBrandedBlogImage({ title, city, category }) {
  const width = 1200;
  const height = 675;
  const isNoida = city?.toLowerCase() === "noida";
  const brandName = isNoida ? "Noida Painters" : "Gurgaon Painters";
  const badgeText = `${category ? category.toUpperCase() + " · " : ""}${brandName.toUpperCase()}`;

  // 1. Fetch AI base image
  const prompt = buildImagePrompt(title, city, category);
  let baseBuffer = await fetchBaseAiImage(prompt);

  // If both network fetches fail, create a rich dark aesthetic gradient background
  let baseImageSharp;
  if (baseBuffer) {
    baseImageSharp = sharp(baseBuffer).resize(width, height, { fit: "cover" });
  } else {
    baseImageSharp = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 28, g: 35, b: 48, alpha: 1 },
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

  // 3. Prepare gradient overlays (Top for logo clarity, bottom dark fade for readable text)
  const gradientSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.80" />
          <stop offset="30%" stop-color="#000000" stop-opacity="0.30" />
          <stop offset="50%" stop-color="#000000" stop-opacity="0.0" />
        </linearGradient>
        <linearGradient id="bottomShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="40%" stop-color="#000000" stop-opacity="0.65" />
          <stop offset="75%" stop-color="#000000" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.98" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#topShadow)" />
      <rect width="${width}" height="${height}" fill="url(#bottomShadow)" />
    </svg>
  `);

  // 4. Wrap title text and prepare text SVG
  const titleLines = wrapText(title, 34);
  const lineHeight = 52;
  const startY = height - 90 - (titleLines.length - 1) * lineHeight;

  const titleSvgElements = titleLines
    .map(
      (line, idx) =>
        `<text x="64" y="${startY + idx * lineHeight}" class="title-text">${escapeXml(line)}</text>`
    )
    .join("\n");

  const textSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .badge {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 17px;
          font-weight: 700;
          fill: #f97316;
          letter-spacing: 2px;
        }
        .title-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 44px;
          font-weight: 800;
          fill: #ffffff;
        }
        .sub-tag {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 18px;
          font-weight: 500;
          fill: #e2e8f0;
          opacity: 0.9;
        }
      </style>
      <text x="64" y="${startY - 34}" class="badge">${escapeXml(badgeText)}</text>
      ${titleSvgElements}
      <text x="64" y="${startY + titleLines.length * lineHeight - 12}" class="sub-tag">Verified Estimates · Expert Local Painters · Free Consultation</text>
    </svg>
  `);

  // 5. Composite everything
  const compositeLayers = [
    { input: gradientSvg, top: 0, left: 0 },
  ];

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
    .webp({ quality: 85 })
    .toBuffer();

  // 6. Store directly in Neon DB blog_images table
  const sql = getDatabaseClient();
  const [storedRow] = await sql`
    INSERT INTO blog_images (content_type, image_data)
    VALUES ('image/webp', decode(${finalWebpBuffer.toString("base64")}, 'base64'))
    RETURNING id
  `;

  const finalImageUrl = `/api/blog/images/${storedRow.id}`;
  console.log(`[AI Image Composer] Generated & stored branded banner: ${finalImageUrl}`);
  return finalImageUrl;
}
