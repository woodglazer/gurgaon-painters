export const instant = false;
import { connection } from "next/server";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";
import { getDatabaseClient } from "@/lib/db";
import { getSelectedAdminCity } from "@/lib/admin-city-cookie";
import { deleteGalleryItem } from "./actions";
import GalleryUploadModal from "./gallery-modal";
import CityBadge from "../city-badge";

export const metadata = {
  title: "Gallery | Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage({ searchParams }) {
  await connection();
  const [resolvedParams, cookieCity] = await Promise.all([
    searchParams,
    getSelectedAdminCity(),
  ]);

  const selectedCity = resolvedParams?.city || (cookieCity !== "all" ? cookieCity : undefined);
  const isCityFiltered = selectedCity === "gurgaon" || selectedCity === "noida";

  const sql = getDatabaseClient();
  const items = isCityFiltered
    ? await sql`
        SELECT id, title, category, image_url, city, created_at
        FROM gallery_items
        WHERE LOWER(COALESCE(city, 'gurgaon')) = LOWER(${selectedCity})
           OR LOWER(COALESCE(city, 'gurgaon')) = 'all'
        ORDER BY created_at DESC
      `
    : await sql`
        SELECT id, title, category, image_url, city, created_at
        FROM gallery_items
        ORDER BY created_at DESC
      `;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#a27942]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#29251f]">
            {selectedCity
              ? `${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Gallery`
              : "Project Gallery"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#746f68]">
            Upload and manage project photos, completed works and transformations.
          </p>
        </div>
        <GalleryUploadModal defaultCity={selectedCity || "gurgaon"} />
      </header>

      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-[#e9e3d9] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-[#f4eee5] text-[#a27942]">
            <ImageIcon size={24} />
          </div>
          <h2 className="mt-4 font-semibold text-[#29251f]">No photos added yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#817a6e]">
            {selectedCity
              ? `There are no gallery photos for ${selectedCity}. Click 'Add photo' to upload one.`
              : "Upload your first completed project photos to show them on the website."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-[#ded8cf] bg-white"
            >
              <div className="relative aspect-4/3 w-full bg-[#f4eee5]">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#817a6e]">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <CityBadge city={item.city} />
                </div>
              </div>

              <div className="p-3.5">
                <p className="text-xs font-semibold uppercase text-[#a27942]">
                  {item.category}
                </p>
                <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-[#29251f]">
                  {item.title}
                </h3>

                <div className="mt-3 flex items-center justify-end border-t border-[#f0ece5] pt-2">
                  <form action={deleteGalleryItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      title="Delete Photo"
                      className="inline-flex items-center gap-1 rounded-md p-1.5 text-xs text-red-600 transition hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
