import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import { getPublishedBlogPosts } from "@/lib/blogs";
import { connection } from "next/server";
import { getSiteUrl } from "../site-url";
import PageFAQs from "../components/PageFAQs";
import { pageFaqs } from "../components/page-faqs";
import { createSeoMetadata } from "../seo";
import Breadcrumbs from "../components/Breadcrumbs";


export const instant = false;

const siteUrl = getSiteUrl();

export const metadata = createSeoMetadata({
  title: "Painting Guides Gurgaon | Gurgaon Painters",
  description: "Practical painting guides for Gurgaon: choosing interior paint finishes, preparing an exterior repaint, and spotting signs of moisture before painting.",
  ...(siteUrl ? { alternates: { canonical: `${siteUrl}/blog` } } : {}),
  openGraph: { url: siteUrl ? `${siteUrl}/blog` : undefined, type: "website" },
  twitter: { card: "summary_large_image" },
});

export default async function BlogPage() {
  await connection();
  const articles = await getPublishedBlogPosts();

  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs width="6xl" items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-6xl">Practical painting advice for Gurgaon homes.</h1>
          </header>

          <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.slug} className="overflow-hidden rounded-md border border-[#29251f]/10 bg-white shadow-[0_8px_24px_rgba(35,31,24,0.06)]">
                <Link href={`/blog/${article.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c2410c]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c2410c]">{article.category}</p>
                    <h2 className="mt-2 text-xl font-semibold leading-snug text-[#29251f]">{article.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[#69645b]">{article.description}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-[#c2410c]">Read article <span aria-hidden="true" className="ml-2">→</span></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PageFAQs faqs={pageFaqs.blog} title="Gurgaon painting guide FAQs" className="bg-white" />
      <Footer />
    </main>
  );
}
