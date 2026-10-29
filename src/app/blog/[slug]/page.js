import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import Navbar from "../../components/navbar";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/blogs";
import { connection } from "next/server";
import { getSiteUrl } from "../../site-url";
import PageFAQs from "../../components/PageFAQs";
import { articleFaqs } from "../../components/page-faqs";
import { createSeoMetadata } from "../../seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import BlogContent from "../blog-content";
import { BRAND_NAME } from "../../seo";

const relatedServices = {
  "choose-paint-finish-for-each-room": {
    title: "interior painting services in Gurgaon",
    href: "/services/interior-painting-gurgaon",
  },
  "exterior-house-repainting-checklist-gurgaon": {
    title: "exterior painting services in Gurgaon",
    href: "/services/exterior-painting-gurgaon",
  },
  "early-signs-wall-waterproofing-gurgaon": {
    title: "waterproofing services in Gurgaon",
    href: "/services/waterproofing-services-gurgaon",
  },
};

function formatArticleDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

export const instant = false;

export async function generateMetadata({ params }) {
  await connection();
  const { slug } = await params;
  const article = await getPublishedBlogPost(slug);
  if (!article) return {};

  const siteUrl = getSiteUrl();
  const canonical = siteUrl ? `${siteUrl}/blog/${article.slug}` : undefined;
  return createSeoMetadata({
    title: article.seoTitle || article.title,
    description: article.description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: { ...(canonical ? { url: canonical } : {}), type: "article", images: [article.image] },
    twitter: { card: "summary_large_image", images: [article.image] },
  });
}

export default async function ArticlePage({ params }) {
  await connection();
  const { slug } = await params;
  const [article, articles] = await Promise.all([
    getPublishedBlogPost(slug),
    getPublishedBlogPosts(),
  ]);
  if (!article) notFound();

  const siteUrl = getSiteUrl();
  const articleUrl = siteUrl ? `${siteUrl}/blog/${article.slug}` : undefined;
  const publishedAt = new Date(article.createdAt);
  const updatedAt = new Date(article.updatedAt);
  const relatedService = relatedServices[article.slug];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: siteUrl ? `${siteUrl}${article.image}` : article.image,
    mainEntityOfPage: articleUrl,
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    inLanguage: "en-IN",
  };

  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <article className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
          <Breadcrumbs inline items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: article.title }]} />
          <header className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">{article.category} · Gurgaon Painters guide</p>
            <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">{article.title}</h1>
            <p className="mt-5 max-w-6xl text-lg leading-8 text-[#69645b]">{article.description}</p>
            <p className="mt-4 text-sm text-[#777166]">
              By {BRAND_NAME} · Published{" "}
              <time dateTime={publishedAt.toISOString()}>{formatArticleDate(publishedAt)}</time>
              {updatedAt.getTime() - publishedAt.getTime() > 60_000 && (
                <>
                  {" "}· Updated{" "}
                  <time dateTime={updatedAt.toISOString()}>{formatArticleDate(updatedAt)}</time>
                </>
              )}
            </p>
          </header>
          <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-md">
            <Image src={article.image} alt={article.imageAlt} fill loading="lazy" sizes="(max-width: 767px) 100vw, 896px" className="object-cover" />
          </div>
          <div className="mx-auto mt-8 max-w-6xl text-base leading-8 text-[#514b41]">
            <BlogContent content={article.body} />
            <h2 className="pt-2 text-2xl font-semibold text-[#29251f]">What to check</h2>
            <ul className="list-disc space-y-2 pl-5">
              {article.checks.map((check) => <li key={check}>{check}</li>)}
            </ul>
            <p className="border-t border-[#29251f]/15 pt-6 text-[#69645b]">Every property is different. The right materials and repairs depend on the surface and an on-site assessment.</p>
            {relatedService && (
              <p className="mt-5">
                Learn more about{" "}
                <Link href={relatedService.href} className="font-semibold text-[#c2410c] hover:underline">
                  {relatedService.title}
                </Link>
                .
              </p>
            )}
            <Link href="/contact" className="inline-flex min-h-12 items-center rounded-full bg-[#c2410c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#9a3412]">Discuss your painting project</Link>
          </div>
          <nav aria-label="More painting guides" className="mt-12 border-t border-[#29251f]/15 pt-6">
            <h2 className="text-xl font-semibold text-[#29251f]">More painting guides</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {articles.filter(({ slug: otherSlug }) => otherSlug !== article.slug).map((other) => (
                <li key={other.slug}><Link className="text-[#c2410c] hover:underline" href={`/blog/${other.slug}`}>{other.title} →</Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </article>
      <PageFAQs faqs={articleFaqs[article.slug] || []} title="Questions about this painting guide" className="bg-white" />
      <Footer />
    </main>
  );
}
