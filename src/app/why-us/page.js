import { Building2, Check, Paintbrush, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import { getSiteUrl } from "../site-url";
import PageFAQs from "../components/PageFAQs";
import { pageFaqs } from "../components/page-faqs";
import { createSeoMetadata } from "../seo";
import Breadcrumbs from "../components/Breadcrumbs";

const siteUrl = getSiteUrl();
const reasons = [
  { title: "Experience to draw on", description: "Home Glazer reports being founded in 2008 and completing more than 5,000 projects. Each property's surface and scope still need an individual assessment.", icon: Check },
  { title: "Preparation matters", description: "Surface condition, repairs, protection, and the agreed coating system are discussed as part of planning the work.", icon: Paintbrush },
  { title: "Site discussion before work", description: "A site visit helps clarify the property, requirements, colour preferences, and practical details before a quote is agreed.", icon: ShieldCheck },
  { title: "Coordinated project scope", description: "Project coordination and on-site supervision help the team follow the agreed work scope and sequence.", icon: Building2 },
];

export const metadata = createSeoMetadata({
  title: "Why Us | Gurgaon Painters",
  description: "Learn how Home Glazer plans surface preparation, site visits, painting scope, and project coordination for Gurgaon properties.",
  ...(siteUrl ? { alternates: { canonical: `${siteUrl}/why-us` } } : {}),
  openGraph: { url: siteUrl ? `${siteUrl}/why-us` : undefined, type: "website" },
});

export default function WhyUsPage() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs width="6xl" items={[{ label: "Home", href: "/" }, { label: "Why Us" }]} />
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">Our approach</p>
            <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">Why choose Gurgaon Painters?</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#69645b]">A considered painting project begins with understanding the property, the surface, and what you want to achieve. Here is how Home Glazer approaches painting work in Gurgaon and Gurugram.</p>
          </header>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-md border border-[#29251f]/10 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c2410c]/10 text-[#c2410c]"><Icon size={20} strokeWidth={1.7} aria-hidden="true" /></span>
                <h2 className="mt-5 text-xl font-semibold text-[#29251f]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#69645b]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-6xl border-t border-[#29251f]/15 pt-7 text-center">
            <h2 className="text-2xl font-semibold text-[#29251f]">Plan a painting project in Gurgaon</h2>
            <p className="mt-3 leading-7 text-[#69645b]">Explore our painting services or share your requirements for a site discussion and quote.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/services" className="inline-flex min-h-12 items-center rounded-full border border-[#c2410c] px-6 text-sm font-bold text-[#c2410c] transition-colors hover:bg-[#c2410c] hover:text-white">Explore services</Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center rounded-full bg-[#c2410c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#9a3412]">Contact our team</Link>
            </div>
          </div>
        </div>
      </section>
      <PageFAQs faqs={pageFaqs.whyUs} title="Why choose Gurgaon Painters? FAQs" className="bg-white" />
      <Footer />
    </main>
  );
}
