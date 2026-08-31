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
  soundproofing: "Soundproofing",
  hicaps: "HICAPS",
  plinth: "Plinth / treatment table",
  parking: "Parking",
  waiting_room: "Waiting room",
  wheelchair: "Wheelchair access",
  wifi: "Wifi",
  kitchen: "Kitchen / tea point",
};

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-");
}
