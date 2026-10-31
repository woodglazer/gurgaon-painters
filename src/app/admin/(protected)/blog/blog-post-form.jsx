"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import BlogImageUpload from "./blog-image-upload";
import QuillEditor from "./quill-editor";
import { createBlogPost, updateBlogPost } from "./actions";

const fieldClass =
  "mt-1 w-full rounded-md border border-[#ded8cf] bg-white px-3 py-2.5 text-sm text-[#38332c] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15";
const labelClass = "block text-sm font-medium text-[#504b44]";

export default function BlogPostForm({ post, defaultCity = "gurgaon" }) {
  const action = post
    ? updateBlogPost.bind(null, post.id)
    : createBlogPost;
  const [state, formAction, pending] = useActionState(action, { error: "" });
  const [body, setBody] = useState(
    post?.body || post?.paragraphs?.join("\n\n") || "",
  );

  return (
    <form action={formAction} className="mt-6 w-full space-y-5">
      {state.error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      {/* Target City Switch / Select */}
      <div className="rounded-lg border border-[#e8e2d8] bg-[#fbf9f6] p-4">
        <label className={labelClass}>
          Target Website / City
          <span className="block text-xs font-normal text-[#817a6e]">
            Choose where this blog should be published.
          </span>
          <select
            name="city"
            defaultValue={post?.city || defaultCity}
            className={`${fieldClass} mt-2 font-medium`}
          >
            <option value="gurgaon">Gurgaon Painters (gurgaonpainters.com)</option>
            <option value="noida">Noida Painters (noidapainters.com)</option>
            <option value="all">Both Websites (All Cities)</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Post title
          <input
            className={fieldClass}
            name="title"
            required
            maxLength={180}
            defaultValue={post?.title}
          />
        </label>
        <label className={labelClass}>
          URL slug
          <input
            className={fieldClass}
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={180}
            defaultValue={post?.slug}
            placeholder="your-article-title"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Category
          <input
            className={fieldClass}
            name="category"
            required
            maxLength={100}
            defaultValue={post?.category}
            placeholder="e.g. Interior planning, Colour advice"
          />
        </label>
        <label className={labelClass}>
          SEO title
          <input
            className={fieldClass}
            name="seoTitle"
            maxLength={180}
            defaultValue={post?.seoTitle}
            placeholder="Defaults to post title if left blank"
          />
        </label>
      </div>

      <label className={labelClass}>
        Short description (meta description & excerpt)
        <textarea
          className={fieldClass}
          name="description"
          required
          rows={3}
          maxLength={320}
          defaultValue={post?.description}
        />
      </label>

      <div>
        <label className={labelClass}>Article content</label>
        <QuillEditor value={body} onChange={setBody} />
        <input type="hidden" name="body" value={body} />
      </div>

      <label className={labelClass}>
        Key checks or takeaways (one per line)
        <textarea
          className={fieldClass}
          name="checks"
          rows={4}
          defaultValue={post?.checks?.join("\n")}
          placeholder="One item per line&#10;Second check&#10;Third check"
        />
      </label>

      <div className="rounded-md border border-[#e9e3d9] bg-[#faf9f7] p-5">
        <h3 className="font-semibold text-[#29251f]">Featured image</h3>
        <p className="mt-1 text-xs text-[#817a6e]">
          Upload an image or paste a local image path.
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Image path
            <input
              id="blog-image-input"
              className={fieldClass}
              name="image"
              required
              maxLength={500}
              defaultValue={post?.image}
              placeholder="/images/service-interior.webp"
            />
          </label>
          <label className={labelClass}>
            Image alt text
            <input
              className={fieldClass}
              name="imageAlt"
              required
              maxLength={250}
              defaultValue={post?.imageAlt}
              placeholder="Descriptive text for accessibility and SEO"
            />
          </label>
        </div>
        <div className="mt-4">
          <BlogImageUpload targetInputId="blog-image-input" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e9e3d9] pt-5">
        <label className="flex items-center gap-2 text-sm font-medium text-[#29251f]">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={post?.published}
            className="size-4 rounded border-[#ded8cf] text-[#c2410c] focus:ring-[#c2410c]"
          />
          Publish immediately
        </label>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="rounded-md border border-[#ded8cf] bg-white px-4 py-2.5 text-sm font-medium text-[#504b44] transition hover:bg-[#faf9f7] hover:text-[#29251f]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-[#c2410c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a3412] disabled:opacity-50"
          >
            {pending ? "Saving..." : post ? "Update post" : "Save post"}
          </button>
        </div>
      </div>
    </form>
  );
}
