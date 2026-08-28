import { MELBOURNE_HUBS } from "./format";
import { mockRooms } from "./mockData";

function publishedRooms() {
  return mockRooms.filter((room) => room.is_published);
}

/**
 * @param {{ suburb?: string, type?: string, days?: string[], max?: number|string }} [filters]
 */
export function getPublishedRooms(filters = {}) {
  const suburb = filters.suburb?.trim().toLowerCase();
  const type = filters.type?.trim();
  const days = Array.isArray(filters.days)
    ? filters.days.filter(Boolean)
    : filters.days
      ? [filters.days]
      : [];
  const maxDollars =
    filters.max === undefined || filters.max === "" || filters.max === null
      ? null
      : Number(filters.max);

  return publishedRooms().filter((room) => {
    if (suburb && !room.suburb.toLowerCase().includes(suburb)) {
      return false;
    }
    if (type && room.room_type !== type) {
      return false;
    }
    if (days.length && !days.every((day) => room.available_days.includes(day))) {
      return false;
    }
    if (maxDollars != null && !Number.isNaN(maxDollars)) {
      if (room.price_per_day_cents > maxDollars * 100) {
        return false;
      }
    }
    return true;
  });
}

export function getRoomBySlug(slug) {
  return (
    publishedRooms().find((room) => room.slug === slug) ??
    mockRooms.find((room) => room.slug === slug) ??
    null
  );
}

export function getSuburbStats() {
  const rooms = publishedRooms();
  return MELBOURNE_HUBS.map((suburb) => ({
    suburb,
    count: rooms.filter((room) => room.suburb === suburb).length,
  }));
}

export function getFeaturedRooms(limit = 6) {
  return [...publishedRooms()]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}
