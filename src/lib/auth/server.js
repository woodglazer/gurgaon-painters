import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

function requiredEnvironmentVariable(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be set to use Neon Auth.`);
  }

  return value;
}

let auth;

export function getAuth() {
  if (!auth) {
    auth = createNeonAuth({
      baseUrl: requiredEnvironmentVariable("NEON_AUTH_BASE_URL"),
      cookies: {
        secret: requiredEnvironmentVariable("NEON_AUTH_COOKIE_SECRET"),
      },
    });
  }

  return auth;
}
