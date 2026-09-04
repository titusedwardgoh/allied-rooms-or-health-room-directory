"use client";

import { useEffect, useRef } from "react";
import { parseAuPlace } from "@/lib/auAddress";
import { googleMapsApiKey, loadGoogleMaps } from "@/lib/googleMaps";

export default function AddressAutocomplete({
  name,
  value,
  onChange,
  onResolved,
  className,
  placeholder,
}) {
  const inputRef = useRef(null);
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;
  const hasKey = Boolean(googleMapsApiKey());

  useEffect(() => {
    if (!hasKey) return undefined;
    let autocomplete;
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !google?.maps?.places || !inputRef.current) return;
        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "au" },
          fields: ["address_components", "formatted_address", "name"],
          types: ["address"],
        });
        autocomplete.addListener("place_changed", () => {
          const parsed = parseAuPlace(autocomplete.getPlace());
          onResolvedRef.current?.(parsed);
        });
      })
      .catch((error) => {
        console.error("AddressAutocomplete:", error.message);
      });

    return () => {
      cancelled = true;
      if (autocomplete && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [hasKey]);

  return (
    <input
      ref={inputRef}
      name={name}
      value={value}
      autoComplete="off"
      onChange={(event) => onChange(event.target.value)}
      className={className}
      placeholder={placeholder}
    />
  );
}
