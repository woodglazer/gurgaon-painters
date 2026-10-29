import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import PageFAQs from "../components/PageFAQs";
import { createSeoMetadata } from "../seo";
import { getSiteUrl } from "../site-url";
import Breadcrumbs from "../components/Breadcrumbs";

const siteUrl = getSiteUrl();
const cookieFaqs = [
  { question: "What cookie does this website use?", answer: "The site uses a necessary preference cookie named homeglazer-cookie-notice to remember that the cookie notice has been acknowledged. It expires after 180 days." },
  { question: "Does this website use analytics or advertising cookies?", answer: "Google Analytics (GA4) measures page usage and selected enquiry interactions. Advertising cookies are not enabled by this website." },
  { question: "How can I remove the preference cookie?", answer: "You can delete site cookies from your browser settings. If you clear this preference cookie, the notice may appear again." },
];

export const metadata = createSeoMetadata({
  title: "Cookies | Gurgaon Painters",
  description: "Learn which cookies Gurgaon Painters by Home Glazer uses, why the cookie notice preference is stored, and how to clear it.",
  ...(siteUrl ? { alternates: { canonical: `${siteUrl}/cookies` } } : {}),
  openGraph: { url: siteUrl ? `${siteUrl}/cookies` : undefined, type: "website" },
});

export default function CookiesPage() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs width="4xl" items={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]} />
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <article className="mx-auto max-w-4xl">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">Website information</p>
            <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">Cookie Policy</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#69645b]">This page explains the small amount of cookie storage used on the Gurgaon Painters by Home Glazer website.</p>
          </header>
          <div className="mt-8 space-y-6 border-t border-[#29251f]/15 pt-7 text-base leading-7 text-[#514b41]">
            <section>
              <h2 className="text-xl font-semibold text-[#29251f]">Necessary preference cookie</h2>
              <p className="mt-2">When you dismiss the cookie notice, the site stores <code className="rounded bg-white px-1.5 py-0.5 text-sm">homeglazer-cookie-notice</code> in your browser for 180 days. It remembers that you have already seen the notice so it does not keep appearing on each visit.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#29251f]">Analytics and advertising</h2>
              <p className="mt-2">This website uses Google Analytics (GA4) to measure page usage and selected interactions, including enquiry submissions, phone-link clicks and WhatsApp-link clicks. The analytics events do not include the name, phone number, project message, or WhatsApp message text entered in the enquiry form. Google Analytics may store analytics cookies in your browser and process usage data under Google&apos;s privacy terms. This website does not enable advertising cookies.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#29251f]">Embedded map</h2>
              <p className="mt-2">The contact page embeds a Google Map for Home Glazer&apos;s Faridabad address. Loading the map may allow Google to process technical information under its own privacy terms.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#29251f]">Your browser settings</h2>
              <p className="mt-2">You can remove stored cookies through your browser settings. Clearing the preference cookie may cause the notice to appear again.</p>
            </section>
          </div>
        </article>
      </section>
      <PageFAQs faqs={cookieFaqs} title="Cookie policy FAQs" className="bg-white" />
      <Footer />
    </main>
  );
}
