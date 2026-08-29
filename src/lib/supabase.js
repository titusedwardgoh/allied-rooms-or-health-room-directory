import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return (
    url.includes("supabase.co") &&
    !url.includes("YOUR_PROJECT_ID") &&
    key.length > 10 &&
    !key.includes("YOUR_KEY")
  );
}

export function createSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url.includes("supabase.co") || !serviceKey || serviceKey.includes("YOUR_SECRET")) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const ROOM_SELECT = `
  id,
  host_id,
  title,
  slug,
  suburb,
  state,
  price_per_day_cents,
  room_type,
  available_days,
  amenities,
  image_urls,
  description,
  is_published,
  created_at,
  host:profiles (
    id,
    practice_name,
    contact_email,
    phone,
    website_url,
    created_at
  )
`;

export function roomSelect() {
  return ROOM_SELECT;
}
