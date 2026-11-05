"use server";

import { createElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import SuburbAlertConfirmationEmail from "@/emails/SuburbAlertConfirmationEmail";
import { notifyAdmin } from "@/lib/adminNotify";
import { CONTACT_EMAIL } from "@/lib/contact";
import { upsertRoomAlert } from "@/lib/db/alerts";
import { DAY_LABEL, orderedDays } from "@/lib/format";
import { getLocationHub } from "@/lib/locations";
import { MAIL_FROM, SITE_URL } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { isEmail } from "@/lib/validate";

const resend = new Resend(process.env.RESEND_API_KEY);
const VALID_DAYS = new Set(Object.keys(DAY_LABEL));

function daysLabel(days) {
  if (!days.length) return "Any day";
  return days.map((day) => DAY_LABEL[day] || day).join(", ");
}

async function sendSuburbAlertConfirmation({ email, hub, days }) {
  if (!process.env.RESEND_API_KEY) {
    console.error("captureRoomAlert: RESEND_API_KEY is not set");
    return false;
  }

  const hubUrl = `${SITE_URL}/locations/${hub.slug}`;
  const preferredDays = daysLabel(days);
  const text = [
    `You're on the AlliedRooms list for sessional rooms in ${hub.name}.`,
    "",
    `Preferred days: ${preferredDays}`,
    "",
    `View rooms: ${hubUrl}`,
    "",
    "This email confirms we have your address on file. Reply if you want to be removed.",
    "",
    "Sent via AlliedRooms",
  ].join("\n");

  try {
    const html = await render(
      createElement(SuburbAlertConfirmationEmail, {
        suburbName: hub.name,
        daysLabel: preferredDays,
        hubUrl,
      }),
    );
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [email],
      replyTo: CONTACT_EMAIL,
      subject: `You're on the ${hub.name} room list`,
      text,
      html,
    });
    if (error) {
      console.error("captureRoomAlert confirmation email:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      "captureRoomAlert confirmation email:",
      error?.message || error,
    );
    return false;
  }
}

export async function captureRoomAlert(formData) {
  try {
    if (formData.get("company")) {
      return { ok: true };
    }

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    if (!isEmail(email)) {
      return { ok: false, error: "Please enter a valid email address." };
    }

    const hub = getLocationHub(formData.get("suburb"));
    if (!hub) {
      return { ok: false, error: "Invalid location selected." };
    }

    const days = orderedDays(
      formData.getAll("days").filter((day) => VALID_DAYS.has(String(day))),
    );

    const admin = createSupabaseAdminClient();
    if (!admin) {
      console.error("captureRoomAlert: missing SUPABASE_SERVICE_ROLE_KEY");
      return {
        ok: false,
        error: "Could not save your request. Please try again.",
      };
    }

    const { error } = await upsertRoomAlert(admin, {
      email,
      suburb: hub.slug,
      days,
    });

    if (error) {
      console.error("captureRoomAlert:", error.message);
      return {
        ok: false,
        error: "Could not save your request. Please try again.",
      };
    }

    const emailed = await sendSuburbAlertConfirmation({
      email,
      hub,
      days,
    });

    await notifyAdmin({
      subject: `[AlliedRooms] Room alert — ${hub.name}`,
      lines: [
        "Someone joined a suburb room list.",
        "",
        `Suburb: ${hub.name}`,
        `Email: ${email}`,
        `Preferred days: ${daysLabel(days)}`,
        "",
        `${SITE_URL}/locations/${hub.slug}`,
      ],
    });

    return { ok: true, emailed };
  } catch (error) {
    console.error("captureRoomAlert:", error?.message || error);
    return {
      ok: false,
      error: "Could not save your request. Please try again.",
    };
  }
}
