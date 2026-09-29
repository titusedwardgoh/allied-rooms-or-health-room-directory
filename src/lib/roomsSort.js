const SORT_VALUES = new Set(["newest", "price-asc", "price-desc"]);

export const ROOM_SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function parseRoomSort(value) {
  return SORT_VALUES.has(value) ? value : "newest";
}

export function sortPublishedRooms(rooms, sortBy) {
  const sorted = [...rooms];
  const key = parseRoomSort(sortBy);

  if (key === "price-asc") {
    sorted.sort(
      (a, b) => (a.price_per_day_cents ?? 0) - (b.price_per_day_cents ?? 0),
    );
  } else if (key === "price-desc") {
    sorted.sort(
      (a, b) => (b.price_per_day_cents ?? 0) - (a.price_per_day_cents ?? 0),
    );
  } else {
    sorted.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime(),
    );
  }

  return sorted;
}
