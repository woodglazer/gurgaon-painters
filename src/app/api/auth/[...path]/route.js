import { getAuth } from "@/lib/auth/server";

async function handleAuthRequest(method, ...args) {
  const handler = getAuth().handler()[method];
  return handler(...args);
}

export async function GET(...args) {
  return handleAuthRequest("GET", ...args);
}

export async function POST(...args) {
  return handleAuthRequest("POST", ...args);
}

export async function PUT(...args) {
  return handleAuthRequest("PUT", ...args);
}

export async function DELETE(...args) {
  return handleAuthRequest("DELETE", ...args);
}

export async function PATCH(...args) {
  return handleAuthRequest("PATCH", ...args);
}
