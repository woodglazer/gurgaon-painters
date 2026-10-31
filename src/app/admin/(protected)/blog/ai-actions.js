"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminAccess } from "@/lib/auth/admin";
import { generateAIBlogPost } from "@/lib/ai-blog-generator";

export async function generateBlogAction(city) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    return { error: "Unauthorized access" };
  }

  try {
    const post = await generateAIBlogPost(city, { autoPublish: false });
    revalidatePath("/", "layout");
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    try {
      revalidateTag("blog_posts");
    } catch (e) {
      // ignore
    }
    return { success: true, title: post.title, slug: post.slug };
  } catch (err) {
    return { error: err?.message || "Failed to generate blog post." };
  }
}
