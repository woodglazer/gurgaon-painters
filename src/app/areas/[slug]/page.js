import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import Navbar from "../../components/navbar";
import { getSiteUrl } from "../../site-url";
import { createSeoMetadata } from "../../seo";
import { areas } from "../areas";

export function generateStaticParams() {
  return areas.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const area = areas.find((item) => item.slug === slug);
  if (!area) return {};

  const siteUrl = getSiteUrl();
  const canonical = siteUrl ? `${siteUrl}/areas/${area.slug}` : undefined;
  return createSeoMetadata({
    title: `Painters in ${area.name} | Gurgaon Painters`,
    description: area.description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      ...(canonical ? { url: canonical } : {}),
      type: "website",
    },
  });
}

export default async function AreaPage({ params }) {
  const { slug } = await params;
  const area = areas.find((item) => item.slug === slug);
  if (!area) notFound();

  return (
    <main className="relative min-h-screen bg-[#f6f6f4]">
      <Navbar />
      <article className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            inline
            items={[
              { label: "Home", href: "/" },
              { label: "Areas We Serve", href: "/areas" },
              { label: area.name },
            ]}
          />
          <header className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
              Gurgaon &amp; Gurugram
            </p>
            <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.045em] text-[#29251f] sm:text-5xl">
              Painters in {area.name}, Gurgaon
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#69645b]">
              {area.intro}
            </p>
          </header>

          <section className="mt-10 grid gap-8 border-t border-[#29251f]/15 pt-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-[#29251f]">
                Property types to discuss
              </h2>
              <p className="mt-4 text-base leading-7 text-[#69645b]">
                {area.propertyTypes}
              </p>
              <p className="mt-4 text-base leading-7 text-[#69645b]">
                The work plan depends on the actual wall and surface condition.
                A site discussion can separate paintwork from repairs, identify
                access or society requirements, and record which areas are
                included before a quote is agreed.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#29251f]">
                Local planning checklist
              </h2>
              <ul className="mt-4 space-y-3">
                {area.planningNotes.map((note) => (
                  <li
                    key={note}
                    className="rounded-md border border-[#29251f]/10 bg-white p-4 text-sm leading-6 text-[#69645b]"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-10 border-t border-[#29251f]/15 pt-8">
            <h2 className="text-2xl font-semibold text-[#29251f]">
              Services available to discuss
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#69645b]">
              Ask about interior or exterior painting, wall textures,
              waterproofing, wood and metal finishes, or commercial painting.
              Recommendations depend on the surface, intended use and
              assessment at the property.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center rounded-full border border-[#c2410c] px-5 text-sm font-semibold text-[#c2410c] hover:bg-[#c2410c] hover:text-white"
              >
                Browse all services
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center rounded-full bg-[#c2410c] px-5 text-sm font-semibold text-white hover:bg-[#9a3412]"
              >
                Ask about {area.name}
              </Link>
            </div>
          </section>

          <p className="mt-8 border-t border-[#29251f]/15 pt-6 text-sm leading-6 text-[#777166]">
            This page contains area-specific planning guidance, not a claim that
            a particular project has been completed here. Share the property
            address to confirm service availability and ask for verified
            project references.
          </p>
        </div>
      </article>
      <Footer />
    </main>
  );
}
