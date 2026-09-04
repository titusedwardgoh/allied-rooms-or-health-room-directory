import { createClient } from "@supabase/supabase-js";

function readEnv(name) {
  return String(process.env[name] || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function supabaseUrl() {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL");
}

function publishableKey() {
  return readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

function secretKey() {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function isSupabaseUrl(url) {
  return url.includes("supabase.co") && !url.includes("YOUR_PROJECT_ID");
}

function looksLikeKey(key) {
  return key.length > 10 && !key.includes("YOUR_KEY") && !key.includes("YOUR_SECRET");
}

function supabaseFetch() {
  return (input, init = {}) => fetch(input, { ...init, cache: "no-store" });
}

function makeClient(url, key) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: supabaseFetch() },
  });
}

export function isSupabaseConfigured() {
  return isSupabaseUrl(supabaseUrl()) && looksLikeKey(publishableKey());
}

export function createSupabaseClient() {
  const url = supabaseUrl();
  const key = publishableKey();
  if (!isSupabaseUrl(url) || !looksLikeKey(key)) return null;
  return makeClient(url, key);
}

export function createSupabaseAdminClient() {
  const url = supabaseUrl();
  const key = secretKey();
  if (!isSupabaseUrl(url) || !looksLikeKey(key)) return null;
  return makeClient(url, key);
}

/** Server reads: secret key if present (bypasses RLS), otherwise publishable. */
export function createSupabaseServerClient() {
  return createSupabaseAdminClient() || createSupabaseClient();
}

const ROOM_SELECT = `
  id,
  host_id,
  title,
  slug,
  address_line,
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

const ROOM_SELECT_PLAIN = `
  id,
  host_id,
  title,
  slug,
  address_line,
  suburb,
  state,
  price_per_day_cents,
  room_type,
  available_days,
  amenities,
  image_urls,
  description,
  is_published,
  created_at
`;

export function roomSelect() {
  return ROOM_SELECT;
}

export function roomSelectPlain() {
  return ROOM_SELECT_PLAIN;
}
