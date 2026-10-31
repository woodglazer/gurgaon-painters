"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { User, Check, Building2, ChevronDown, MapPin } from "lucide-react";
import { setSelectedAdminCity } from "@/lib/admin-city-cookie";

const CITIES = [
  { id: "all", label: "All Cities (Both)", tag: "All" },
  { id: "gurgaon", label: "Gurgaon Painters", tag: "Gurgaon" },
  { id: "noida", label: "Noida Painters", tag: "Noida" },
];

export default function AdminProfileSwitcher({ userEmail, initialCity = "all" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL search param takes precedence, otherwise fallback to cookie / initialCity
  const paramCity = searchParams.get("city");
  const currentCity = paramCity || initialCity;
  const activeCityObj = CITIES.find((c) => c.id === currentCity) || CITIES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (cityId) => {
    setIsOpen(false);
    startTransition(async () => {
      // 1. Save in server-side cookie so it persists across all sidebar/nav tabs
      await setSelectedAdminCity(cityId);

      // 2. Refresh current page without losing the view
      const params = new URLSearchParams(searchParams.toString());
      if (cityId === "all") {
        params.delete("city");
      } else {
        params.set("city", cityId);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
      router.refresh();
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button with City Indicator */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-lg border border-[#ded8cf] bg-white px-3 py-1.5 text-sm font-medium text-[#29251f]  transition hover:border-[#c2410c]/50 hover:bg-[#faf9f7] focus:outline-hidden cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex size-7 items-center justify-center rounded-full bg-[#f4eee5] text-[#c2410c]">
          <User size={15} />
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-xs font-semibold leading-none text-[#29251f]">
            {activeCityObj.tag}
          </p>
          <p className="mt-1 text-[11px] leading-none text-[#817a6e]">
            {isPending ? "Switching..." : "Switch City"}
          </p>
        </div>

        <ChevronDown
          size={14}
          className={`text-[#817a6e] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#c2410c]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-[#e5dfd5] bg-white p-2  ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95">
          {/* User Info Header */}
          <div className="border-b border-[#f0ece5] px-3 py-2.5">
            <p className="text-xs font-medium text-[#817a6e]">Signed in as</p>
            <p className="truncate text-xs font-semibold text-[#29251f]">
              {userEmail || "admin@gurgaonpainters.com"}
            </p>
          </div>

          {/* Switch City Section */}
          <div className="pt-2">
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#9f9689]">
              Switch Website / City
            </p>
            <div className="mt-1 space-y-1">
              {CITIES.map((city) => {
                const isSelected = currentCity === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelectCity(city.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-[#fff7ed] text-[#c2410c] font-semibold"
                        : "text-[#504b44] hover:bg-[#faf7f2] hover:text-[#29251f]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-6 items-center justify-center rounded-md ${
                          isSelected
                            ? "bg-[#c2410c] text-white"
                            : "bg-[#f2eee9] text-[#786f63]"
                        }`}
                      >
                        {city.id === "all" ? (
                          <Building2 size={13} />
                        ) : (
                          <MapPin size={13} />
                        )}
                      </div>
                      <span>{city.label}</span>
                    </div>
                    {isSelected && (
                      <Check size={14} className="text-[#c2410c]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
