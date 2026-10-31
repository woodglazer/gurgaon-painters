import "server-only";
import { neon } from "@neondatabase/serverless";

export function getDatabaseClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be configured to use database storage.");
  }

  return neon(databaseUrl);
}
