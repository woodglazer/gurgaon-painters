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
import AdminGreeting from "./admin-greeting";

const quickActions = [
  {
    href: "/",
    label: "View website",
    description: "See the public website",
    icon: Globe,
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

export default async function AdminDashboardPage() {
  await connection();

  const sql = getDatabaseClient();
  const [counts, recentEnquiries, blogCounts] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total_count,
        COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
        COUNT(*) FILTER (WHERE status = 'follow_up')::int AS follow_up_count
      FROM enquiries
    `,
    sql`
      SELECT id, name, service, status, created_at
      FROM enquiries
      ORDER BY created_at DESC
      LIMIT 5
    `,
    sql`
      SELECT COUNT(*) FILTER (WHERE published = true)::int AS published_count
      FROM blog_posts
    `,
  ]);
  const summary = counts[0];
  const overviewStats = [
    {
      label: "Total enquiries",
      icon: ClipboardList,
      value: summary.total_count,
      detail: "All customer requests",
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
      value: blogCounts[0].published_count,
      detail: "Published articles",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#a27942]">Overview</p>
          <AdminGreeting />
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#746f68]">
            Here is a quick look at your dashboard and shortcuts to useful pages.
          </p>
        </div>
      </div>

      <section
        aria-label="Dashboard summary"
        className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {overviewStats.map(({ label, icon: Icon, value, detail }) => (
          <article
            key={label}
            className="rounded-md border border-[#e9e3d9] bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#746f68]">{label}</p>
              <Icon size={18} className="text-[#a27942]" aria-hidden="true" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#29251f]">{value}</p>
            <p className="mt-1 text-xs text-[#817a6e]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="mb-3 text-sm font-semibold text-[#504b44]">
          Quick actions
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {quickActions.map(({ href, label, description, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
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
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-[#f4eee5] text-[#a27942]">
            <ClipboardList size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-[#29251f]">Recent enquiries</h2>
            <p className="mt-0.5 text-xs text-[#817a6e]">
              Latest customer requests
            </p>
          </div>
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
                <div>
                  <p className="text-sm font-medium text-[#38332c]">
                    {enquiry.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#817a6e]">
                    {enquiry.service}
                  </p>
                </div>
                <span className="rounded-full bg-[#f4eee5] px-2.5 py-1 text-xs font-medium text-[#74634d]">
                  {ENQUIRY_STATUS_LABELS[enquiry.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/admin/enquiries"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c2410c] transition hover:text-[#9a3412]"
        >
          View all enquiries
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
