"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { DAY_LABEL, ROOM_TYPE_LABEL } from "@/lib/format";

const DAY_INITIAL = {
  mon: "M",
  tue: "T",
  wed: "W",
  thu: "T",
  fri: "F",
  sat: "S",
  sun: "S",
};

const TYPE_OPTIONS = [
  { key: "", label: "Any type" },
  ...Object.entries(ROOM_TYPE_LABEL).map(([key, label]) => ({ key, label })),
];

function daysSummary(days) {
  if (!days.length) return "Add days";
  if (days.length === 7) return "Any day";
  return Object.keys(DAY_LABEL)
    .filter((key) => days.includes(key))
    .map((key) => DAY_LABEL[key])
    .join(", ");
}

const menuClass =
  "absolute top-full z-50 mt-2 overflow-auto rounded-3xl border border-stone-200 bg-white p-2 text-left shadow-[var(--shadow-warm)]";

const menuItemClass = (activeItem) =>
  `flex w-full cursor-pointer rounded-2xl px-3 py-2.5 text-left text-sm font-semibold ${
    activeItem ? "bg-stone-100 text-stone-900" : "text-stone-800 hover:bg-stone-50"
  }`;

function fieldClass(active, id) {
  return `min-w-0 flex-1 rounded-full px-7 py-3.5 text-left transition focus:outline-none sm:flex sm:flex-col sm:justify-center ${
    active === id
      ? "relative z-10 bg-white shadow-[0_3px_12px_rgb(0_0_0_/_0.1)]"
      : active
        ? "hover:bg-stone-200/80"
        : "hover:bg-stone-100"
  }`;
}
function dividerClass(active) {
  return `pointer-events-none hidden h-8 w-px shrink-0 self-center bg-stone-200 sm:block ${
    active ? "sm:opacity-0" : "sm:group-hover/search:opacity-0"
  }`;
}

function DayPicker({ selectedDays, onToggle }) {
  return (
    <div className="flex items-center gap-1">
      {Object.entries(DAY_INITIAL).map(([key, initial]) => {
        const selected = selectedDays.includes(key);
        return (
          <button
            key={key}
            type="button"
            aria-pressed={selected}
            aria-label={DAY_LABEL[key]}
            onClick={() => onToggle(key)}
            className={`flex aspect-square min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full text-sm font-bold transition-colors sm:max-w-8 sm:text-xs ${
              selected
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
            }`}
          >
            {initial}
          </button>
        );
      })}
    </div>
  );
}

