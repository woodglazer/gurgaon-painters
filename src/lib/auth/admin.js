import { getAuth } from "./server";

export async function getAdminAccess() {
  // Local development bypass so you can preview the dashboard without production secrets
  if (process.env.NODE_ENV === "development" && !process.env.NEON_AUTH_BASE_URL) {
    return {
      status: "authorized",
      user: {
        email: process.env.ADMIN_EMAIL || "admin@gurgaonpainters.com",
        name: "Admin",
      },
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    return { status: "unconfigured" };
  }

  const { data: session, error } = await getAuth().getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    return { status: "unauthenticated" };
  }

  if (session.user.email?.trim().toLowerCase() !== adminEmail) {
    return { status: "unauthorized", email: session.user.email };
  }

  if (!session.user.emailVerified) {
    return { status: "unverified", email: session.user.email };
  }

  return { status: "authorized", user: session.user };
}
