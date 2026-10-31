import { connection } from "next/server";
import { ENQUIRY_SERVICES } from "@/lib/enquiry-config";
import { getDatabaseClient } from "@/lib/db";
import { sendLeadWhatsAppNotification } from "@/lib/whatsapp-notifier";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request) {
  await connection();

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { error: "A JSON request body is required." },
      { status: 415, headers: noStore },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "The enquiry details could not be read. Please try again." },
      { status: 400, headers: noStore },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Please provide valid enquiry details." },
      { status: 400, headers: noStore },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const service = typeof body.service === "string" ? body.service : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const digitCount = phone.replace(/\D/g, "").length;

  if (name.length < 2 || name.length > 120) {
    return Response.json(
      { error: "Please enter a name between 2 and 120 characters." },
      { status: 400, headers: noStore },
    );
  }

  if (
    phone.length > 30 ||
    !/^[+\d\s().-]+$/.test(phone) ||
    digitCount < 7
  ) {
    return Response.json(
      { error: "Please enter a valid phone number." },
      { status: 400, headers: noStore },
    );
  }

  if (!ENQUIRY_SERVICES.includes(service)) {
    return Response.json(
      { error: "Please select a valid service." },
      { status: 400, headers: noStore },
    );
  }

  if (message.length > 2000) {
    return Response.json(
      { error: "Project details must be 2,000 characters or fewer." },
      { status: 400, headers: noStore },
    );
  }

  try {
    const sql = getDatabaseClient();
    const [enquiry] = await sql`
      INSERT INTO enquiries (name, phone, service, message, city)
      VALUES (${name}, ${phone}, ${service}, ${message}, 'gurgaon')
      RETURNING id
    `;

    // Trigger WhatsApp notification asynchronously
    sendLeadWhatsAppNotification({
      name,
      phone,
      service,
      message,
      city: "gurgaon",
    }).catch((err) => console.error("WhatsApp trigger error:", err));

    return Response.json(
      { id: enquiry.id },
      { status: 201, headers: noStore },
    );
  } catch (error) {
    console.error(
      "Unable to save contact enquiry.",
      error instanceof Error ? error.message : "Unknown database error",
    );
    return Response.json(
      { error: "We could not save your enquiry. Please try again shortly." },
      { status: 503, headers: noStore },
    );
  }
}
