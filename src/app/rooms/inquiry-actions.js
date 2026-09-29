"use server";

import { Resend } from "resend";
import { logInquiry, markInquiry } from "@/lib/db/inquiries";
import { getRoomBySlug } from "@/lib/db/rooms";
import { escapeHtml } from "@/lib/html";
import { MAIL_FROM } from "@/lib/site";
import { isEmail } from "@/lib/validate";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_NAME = 120;
const MAX_MESSAGE = 5000;
const MAX_PHONE = 40;

export async function sendListingInquiry(payload) {
  const slug = String(payload?.slug ?? "").trim();
  const name = String(payload?.name ?? "").trim();
  const email = String(payload?.email ?? "").trim();
  const phone = String(payload?.phone ?? "").trim();
  const message = String(payload?.message ?? "").trim();

  if (!slug) {
    return { ok: false, error: "Missing listing." };
  }
  if (!name || name.length > MAX_NAME) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!isEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (phone.length > MAX_PHONE) {
    return { ok: false, error: "Please enter a shorter phone number." };
  }
  if (!message) {
    return { ok: false, error: "Please include a short message." };
  }
  if (message.length > MAX_MESSAGE) {
    return { ok: false, error: "Please keep your message under 5,000 characters." };
  }

  const room = await getRoomBySlug(slug);
  const host = room?.host ?? {};
  const hostEmail = String(host.contact_email ?? "").trim();

  if (!room || room.is_published === false) {
    return { ok: false, error: "This listing is not available." };
  }
  if (!isEmail(hostEmail)) {
    return {
      ok: false,
      error: "This host cannot receive inquiries right now.",
    };
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("Resend API Error:", "RESEND_API_KEY is not set");
    return { ok: false, error: "Couldn't send right now. Please try again." };
  }

  const inquiryId = await logInquiry({
    source: "listing",
    room_id: room.id,
    room_title: room.title,
    room_slug: room.slug,
    host_email: hostEmail,
    sender_name: name,
    sender_email: email,
    sender_phone: phone || null,
    topic: "Listing inquiry",
    message,
    status: "pending",
  });

  const lines = [
    "New inquiry via AlliedRooms",
    "",
    `Listing: ${room.title}`,
    `From: ${name}`,
    `Email: ${email}`,
  ];
  if (phone) lines.push(`Phone: ${phone}`);
  lines.push("", "Message:", message);
  const textBody = lines.join("\n");

  const htmlBody = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #1c1917; line-height: 1.6;">
      <h1 style="font-size: 18px; margin: 0 0 16px;">New listing inquiry</h1>
      <p style="margin: 0 0 8px;"><strong>Listing:</strong> ${escapeHtml(room.title)}</p>
      <p style="margin: 0 0 8px;"><strong>From:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${
        phone
          ? `<p style="margin: 0 0 16px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>`
          : ""
      }
      <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [hostEmail],
      replyTo: email,
      subject: `Inquiry — ${room.title} via AlliedRooms`,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API Error:", error);
      await markInquiry(inquiryId, "failed");
      return { ok: false, error: "Couldn't send right now. Please try again." };
    }

    await markInquiry(inquiryId, "sent");
    return { ok: true };
  } catch (error) {
    console.error("Resend API Error:", error);
    await markInquiry(inquiryId, "failed");
    return { ok: false, error: "Couldn't send right now. Please try again." };
  }
}
