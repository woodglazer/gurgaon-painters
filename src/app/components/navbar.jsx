"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "../services/services";
import { BRAND_NAME } from "../seo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Why Us", href: "/why-us" },
  { label: "Areas", href: "/areas" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md sm:gap-4 sm:px-5 sm:py-2.5 lg:px-7"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center px-1 py-1 sm:px-2"
          aria-label={`${BRAND_NAME} - Home`}
        >
          <Image
            src="/gurgaon-painters-logo-transparent.png"
            alt={`${BRAND_NAME} logo`}
            width={180}
            height={64}
            sizes="(min-width: 1024px) 144px, (min-width: 640px) 120px, 88px"
            priority
            className="h-8 w-[5.5rem] object-contain sm:h-9 sm:w-[7.5rem] lg:h-10 lg:w-36"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-5 text-sm font-semibold text-[#0B1F4D] lg:flex xl:gap-8">
          <div className="group relative">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 py-1 transition-colors hover:text-[#c2410c] focus-visible:text-[#c2410c]"
            >
              Services <ChevronDown size={15} aria-hidden="true" />
            </Link>
            <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-[#29251f] transition-colors hover:bg-[#f9f9f7] hover:text-[#c2410c]"
                  >
                    {service.shortTitle}
                  </Link>
                ))}
                <Link href="/services" className="mt-1 block border-t border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#c2410c] hover:text-[#9a3412]">
                  All services →
                </Link>
              </div>
            </div>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative py-1 transition-colors hover:text-[#c2410c] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#c2410c] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="tel:+919717256514"
            className="hidden min-h-10 items-center justify-center rounded-full bg-[#c2410c] px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-[#9a3412] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c] sm:inline-flex sm:px-5 sm:text-sm"
          >
            +91 97172 56514
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0B1F4D] transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c] lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.16)] lg:hidden"
            style={{ animation: "menuSlideDown 0.22s ease-out" }}
          >
            <div className="flex flex-col">
              <div>
                <div className="flex min-h-12 items-center rounded-xl transition-colors hover:bg-slate-50">
                  <Link
                    href="/services"
                    className="flex min-h-12 flex-1 items-center rounded-xl px-4 text-base font-medium text-[#0B1F4D] hover:text-[#c2410c]"
                    onClick={() => setIsOpen(false)}
                  >
                    Services
                  </Link>
                  <button
                    type="button"
                    aria-label={isServicesOpen ? "Hide service links" : "Show service links"}
                    aria-expanded={isServicesOpen}
                    className="mr-2 flex h-9 w-9 items-center justify-center rounded-full text-[#0B1F4D] hover:bg-white hover:text-[#c2410c]"
                    onClick={() => setIsServicesOpen((open) => !open)}
                  >
                    <ChevronDown size={18} className={`transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {isServicesOpen && (
                  <div className="ml-4 border-l border-[#c2410c]/20 pl-2">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="flex min-h-11 items-center rounded-lg px-4 text-sm text-[#514b41] transition-colors hover:bg-slate-50 hover:text-[#c2410c]"
                        onClick={() => {
                          setIsOpen(false);
                          setIsServicesOpen(false);
                        }}
                      >
                        {service.shortTitle}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-[#0B1F4D] transition-colors hover:bg-slate-50 hover:text-[#c2410c]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <a
              href="tel:+919717256514"
              className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-[#c2410c] px-5 text-sm font-bold text-white transition-colors hover:bg-[#9a3412]"
              onClick={() => setIsOpen(false)}
            >
              Call: +91 97172 56514
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
