let mapsPromise = null;

export function googleMapsApiKey() {
  return String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();
}

export function loadGoogleMaps() {
  const apiKey = googleMapsApiKey();
  if (!apiKey || typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-google-maps]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google ?? null), {
        once: true,
      });
      existing.addEventListener(
        "error",
        () => reject(new Error("Google Maps failed to load")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve(window.google ?? null);
    script.onerror = () => {
      mapsPromise = null;
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(script);
  });

  return mapsPromise;
}
