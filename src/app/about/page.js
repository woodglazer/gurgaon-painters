import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import Link from "next/link";
import { getSiteUrl } from "../site-url";
import PageFAQs from "../components/PageFAQs";
import { pageFaqs } from "../components/page-faqs";
import { createSeoMetadata } from "../seo";
import Breadcrumbs from "../components/Breadcrumbs";

const siteUrl = getSiteUrl();

export const metadata = createSeoMetadata({
  title: "About | Gurgaon Painters",
  description: "Meet Gurgaon Painters by Home Glazer. Learn how we plan painting, surface preparation, and finishing for homes and businesses in Gurgaon.",
  ...(siteUrl ? { alternates: { canonical: `${siteUrl}/about` } } : {}),
  openGraph: { url: siteUrl ? `${siteUrl}/about` : undefined, type: "website" },
  twitter: { card: "summary_large_image" },
});

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs width="6xl" items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
            About Gurgaon Painters
          </p>
          <h1 className="max-w-3xl text-5xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-6xl">
            Painting planned around your property and surfaces.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#69645b]">
            Gurgaon Painters by Home Glazer helps homeowners and businesses
            refresh and protect their spaces. Home Glazer was founded in 2008
            and has completed more than 5,000 projects. We serve
            residential and commercial projects across Gurgaon (Gurugram).
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-[#29251f]/10 bg-white p-5 shadow-[0_8px_24px_rgba(35,31,24,0.05)]">
              <dt className="text-sm text-[#69645b]">Serving customers since</dt>
              <dd className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#c2410c]">2008</dd>
            </div>
            <div className="rounded-md border border-[#29251f]/10 bg-white p-5 shadow-[0_8px_24px_rgba(35,31,24,0.05)]">
              <dt className="text-sm text-[#69645b]">Projects completed</dt>
              <dd className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#c2410c]">5,000+</dd>
            </div>
          </dl>
          <div className="mt-8 grid gap-6 border-t border-[#29251f]/10 pt-6 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-medium text-[#29251f]">What we do</h2>
              <p className="mt-3 leading-7 text-[#69645b]">
                From a single room to a full repaint, we discuss the space,
                surface condition, intended use, and finish before recommending
                the relevant service. Work includes homes, apartments, offices,
                and retail spaces in Gurgaon.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-medium text-[#29251f]">How we work</h2>
              <p className="mt-3 leading-7 text-[#69645b]">
                We begin with a free consultation, then arrange a site visit to
                review the space and plan the work. You receive a clear quote
                before execution; preparation and finishing depend on the
                surface and selected coating system.
              </p>
            </div>
          </div>
          <section className="mt-10 border-t border-[#29251f]/10 pt-8" aria-labelledby="our-process-heading">
            <h2 id="our-process-heading" className="text-2xl font-medium text-[#29251f]">A clear process from first discussion to finish</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Free consultation", "Tell us about your property, requirements and preferred finish."],
                ["Site visit and planning", "Review the surfaces, access and work areas at the property."],
                ["Transparent quote", "Agree on the work scope and quote before the project begins."],
                ["Execution", "The team carries out the agreed preparation and painting work."],
              ].map(([title, text], index) => (
                <li key={title} className="rounded-md border border-[#29251f]/10 bg-white p-5 shadow-[0_8px_24px_rgba(35,31,24,0.05)]">
                  <span className="text-xs font-bold tracking-[0.18em] text-[#c2410c]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg font-semibold text-[#29251f]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#69645b]">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#c2410c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#9a3412]"
          >
            Talk to our team
          </Link>
        </div>
      </section>
      <PageFAQs faqs={pageFaqs.about} title="About Gurgaon Painters: common questions" className="bg-[#f6f6f4]" />
      <Footer />
    </main>
  );
}
