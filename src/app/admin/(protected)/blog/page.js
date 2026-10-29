import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight, BookOpen, FilePenLine, Plus } from "lucide-react";
import { getAdminBlogPosts } from "@/lib/blogs";
import { setBlogPostStatus } from "./actions";
import DeleteBlogButton from "./delete-blog-button";

export const metadata = {
  title: "Blog | Admin Dashboard",
  robots: { index: false, follow: false },
};

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export default async function AdminBlogPage() {
  await connection();
  const posts = await getAdminBlogPosts();
  const publishedCount = posts.filter((post) => post.published).length;
  const draftCount = posts.length - publishedCount;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#a27942]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#29251f]">Blog posts</h1>
          <p className="mt-2 text-sm leading-6 text-[#746f68]">
            Write articles, save drafts, and manage what appears on the public blog.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-md bg-[#c2410c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a3412]"
        >
          <Plus size={16} aria-hidden="true" />
          Write a post
        </Link>
      </header>

      <section aria-label="Blog totals" className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "All posts", value: posts.length },
          { label: "Published", value: publishedCount },
          { label: "Drafts", value: draftCount },
        ].map(({ label, value }) => (
          <article
            key={label}
            className="rounded-md border border-[#e9e3d9] bg-white p-4"
          >
            <p className="text-sm font-medium text-[#746f68]">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-[#29251f]">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-[#e9e3d9] bg-white">
        <div className="flex items-center gap-3 border-b border-[#eee9e2] px-5 py-4">
          <BookOpen size={18} className="text-[#a27942]" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-[#29251f]">All posts</h2>
            <p className="mt-1 text-xs text-[#817a6e]">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <h3 className="font-semibold text-[#29251f]">No blog posts yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817a6e]">
              Create a post to start building your public painting guides.
            </p>
            <Link
              href="/admin/blog/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c2410c] hover:text-[#9a3412]"
            >
              Create your first post <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-[#817a6e]">
                <tr>
                  <th scope="col" className="px-5 py-3">Article</th>
                  <th scope="col" className="px-5 py-3">Updated</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                  <th scope="col" className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece6]">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#38332c]">{post.title}</p>
                      <p className="mt-1 text-xs text-[#817a6e]">
                        {post.category} · /blog/{post.slug}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#746f68]">
                      {formatDate(post.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          post.published
                            ? "bg-green-50 text-green-800"
                            : "bg-[#f4eee5] text-[#74634d]"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/blog/${encodeURIComponent(post.slug)}/edit`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#c2410c] hover:text-[#9a3412]"
                        >
                          <FilePenLine size={14} aria-hidden="true" />
                          Edit
                        </Link>
                        <form action={setBlogPostStatus}>
                          <input type="hidden" name="id" value={post.id} />
                          <input type="hidden" name="slug" value={post.slug} />
                          <input
                            type="hidden"
                            name="published"
                            value={post.published ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            className="text-xs font-semibold text-[#504b44] hover:text-[#29251f]"
                          >
                            {post.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <DeleteBlogButton id={post.id} slug={post.slug} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
