import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { createSeoMetadata } from "../seo";
import { getSiteUrl } from "../site-url";
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  DISPLAY_ADDRESS,
} from "@/lib/business-contact";

const siteUrl = getSiteUrl();

export const metadata = createSeoMetadata({
  title: "Privacy | Gurgaon Painters",
  description:
    "Read how Gurgaon Painters by Home Glazer handles enquiry details, WhatsApp contact and the essential cookie used on this website.",
  ...(siteUrl
    ? { alternates: { canonical: `${siteUrl}/privacy-policy` } }
    : {}),
  openGraph: {
    url: siteUrl ? `${siteUrl}/privacy-policy` : undefined,
    type: "website",
  },
});

const sections = [
  {
    title: "Information you provide",
    content: (
      <>
        <p>
          If you use the enquiry form, you can enter your name, phone number,
          the painting service you need, and optional project details. When you
          submit the form, these details are saved in this website&apos;s enquiry
          database so Home Glazer can respond to your request. WhatsApp opens so
          you can review the prepared message and choose whether to send it. If
          you send it, WhatsApp also receives the information in accordance
          with its privacy practices.
        </p>
        <p>
          If you call us, we receive the phone number and any other details you
          choose to share during the call.
        </p>
      </>
    ),
  },
  {
    title: "How we use enquiry information",
    content: (
      <p>
        Home Glazer uses information you choose to send to respond to your
        questions, discuss painting or related services, prepare a quote, and
        arrange a site visit when requested. If you become a customer, your
        details may also be used to communicate about the requested work.
      </p>
    ),
  },
  {
    title: "Sharing and service providers",
    content: (
      <p>
        We do not sell your personal information. Enquiry details that you send
        may be handled by the Home Glazer team so they can respond. When you
        choose to send an enquiry through WhatsApp, the information is also
        handled by WhatsApp under its own terms and privacy policy. We do not
        control how third-party services process information. The contact page
        embeds Google Maps to show Home Glazer&apos;s public Faridabad address;
        Google may receive technical information when the map loads. Google
        Analytics receives page-use and interaction events to measure website performance;
        those events do not include the name, phone number, project message, or
        WhatsApp message text entered in the enquiry form.
      </p>
    ),
  },
  {
    title: "Cookies and website use",
    content: (
      <p>
        This website uses the necessary preference cookie
        <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-sm">
          homeglazer-cookie-notice
        </code>
        to remember when you have dismissed the cookie notice. It expires after
        180 days. Google Analytics (GA4) also measures page usage and selected
        interactions, including enquiry submissions, phone-link clicks, and
        WhatsApp-link clicks. Analytics events do not include enquiry names,
        phone numbers, project messages, or WhatsApp message text. Google
        Analytics may store analytics cookies. Advertising cookies are not
        enabled. You can remove cookies in your browser settings. See our{" "}
        <Link
          className="font-semibold text-[#c2410c] underline underline-offset-4"
          href="/cookies"
        >
          Cookie Policy
        </Link>
        {" "}for details.
      </p>
    ),
  },
  {
    title: "Keeping information accurate",
    content: (
      <p>
        Please contact us if information you have shared needs to be corrected
        or if you have a question about how it is used. We will review your
        request and respond. Information sent through WhatsApp may also remain
        subject to WhatsApp’s own retention and account settings.
      </p>
    ),
  },
  {
    title: "Contact us",
    content: (
      <>
        <p>
          This policy applies to information collected through the Gurgaon
          Painters website. For privacy questions or requests, contact Home
          Glazer:
        </p>
        <address className="mt-3 not-italic">
          {DISPLAY_ADDRESS}
          <br />
          Phone: <a href="tel:+919717256514">{BUSINESS_PHONE}</a>
          <br />
          Email: <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
        </address>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs
        width="4xl"
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <section className="px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <article className="mx-auto max-w-4xl">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
              Website information
            </p>
            <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#69645b]">
              Learn how Gurgaon Painters by Home Glazer handles information you
              share when you ask about our painting services.
            </p>
            <p className="mt-3 text-sm text-[#817a6e]">
              Last updated: October 29, 2026
            </p>
          </header>

          <div className="mt-8 space-y-6 border-t border-[#29251f]/15 pt-7 text-base leading-7 text-[#514b41]">
            <section>
              <h2 className="text-xl font-semibold text-[#29251f]">
                Introduction
              </h2>
              <p className="mt-2">
                Home Glazer respects your privacy and handles personal
                information in ways that support your enquiry and the services
                you request. This policy describes the information involved
                when you use this website and contact our team.
              </p>
            </section>
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-[#29251f]">
                  {section.title}
                </h2>
                <div className="mt-2 space-y-3">{section.content}</div>
              </section>
            ))}
          </div>
        </article>
      </section>
      <Footer />
    </main>
  );
}
