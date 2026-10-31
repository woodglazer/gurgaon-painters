export const instant = false;
import { connection } from "next/server";
import { ArrowUpRight, ClipboardList, Clock3 } from "lucide-react";
import { getDatabaseClient } from "@/lib/db";
import {
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
} from "@/lib/enquiry-config";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";
import EnquiryStatusSelect from "./status-select";
import CityBadge from "../city-badge";

export const metadata = {
  title: "Enquiries | Admin Dashboard",
  robots: { index: false, follow: false },
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export default async function AdminEnquiriesPage({ searchParams }) {
  await connection();
  const [resolvedParams, cookieCity] = await Promise.all([
    searchParams,
    getSelectedAdminCity(),
  ]);

  const selectedCity = resolvedParams?.city || (cookieCity !== "all" ? cookieCity : undefined);
  const isCityFiltered = selectedCity === "gurgaon" || selectedCity === "noida";

  const sql = getDatabaseClient();
  const [enquiries, counts] = await Promise.all([
    isCityFiltered
      ? sql`
          SELECT id, name, phone, service, message, status, city, created_at
          FROM enquiries
          WHERE LOWER(COALESCE(city, 'gurgaon')) = LOWER(${selectedCity})
          ORDER BY created_at DESC
          LIMIT 200
        `
      : sql`
          SELECT id, name, phone, service, message, status, city, created_at
          FROM enquiries
          ORDER BY created_at DESC
          LIMIT 200
        `,
    isCityFiltered
      ? sql`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
            COUNT(*) FILTER (WHERE status = 'follow_up')::int AS follow_up,
            COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
          FROM enquiries
          WHERE LOWER(COALESCE(city, 'gurgaon')) = LOWER(${selectedCity})
        `
      : sql`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
            COUNT(*) FILTER (WHERE status = 'follow_up')::int AS follow_up,
            COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
          FROM enquiries
        `,
  ]);
  const summary = counts[0] || { total: 0, new_count: 0, follow_up: 0, completed: 0 };
  const stats = [
    { label: "Total enquiries", value: summary.total, icon: ClipboardList },
    { label: "New", value: summary.new_count, icon: ClipboardList },
    { label: "Follow-ups", value: summary.follow_up, icon: Clock3 },
    { label: "Completed", value: summary.completed, icon: ClipboardList },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#a27942]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#29251f]">
            Enquiries
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#746f68]">
            Review customer requests and keep their follow-up status up to date.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#74634d] transition hover:text-[#c2410c]"
          >
            Open contact page
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <section
        aria-label="Enquiry totals"
        className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="rounded-md border border-[#e9e3d9] bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#746f68]">{label}</p>
              <Icon size={17} className="text-[#a27942]" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#29251f]">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-[#e9e3d9] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee9e2] px-5 py-4">
          <div>
            <h2 className="font-semibold text-[#29251f]">
              {selectedCity
                ? `${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Enquiries`
                : "All enquiries (Gurgaon & Noida)"}
            </h2>
            <p className="mt-1 text-xs text-[#817a6e]">
              Showing {enquiries.length} enquiries
            </p>
          </div>
        </div>

        {enquiries.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-[#f4eee5] text-[#a27942]">
              <ClipboardList size={21} aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-semibold text-[#29251f]">
              No enquiries yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817a6e]">
              Customer requests submitted through the website contact forms will
              appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-[#817a6e]">
                <tr>
                  <th scope="col" className="px-5 py-3">City</th>
                  <th scope="col" className="px-5 py-3">Customer</th>
                  <th scope="col" className="px-5 py-3">Service</th>
                  <th scope="col" className="px-5 py-3">Project details</th>
                  <th scope="col" className="px-5 py-3">Received</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece6]">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="align-top">
                    <td className="px-5 py-4">
                      <CityBadge city={enquiry.city} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#38332c]">{enquiry.name}</p>
                      <a
                        href={`tel:${enquiry.phone.replace(/[^\d+]/g, "")}`}
                        className="mt-1 inline-block text-xs text-[#817a6e] hover:text-[#c2410c]"
                      >
                        {enquiry.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-[#504b44]">{enquiry.service}</td>
                    <td className="max-w-xs whitespace-pre-wrap px-5 py-4 text-xs leading-5 text-[#746f68]">
                      {enquiry.message || "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#746f68]">
                      {formatDate(enquiry.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <EnquiryStatusSelect
                        id={enquiry.id}
                        name={enquiry.name}
                        initialStatus={ENQUIRY_STATUSES.includes(enquiry.status)
                          ? enquiry.status
                          : "new"}
                      />
                      <span className="sr-only">
                        {ENQUIRY_STATUS_LABELS[enquiry.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
