"use server";

import { revalidatePath } from "next/cache";
import { getDatabaseClient } from "@/lib/db";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";

export async function addGalleryItem(formData) {
  const title = (formData.get("title") || "").trim();
  const category = (formData.get("category") || "Interior").trim();
  const imageUrl = (formData.get("imageUrl") || "").trim();
  let city = (formData.get("city") || "").trim();

  if (!city) {
    const active = await getSelectedAdminCity();
    city = active !== "all" ? active : "gurgaon";
  }

  if (!title || !imageUrl) {
    return { error: "Title and Image URL are required." };
  }

  const sql = getDatabaseClient();
  await sql`
    INSERT INTO gallery_items (title, category, image_url, city)
    VALUES (${title}, ${category}, ${imageUrl}, ${city})
  `;

  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteGalleryItem(formData) {
  const id = formData.get("id");
  if (!id) return;

  const sql = getDatabaseClient();
  await sql`
    DELETE FROM gallery_items WHERE id = ${id}
  `;

  revalidatePath("/admin/gallery");
}
