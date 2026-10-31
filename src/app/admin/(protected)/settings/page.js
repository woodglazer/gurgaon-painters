export const instant = false;
import { connection } from "next/server";
import { getDatabaseClient } from "@/lib/db";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";
import SettingsForm from "./settings-form";

export const metadata = {
  title: "Settings | Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage({ searchParams }) {
  await connection();
  const [resolvedParams, cookieCity] = await Promise.all([
    searchParams,
    getSelectedAdminCity(),
  ]);

  const rawCity = resolvedParams?.city || cookieCity;
  const activeCity = rawCity === "noida" ? "noida" : "gurgaon";

  const sql = getDatabaseClient();
  const rows = await sql`
    SELECT 
      city, site_name, phone, whatsapp, email, address, working_hours,
      whatsapp_notify_enabled, whatsapp_notify_number, whatsapp_notify_api_key, whatsapp_notify_template
    FROM site_settings
    WHERE city = ${activeCity}
    LIMIT 1
  `;
  const settings = rows[0] || null;

  return (
    <div>
      <header>
        <p className="text-sm font-medium text-[#a27942]">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#29251f]">
          Business Settings
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#746f68]">
          Manage contact details, WhatsApp lead alerts, and branch preferences.
        </p>
      </header>

      {/* City Tabs for Settings */}
      <div className="mt-6 flex border-b border-[#ded8cf]">
        <a
          href="/admin/settings?city=gurgaon"
          className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeCity === "gurgaon"
              ? "border-[#c2410c] text-[#c2410c]"
              : "border-transparent text-[#746f68] hover:text-[#29251f]"
          }`}
        >
          Gurgaon Branch Settings
        </a>
        <a
          href="/admin/settings?city=noida"
          className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeCity === "noida"
              ? "border-[#c2410c] text-[#c2410c]"
              : "border-transparent text-[#746f68] hover:text-[#29251f]"
          }`}
        >
          Noida Branch Settings
        </a>
      </div>

      <SettingsForm settings={settings} city={activeCity} />
    </div>
  );
}
