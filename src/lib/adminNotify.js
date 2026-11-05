import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import { escapeHtml } from "@/lib/html";
import { MAIL_FROM } from "@/lib/site";

const resend = new Resend(process.env.RESEND_API_KEY);

function adminInbox() {
  return process.env.CONTACT_FORM_TO_EMAIL?.trim() || CONTACT_EMAIL;
}

/** Background ping to Gmail. Never throws; never blocks the user-facing result. */
export async function notifyAdmin({ subject, lines }) {
  if (!process.env.RESEND_API_KEY) {
    console.error("notifyAdmin: RESEND_API_KEY is not set");
    return;
  }

  const bodyLines = (lines || []).filter((line) => line != null);
  const text = [...bodyLines, "", "Sent via AlliedRooms"].join("\n");
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #1c1917; line-height: 1.6;">
      <h1 style="font-size: 18px; margin: 0 0 16px;">${escapeHtml(subject)}</h1>
      ${bodyLines
        .map((line) =>
          line
            ? `<p style="margin: 0 0 8px;">${escapeHtml(line)}</p>`
            : "<p style=\"margin: 0 0 8px;\">&nbsp;</p>",
        )
        .join("")}
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [adminInbox()],
      subject,
      text,
      html,
    });
    if (error) {
      console.error("notifyAdmin:", error);
    }
  } catch (error) {
    console.error("notifyAdmin:", error?.message || error);
  }
}
