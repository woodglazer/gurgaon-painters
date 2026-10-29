"use server";

import { getAuth } from "@/lib/auth/server";

export async function createAdminAccount(password) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    return { error: "Admin account setup is not configured." };
  }

  if (typeof password !== "string" || password.length < 8) {
    return { error: "Choose a password with at least 8 characters." };
  }

  const { data, error } = await getAuth().signUp.email({
    email: adminEmail,
    name: "Admin",
    password,
  });

  if (error) {
    return { error: error.message || "Unable to create the admin account." };
  }

  return {
    success: true,
    emailVerified: Boolean(data?.user?.emailVerified),
  };
}
