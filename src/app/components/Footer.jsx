import { Phone, MapPin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { services } from "../services/services";
import { BRAND_NAME } from "../seo";
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
} from "@/lib/business-contact";
import { areas } from "../areas/areas";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Why Us", href: "/why-us" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Cookie policy", href: "/cookies" },
];

async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const currentYear = await getCurrentYear();

  return (
    <footer className="bg-[#1a1612] text-white">
      {/* Main footer content */}
      <div className="mx-auto w-full px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2.5 text-white"
              aria-label={`${BRAND_NAME} - Home`}
            >
              <Image
                src="/gurgaon-painters-logo-transparent.png"
                alt={`${BRAND_NAME} logo`}
                width={180}
                height={64}
                sizes="(min-width: 640px) 176px, 144px"
                className="h-12 w-36 object-contain object-left sm:h-14 sm:w-44"
              />
            </Link>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              by Home Glazer
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
              Professional painting services across Gurgaon and Gurugram for
              every room, home, and workspace.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a
                href={BUSINESS_PHONE_HREF}
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Phone size={15} strokeWidth={1.7} className="shrink-0 text-[#c2410c]" />
                {BUSINESS_PHONE}
              </a>
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Mail size={15} strokeWidth={1.7} className="shrink-0 text-[#c2410c]" />
                {BUSINESS_EMAIL}
              </a>
              <div className="flex items-start gap-3 text-sm text-white/55">
                <MapPin size={15} strokeWidth={1.7} className="mt-0.5 shrink-0 text-[#c2410c]" />
                <span>Gurgaon (Gurugram), Haryana, India</span>
              </div>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links column */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA column */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Get a Quote
            </h3>
            <p className="mb-5 text-sm leading-6 text-white/55">
              Ready to refresh your space? Get in touch for a free site visit
              and no-obligation quote.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+919717256514"
                className="inline-flex items-center justify-center rounded-full bg-[#c2410c] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-[#9a3412] hover:-translate-y-px"
              >
                Call Us Now
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white"
              >
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>

        <section
          className="mt-8 border-t border-white/10 pt-6"
          aria-labelledby="footer-areas-heading"
        >
          <h2
            id="footer-areas-heading"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50"
          >
            Areas We Serve
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/areas/${area.slug}`}
                  className="text-sm text-white/65 transition-colors hover:text-white"
                >
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Divider */}
        <div className="mt-8 border-t border-white/10 pt-5 sm:flex sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            &copy; {currentYear} Gurgaon Painters by Home Glazer. All rights
            reserved.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/35 sm:mt-0">
            <p>Serving Gurgaon &amp; Gurugram, Haryana</p>
            <Link href="/privacy-policy" className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/sitemap.xml" className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white">Sitemap</Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
