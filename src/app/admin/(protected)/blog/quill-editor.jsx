"use client";

import { useEffect, useRef, useState } from "react";

const toolbarOptions = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "link"],
  ["clean"],
];

export default function QuillEditor({ initialValue, onChange }) {
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const initialContentRef = useRef(initialValue);
  const [ready, setReady] = useState(false);
  const [initializationError, setInitializationError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    let editor;
    const editorElement = editorRef.current;

    async function initialize() {
      const { default: Quill } = await import("quill");
      if (cancelled || !editorElement) {
        return;
      }

      editor = new Quill(editorElement, {
        theme: "snow",
        placeholder: "Write your article here...",
        formats: [
          "bold",
          "italic",
          "underline",
          "strike",
          "link",
          "header",
          "list",
          "blockquote",
        ],
        modules: {
          toolbar: toolbarOptions,
        },
      });

      const delta = parseDelta(initialContentRef.current);
      if (delta) {
        editor.setContents(delta, "silent");
      } else if (initialContentRef.current) {
        editor.setText(initialContentRef.current, "silent");
      }

      editor.on("text-change", () => {
        onChangeRef.current(JSON.stringify(editor.getContents()));
      });
      setReady(true);
    }

    initialize().catch((error) => {
      console.error("Unable to initialize the blog editor.", error);
      if (!cancelled) {
        setInitializationError(
          "The rich-text editor could not be loaded. Refresh the page and try again.",
        );
      }
    });

    return () => {
      cancelled = true;
      if (editor) {
        editor.off("text-change");
        editorElement?.replaceChildren();
      }
    };
  }, [initialContentRef]);

  return (
    <div className="blog-quill-editor w-full">
      <div
        ref={editorRef}
        aria-label="Article content editor"
        className="min-h-96 bg-white text-base leading-7 text-[#38332c]"
      />
      {initializationError ? (
        <p role="alert" className="border-x border-b border-red-200 px-4 py-3 text-sm text-red-800">
          {initializationError}
        </p>
      ) : !ready ? (
        <p className="border-x border-b border-[#ded8cf] px-4 py-3 text-sm text-[#817a6e]">
          Loading editor…
        </p>
      ) : null}
    </div>
  );
}

function parseDelta(value) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed?.ops) ? parsed : null;
  } catch {
    return null;
  }
}
