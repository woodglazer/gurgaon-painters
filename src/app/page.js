import Features from "./components/Features";
import FAQSection from "./components/FAQSection";
import Contact from "./components/Contact";
import BlogSection from "./components/BlogSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowWeDoIt from "./components/HowWeDoIt";
import Navbar from "./components/navbar";
import Reviews from "./components/Reviews";
import Services from "./components/Services";
import VisualizeRoomColor from "./components/VisualizeRoomColor";
import { getSiteUrl } from "./site-url";
import { BRAND_NAME } from "./seo";

const siteUrl = getSiteUrl();

export const metadata = {
  ...(siteUrl ? { alternates: { canonical: siteUrl } } : {}),
};

export default function Home() {
  const services = [
    "Interior Painting",
    "Exterior Painting",
    "Wall Texture Painting",
    "Waterproofing",
    "Wood Polish and Metal Finishes",
    "Commercial Painting",
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: BRAND_NAME,
        description: "Interior and exterior painting, wall textures, waterproofing, and wood and metal finishes for homes and businesses in Gurgaon and Gurugram.",
        ...(siteUrl
          ? { url: siteUrl }
          : {}),
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": siteUrl ? `${siteUrl}/#organization` : "#organization",
        name: BRAND_NAME,
        telephone: "+91 97172 56514",
        parentOrganization: {
          "@type": "Organization",
          name: "Home Glazer",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91 97172 56514",
          contactType: "customer service",
        },
        ...(siteUrl ? { url: siteUrl } : {}),
      },
      ...services.map((name) => ({
        "@type": "Service",
        name,
        serviceType: name,
        description: `${name} for residential and commercial properties in Gurgaon and Gurugram. Scope and recommendations are confirmed after discussing the site and surfaces.`,
        areaServed: [
          { "@type": "City", name: "Gurgaon" },
          { "@type": "City", name: "Gurugram" },
        ],
        provider: {
          "@type": "Organization",
          "@id": siteUrl ? `${siteUrl}/#organization` : "#organization",
          ...(!siteUrl ? { name: BRAND_NAME } : {}),
        },
      })),
    ],
  };

  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <Hero />
      <Services />
      <Features />
      <HowWeDoIt />
      <VisualizeRoomColor />
      <Reviews />
      <BlogSection />
      <FAQSection />
      <Contact />
      <Footer />
    </main>
  );
}
