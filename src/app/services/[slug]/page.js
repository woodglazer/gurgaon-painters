import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import Navbar from "../../components/navbar";
import { services } from "../services";
import { getSiteUrl } from "../../site-url";
import PageFAQs from "../../components/PageFAQs";
import { serviceFaqs } from "../../components/page-faqs";
import { createSeoMetadata } from "../../seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import { servicePageContent } from "../service-page-content";
import { BRAND_NAME } from "../../seo";

const relatedGuides = {
  "interior-painting-gurgaon": {
    title: "How to choose the right paint finish for each room",
    slug: "choose-paint-finish-for-each-room",
  },
  "exterior-painting-gurgaon": {
    title: "What to check before repainting your home's exterior",
    slug: "exterior-house-repainting-checklist-gurgaon",
  },
  "wall-texture-painting-gurgaon": {
    title: "How to choose the right paint finish for each room",
    slug: "choose-paint-finish-for-each-room",
  },
  "waterproofing-services-gurgaon": {
    title: "Early signs that a wall may need waterproofing",
    slug: "early-signs-wall-waterproofing-gurgaon",
  },
  "wood-metal-painting-polish-gurgaon": {
    title: "How to choose the right paint finish for each room",
    slug: "choose-paint-finish-for-each-room",
  },
  "commercial-painting-gurgaon": {
    title: "What to check before repainting your property's exterior",
    slug: "exterior-house-repainting-checklist-gurgaon",
  },
};

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  const siteUrl = getSiteUrl();
  const canonical = siteUrl ? `${siteUrl}/services/${service.slug}` : undefined;
  return createSeoMetadata({
    title: service.seoTitle || service.title,
    description: service.description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: { ...(canonical ? { url: canonical } : {}), type: "website", images: [service.image] },
    twitter: { card: "summary_large_image", images: [service.image] },
  });
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const siteUrl = getSiteUrl();
  const serviceUrl = siteUrl ? `${siteUrl}/services/${service.slug}` : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HousePainter",
        "@id": siteUrl ? `${siteUrl}/#local-business` : "#local-business",
        name: BRAND_NAME,
        telephone: "+91 97172 56514",
        ...(siteUrl ? { url: siteUrl } : {}),
        areaServed: {
          "@type": "City",
          name: "Gurugram",
          alternateName: "Gurgaon",
          containedInPlace: { "@type": "AdministrativeArea", name: "Haryana" },
        },
      },
      {
        "@type": "Service",
        "@id": serviceUrl ? `${serviceUrl}/#service` : `#${service.slug}-service`,
        name: service.title,
        description: service.description,
        serviceType: service.shortTitle,
        areaServed: {
          "@type": "City",
          name: "Gurugram",
          alternateName: "Gurgaon",
          containedInPlace: { "@type": "AdministrativeArea", name: "Haryana" },
        },
        provider: { "@id": siteUrl ? `${siteUrl}/#local-business` : "#local-business" },
        ...(serviceUrl ? { url: serviceUrl } : {}),
      },
    ],
  };
  const longSections = servicePageContent[service.slug];

  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <article className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
          <Breadcrumbs inline items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.shortTitle }]} />
          <div className="mt-7 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">Gurgaon &amp; Gurugram</p>
              <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">{service.h1 || service.title}</h1>
              <p className="mt-5 text-lg leading-8 text-[#69645b]">{service.intro}</p>
              <Link href="/contact" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#c2410c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#9a3412]">Request a site discussion</Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image src={service.image} alt={service.imageAlt} fill preload sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
          <section className="mx-auto mt-12 max-w-6xl border-t border-[#29251f]/15 pt-8" aria-labelledby="scope-heading">
            <h2 id="scope-heading" className="text-2xl font-semibold text-[#29251f]">What to discuss for this service</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.details.map((detail, index) => <li key={detail} className="rounded-md border border-[#29251f]/10 bg-white p-5 shadow-[0_8px_24px_rgba(35,31,24,0.05)]">
                <span className="text-xs font-bold tracking-[0.18em] text-[#c2410c]">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-base leading-7 text-[#69645b]">{detail}</p>
              </li>)}
            </ul>
            {!longSections && <p className="mt-8 text-sm leading-6 text-[#777166]">The recommended materials, preparation, and schedule depend on the property and site assessment. Gurgaon Painters by Home Glazer serves residential and commercial projects across Gurgaon (Gurugram).</p>}
          </section>
          {longSections ? (
            <div className="mx-auto mt-12 max-w-6xl space-y-10 border-t border-[#29251f]/15 pt-8">
              {longSections.map((section, index) => (
                <section key={section.heading} aria-labelledby={`service-section-${index}`}>
                  <h2 id={`service-section-${index}`} className="text-2xl font-semibold text-[#29251f]">{section.heading}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-7 text-[#69645b]">{paragraph}</p>)}
                  {section.items && <ul className="mt-4 grid gap-3 sm:grid-cols-2">{section.items.map((item, itemIndex) => <li key={item} className="rounded-md border border-[#29251f]/10 bg-white p-5 shadow-[0_8px_24px_rgba(35,31,24,0.05)]">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#c2410c]">{String(itemIndex + 1).padStart(2, "0")}</span>
                    <p className="mt-2 text-base leading-7 text-[#69645b]">{item}</p>
                  </li>)}</ul>}
                  {section.steps && <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-7 text-[#69645b]">{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
                  {section.closing && <p className="mt-4 text-base leading-7 text-[#69645b]">{section.closing}</p>}
                </section>
              ))}
            </div>
          ) : (
          <section className="mx-auto mt-12 max-w-6xl border-t border-[#29251f]/15 pt-8" aria-labelledby="planning-heading">
            <h2 id="planning-heading" className="text-2xl font-semibold text-[#29251f]">Planning {service.shortTitle.toLowerCase()} in Gurgaon</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {service.guidance.map(({ title, text }) => (
                <article key={title} className="rounded-md border border-[#29251f]/10 bg-white p-5 shadow-[0_8px_24px_rgba(35,31,24,0.05)]">
                  <h3 className="text-lg font-semibold text-[#29251f]">{title}</h3>
                  <p className="mt-2 text-base leading-7 text-[#69645b]">{text}</p>
                </article>
              ))}
            </div>
          </section>
          )}
          <section className="mx-auto mt-12 max-w-6xl rounded-md bg-[#29251f] px-6 py-8 text-center text-white sm:px-10 sm:py-10" aria-labelledby="service-cta-heading">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f2a17e]">Gurgaon &amp; Gurugram</p>
            <h2 id="service-cta-heading" className="mt-3 text-2xl font-semibold sm:text-3xl">Planning {service.shortTitle.toLowerCase()} for your property?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">Talk with Home Glazer about your project and arrange a free site visit.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c2410c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#9a3412]">Get a Free Site Visit</Link>
              <a href="tel:+919717256514" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#29251f]">Call +91 97172 56514</a>
            </div>
          </section>
          <nav aria-label="Other painting services" className="mt-12 border-t border-[#29251f]/15 pt-6">
            <h2 className="text-xl font-semibold text-[#29251f]">Explore other services</h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {services.filter(({ slug: otherSlug }) => otherSlug !== service.slug).map((other) => <li key={other.slug}><Link className="text-sm font-semibold text-[#c2410c] hover:underline" href={`/services/${other.slug}`}>{other.shortTitle} →</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Related painting guides" className="mt-8 border-t border-[#29251f]/15 pt-6">
            <h2 className="text-xl font-semibold text-[#29251f]">Related painting guide</h2>
            <Link
              className="mt-3 inline-flex text-sm font-semibold text-[#c2410c] hover:underline"
              href={`/blog/${relatedGuides[service.slug].slug}`}
            >
              {relatedGuides[service.slug].title} →
            </Link>
          </nav>
        </div>
      </article>
      <PageFAQs faqs={serviceFaqs[service.slug]} title={`${service.shortTitle} FAQs`} className="bg-white" />
      <Footer />
    </main>
  );
}
