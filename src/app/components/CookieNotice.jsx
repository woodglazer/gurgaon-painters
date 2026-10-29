"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const NOTICE_COOKIE = "homeglazer-cookie-notice";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

function hasAcknowledgedNotice() {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${NOTICE_COOKIE}=`));
}

function subscribeToNotice(callback) {
  window.addEventListener("cookie-notice-change", callback);
  return () => window.removeEventListener("cookie-notice-change", callback);
}

export default function CookieNotice() {
  const isVisible = useSyncExternalStore(
    subscribeToNotice,
    () => !hasAcknowledgedNotice(),
    () => false,
  );

  function dismissNotice() {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${NOTICE_COOKIE}=acknowledged; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
    window.dispatchEvent(new Event("cookie-notice-change"));
  }

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-[#29251f]/10 bg-white p-5 shadow-[0_16px_48px_rgba(26,22,18,0.2)] sm:inset-x-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6"
    >
      <div>
        <h2 className="text-base font-semibold text-[#29251f]">Cookie notice</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#69645b]">
          This site stores a necessary preference cookie and uses Google Analytics to measure website usage and enquiry interactions. Read our <Link href="/cookies" className="font-semibold text-[#c2410c] underline underline-offset-2">cookie policy</Link>.
        </p>
      </div>
      <button
        type="button"
        onClick={dismissNotice}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#c2410c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#9a3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]"
      >
        Okay
      </button>
    </aside>
  );
}
