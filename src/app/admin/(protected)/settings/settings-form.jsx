"use client";

import { useActionState } from "react";
import { MessageSquareText, Bell, Building2 } from "lucide-react";
import { updateSiteSettings } from "./actions";

export default function SettingsForm({ settings, city }) {
  const boundAction = updateSiteSettings.bind(null, city);
  const [state, formAction, pending] = useActionState(boundAction, null);

  return (
    <form action={formAction} className="mt-6 w-full space-y-6">
      {state?.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 font-medium">
          Settings for {city.toUpperCase()} saved successfully!
        </p>
      )}

      {/* 1. Basic Branch Information */}
      <div className="w-full rounded-xl border border-[#ded8cf] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#f0ece5] pb-3">
          <Building2 size={18} className="text-[#c2410c]" />
          <h2 className="text-base font-semibold text-[#29251f]">
            Branch & Contact Information
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
              Website Brand Name
            </label>
            <input
              name="siteName"
              defaultValue={settings?.site_name || (city === "noida" ? "Noida Painters" : "Gurgaon Painters")}
              className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
              Customer Support Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={settings?.email || (city === "noida" ? "info@noidapainters.com" : "info@gurgaonpainters.com")}
              className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
              Contact Phone (Displayed on site)
            </label>
            <input
              name="phone"
              defaultValue={settings?.phone || "+91 97172 56514"}
              className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
              Customer WhatsApp Button
            </label>
            <input
              name="whatsapp"
              defaultValue={settings?.whatsapp || "+91 97172 56514"}
              className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
            Working Hours
          </label>
          <input
            name="workingHours"
            defaultValue={settings?.working_hours || "Mon - Sun: 8:00 AM - 8:00 PM"}
            className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
            Office / Branch Address
          </label>
          <textarea
            name="address"
            rows={2}
            defaultValue={settings?.address || (city === "noida" ? "Sector 62, Noida, Uttar Pradesh 201309" : "Sector 48, Sohna Road, Gurgaon, Haryana 122018")}
            className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
            required
          />
        </div>
      </div>

      {/* 2. Instant WhatsApp Lead Notifications */}
      <div className="w-full rounded-xl border border-[#ded8cf] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#f0ece5] pb-3">
          <div className="flex items-center gap-2">
            <MessageSquareText size={18} className="text-emerald-600" />
            <div>
              <h2 className="text-base font-semibold text-[#29251f]">
                Instant WhatsApp Lead Alerts
              </h2>
              <p className="text-xs text-[#817a6e]">
                Get a WhatsApp message as soon as a customer submits an enquiry.
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-[#504b44]">
            <input
              type="checkbox"
              name="whatsappNotifyEnabled"
              value="true"
              defaultChecked={settings?.whatsapp_notify_enabled !== false}
              className="size-4 rounded text-emerald-600"
            />
            Enabled
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
              Admin WhatsApp Mobile Number (To receive alerts)
            </label>
            <input
              name="whatsappNotifyNumber"
              defaultValue={settings?.whatsapp_notify_number || "919717256514"}
              placeholder="e.g. 919717256514 (with country code 91)"
              className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
            />
            <p className="mt-1 text-[11px] text-[#817a6e]">
              Enter mobile number with country code without + or spaces (e.g. 919717256514).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
              Webhook URL / Gateway Key (Optional)
            </label>
            <input
              name="whatsappNotifyApiKey"
              defaultValue={settings?.whatsapp_notify_api_key || ""}
              placeholder="e.g. https://api.whatsapp-gateway.com/send or Webhook"
              className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
            />
            <p className="mt-1 text-[11px] text-[#817a6e]">
              Supports AiSensy, Wati, CallMeBot, or Zapier/Pabbly webhook.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#746f68]">
            Notification Message Template
          </label>
          <textarea
            name="whatsappNotifyTemplate"
            rows={3}
            defaultValue={
              settings?.whatsapp_notify_template ||
              "🚨 New Lead from {city_name}!\n👤 Name: {name}\n📞 Phone: {phone}\n🎨 Service: {service}\n📝 Details: {message}"
            }
            className="mt-1.5 w-full rounded-md border border-[#ded8cf] px-3.5 py-2.5 text-sm text-[#29251f] outline-none transition focus:border-[#c2410c] focus:ring-2 focus:ring-[#c2410c]/15"
          />
          <p className="mt-1 text-[11px] text-[#817a6e]">
            Variables available: <code className="font-semibold text-[#c2410c]">{`{city_name}`}</code>, <code className="font-semibold text-[#c2410c]">{`{name}`}</code>, <code className="font-semibold text-[#c2410c]">{`{phone}`}</code>, <code className="font-semibold text-[#c2410c]">{`{service}`}</code>, <code className="font-semibold text-[#c2410c]">{`{message}`}</code>.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#c2410c] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a3412] disabled:opacity-50 cursor-pointer"
        >
          {pending ? "Saving..." : `Save ${city.toUpperCase()} Settings`}
        </button>
      </div>
    </form>
  );
}
