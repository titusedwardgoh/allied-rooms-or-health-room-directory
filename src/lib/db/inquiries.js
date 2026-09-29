import { createSupabaseAdminClient } from "@/lib/supabase";

export async function insertInquiry(admin, inquiry) {
  return admin.from("inquiries").insert(inquiry).select("id").single();
}

export async function setInquiryStatus(admin, id, status) {
  if (!id) return { error: null };
  return admin.from("inquiries").update({ status }).eq("id", id);
}

export async function logInquiry(inquiry) {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const { data, error } = await insertInquiry(admin, inquiry);
  if (error) {
    console.error("Failed to log inquiry to Supabase:", error.message);
    return null;
  }
  return data?.id ?? null;
}

export async function markInquiry(id, status) {
  const admin = createSupabaseAdminClient();
  if (!admin || !id) return;
  const { error } = await setInquiryStatus(admin, id, status);
  if (error) {
    console.error("Failed to update inquiry status:", error.message);
  }
}
