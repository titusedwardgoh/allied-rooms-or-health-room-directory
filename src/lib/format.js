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
export const MIN_CUSTOM_AMENITY_CHARS = 5;
export const MAX_CUSTOM_AMENITY_CHARS = 50;

export function normalizeCustomAmenity(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function customAmenityError(value, { required = false } = {}) {
  const text = normalizeCustomAmenity(value);
  if (!text) {
    return required ? "Describe the custom amenity or equipment." : "";
  }
  if (text.length < MIN_CUSTOM_AMENITY_CHARS) {
    return `Custom amenity must be at least ${MIN_CUSTOM_AMENITY_CHARS} characters.`;
  }
  if (text.length > MAX_CUSTOM_AMENITY_CHARS) {
    return `Custom amenity must be ${MAX_CUSTOM_AMENITY_CHARS} characters or fewer.`;
  }
  const letterCount = (text.match(/\p{L}/gu) || []).length;
  if (letterCount < MIN_CUSTOM_AMENITY_CHARS) {
    return "Custom amenity must have a valid entry.";
  }
  return "";
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
  return list.filter((item) => !(item === "other" && hasCustom));
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
