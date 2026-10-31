import { generateAIBlogPost } from "@/lib/ai-blog-generator";

export const maxDuration = 60; // Allow 60 seconds for AI generation

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Verify secret token or Vercel Cron Header
  const validSecret = process.env.CRON_SECRET || "painters_daily_blog_cron_secret_2026";
  const isAuthorized =
    authHeader === `Bearer ${validSecret}` ||
    secret === validSecret ||
    request.headers.get("x-vercel-cron") === "1";

  if (!isAuthorized) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const autoPublish = searchParams.get("publish") === "true";

    // 1. Generate 1 blog for Gurgaon
    const gurgaonPost = await generateAIBlogPost("gurgaon", { autoPublish });

    // 2. Generate 1 blog for Noida
    const noidaPost = await generateAIBlogPost("noida", { autoPublish });

    return Response.json({
      success: true,
      message: "Daily blogs generated successfully!",
      posts: [gurgaonPost, noidaPost],
    });
  } catch (error) {
    console.error("Cron AI Blog generation error:", error);
    return Response.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
