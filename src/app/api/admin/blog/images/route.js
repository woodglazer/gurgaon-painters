import { connection } from "next/server";
import sharp from "sharp";
import { getAdminAccess } from "@/lib/auth/admin";
import { getDatabaseClient } from "@/lib/db";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const noStore = { "Cache-Control": "no-store" };

function detectImageType(bytes) {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export async function POST(request) {
  await connection();

  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    return Response.json(
      { error: "Administrator access is required." },
      { status: 403, headers: noStore },
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Select a valid image file and try again." },
      { status: 400, headers: noStore },
    );
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json(
      { error: "Select an image before uploading." },
      { status: 400, headers: noStore },
    );
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return Response.json(
      { error: "Image must be 3 MB or smaller." },
      { status: 413, headers: noStore },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!detectImageType(bytes)) {
    return Response.json(
      { error: "Upload a valid JPEG, PNG, or WebP image." },
      { status: 415, headers: noStore },
    );
  }

  let image;
  try {
    image = await sharp(bytes, { limitInputPixels: MAX_IMAGE_PIXELS })
      .rotate()
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return Response.json(
      { error: "This image is invalid or too large to process." },
      { status: 415, headers: noStore },
    );
  }

  const sql = getDatabaseClient();
  const images = await sql`
    INSERT INTO blog_images (content_type, image_data)
    VALUES ('image/webp', decode(${image.toString("base64")}, 'base64'))
    RETURNING id
  `;

  return Response.json(
    { image: `/api/blog/images/${images[0].id}` },
    { headers: noStore },
  );
}
