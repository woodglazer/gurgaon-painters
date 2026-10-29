import BlogPostForm from "../blog-post-form";
import AdminBlogBreadcrumbs from "../admin-blog-breadcrumbs";

export const metadata = {
  title: "Write a post | Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return (
    <div className="w-full">
      <AdminBlogBreadcrumbs currentPage="New post" />
      <h1 className="mt-2 text-3xl font-semibold text-[#29251f]">Write a post</h1>
      <p className="mt-2 text-sm leading-6 text-[#746f68]">
        Add the article content and choose whether to publish it now or save it as a draft.
      </p>
      <BlogPostForm />
    </div>
  );
}
