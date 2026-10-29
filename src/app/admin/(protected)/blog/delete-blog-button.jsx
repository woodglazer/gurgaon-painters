"use client";

import { deleteBlogPost } from "./actions";

export default function DeleteBlogButton({ id, slug }) {
  function confirmDelete(event) {
    if (!window.confirm("Delete this blog post permanently?")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteBlogPost} onSubmit={confirmDelete}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="text-xs font-semibold text-red-700 hover:text-red-900"
      >
        Delete
      </button>
    </form>
  );
}
