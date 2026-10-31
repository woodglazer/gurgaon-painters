import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminLoginForm from "./login-form";

export const metadata = {
  title: "Admin Login | Gurgaon Painters",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (process.env.NODE_ENV === "development" && !process.env.NEON_AUTH_BASE_URL) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f6f4] p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-md border border-[#e7e2d9] bg-white -[0_24px_80px_rgba(15,31,77,0.12)] md:min-h-[600px] md:grid-cols-2">
        <div className="relative hidden min-h-56 flex-col justify-between overflow-hidden bg-[#0B1F4D] p-7 text-white sm:p-10 md:flex md:min-h-full md:p-12">
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[36px] border-white/5"
          />
          <div className="relative">
            <Link
              href="/"
              aria-label="Gurgaon Painters home"
              className="inline-flex rounded-md bg-white p-2"
            >
              <Image
                src="/gurgaon-painters-logo-transparent.png"
                alt="Gurgaon Painters"
                width={1215}
                height={433}
                priority
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>
          </div>
          <div className="relative mt-8 md:mt-0">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <span className="h-px w-8 bg-[#c2410c]" />
              Gurgaon Painters
            </p>
            <h1 className="max-w-sm text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">
              Welcome to your <span className="text-[#f97316]">admin</span>{" "}
              space.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              Sign in to manage the Gurgaon Painters website.
            </p>
          </div>
          <p className="relative mt-8 text-xs text-white/50 md:mt-12">
            Gurgaon Painters
          </p>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
          <Link
            href="/"
            className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#0B1F4D] transition-colors hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c2410c]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to website
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
            Administrator
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F4D]">
            Sign in
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#69645b]">
            Use your authorized administrator account.
          </p>

          <AdminLoginForm adminEmail={process.env.ADMIN_EMAIL?.trim() ?? ""} />

          <p className="mt-6 border-t border-[#e7e2d9] pt-5 text-xs leading-5 text-[#817a6e]">
            Admin access is restricted to the configured administrator email.
          </p>
        </div>
      </div>
    </main>
  );
}
