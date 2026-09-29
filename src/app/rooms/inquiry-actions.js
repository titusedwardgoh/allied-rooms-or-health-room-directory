"use server";

import { createElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import HostInquiryEmail from "@/emails/HostInquiryEmail";
import UserConfirmationEmail from "@/emails/UserConfirmationEmail";
import { logInquiry, markInquiry } from "@/lib/db/inquiries";
import { getRoomBySlug } from "@/lib/db/rooms";
import { MAIL_FROM, SITE_URL } from "@/lib/site";
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
  const clinicName = String(host.practice_name ?? "").trim() || "the clinic";

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

  const listingUrl = `${SITE_URL}/rooms/${room.slug}`;
  const textBody = [
    "New inquiry via AlliedRooms",
    "",
    `Listing: ${room.title}`,
    `From: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const html = await render(
      createElement(HostInquiryEmail, {
        roomTitle: room.title,
        senderName: name,
        senderEmail: email,
        senderPhone: phone,
        message,
      }),
    );
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [hostEmail],
      replyTo: email,
      subject: `Inquiry — ${room.title} via AlliedRooms`,
      text: textBody,
      html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      await markInquiry(inquiryId, "failed");
      return { ok: false, error: "Couldn't send right now. Please try again." };
    }

    await markInquiry(inquiryId, "sent");
    await sendInquiryConfirmation({
      name,
      email,
      clinicName,
      hostEmail,
      listingTitle: room.title,
      listingUrl,
    });
    return { ok: true };
  } catch (error) {
    console.error("Resend API Error:", error);
    await markInquiry(inquiryId, "failed");
    return { ok: false, error: "Couldn't send right now. Please try again." };
  }
}

async function sendInquiryConfirmation({
  name,
  email,
  clinicName,
  hostEmail,
  listingTitle,
  listingUrl,
}) {
  const text = [
    `Hi ${name},`,
    "",
    `Your inquiry about "${listingTitle}" has been sent to ${clinicName}.`,
    "",
    "You can also email the clinic directly:",
    hostEmail,
    "",
    listingUrl ? `View listing: ${listingUrl}` : null,
    listingUrl ? "" : null,
    "Sent via AlliedRooms",
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const html = await render(
      createElement(UserConfirmationEmail, {
        senderName: name,
        roomTitle: listingTitle,
        practiceName: clinicName,
        hostEmail,
        listingUrl,
      }),
    );
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [email],
      replyTo: hostEmail,
      subject: `Your inquiry was sent to ${clinicName}`,
      text,
      html,
    });
    if (error) {
      console.error("Resend confirmation email error:", error);
    }
  } catch (error) {
    console.error("Resend confirmation email error:", error);
  }
}
