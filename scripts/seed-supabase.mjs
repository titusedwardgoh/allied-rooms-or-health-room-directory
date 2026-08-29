import { mockRooms } from "../src/lib/mockData.js";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey || serviceKey.includes("YOUR_SECRET")) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  const { data: existing, error: existingError } = await supabase
    .from("rooms")
    .select("slug");

  if (existingError) {
    throw existingError;
  }

  const existingSlugs = new Set((existing ?? []).map((row) => row.slug));
  let inserted = 0;

  for (const room of mockRooms) {
    if (existingSlugs.has(room.slug)) {
      console.log("skip existing", room.slug);
      continue;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        practice_name: room.host.practice_name,
        contact_email: room.host.contact_email,
        phone: room.host.phone,
        website_url: room.host.website_url,
      })
      .select("id")
      .single();

    if (profileError) throw profileError;

    const { error: roomError } = await supabase.from("rooms").insert({
      host_id: profile.id,
      title: room.title,
      slug: room.slug,
      suburb: room.suburb,
      state: room.state,
      price_per_day_cents: room.price_per_day_cents,
      room_type: room.room_type,
      available_days: room.available_days,
      amenities: room.amenities,
      image_urls: room.image_urls ?? [],
      description: room.description,
      is_published: true,
    });

    if (roomError) throw roomError;
    inserted += 1;
    console.log("inserted", room.slug);
  }

  console.log(`seed complete (${inserted} new rooms)`);
}

seed().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
