"use client";

import { useEffect, useRef, useState } from "react";
import { parseAuPlace } from "@/lib/auAddress";
import { googleMapsApiKey, loadGoogleMaps } from "@/lib/googleMaps";

function pacIsOpen() {
  const pac = document.querySelector(".pac-container");
  return Boolean(pac && window.getComputedStyle(pac).display !== "none");
}

function suburbFromPrediction(prediction) {
  return String(prediction.structured_formatting?.main_text ?? prediction.description)
    .replace(/\s+(VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\b.*$/i, "")
    .split(",")[0]
    .trim();
}

function rankPredictions(predictions) {
  return [...predictions].sort((a, b) => {
    const score = (item) => (/VIC/i.test(item.description) ? 0 : 1);
    return score(a) - score(b);
  });
}

export default function AddressAutocomplete({
  id,
  name,
  value,
  onChange,
  onFocus,
  onResolved,
  className,
  placeholder,
  variant = "address",
  suggestionsClassName,
  leading,
}) {
  const inputRef = useRef(null);
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;
  const sessionTokenRef = useRef(null);
  const pickedRef = useRef(String(value ?? "").trim());
  const hasKey = Boolean(googleMapsApiKey());
  const isSuburb = variant === "suburb";
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!hasKey || isSuburb) return undefined;
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
  }, [hasKey, isSuburb]);

  useEffect(() => {
    if (!hasKey || !isSuburb) return undefined;
    const query = String(value ?? "").trim();
    if (query.length < 2 || query === pickedRef.current) {
      setSuggestions([]);
      setOpen(false);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      loadGoogleMaps()
        .then((google) => {
          if (cancelled || !google?.maps?.places) return;
          if (!sessionTokenRef.current) {
            sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
          }
          const service = new google.maps.places.AutocompleteService();
          service.getPlacePredictions(
            {
              input: query,
              componentRestrictions: { country: "au" },
              sessionToken: sessionTokenRef.current,
              types: ["(cities)"],
            },
            (predictions, status) => {
              if (cancelled) return;
              if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
                setSuggestions([]);
                setOpen(false);
                return;
              }
              const next = rankPredictions(predictions).slice(0, 6);
              setSuggestions(next);
              setActiveIndex(-1);
              setOpen(next.length > 0);
            },
          );
        })
        .catch((error) => {
          console.error("AddressAutocomplete:", error.message);
        });
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hasKey, isSuburb, value]);

  function applySuburb(suburb, extra = {}) {
    if (!suburb) return;
    pickedRef.current = suburb;
    onChange(suburb);
    onResolvedRef.current?.({ addressLine: "", suburb, state: extra.state || "" });
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    sessionTokenRef.current = null;
  }

  function pickPrediction(prediction) {
    const fallback = suburbFromPrediction(prediction);
    loadGoogleMaps()
      .then((google) => {
        if (!google?.maps?.places || !prediction.place_id) {
          applySuburb(fallback);
          return;
        }
        const places = new google.maps.places.PlacesService(document.createElement("div"));
        places.getDetails(
          {
            placeId: prediction.place_id,
            fields: ["address_components", "name"],
            sessionToken: sessionTokenRef.current ?? undefined,
          },
          (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
              applySuburb(fallback);
              return;
            }
            const parsed = parseAuPlace(place);
            applySuburb(parsed.suburb || fallback, { state: parsed.state });
          },
        );
      })
      .catch(() => applySuburb(fallback));
  }

  const input = (
    <input
      ref={inputRef}
      id={id}
      name={name}
      value={value}
      role={isSuburb ? "combobox" : undefined}
      aria-autocomplete={isSuburb ? "list" : undefined}
      aria-expanded={isSuburb ? open : undefined}
      aria-controls={isSuburb && id ? `${id}-suggestions` : undefined}
      autoComplete="off"
      onChange={(event) => onChange(event.target.value)}
      onFocus={(event) => {
        if (isSuburb && suggestions.length) setOpen(true);
        onFocus?.(event);
      }}
      onBlur={() => {
        if (!isSuburb) return;
        window.setTimeout(() => setOpen(false), 120);
      }}
      onKeyDown={(event) => {
        if (!isSuburb) {
          if (event.key === "Enter" && pacIsOpen()) event.preventDefault();
          return;
        }
        if (!open || suggestions.length === 0) return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setActiveIndex((current) => (current + 1) % suggestions.length);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setActiveIndex((current) =>
            current <= 0 ? suggestions.length - 1 : current - 1,
          );
        } else if (event.key === "Enter" && activeIndex >= 0) {
          event.preventDefault();
          pickPrediction(suggestions[activeIndex]);
        } else if (event.key === "Escape") {
          setOpen(false);
        }
      }}
      className={className}
      placeholder={placeholder}
    />
  );

  if (!isSuburb) return input;

  return (
    <div className="w-full min-w-0">
      <div className={leading ? "flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5" : undefined}>
        {leading}
        {input}
      </div>
      {open && suggestions.length > 0 ? (
        <ul
          id={id ? `${id}-suggestions` : undefined}
          role="listbox"
          className={
            suggestionsClassName ||
            "absolute top-full left-0 z-50 mt-2 max-h-64 min-w-72 w-72 overflow-auto rounded-3xl border border-stone-200 bg-white p-2 text-left shadow-[var(--shadow-warm)]"
          }
        >
          {suggestions.map((prediction, index) => (
            <li key={prediction.place_id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pickPrediction(prediction)}
                className={`flex w-full cursor-pointer flex-col rounded-2xl px-3 py-2 text-left text-sm ${
                  index === activeIndex ? "bg-stone-100" : "hover:bg-stone-50"
                }`}
              >
                <span className="font-semibold text-stone-900">
                  {suburbFromPrediction(prediction) || prediction.description}
                </span>
                <span className="text-xs text-stone-500">
                  {prediction.structured_formatting?.secondary_text || "Australia"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
