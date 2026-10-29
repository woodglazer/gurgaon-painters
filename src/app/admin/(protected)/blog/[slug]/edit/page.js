import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getAdminBlogPostBySlug } from "@/lib/blogs";
import BlogPostForm from "../../blog-post-form";
import AdminBlogBreadcrumbs from "../../admin-blog-breadcrumbs";

export const metadata = {
  title: "Edit post | Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }) {
  await connection();
  const { slug } = await params;
  const post = await getAdminBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="w-full">
      <AdminBlogBreadcrumbs currentPage="Edit" />
      <h1 className="mt-2 text-3xl font-semibold text-[#29251f]">Edit post</h1>
      <p className="mt-2 text-sm leading-6 text-[#746f68]">
        Update the article, search preview, image, or publishing status.
      </p>
      <BlogPostForm post={post} />
    </div>
  );
}
