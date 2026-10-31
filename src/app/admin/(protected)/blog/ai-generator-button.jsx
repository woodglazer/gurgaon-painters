"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { generateBlogAction } from "./ai-actions";

export default function AIGeneratorButton({ currentCity = "gurgaon" }) {
  const [isPending, startTransition] = useTransition();
  const [resultMsg, setResultMsg] = useState("");

  const handleGenerate = () => {
    const targetCity = currentCity === "all" ? "gurgaon" : currentCity;
    const confirmText = `AI will write and save a fresh SEO humanized article for ${targetCity.toUpperCase()} Painters. Continue?`;
    if (!window.confirm(confirmText)) return;

    setResultMsg("");
    startTransition(async () => {
      try {
        const res = await generateBlogAction(targetCity);
        if (res.success) {
          setResultMsg(`Generated: "${res.title}"`);
          setTimeout(() => setResultMsg(""), 6000);
        } else {
          alert(`Failed: ${res.error}`);
        }
      } catch (err) {
        alert("Error generating post.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {resultMsg && (
        <span className="hidden items-center gap-1 text-xs font-medium text-emerald-700 sm:inline-flex animate-in fade-in">
          <CheckCircle2 size={14} />
          {resultMsg}
        </span>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-md border border-[#c2410c]/30 bg-[#fff7ed] px-3.5 py-2.5 text-sm font-semibold text-[#c2410c] transition hover:bg-[#ffedd5] disabled:opacity-50 cursor-pointer"
        title="Generate fresh Humanized SEO blog with Google Gemini"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin text-[#c2410c]" />
            Writing Blog...
          </>
        ) : (
          <>
            <Sparkles size={16} className="text-[#c2410c]" />
            AI Write Post
          </>
        )}
      </button>
    </div>
  );
}
