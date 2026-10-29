import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import { getSiteUrl } from "../site-url";
import { createSeoMetadata } from "../seo";
import { areas } from "./areas";

const siteUrl = getSiteUrl();

export const metadata = createSeoMetadata({
  title: "Areas We Serve in Gurgaon | Gurgaon Painters",
  description:
    "Explore painting services across Gurgaon localities, from DLF phases and Golf Course Road to Sohna Road and New Gurgaon sectors.",
  ...(siteUrl ? { alternates: { canonical: `${siteUrl}/areas` } } : {}),
  openGraph: {
    ...(siteUrl ? { url: `${siteUrl}/areas` } : {}),
    type: "website",
  },
});

export default function AreasPage() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <Breadcrumbs
        width="6xl"
        items={[{ label: "Home", href: "/" }, { label: "Areas We Serve" }]}
      />
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
              Gurgaon &amp; Gurugram
            </p>
            <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">
              Painting services by area
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#69645b]">
              Browse locally tailored planning notes for homes, apartments,
              offices and shared spaces. The exact work scope and availability
              are confirmed for each property after an enquiry and site visit.
            </p>
          </header>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <article
                key={area.slug}
                className="rounded-md border border-[#29251f]/10 bg-white p-5"
              >
                <h2 className="text-xl font-semibold text-[#29251f]">
                  {area.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#69645b]">
                  {area.description}
                </p>
                <Link
                  href={`/areas/${area.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[#c2410c] hover:underline"
                >
                  Painting in {area.name} →
                </Link>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[#777166]">
            These guides describe planning considerations, not completed local
            projects. Ask the team for verified project references when
            discussing your property.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
