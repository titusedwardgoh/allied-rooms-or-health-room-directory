const STORAGE_KEY = "alliedrooms-listing-back";

export function writeListingBack(origin) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(origin));
  } catch {
    /* ignore quota / private mode */
  }
}

export function readListingBack() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function listingBackFromReferrer() {
  if (typeof document === "undefined" || !document.referrer) return null;
  try {
    const referrer = new URL(document.referrer);
    if (referrer.host !== window.location.host) return null;
    if (referrer.pathname === "/rooms") {
      return {
        kind: "search",
        href: `${referrer.pathname}${referrer.search}`,
      };
    }
    if (referrer.pathname === "/") {
      return { kind: "home", href: "/rooms" };
    }
  } catch {
    return null;
  }
  return null;
}
