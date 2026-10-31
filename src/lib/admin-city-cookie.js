"use server";

import { cookies } from "next/headers";

export async function setSelectedAdminCity(city) {
  const cookieStore = await cookies();
  if (!city || city === "all") {
    cookieStore.delete("admin_selected_city");
  } else {
    cookieStore.set("admin_selected_city", city, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days persistence
      sameSite: "lax",
    });
  }
}

export async function getSelectedAdminCity() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_selected_city")?.value || "all";
}
