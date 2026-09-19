export const ROOM_TYPE_LABEL = {
  talk_therapy: "Talk Therapy & Consulting", // Armchairs, desk, acoustic treatment
  bodywork: "Treatment Table / Plinth", // Electric/manual table, floor space
  medical: "Clinical & Medical", // Hand basin, medical flooring/specs
  flexible: "Multidisciplinary / Hybrid", // Combo setup or open floor space
  other: "Other",
};

export const DAY_LABEL = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export function formatAUDFromCents(cents) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function pricePerDayLabel(cents) {
  return `${formatAUDFromCents(cents)} / day`;
}

export const AU_STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

export const AMENITY_LABEL = {
  soundproofing: "Acoustic soundproofing",
  sink: "Hand basin in room",
  waiting_room: "Shared waiting lounge",
  receptionist: "Staffed reception",
  hicaps: "HICAPS / EFTPOS terminal",
  plinth: "Plinth / treatment table",
  parking: "On-site / street parking",
  wheelchair: "Wheelchair / step-free access",
  storage: "Lockable practitioner storage",
  wifi: "High-speed Wi-Fi",
  kitchen: "Practitioner kitchenette",
  climate_control: "In-room heating & A/C",
  other: "Other",
};

export const CUSTOM_AMENITY_PREFIX = "Custom: ";
export const CUSTOM_ROOM_TYPE_PREFIX = "Room type: ";
export const MIN_CUSTOM_AMENITY_CHARS = 5;
export const MAX_CUSTOM_AMENITY_CHARS = 50;

export function normalizeCustomAmenity(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function customAmenityError(
  value,
  {
    required = false,
    noun = "Custom amenity",
    emptyMessage = "Describe the custom amenity or equipment.",
  } = {},
) {
  const text = normalizeCustomAmenity(value);
  if (!text) {
    return required ? emptyMessage : "";
  }
  if (text.length < MIN_CUSTOM_AMENITY_CHARS) {
    return `${noun} must be at least ${MIN_CUSTOM_AMENITY_CHARS} characters.`;
  }
  if (text.length > MAX_CUSTOM_AMENITY_CHARS) {
    return `${noun} must be ${MAX_CUSTOM_AMENITY_CHARS} characters or fewer.`;
  }
  const letterCount = (text.match(/\p{L}/gu) || []).length;
  if (letterCount < MIN_CUSTOM_AMENITY_CHARS) {
    return `${noun} must have a valid entry.`;
  }
  return "";
}

export function customRoomTypeError(value, { required = false } = {}) {
  return customAmenityError(value, {
    required,
    noun: "Custom room type",
    emptyMessage: "Describe the custom room type.",
  });
}

export function customRoomTypeFromAmenities(amenities) {
  const list = Array.isArray(amenities) ? amenities : [];
  const item = list.find((entry) =>
    String(entry).startsWith(CUSTOM_ROOM_TYPE_PREFIX),
  );
  return item ? String(item).slice(CUSTOM_ROOM_TYPE_PREFIX.length) : "";
}

export function roomTypeLabel(value, custom = "") {
  const text = normalizeCustomAmenity(custom);
  if (String(value ?? "") === "other" && text) return text;
  return ROOM_TYPE_LABEL[value] || text || "Other";
}

export function listingRoomTypeLabel(room) {
  return roomTypeLabel(
    room?.room_type,
    room?.room_type_other || customRoomTypeFromAmenities(room?.amenities),
  );
}

export function parseStoredRoomType(room) {
  const raw = String(room?.room_type ?? "").trim();
  const custom =
    normalizeCustomAmenity(room?.room_type_other) ||
    customRoomTypeFromAmenities(room?.amenities);
  if (raw === "other") {
    return { room_type: "other", room_type_other: custom };
  }
  if (ROOM_TYPE_LABEL[raw]) {
    return { room_type: raw, room_type_other: "" };
  }
  return { room_type: "talk_therapy", room_type_other: "" };
}

export function matchesRoomTypeFilter(roomType, type) {
  if (!type) return true;
  return roomType === type;
}

export function amenityLabel(item) {
  const value = String(item ?? "");
  if (value.startsWith(CUSTOM_AMENITY_PREFIX)) {
    return value.slice(CUSTOM_AMENITY_PREFIX.length);
  }
  return AMENITY_LABEL[value] || value.replace(/_/g, " ");
}

export function visibleAmenities(items) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const hasCustom = list.some((item) =>
    String(item).startsWith(CUSTOM_AMENITY_PREFIX),
  );
  return list.filter((item) => {
    if (String(item).startsWith(CUSTOM_ROOM_TYPE_PREFIX)) return false;
    if (item === "other" && hasCustom) return false;
    return true;
  });
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-");
}