function TypeList({ selectedType, onSelect }) {
  return (
    <ul role="listbox">
      {TYPE_OPTIONS.map((option) => {
        const selected = selectedType === option.key;
        return (
          <li key={option.key || "any"} role="option" aria-selected={selected}>
            <button type="button" onClick={() => onSelect(option.key)} className={menuItemClass(selected)}>
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function SearchBar({
  suburb = "",
  roomType = "",
  days = [],
  maxPrice = "",
}) {
  const router = useRouter();
  const formRef = useRef(null);
  const whenRef = useRef(null);
  const typeRef = useRef(null);
  const [menuLeft, setMenuLeft] = useState(0);
  const [menuWidth, setMenuWidth] = useState(288);
  const [inputSuburb, setInputSuburb] = useState(suburb);
  const [selectedType, setSelectedType] = useState(roomType);
  const [selectedDays, setSelectedDays] = useState(days);
  const [active, setActive] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function openPanel(id, el) {
    const form = formRef.current;
    if (form && el) {
      const formBox = form.getBoundingClientRect();
      const fieldBox = el.getBoundingClientRect();
      setMenuLeft(Math.max(0, fieldBox.left - formBox.left));
      setMenuWidth(id === "type" || id === "when" ? fieldBox.width : 288);
    }
    setActive((current) => (current === id ? null : id));
  }

  function toggleDay(dayKey) {
    if (selectedDays.includes(dayKey)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayKey));
    } else {
      setSelectedDays([...selectedDays, dayKey]);
    }
  }

  function closeMobile() {
    setMobileOpen(false);
    setActive(null);
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (inputSuburb.trim()) params.set("suburb", inputSuburb.trim());
    if (selectedType) params.set("type", selectedType);
    if (maxPrice) params.set("max", maxPrice);
    selectedDays.forEach((d) => d && params.append("day", d));

    setActive(null);
    setMobileOpen(false);
    router.push(`/rooms?${params.toString()}`);
  }

  useEffect(() => {
    function onPointerDown(event) {
      if (mobileOpen) return;
      if (!formRef.current?.contains(event.target)) setActive(null);
    }
    function onKeyDown(event) {
      if (event.key !== "Escape") return;
      if (mobileOpen) closeMobile();
      else setActive(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    function onChange() {
      if (!mq.matches) return;
      setMobileOpen(false);
      setActive(null);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const selectedTypeLabel =
    TYPE_OPTIONS.find((option) => option.key === selectedType)?.label || "Add type";

  const overlay =
    mobileOpen && typeof document !== "undefined"
      ? createPortal(
          <form
            onSubmit={handleSearch}
            className="fixed inset-0 z-[80] flex flex-col bg-stone-100 sm:hidden"
          >
            <div className="flex items-center px-4 py-3">
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close search"
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-stone-200 bg-white text-stone-800"
              >
                <X className="size-4" strokeWidth={2.25} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto px-3 pb-4">
              {active === "where" ? (
                <div className="rounded-[28px] bg-white p-5 text-left shadow-md shadow-stone-900/10">
                  <p className="text-2xl font-bold text-stone-900">Where?</p>
                  <div className="mt-4">
                    <AddressAutocomplete
                      id="search-location-mobile"
                      variant="suburb"
                      placeholder="Search suburbs"
                      value={inputSuburb}
                      onChange={(value) => {
                        setInputSuburb(value);
                        setActive("where");
                      }}
                      onFocus={() => setActive("where")}
                      onResolved={({ suburb: next }) => {
                        if (next) {
                          setInputSuburb(next);
                          setActive("when");
                        }
                      }}
                      leading={<Search className="size-4 shrink-0 text-stone-400" strokeWidth={2.25} />}
                      className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none"
                      suggestionsClassName="relative mt-3 max-h-52 w-full overflow-auto rounded-2xl p-1"
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActive("where")}
                  className="flex w-full cursor-pointer items-center justify-between rounded-[28px] bg-white px-5 py-4 text-left shadow-md shadow-stone-900/10"
                >
                  <span className="text-sm font-semibold text-stone-800">Where</span>
                  <span className="truncate pl-4 text-sm text-stone-500">
                    {inputSuburb.trim() || "Search suburbs"}
                  </span>
                </button>
              )}

              {active === "when" ? (
                <div className="rounded-[28px] bg-white p-5 text-left shadow-md shadow-stone-900/10">
                  <p className="text-2xl font-bold text-stone-900">When?</p>
                  <div className="mt-4">
                    <DayPicker selectedDays={selectedDays} onToggle={toggleDay} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActive("when")}
                  className="flex w-full cursor-pointer items-center justify-between rounded-[28px] bg-white px-5 py-4 text-left shadow-md shadow-stone-900/10"
                >
                  <span className="text-sm font-semibold text-stone-800">When</span>
                  <span className="truncate pl-4 text-sm text-stone-500">{daysSummary(selectedDays)}</span>
                </button>
              )}

              {active === "type" ? (
                <div className="rounded-[28px] bg-white p-5 text-left shadow-md shadow-stone-900/10">
                  <p className="text-2xl font-bold text-stone-900">Type?</p>
                  <div className="mt-3">
                    <TypeList
                      selectedType={selectedType}
                      onSelect={(key) => {
                        setSelectedType(key);
                        setActive(null);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActive("type")}
                  className="flex w-full cursor-pointer items-center justify-between rounded-[28px] bg-white px-5 py-4 text-left shadow-md shadow-stone-900/10"
                >
                  <span className="text-sm font-semibold text-stone-800">Type</span>
                  <span className="truncate pl-4 text-sm text-stone-500">
                    {selectedType ? selectedTypeLabel : "Add type"}
                  </span>
                </button>
              )}
            </div>

            <div className="border-t border-stone-200 bg-stone-100 px-4 py-3">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-teal-900 py-3.5 text-sm font-semibold text-white"
              >
                <Search className="size-4" strokeWidth={2.25} />
                Search
              </button>
            </div>
          </form>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMobileOpen(true);
          setActive("where");
        }}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-200 bg-white py-3.5 text-sm font-semibold text-stone-800 shadow-md shadow-stone-900/5 sm:hidden"
      >
        <Search className="size-4" strokeWidth={2.25} />
        Start your search
      </button>

      <form
        ref={formRef}
        onSubmit={handleSearch}
        className={`relative mx-auto hidden max-w-4xl rounded-3xl border border-stone-200 shadow-md shadow-stone-900/5 sm:block sm:rounded-full ${
          active && !mobileOpen ? "bg-stone-100" : "bg-white"
        }`}
      >
        <div className="group/search flex flex-col sm:flex-row sm:items-stretch">
          <div
            className={`${fieldClass(active, "where")} cursor-text`}
            onMouseDown={() => setActive("where")}
          >
            <label htmlFor="search-location" className="block text-xs font-bold text-stone-900">
              Where
            </label>
            <AddressAutocomplete
              id="search-location"
              variant="suburb"
              placeholder="Search suburbs"
              value={inputSuburb}
              onChange={(value) => {
                setInputSuburb(value);
                setActive("where");
              }}
              onFocus={() => setActive("where")}
              onResolved={({ suburb: next }) => {
                if (next) setInputSuburb(next);
              }}
              className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none"
            />
          </div>

          <div className={dividerClass(active)} />

          <button
            ref={whenRef}
            type="button"
            className={`${fieldClass(active, "when")} cursor-pointer`}
            onClick={() => openPanel("when", whenRef.current)}
          >
            <span className="block text-xs font-bold text-stone-900">When</span>
            <span
              className={`block truncate text-sm ${
                selectedDays.length ? "text-stone-900" : "text-stone-500"
              }`}
            >
              {daysSummary(selectedDays)}
            </span>
          </button>

          <div className={dividerClass(active)} />

          <button
            ref={typeRef}
            type="button"
            className={`${fieldClass(active, "type")} cursor-pointer sm:pr-20`}
            onClick={() => openPanel("type", typeRef.current)}
          >
            <span className="block text-xs font-bold text-stone-900">Type</span>
            <span
              className={`block truncate text-sm ${
                selectedType ? "text-stone-900" : "text-stone-500"
              }`}
            >
              {selectedType ? selectedTypeLabel : "Add type"}
            </span>
          </button>

          <button
            type="submit"
            className="m-2 grid size-12 shrink-0 cursor-pointer place-items-center self-end rounded-full bg-teal-900 text-white transition-all hover:bg-teal-950 active:scale-[0.98] sm:absolute sm:right-4 sm:top-1/2 sm:z-20 sm:m-0 sm:-translate-y-1/2 sm:self-auto"
            aria-label="Search"
          >
            <Search className="size-5" strokeWidth={2.25} />
          </button>
        </div>

        {active === "when" && !mobileOpen ? (
          <div
            className="absolute top-full z-50 mt-2 rounded-3xl border border-stone-200 bg-white p-3 shadow-[var(--shadow-warm)]"
            style={{ left: menuLeft, width: menuWidth }}
          >
            <DayPicker selectedDays={selectedDays} onToggle={toggleDay} />
          </div>
        ) : null}

        {active === "type" && !mobileOpen ? (
          <ul role="listbox" className={menuClass} style={{ left: menuLeft, width: menuWidth }}>
            {TYPE_OPTIONS.map((option) => {
              const selected = selectedType === option.key;
              return (
                <li key={option.key || "any"} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType(option.key);
                      setActive(null);
                    }}
                    className={menuItemClass(selected)}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </form>

      {overlay}
    </>
  );
}
