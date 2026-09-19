"use server";

import { revalidatePath } from "next/cache";
import { publishRoomBySlug } from "@/lib/db/rooms";
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

  const { error } = await publishRoomBySlug(admin, value);
  if (error) {
    console.error("publishListing:", error.message);
    return { error: "Could not publish this listing. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  return { ok: true };
}
