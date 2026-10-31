import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import Image from "next/image";
import AdminSignOutButton from "./sign-out-button";
import AdminProfileSwitcher from "./admin-profile-switcher";
import ResizableAdminContent from "./resizable-admin-content";
import { getAdminAccess } from "@/lib/auth/admin";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";

export const metadata = {
  title: "Admin Dashboard | Gurgaon Painters",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function ProtectedAdminLayout({ children }) {
  await connection();
  const [access, savedCity] = await Promise.all([
    getAdminAccess(),
    getSelectedAdminCity(),
  ]);

  if (access.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (access.status === "unconfigured") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f6f4] px-5 py-12">
        <section className="max-w-xl rounded-md border border-[#e9e3d9] bg-white p-8 ">
          <h1 className="text-2xl font-semibold text-[#29251f]">
            Admin access needs configuration
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#746f68]">
            Set the <code className="font-semibold">ADMIN_EMAIL</code> environment
            variable to the email address of your Neon Auth administrator account,
            then restart the app.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex rounded-xl bg-[#29251f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#484137]"
          >
            Go to admin sign in
          </Link>
        </section>
      </main>
    );
  }

  if (access.status === "unauthorized") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f6f4] px-5 py-12">
        <section className="max-w-xl rounded-3xl border border-[#e9e3d9] bg-white p-8 text-center ">
          <h1 className="text-2xl font-semibold text-[#29251f]">
            This account is not an administrator
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#746f68]">
            The signed-in account does not have access to this dashboard.
          </p>
          <AdminSignOutButton className="mt-6 rounded-xl bg-[#29251f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#484137]" />
        </section>
      </main>
    );
  }

  if (access.status === "unverified") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f6f4] px-5 py-12">
        <section className="max-w-xl rounded-3xl border border-[#e9e3d9] bg-white p-8 text-center ">
          <h1 className="text-2xl font-semibold text-[#0B1F4D]">
            Verify your email to continue
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#69645b]">
            Confirm your administrator email address before accessing the dashboard.
          </p>
          <AdminSignOutButton className="mt-6 rounded-md bg-[#c2410c] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9a3412]" />
        </section>
      </main>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f6f6f4]">
      {/* Top Navbar */}
      <header className="shrink-0 bg-[#f6f6f4] ">
        <div className="mx-auto flex max-w-8xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
          <Link href="/admin" aria-label="Admin Dashboard Home">
            <Image
              src="/gurgaon-painters-logo-transparent.png"
              alt="Gurgaon Painters"
              width={1215}
              height={433}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>
          
          {/* Right side: Profile with Switcher & Exit Button */}
          <div className="flex items-center gap-3">
            <AdminProfileSwitcher
              userEmail={access.user?.email}
              initialCity={savedCity}
            />
            
            <div className="h-6 w-px bg-[#ded8cf]" aria-hidden="true" />

            <AdminSignOutButton
              iconOnly
              title="Sign out / Exit"
              className="rounded-lg border border-[#ded8cf] bg-white p-2 text-[#38332c]  transition hover:border-[#c2410c]/50 hover:bg-[#faf9f7] hover:text-[#c2410c]"
            />
          </div>
        </div>
      </header>

      <ResizableAdminContent>{children}</ResizableAdminContent>
    </div>
  );
}
