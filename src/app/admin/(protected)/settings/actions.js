"use server";

import { revalidatePath } from "next/cache";
import { getDatabaseClient } from "@/lib/db";

export async function updateSiteSettings(city, _previousState, formData) {
  const phone = (formData.get("phone") || "").trim();
  const whatsapp = (formData.get("whatsapp") || "").trim();
  const email = (formData.get("email") || "").trim();
  const address = (formData.get("address") || "").trim();
  const workingHours = (formData.get("workingHours") || "").trim();
  const siteName = (formData.get("siteName") || "").trim();

  // WhatsApp Notification Settings
  const whatsappNotifyEnabled = formData.get("whatsappNotifyEnabled") === "true";
  const whatsappNotifyNumber = (formData.get("whatsappNotifyNumber") || "").trim();
  const whatsappNotifyApiKey = (formData.get("whatsappNotifyApiKey") || "").trim();
  const whatsappNotifyTemplate = (formData.get("whatsappNotifyTemplate") || "").trim();

  if (!phone || !email || !address) {
    return { error: "Phone, Email and Address are required." };
  }

  const sql = getDatabaseClient();
  await sql`
    INSERT INTO site_settings (
      city, site_name, phone, whatsapp, email, address, working_hours,
      whatsapp_notify_enabled, whatsapp_notify_number, whatsapp_notify_api_key, whatsapp_notify_template,
      updated_at
    )
    VALUES (
      ${city}, ${siteName}, ${phone}, ${whatsapp}, ${email}, ${address}, ${workingHours},
      ${whatsappNotifyEnabled}, ${whatsappNotifyNumber}, ${whatsappNotifyApiKey}, ${whatsappNotifyTemplate},
      now()
    )
    ON CONFLICT (city) DO UPDATE
    SET 
      site_name = EXCLUDED.site_name,
      phone = EXCLUDED.phone,
      whatsapp = EXCLUDED.whatsapp,
      email = EXCLUDED.email,
      address = EXCLUDED.address,
      working_hours = EXCLUDED.working_hours,
      whatsapp_notify_enabled = EXCLUDED.whatsapp_notify_enabled,
      whatsapp_notify_number = EXCLUDED.whatsapp_notify_number,
      whatsapp_notify_api_key = EXCLUDED.whatsapp_notify_api_key,
      whatsapp_notify_template = EXCLUDED.whatsapp_notify_template,
      updated_at = now()
  `;

  revalidatePath("/admin/settings");
  return { success: true };
}
