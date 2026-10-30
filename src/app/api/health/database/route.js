import { neon } from "@neondatabase/serverless";
import { connection } from "next/server";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  await connection();
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return Response.json(
      { database: "unavailable" },
      { status: 503, headers: noStore },
    );
  }

  try {
    const sql = neon(databaseUrl);
    await sql`SELECT 1`;

    return Response.json({ database: "ok" }, { headers: noStore });
  } catch {
    return Response.json(
      { database: "unavailable" },
      { status: 503, headers: noStore },
    );
  }
}
