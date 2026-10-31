"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/admin";
import { generateAIBlogPost } from "@/lib/ai-blog-generator";

export async function generateBlogAction(city) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    return { error: "Unauthorized access" };
  }

  try {
    const post = await generateAIBlogPost(city, { autoPublish: false });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, title: post.title, slug: post.slug };
  } catch (err) {
    return { error: err?.message || "Failed to generate blog post." };
  }
}
