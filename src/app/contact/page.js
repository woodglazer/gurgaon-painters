import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import Contact from "../components/Contact";
import { getSiteUrl } from "../site-url";
import PageFAQs from "../components/PageFAQs";
import { pageFaqs } from "../components/page-faqs";
import { createSeoMetadata } from "../seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { DISPLAY_ADDRESS } from "@/lib/business-contact";

const siteUrl = getSiteUrl();

export const metadata = createSeoMetadata({
  title: "Contact | Gurgaon Painters",
  description: "Contact Gurgaon Painters by Home Glazer to discuss painting, waterproofing, wall textures, and other work for your Gurgaon property.",
  ...(siteUrl ? { alternates: { canonical: `${siteUrl}/contact` } } : {}),
  openGraph: { url: siteUrl ? `${siteUrl}/contact` : undefined, type: "website" },
});

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs width="6xl" items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <header className="px-5 pb-0 pt-28 text-center sm:px-8 sm:pt-32 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">Gurgaon &amp; Gurugram</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">Contact Gurgaon Painters</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#69645b]">Tell us about your property and painting requirements. Our team can discuss the scope and arrange a site conversation.</p>
      </header>
      <Contact />
      <section
        className="bg-white px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16"
        aria-labelledby="business-address-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2 id="business-address-heading" className="text-2xl font-semibold text-[#29251f]">
            Service Location
          </h2>
          <address className="mt-3 not-italic text-sm leading-6 text-[#69645b]">
            {DISPLAY_ADDRESS}
          </address>
        </div>
      </section>
      <PageFAQs faqs={pageFaqs.contact} title="Contact and painting quote FAQs" className="bg-[#f6f6f4]" />
      <Footer />
    </main>
  );
}
