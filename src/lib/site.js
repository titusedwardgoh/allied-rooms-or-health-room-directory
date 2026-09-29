export const SITE_URL = "https://alliedrooms.com.au";

/** Resend `from` after alliedrooms.com.au is verified. Override with RESEND_FROM_EMAIL. */
export const MAIL_FROM =
  process.env.RESEND_FROM_EMAIL?.trim() ||
  "AlliedRooms <hello@alliedrooms.com.au>";
