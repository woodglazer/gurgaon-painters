export const instant = false;
import {
  ArrowUpRight,
  BookOpen,
  ClipboardList,
  Clock3,
  Globe,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { getDatabaseClient } from "@/lib/db";
import { ENQUIRY_STATUS_LABELS } from "@/lib/enquiry-config";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";
import AdminGreeting from "./admin-greeting";
import CityBadge from "./city-badge";

const quickActions = [
  {
    href: "https://gurgaonpainters.com",
    label: "Gurgaon Website",
    description: "Visit gurgaonpainters.com",
    icon: Globe,
    external: true,
  },
  {
    href: "https://noidapainters.com",
    label: "Noida Website",
    description: "Visit noidapainters.com",
    icon: Globe,
    external: true,
  },
  {
    href: "/blog",
    label: "Preview blog",
    description: "Browse published articles",
    icon: BookOpen,
  },
  {
    href: "tel:+919717256514",
    label: "Call the business",
    description: "+91 97172 56514",
    icon: Phone,
  },
];

export default async function AdminDashboardPage({ searchParams }) {
  await connection();
  const [resolvedParams, cookieCity] = await Promise.all([
    searchParams,
    getSelectedAdminCity(),
  ]);

  const selectedCity = resolvedParams?.city || (cookieCity !== "all" ? cookieCity : undefined);
  const isCityFiltered = selectedCity === "gurgaon" || selectedCity === "noida";

  const sql = getDatabaseClient();
  const [counts, recentEnquiries, blogCounts] = await Promise.all([
    isCityFiltered
      ? sql`
          SELECT
            COUNT(*)::int AS total_count,
            COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
            COUNT(*) FILTER (WHERE status = 'follow_up')::int AS follow_up_count
          FROM enquiries
          WHERE LOWER(COALESCE(city, 'gurgaon')) = LOWER(${selectedCity})
        `
      : sql`
          SELECT
            COUNT(*)::int AS total_count,
            COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
            COUNT(*) FILTER (WHERE status = 'follow_up')::int AS follow_up_count
          FROM enquiries
        `,
    isCityFiltered
      ? sql`
          SELECT id, name, service, status, city, created_at
          FROM enquiries
          WHERE LOWER(COALESCE(city, 'gurgaon')) = LOWER(${selectedCity})
          ORDER BY created_at DESC
          LIMIT 6
        `
      : sql`
          SELECT id, name, service, status, city, created_at
          FROM enquiries
          ORDER BY created_at DESC
          LIMIT 6
        `,
    sql`
      SELECT COUNT(*) FILTER (WHERE published = true)::int AS published_count
      FROM blog_posts
    `,
  ]);

  const summary = counts[0] || { total_count: 0, new_count: 0, follow_up_count: 0 };
  const overviewStats = [
    {
      label: "Total enquiries",
      icon: ClipboardList,
      value: summary.total_count,
      detail: selectedCity ? `All requests for ${selectedCity}` : "Gurgaon & Noida combined",
    },
    {
      label: "New enquiries",
      icon: ClipboardList,
      value: summary.new_count,
      detail: "Awaiting first contact",
    },
    {
      label: "Follow-ups pending",
      icon: Clock3,
      value: summary.follow_up_count,
      detail: "Need another follow-up",
    },
    {
      label: "Published blogs",
      icon: BookOpen,
      value: blogCounts[0]?.published_count || 0,
      detail: "Published articles",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#a27942]">Admin</p>
          <AdminGreeting />
          <p className="mt-2 text-sm leading-6 text-[#746f68]">
            Manage customer leads, appointments and content across Gurgaon & Noida.
          </p>
        </div>
      </div>

      <section
        aria-label="Overview statistics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {overviewStats.map(({ label, icon: Icon, value, detail }) => (
          <article
            key={label}
            className="rounded-md border border-[#e9e3d9] bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#746f68]">{label}</span>
              <span className="flex size-9 items-center justify-center rounded-md bg-[#f4eee5] text-[#a27942]">
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-[#29251f]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[#817a6e]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#817a6e]">
          Quick actions
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ href, label, description, icon: Icon, external }) => (
            <li key={label}>
              <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex h-full items-center gap-3 rounded-md border border-[#e9e3d9] bg-white p-4 transition hover:border-[#c2410c]/40 hover:bg-[#faf9f7]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#f4eee5] text-[#a27942]">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[#38332c]">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#817a6e]">
                    {description}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-[#817a6e]"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-md border border-[#e9e3d9] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#f4eee5] text-[#a27942]">
              <ClipboardList size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-[#29251f]">
                {selectedCity
                  ? `Recent ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Enquiries`
                  : "Recent Enquiries"}
              </h2>
              <p className="mt-0.5 text-xs text-[#817a6e]">
                Latest customer requests
              </p>
            </div>
          </div>
          <Link
            href={selectedCity ? `/admin/enquiries?city=${selectedCity}` : "/admin/enquiries"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c2410c] hover:text-[#9a3412]"
          >
            View all
            <ArrowUpRight size={14} />
          </Link>
        </div>
        {recentEnquiries.length === 0 ? (
          <div className="mt-5 rounded-md bg-[#faf9f7] px-4 py-6 text-center">
            <p className="text-sm font-medium text-[#504b44]">
              No enquiries have been received yet
            </p>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-[#817a6e]">
              Website contact form submissions will appear here.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-[#f0ece6]">
            {recentEnquiries.map((enquiry) => (
              <li
                key={enquiry.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div className="flex items-center gap-3">
                  <CityBadge city={enquiry.city} />
                  <div>
                    <p className="text-sm font-medium text-[#38332c]">
                      {enquiry.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#817a6e]">
                      {enquiry.service}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[#f4eee5] px-2.5 py-1 text-xs font-medium text-[#74634d]">
                  {ENQUIRY_STATUS_LABELS[enquiry.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
