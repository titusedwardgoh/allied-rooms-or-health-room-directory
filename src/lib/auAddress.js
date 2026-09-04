import { AU_STATES } from "@/lib/format";

const GOOGLE_STATE_NAME = {
  victoria: "VIC",
  "new south wales": "NSW",
  queensland: "QLD",
  "south australia": "SA",
  "western australia": "WA",
  tasmania: "TAS",
  "northern territory": "NT",
  "australian capital territory": "ACT",
};

function componentByType(components, type) {
  return (components ?? []).find((item) => item.types?.includes(type));
}

export function auStateFromGoogle(component) {
  if (!component) return "";
  const shortName = String(component.short_name ?? "").toUpperCase();
  if (AU_STATES.includes(shortName)) return shortName;
  const longName = String(component.long_name ?? "").trim().toLowerCase();
  return GOOGLE_STATE_NAME[longName] || "";
}

export function parseAuPlace(place) {
  const components = place?.address_components ?? [];
  const subpremise = componentByType(components, "subpremise")?.long_name ?? "";
  const streetNumber = componentByType(components, "street_number")?.long_name ?? "";
  const route = componentByType(components, "route")?.long_name ?? "";
  const addressLine = [subpremise, streetNumber, route]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const suburb =
    componentByType(components, "locality")?.long_name ||
    componentByType(components, "postal_town")?.long_name ||
    componentByType(components, "sublocality_level_1")?.long_name ||
    componentByType(components, "sublocality")?.long_name ||
    "";

  const state = auStateFromGoogle(
    componentByType(components, "administrative_area_level_1"),
  );

  return {
    addressLine:
      addressLine ||
      String(place?.formatted_address ?? "")
        .split(",")[0]
        .trim(),
    suburb: String(suburb).trim(),
    state,
  };
}

export function roomLocationLabel(room) {
  const street = String(room?.address_line ?? "").trim();
  const suburb = String(room?.suburb ?? "").trim();
  const state = String(room?.state ?? "").trim();
  const locality = [suburb, state].filter(Boolean).join(", ");
  return [street, locality].filter(Boolean).join(", ");
}
