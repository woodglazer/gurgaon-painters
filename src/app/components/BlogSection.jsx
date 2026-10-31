import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/lib/blogs";

export default async function BlogSection() {
  const publishedArticles = await getPublishedBlogPosts("gurgaon");
  const articles = (publishedArticles || []).slice(0, 3);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      id="blog"
      className="bg-[#f9f9f7] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16"
      aria-labelledby="blog-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-6 max-w-3xl text-center sm:mb-8">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#29251f]">
            <span className="h-px w-8 bg-[#c2410c]" />
            From the blog
            <span className="h-px w-8 bg-[#c2410c]" />
          </p>
          <h2
            id="blog-heading"
            className="text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl lg:text-6xl"
          >
            Painting guides and practical advice.
          </h2>
          <p className="mt-4 text-base text-[#69645b] sm:text-lg">
            Straightforward guidance on planning, materials, and care.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col overflow-hidden rounded-md border border-[#29251f]/10 bg-white shadow-[0_8px_24px_rgba(35,31,24,0.06)]"
            >
              <Link
                href={`/blog/${article.slug}`}
                className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c2410c]"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-[#e8e4de]">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c2410c]">
                    {article.category}
                  </span>
                  <h3 className="mt-1 text-lg font-medium leading-snug tracking-[-0.02em] text-[#29251f] group-hover:text-[#c2410c] sm:text-xl">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#69645b]">
                    {article.description}
                  </p>
                  <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#29251f] group-hover:text-[#c2410c]">
                    Read article →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#29251f] transition-colors hover:text-[#c2410c]"
          >
            View all articles
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
