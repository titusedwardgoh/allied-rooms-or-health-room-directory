"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { DAY_KEYS, DAY_LABEL, ROOM_TYPE_LABEL } from "@/lib/format";

export default function SearchBar({
  suburb: initialSuburb = "",
  roomType: initialType = "",
  days: initialDays = [],
}) {
  const router = useRouter();
  const [suburb, setSuburb] = useState(initialSuburb);
  const [roomType, setRoomType] = useState(initialType);
  const [days, setDays] = useState(initialDays);

  function toggleDay(day) {
    setDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmed = suburb.trim();
    if (trimmed) params.set("suburb", trimmed.toLowerCase());
    if (roomType) params.set("type", roomType);
    days.forEach((day) => params.append("day", day));
    const query = params.toString();
    router.push(query ? `/rooms?${query}` : "/rooms");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-20 z-40 mx-auto w-full max-w-4xl rounded-2xl border border-stone-200 bg-white/75 p-3 shadow-warm backdrop-blur-md md:rounded-full md:px-3 md:py-2"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
        <label className="flex min-w-0 flex-1 flex-col px-3 md:border-r md:border-stone-200">
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
            Where
          </span>
          <input
            type="text"
            name="suburb"
            value={suburb}
            onChange={(event) => setSuburb(event.target.value)}
            placeholder="Suburb or postcode"
            className="w-full bg-transparent py-1 text-sm text-stone-900 outline-none placeholder:text-stone-400"
          />
        </label>

        <label className="flex min-w-0 flex-1 flex-col px-3 md:border-r md:border-stone-200">
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
            Modality
          </span>
          <select
            name="type"
            value={roomType}
            onChange={(event) => setRoomType(event.target.value)}
            className="w-full bg-transparent py-1 text-sm text-stone-900 outline-none"
          >
            <option value="">Any</option>
            {Object.entries(ROOM_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex min-w-0 flex-[1.4] flex-col px-3">
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
            Days
          </span>
          <div className="flex flex-wrap gap-1 py-1">
            {DAY_KEYS.map((day) => {
              const selected = days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  aria-pressed={selected}
                  className={`rounded-full border px-2 py-0.5 text-xs transition-colors duration-150 ${
                    selected
                      ? "border-clay bg-clay text-white"
                      : "border-stone-200 bg-paper text-stone-700 hover:border-stone-300"
                  }`}
                >
                  {DAY_LABEL[day]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end px-1 md:pl-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white transition-transform duration-150 hover:bg-orange-900 active:scale-[0.99]"
          >
            <Search className="size-4" aria-hidden="true" />
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
