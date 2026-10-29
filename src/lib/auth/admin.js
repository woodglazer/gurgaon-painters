import { getAuth } from "./server";

export async function getAdminAccess() {
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
