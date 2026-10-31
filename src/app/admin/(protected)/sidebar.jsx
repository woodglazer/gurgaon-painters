"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  ImageIcon,
  Settings,
  Newspaper,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: ClipboardList },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ width }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCompact = width < 120;
  const currentCity = searchParams.get("city");

  return (
    <aside
      style={{ width }}
      className="hidden shrink-0 overflow-y-auto m-2 rounded-md border border-[#e9e3d9] bg-white md:block"
    >
      <nav className="p-3">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            // Retain city param when switching tabs
            const targetHref = currentCity ? `${href}?city=${currentCity}` : href;

            return (
              <li key={href}>
                <Link
                  href={targetHref}
                  aria-label={isCompact ? label : undefined}
                  title={label}
                  className={`flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    isCompact
                      ? "justify-center px-3"
                      : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-[#c2410c] text-white"
                      : "text-[#504b44] hover:bg-[#f6f1eb] hover:text-[#29251f]"
                  }`}
                >
                  <Icon size={18} className="shrink-0" aria-hidden="true" />
                  {!isCompact && label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
