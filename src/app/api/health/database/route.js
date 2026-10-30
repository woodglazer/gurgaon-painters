import { neon } from "@neondatabase/serverless";
import { connection } from "next/server";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  await connection();
  const databaseUrl = process.env.DATABASE_URL;
  const authUrl = process.env.NEON_AUTH_BASE_URL;

  let authHost = null;
  try {
    if (authUrl) {
      authHost = new URL(authUrl).host;
    }
  } catch {}

  let dbHost = null;
  try {
    if (databaseUrl) {
      dbHost = new URL(databaseUrl).host;
    }
  } catch {}

  if (!databaseUrl) {
    return Response.json(
      { database: "unavailable", dbHost, authHost },
      { status: 200, headers: noStore },
    );
  }

  try {
    const sql = neon(databaseUrl);
    await sql`SELECT 1`;

    return Response.json({ database: "ok", dbHost, authHost }, { headers: noStore });
  } catch {
    return Response.json(
      { database: "unavailable", dbHost, authHost },
      { status: 200, headers: noStore },
    );
  }
}
