import { mockRooms } from "./mockData";
import {
  createSupabaseAdminClient,
  createSupabaseClient,
  isSupabaseConfigured,
  roomSelect,
  roomSelectPlain,
} from "./supabase";

function supabaseReaders() {
  return [createSupabaseAdminClient(), createSupabaseClient()].filter(Boolean);
}

async function queryRooms(run) {
  let lastError = null;
  for (const client of supabaseReaders()) {
    const result = await run(client);
    if (!result.error) return result;
    lastError = result.error;
    console.error("Supabase read:", result.error.message);
  }
  return { data: null, error: lastError };
}

const HUBS = [
  { suburb: "Richmond", tag: "Inner East" },
  { suburb: "South Yarra", tag: "Metro" },
  { suburb: "Fitzroy", tag: "Inner North" },
  { suburb: "Hawthorn", tag: "East" },
  { suburb: "Brunswick", tag: "North" },
];

function normalizeDays(days) {
  if (!days) return [];
  return Array.isArray(days) ? days.filter(Boolean) : [days];
}

function filterMock(rooms, filters = {}) {
  const { suburb = "", type = "", days = [], max = "" } = filters;
  const cleanSuburb = suburb.trim().toLowerCase();
  const maxCents = max ? parseInt(max, 10) * 100 : null;
  const selectedDays = normalizeDays(days);

  return rooms.filter((room) => {
    if (!room.is_published) return false;
    if (cleanSuburb && !room.suburb.toLowerCase().includes(cleanSuburb)) {
      return false;
    }
    if (type && room.room_type !== type) return false;
    if (
      selectedDays.length > 0 &&
      !selectedDays.some((d) => room.available_days.includes(d))
    ) {
      return false;
    }
    if (maxCents && room.price_per_day_cents > maxCents) return false;
    return true;
  });
}

function normalizeRoom(row) {
  if (!row) return null;
  const host = Array.isArray(row.host) ? row.host[0] : row.host;
  return {
    ...row,
    host: host ?? null,
    amenities: row.amenities ?? [],
    available_days: row.available_days ?? [],
    image_urls: row.image_urls ?? [],
  };
}

function statsFromRooms(rooms) {
  const counts = {};
  rooms.forEach((r) => {
    if (!r.is_published) return;
    counts[r.suburb] = (counts[r.suburb] || 0) + 1;
  });
  return HUBS.map(({ suburb, tag }) => ({
    suburb,
    tag,
    count: counts[suburb] || 0,
  }));
}

function applyRoomFilters(query, filters = {}) {
  const { suburb = "", type = "", days = [], max = "" } = filters;
  const cleanSuburb = suburb.trim().toLowerCase();
  const maxCents = max ? parseInt(max, 10) * 100 : null;
  const selectedDays = normalizeDays(days);

  let next = query.eq("is_published", true).order("created_at", { ascending: false });
  if (cleanSuburb) next = next.ilike("suburb", `%${cleanSuburb}%`);
  if (type) next = next.eq("room_type", type);
  if (selectedDays.length > 0) next = next.overlaps("available_days", selectedDays);
  if (maxCents) next = next.lte("price_per_day_cents", maxCents);
  return next;
}

async function fetchPublishedRooms(filters = {}) {
  if (!supabaseReaders().length) return filterMock(mockRooms, filters);

  let { data, error } = await queryRooms((supabase) =>
    applyRoomFilters(supabase.from("rooms").select(roomSelect()), filters),
  );

  if (error) {
    ({ data, error } = await queryRooms((supabase) =>
      applyRoomFilters(supabase.from("rooms").select(roomSelectPlain()), filters),
    ));
  }

  if (error) {
    console.error("Supabase getPublishedRooms:", error.message);
    return [];
  }
  return (data ?? []).map(normalizeRoom);
}

export async function getPublishedRooms(filters = {}) {
  return fetchPublishedRooms(filters);
}

export async function getRoomBySlug(slug) {
  if (!slug) return null;

  if (!supabaseReaders().length) {
    return mockRooms.find((room) => room.slug === slug) || null;
  }

  let { data, error } = await queryRooms((supabase) =>
    supabase
      .from("rooms")
      .select(roomSelect())
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle(),
  );

  if (error) {
    ({ data, error } = await queryRooms((supabase) =>
      supabase
        .from("rooms")
        .select(roomSelectPlain())
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle(),
    ));
  }

  if (error) {
    console.error("Supabase getRoomBySlug:", error.message);
    return null;
  }
  return normalizeRoom(data);
}

export async function getFeaturedRooms(limit = 6) {
  const rooms = await fetchPublishedRooms();
  return rooms.slice(0, limit);
}

export async function getSuburbStats() {
  if (!isSupabaseConfigured()) {
    return statsFromRooms(mockRooms);
  }

  const { data, error } = await queryRooms((supabase) =>
    supabase.from("rooms").select("suburb, is_published").eq("is_published", true),
  );

  if (error) {
    console.error("Supabase getSuburbStats:", error.message);
    return statsFromRooms([]);
  }
  return statsFromRooms(data ?? []);
}

export function usingSupabase() {
  return isSupabaseConfigured();
}
