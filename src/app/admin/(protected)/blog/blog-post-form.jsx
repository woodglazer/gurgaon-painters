"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import BlogImageUpload from "./blog-image-upload";
import QuillEditor from "./quill-editor";
import { createBlogPost, updateBlogPost } from "./actions";

const fieldClass =
  "mt-1 w-full rounded-md border border-[#ded8cf] bg-white px-3 py-2.5 text-sm text-[#38332c] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15";
const labelClass = "block text-sm font-medium text-[#504b44]";

export default function BlogPostForm({ post }) {
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
        <label className={labelClass}>
          Category
          <input
            className={fieldClass}
            name="category"
            required
            maxLength={100}
            defaultValue={post?.category}
            placeholder="Interior planning"
          />
        </label>
        <label className={labelClass}>
          SEO title
          <input
            className={fieldClass}
            name="seoTitle"
            maxLength={180}
            defaultValue={post?.seoTitle}
            placeholder="Leave blank to use the post title"
          />
        </label>
      </div>

      <label className={labelClass}>
        Short description
        <textarea
          className={fieldClass}
          name="description"
          required
          maxLength={320}
          rows={2}
          defaultValue={post?.description}
        />
      </label>

      <div role="region" aria-labelledby="body-label" className="w-full">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="body-label" className={labelClass}>Article body</h2>
            <p id="body-help" className="mt-1 text-xs font-normal text-[#817a6e]">
              Format your article with headings, text styles, lists, links, and quotes.
            </p>
          </div>
        </div>

        <input type="hidden" name="body" value={body} />
        <div className="mt-3 w-full">
          <QuillEditor initialValue={body} onChange={setBody} />
        </div>
        <p className="mt-2 text-xs leading-5 text-[#817a6e]">
          Formatting is shown as you write. Select text and use the toolbar.
        </p>
      </div>

      <label className={labelClass}>
        Key takeaways
        <textarea
          className={fieldClass}
          name="checks"
          maxLength={5000}
          rows={4}
          defaultValue={post?.checks?.join("\n")}
          aria-describedby="checks-help"
        />
        <span id="checks-help" className="mt-1 block text-xs font-normal text-[#817a6e]">
          Add one takeaway per line.
        </span>
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <BlogImageUpload initialValue={post?.image} />
        <label className={labelClass}>
          Image alt text
          <input
            className={fieldClass}
            name="imageAlt"
            required
            maxLength={250}
            defaultValue={post?.imageAlt}
          />
        </label>
      </div>

      <label className={`${labelClass} max-w-sm`}>
        Publishing status
        <select
          className={fieldClass}
          name="published"
          defaultValue={post?.published ? "true" : "false"}
        >
          <option value="false">Draft</option>
          <option value="true">Published</option>
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#eee9e2] pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#c2410c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a3412] disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Saving…" : post ? "Save changes" : "Create post"}
        </button>
        <Link
          href="/admin/blog"
          className="rounded-md border border-[#ded8cf] px-5 py-2.5 text-sm font-semibold text-[#504b44] transition hover:bg-[#faf9f7]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
