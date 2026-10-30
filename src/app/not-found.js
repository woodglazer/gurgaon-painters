import Link from "next/link";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Page Not Found | Gurgaon Painters",
  description: "The page you are looking for does not exist. Browse our painting services or return to Gurgaon Painters home.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#f6f6f4] flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-5 py-24 sm:px-8 sm:py-32">
        <div className="max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
            404 Error
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-[#29251f] sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-base leading-7 text-[#69645b]">
            Sorry, the page you are looking for might have been moved, removed, or is temporarily unavailable.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded bg-[#c2410c] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#9a3412]"
            >
              Back to Home
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded border border-[#29251f]/20 bg-white px-6 py-3 text-sm font-medium text-[#29251f] transition-colors hover:bg-slate-50"
            >
              Our Painting Services
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
