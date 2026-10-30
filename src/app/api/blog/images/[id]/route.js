import { connection } from "next/server";
import { getDatabaseClient } from "@/lib/db";

const imageIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request, { params }) {
  await connection();
  const { id } = await params;
  if (!imageIdPattern.test(id)) {
    return new Response("Image not found.", { status: 404 });
  }

  try {
    const sql = getDatabaseClient();
    const images = await sql`
      SELECT content_type, encode(image_data, 'base64') AS image_base64
      FROM blog_images
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!images.length) {
      return new Response("Image not found.", { status: 404 });
    }

    return new Response(Buffer.from(images[0].image_base64, "base64"), {
      headers: {
        "Content-Type": images[0].content_type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(`Unable to retrieve blog image "${id}":`, error?.message);
    return new Response("Image not found.", { status: 404 });
  }
}
