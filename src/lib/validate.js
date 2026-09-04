export const MIN_PRACTICE_NAME_LENGTH = 4;
export const MIN_ADDRESS_LINE_LENGTH = 5;
export const MAX_PRICE_PER_DAY_DOLLARS = 2000;

export function toAuPhoneDigits(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("61") && digits.length === 11) {
    digits = `0${digits.slice(2)}`;
  }
  return digits;
}

export function isAuPhone(value) {
  return /^(?:02|03|04|07|08)\d{8}$/.test(toAuPhoneDigits(value));
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}

export function normalizeWebsiteUrl(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isWebsiteUrl(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || /^https?:\/\/$/i.test(trimmed)) return false;

  try {
    const url = new URL(normalizeWebsiteUrl(trimmed));
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const host = url.hostname;
    if (!host.includes(".") || host.startsWith(".") || host.endsWith(".")) {
      return false;
    }
    return /^[a-z0-9.-]+$/i.test(host);
  } catch {
    return false;
  }
}

export function addressLineError(value) {
  if (String(value ?? "").trim().length < MIN_ADDRESS_LINE_LENGTH) {
    return "Enter a street address, or pick one from the suggestions.";
  }
  return "";
}

export function dailyRateError(value) {
  const dollars = Number(value);
  if (!Number.isFinite(dollars) || dollars <= 0) {
    return "Enter a daily rate greater than $0.";
  }
  if (dollars > MAX_PRICE_PER_DAY_DOLLARS) {
    return `Daily rate must be $2,000 or less.`;
  }
  return "";
}

export function practiceDetailsError({ practiceName, contactEmail, phone, websiteUrl }) {
  if (practiceName.trim().length < MIN_PRACTICE_NAME_LENGTH) {
    return `Practice name must be at least ${MIN_PRACTICE_NAME_LENGTH} characters.`;
  }
  if (!isEmail(contactEmail)) {
    return "Enter a valid contact email, such as hello@clinic.com.au.";
  }
  if (!isAuPhone(phone)) {
    return "Enter a valid 10 digit Australian number.";
  }
  const website = String(websiteUrl ?? "").trim();
  if (website && !/^https?:\/\/$/i.test(website) && !isWebsiteUrl(website)) {
    return "Enter a valid website, such as https://clinic.com.au, or leave it blank.";
  }
  return "";
}
