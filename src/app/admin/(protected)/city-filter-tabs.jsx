"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MapPin } from "lucide-react";

const CITIES = [
  { id: "all", label: "All Cities" },
  { id: "gurgaon", label: "Gurgaon" },
  { id: "noida", label: "Noida" },
];

export default function CityFilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCity = searchParams.get("city") || "all";

  const handleSelectCity = (cityId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cityId === "all") {
      params.delete("city");
    } else {
      params.set("city", cityId);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-[#e2dcd2] bg-[#fbf9f6] p-1 ">
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#8a7f72]">
        <MapPin size={14} className="text-[#c2410c]" />
        <span>Location:</span>
      </div>
      {CITIES.map((city) => {
        const isActive = currentCity === city.id;
        return (
          <button
            key={city.id}
            type="button"
            onClick={() => handleSelectCity(city.id)}
            className={`cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition ${
              isActive
                ? "bg-[#c2410c] text-white "
                : "text-[#62594f] hover:bg-[#ede5da] hover:text-[#29251f]"
            }`}
          >
            {city.label}
          </button>
        );
      })}
    </div>
  );
}
