import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getRoomBySlug, publishRoomBySlug } from "@/lib/db/rooms";
import { deleteMatchingListingLeads } from "@/lib/db/leads";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function POST(request) {
  let slug = "";
  try {
    const body = await request.json();
    slug = String(body?.slug || "").trim();
  } catch {
    return NextResponse.json({ error: "Missing listing." }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Missing listing." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Could not publish this listing. Please try again." },
      { status: 500 },
    );
  }

  const room = await getRoomBySlug(slug);
  const { error } = await publishRoomBySlug(admin, slug);
  if (error) {
    console.error("publishListing:", error.message);
    return NextResponse.json(
      { error: "Could not publish this listing. Please try again." },
      { status: 500 },
    );
  }

  const host = room?.host ?? {};
  const { error: leadError } = await deleteMatchingListingLeads(admin, {
    practiceName: host.practice_name,
    contactEmail: host.contact_email,
    phone: host.phone,
  });
  if (leadError) {
    console.error("publishListing lead:", leadError.message);
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  return NextResponse.json({ ok: true });
}
