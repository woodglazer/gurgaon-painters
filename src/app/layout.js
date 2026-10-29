import { Poppins, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSiteUrl } from "./site-url";
import ScrollReveal from "./components/ScrollReveal";
import CookieNotice from "./components/CookieNotice";
import WhatsAppButton from "./components/WhatsAppButton";
import AnalyticsEvents from "./components/AnalyticsEvents";
import { BRAND_NAME, createSeoMetadata } from "./seo";
import { areas } from "./areas/areas";
import {
  BUSINESS_ADDRESS_DETAILS,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
} from "@/lib/business-contact";

const siteUrl = getSiteUrl();

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const rootSeo = createSeoMetadata({
  title: "Painters in Gurgaon | Gurgaon Painters",
  description: "Painters in Gurgaon for homes and businesses: interior, exterior, textures, waterproofing and wood finishes. Request a free site visit from our team.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: BRAND_NAME,
    title: "Painters in Gurgaon | Gurgaon Painters",
    description: "Painters in Gurgaon for homes and businesses: interior, exterior, textures, waterproofing and wood finishes. Request a free site visit from our team.",
    ...(siteUrl ? { url: siteUrl, images: ["/images/hero-image-two.webp"] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Painters in Gurgaon | Gurgaon Painters",
    description: "Painters in Gurgaon for homes and businesses: interior, exterior, textures, waterproofing and wood finishes. Request a free site visit from our team.",
    ...(siteUrl ? { images: ["/images/hero-image-two.webp"] } : {}),
  },
});

export const metadata = {
  ...rootSeo,
  metadataBase: new URL(siteUrl || "https://www.gurgaonpainters.com"),
  title: { default: rootSeo.title.absolute, template: "%s" },
  applicationName: BRAND_NAME,
};

export default function RootLayout({ children }) {
  const businessSchema = siteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "HousePainter",
        "@id": `${siteUrl}/#local-business`,
        name: BRAND_NAME,
        url: siteUrl,
        logo: `${siteUrl}/gurgaon-painters-logo-transparent.png`,
        image: `${siteUrl}/images/hero-image-two.webp`,
        telephone: BUSINESS_PHONE,
        email: BUSINESS_EMAIL,
        address: {
          "@type": "PostalAddress",
          ...BUSINESS_ADDRESS_DETAILS,
        },
        areaServed: [
          { "@type": "City", name: "Gurugram", alternateName: "Gurgaon" },
          ...areas.map(({ name }) => ({ "@type": "Place", name })),
        ],
      }
    : null;

  return (
    <html lang="en-IN" className={`${spaceGrotesk.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        {children}
        {businessSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
            }}
          />
        )}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WVX3B89NZY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WVX3B89NZY');
          `}
        </Script>
        <ScrollReveal />
        <AnalyticsEvents />
        <CookieNotice />
        <WhatsAppButton />
        <nav
          aria-label="Quick contact options"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] text-center text-xs font-bold text-[#0B1F4D] shadow-[0_-8px_24px_rgba(15,23,42,0.12)] md:hidden"
        >
          <a href="tel:+919717256514" className="flex min-h-14 items-center justify-center px-2">
            Call
          </a>
          <a
            href="https://wa.me/919717256514?text=Hello%20Gurgaon%20Painters%2C%20I%20would%20like%20to%20discuss%20a%20painting%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-center border-x border-slate-200 px-2"
          >
            WhatsApp
          </a>
          <a href="/contact" className="flex min-h-14 items-center justify-center px-2 text-[#c2410c]">
            Get Quote
          </a>
        </nav>
      </body>
    </html>
  );
}
