"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const fieldClass =
  "mt-1 w-full rounded-md border border-[#ded8cf] bg-white px-3 py-2.5 text-sm text-[#38332c] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15";

export default function BlogImageUpload({ initialValue = "" }) {
  const inputRef = useRef(null);
  const [image, setImage] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be 3 MB or smaller.");
      return;
    }

    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.set("image", file);

    try {
      const response = await fetch("/api/admin/blog/images", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to upload this image.");
      }
      setImage(result.image);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload this image.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative">
      <span className="block text-sm font-medium text-[#504b44]">Cover image</span>
      <input type="hidden" name="image" value={image} required />
      <div className="mt-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-[#ded8cf] bg-white px-4 py-2.5 text-sm font-semibold text-[#504b44] transition hover:bg-[#faf9f7] disabled:cursor-wait disabled:opacity-60"
          >
            {uploading ? "Uploading…" : image ? "Choose another image" : "Upload image"}
          </button>
          <span className="text-xs text-[#817a6e]">
            JPEG, PNG, or WebP · up to 3 MB
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          className="sr-only"
          aria-label="Choose a cover image to upload"
        />
        {image && (
          <div className="relative aspect-[16/9] w-full max-w-lg overflow-hidden rounded-md border border-[#e9e3d9] bg-[#faf9f7]">
            <Image
              src={image}
              alt="Cover image preview"
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              unoptimized={image.startsWith("/api/blog/images/")}
              className="object-cover"
            />
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
