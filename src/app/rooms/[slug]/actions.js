"use server";

import { revalidatePath } from "next/cache";
import { notifyAdmin } from "@/lib/adminNotify";
import { getRoomBySlug, publishRoomBySlug } from "@/lib/db/rooms";
import { pricePerDayLabel } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function publishListing(slug) {
  const value = String(slug || "").trim();
  if (!value) {
    return { error: "Missing listing." };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { error: "Could not publish this listing. Please try again." };
  }

  const room = await getRoomBySlug(value);
  const { error } = await publishRoomBySlug(admin, value);
  if (error) {
    console.error("publishListing:", error.message);
    return { error: "Could not publish this listing. Please try again." };
  }

  if (room?.is_published === false) {
    const host = room.host ?? {};
    await notifyAdmin({
      subject: `[AlliedRooms] Listing published — ${room.title}`,
      lines: [
        "A listing just went live.",
        "",
        `Title: ${room.title}`,
        `Suburb: ${room.suburb || "—"}`,
        `Rate: ${pricePerDayLabel(room.price_per_day_cents)}`,
        `Host: ${host.practice_name || "—"}`,
        `Host email: ${host.contact_email || "—"}`,
        "",
        `${SITE_URL}/rooms/${room.slug}`,
      ],
    });
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  return { ok: true };
}
