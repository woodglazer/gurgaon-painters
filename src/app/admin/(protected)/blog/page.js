export const instant = false;
import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight, BookOpen, FilePenLine, Plus } from "lucide-react";
import { getAdminBlogPosts } from "@/lib/blogs";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";
import { setBlogPostStatus } from "./actions";
import DeleteBlogButton from "./delete-blog-button";
import CityBadge from "../city-badge";
import AIGeneratorButton from "./ai-generator-button";

export const metadata = {
  title: "Blog | Admin Dashboard",
  robots: { index: false, follow: false },
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export default async function AdminBlogPage({ searchParams }) {
  await connection();
  const [resolvedParams, cookieCity] = await Promise.all([
    searchParams,
    getSelectedAdminCity(),
  ]);

  const selectedCity = resolvedParams?.city || (cookieCity !== "all" ? cookieCity : undefined);
  const posts = await getAdminBlogPosts(selectedCity);
  const publishedCount = posts.filter((post) => post.published).length;
  const draftCount = posts.length - publishedCount;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#a27942]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#29251f]">
            {selectedCity
              ? `${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Blog Posts`
              : "Blog Posts"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#746f68]">
            Write articles, save drafts, or generate humanized SEO posts with AI.
          </p>
        </div>
        
        {/* Action Buttons: AI Generate + Manual Write */}
        <div className="flex items-center gap-3">
          <AIGeneratorButton currentCity={selectedCity || "gurgaon"} />

          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-md bg-[#c2410c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a3412]"
          >
            <Plus size={16} aria-hidden="true" />
            Write a post
          </Link>
        </div>
      </header>

      <section aria-label="Blog totals" className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total posts", value: posts.length },
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee9e2] px-5 py-4">
          <div>
            <h2 className="font-semibold text-[#29251f]">
              {selectedCity
                ? `${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Articles`
                : "All articles"}
            </h2>
            <p className="mt-1 text-xs text-[#817a6e]">
              Manage published posts and saved drafts
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74634d] hover:text-[#c2410c]"
          >
            View public blog
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-[#f4eee5] text-[#a27942]">
              <BookOpen size={21} aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-semibold text-[#29251f]">No blog posts found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817a6e]">
              {selectedCity
                ? `No articles created for ${selectedCity} yet.`
                : "Create your first article or use 'AI Write Post' above."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <AIGeneratorButton currentCity={selectedCity || "gurgaon"} />
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-2 rounded-md bg-[#c2410c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a3412]"
              >
                <Plus size={16} aria-hidden="true" />
                Write a post
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-[#817a6e]">
                <tr>
                  <th scope="col" className="px-5 py-3">City</th>
                  <th scope="col" className="px-5 py-3">Title</th>
                  <th scope="col" className="px-5 py-3">Category</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                  <th scope="col" className="px-5 py-3">Last updated</th>
                  <th scope="col" className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece6]">
                {posts.map((post) => (
                  <tr key={post.id} className="align-middle">
                    <td className="px-5 py-4">
                      <CityBadge city={post.city} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/blog/${post.slug}/edit`}
                        className="font-medium text-[#29251f] hover:text-[#c2410c]"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-xs text-[#817a6e]">
                        {post.description}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#504b44]">
                      {post.category}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <form action={setBlogPostStatus} className="inline">
                        <input type="hidden" name="id" value={post.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={post.published ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold transition cursor-pointer ${
                            post.published
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </button>
                      </form>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#746f68]">
                      {formatDate(post.updatedAt || post.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.slug}/edit`}
                          className="inline-flex items-center gap-1 rounded-md border border-[#e9e3d9] bg-white px-2.5 py-1.5 text-xs font-medium text-[#504b44] hover:bg-[#faf9f7] hover:text-[#29251f]"
                        >
                          <FilePenLine size={13} aria-hidden="true" />
                          Edit
                        </Link>
                        <DeleteBlogButton id={post.id} title={post.title} />
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
