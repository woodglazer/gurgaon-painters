"use client";

import { useEffect } from "react";

export default function AnalyticsEvents() {
  useEffect(() => {
    function trackContactClick(event) {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a[href]");
      if (!link) return;

      const destination = new URL(link.href, window.location.href);
      const eventName =
        destination.protocol === "tel:"
          ? "click_to_call"
          : destination.hostname === "wa.me" ||
              destination.hostname.endsWith("whatsapp.com")
            ? "whatsapp_click"
            : null;

      if (!eventName || typeof window.gtag !== "function") return;

      window.gtag("event", eventName, { link_type: eventName });
    }

    document.addEventListener("click", trackContactClick);
    return () => document.removeEventListener("click", trackContactClick);
  }, []);

  return null;
}
