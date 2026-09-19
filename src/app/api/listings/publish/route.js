import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { publishRoomBySlug } from "@/lib/db/rooms";
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

  const { error } = await publishRoomBySlug(admin, slug);
  if (error) {
    console.error("publishListing:", error.message);
    return NextResponse.json(
      { error: "Could not publish this listing. Please try again." },
      { status: 500 },
    );
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  return NextResponse.json({ ok: true });
}
