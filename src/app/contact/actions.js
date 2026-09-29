"use server";

import { Resend } from "resend";
import { CONTACT_EMAIL, CONTACT_TOPICS } from "@/lib/contact";
import { MAIL_FROM } from "@/lib/site";
import { logInquiry, markInquiry } from "@/lib/db/inquiries";
import { escapeHtml } from "@/lib/html";
import { isEmail } from "@/lib/validate";

const resend = new Resend(process.env.RESEND_API_KEY);

const TOPIC_SET = new Set(CONTACT_TOPICS);
const MAX_NAME = 120;
const MAX_MESSAGE = 5000;

export async function sendContactMessage(payload) {
  const name = String(payload?.name ?? "").trim();
  const email = String(payload?.email ?? "").trim();
  const topic = String(payload?.topic ?? "").trim();
  const message = String(payload?.message ?? "").trim();

  if (!name || name.length > MAX_NAME) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!isEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!TOPIC_SET.has(topic)) {
    return { ok: false, error: "Please choose a topic." };
  }
  if (!message) {
    return { ok: false, error: "Please include a short message." };
  }
  if (message.length > MAX_MESSAGE) {
    return { ok: false, error: "Please keep your message under 5,000 characters." };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Resend API Error:", "RESEND_API_KEY is not set");
    return {
      ok: false,
      error: `Couldn't send right now. Email us at ${CONTACT_EMAIL}.`,
    };
  }

  const to = process.env.CONTACT_FORM_TO_EMAIL || CONTACT_EMAIL;
  const inquiryId = await logInquiry({
    source: "contact",
    room_id: null,
    room_title: topic,
    room_slug: null,
    host_email: to,
    sender_name: name,
    sender_email: email,
    sender_phone: null,
    topic,
    message,
    status: "pending",
  });

  const textBody = [
    "New AlliedRooms enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    "",
    "Message:",
    message,
  ].join("\n");
  const htmlBody = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #1c1917; line-height: 1.6;">
      <h1 style="font-size: 18px; margin: 0 0 16px;">New AlliedRooms enquiry</h1>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 16px;"><strong>Topic:</strong> ${escapeHtml(topic)}</p>
      <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [to],
      replyTo: email,
      subject: `New AlliedRooms Enquiry: ${topic} from ${name}`,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API Error:", error);
      await markInquiry(inquiryId, "failed");
      return {
        ok: false,
        error: `Couldn't send right now. Email us at ${CONTACT_EMAIL}.`,
      };
    }

    await markInquiry(inquiryId, "sent");
    return { ok: true };
  } catch (error) {
    console.error("Resend API Error:", error);
    await markInquiry(inquiryId, "failed");
    return {
      ok: false,
      error: `Couldn't send right now. Email us at ${CONTACT_EMAIL}.`,
    };
  }
}
