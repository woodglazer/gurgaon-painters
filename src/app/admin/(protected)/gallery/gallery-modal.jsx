"use client";

import { useActionState, useState } from "react";
import { Plus, X, UploadCloud } from "lucide-react";
import { addGalleryItem } from "./actions";

export default function GalleryUploadModal({ defaultCity = "gurgaon" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const form = new FormData();
    form.set("file", file);

    try {
      const res = await fetch("/api/admin/blog/images", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        alert("Upload failed. Please try a smaller image.");
      }
    } catch {
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-[#c2410c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9a3412] cursor-pointer"
      >
        <Plus size={16} />
        Add photo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#e8e2d8] bg-white p-6 shadow-none">
            <div className="flex items-center justify-between border-b border-[#f0ece5] pb-4">
              <h2 className="text-lg font-semibold text-[#29251f]">Add Gallery Photo</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#817a6e] hover:text-[#29251f] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              action={async (formData) => {
                await addGalleryItem(formData);
                setIsOpen(false);
                setImageUrl("");
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase text-[#746f68]">
                  Target City
                </label>
                <select
                  name="city"
                  defaultValue={defaultCity}
                  className="mt-1 w-full rounded-md border border-[#ded8cf] bg-white px-3 py-2 text-sm font-medium text-[#29251f]"
                >
                  <option value="gurgaon">Gurgaon Painters</option>
                  <option value="noida">Noida Painters</option>
                  <option value="all">Both Websites (All Cities)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#746f68]">
                  Project Title
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Luxury 3BHK Living Room Finish"
                  className="mt-1 w-full rounded-md border border-[#ded8cf] bg-white px-3 py-2 text-sm text-[#29251f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#746f68]">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue="Interior"
                  className="mt-1 w-full rounded-md border border-[#ded8cf] bg-white px-3 py-2 text-sm text-[#29251f]"
                >
                  <option value="Interior">Interior Painting</option>
                  <option value="Exterior">Exterior Painting</option>
                  <option value="Texture">Texture & Stencils</option>
                  <option value="Waterproofing">Waterproofing</option>
                  <option value="Woodwork">Wood Polish & Glazing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#746f68]">
                  Photo Upload
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    name="imageUrl"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/... or upload"
                    className="w-full rounded-md border border-[#ded8cf] bg-white px-3 py-2 text-sm text-[#29251f]"
                  />
                  <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[#ded8cf] bg-[#f9f7f4] px-3 py-2 text-xs font-medium text-[#504b44] hover:bg-[#ede6dc]">
                    <UploadCloud size={14} />
                    {isUploading ? "Uploading..." : "Browse"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#f0ece5] pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-[#ded8cf] bg-white px-4 py-2 text-sm font-medium text-[#504b44] hover:bg-[#faf7f2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-md bg-[#c2410c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9a3412] cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
