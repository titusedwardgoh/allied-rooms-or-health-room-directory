"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { publishRoomBySlug } from "@/lib/db/rooms";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function publishListing(formData) {
  const slug = String(formData.get("slug") || "").trim();
  if (!slug) {
    return { error: "Missing listing." };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { error: "Could not publish this listing. Please try again." };
  }

  const { error } = await publishRoomBySlug(admin, slug);
  if (error) {
    console.error("publishListing:", error.message);
    return { error: "Could not publish this listing. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${slug}`);
  redirect(`/rooms/${slug}`);
}
