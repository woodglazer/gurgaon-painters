import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import { services } from "./services";
import { getSiteUrl } from "../site-url";
import PageFAQs from "../components/PageFAQs";
import { pageFaqs } from "../components/page-faqs";
import { createSeoMetadata } from "../seo";
import Breadcrumbs from "../components/Breadcrumbs";

const siteUrl = getSiteUrl();

export const metadata = createSeoMetadata({
  title: "Painting Services Gurgaon | Gurgaon Painters",
  description: "Explore interior and exterior painting, wall textures, waterproofing, wood and metal finishes, and commercial painting in Gurgaon.",
  ...(siteUrl ? { alternates: { canonical: `${siteUrl}/services` } } : {}),
  openGraph: {
    url: siteUrl ? `${siteUrl}/services` : undefined,
    type: "website",
    images: ["/images/service-interior.webp"],
  },
  twitter: { card: "summary_large_image", images: ["/images/service-interior.webp"] },
});

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs width="6xl" items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">Gurgaon &amp; Gurugram</p>
            <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">Painting services for your property</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#69645b]">Explore painting and surface finishing services for homes, apartments, offices, shops, and commercial properties across Gurgaon.</p>
          </header>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.slug} className="overflow-hidden rounded-md border border-[#29251f]/10 bg-white">
                <Link href={`/services/${service.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c2410c]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-[#29251f]">{service.shortTitle}</h2>
                    <p className="mt-3 text-sm leading-6 text-[#69645b]">{service.description}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-[#c2410c]">Explore service <span aria-hidden="true" className="ml-2">→</span></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PageFAQs faqs={pageFaqs.services} title="Painting services FAQs" className="bg-white" />
      <Footer />
    </main>
  );
}
