"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DAY_LABEL, ROOM_TYPE_LABEL } from "@/lib/format";

export default function SearchBar({
  suburb = "",
  roomType = "",
  days = [],
  maxPrice = "",
}) {
  const router = useRouter();
  const [inputSuburb, setInputSuburb] = useState(suburb);
  const [selectedType, setSelectedType] = useState(roomType);
  const [selectedDays, setSelectedDays] = useState(days);
  const [max, setMax] = useState(maxPrice);

  function toggleDay(dayKey) {
    if (selectedDays.includes(dayKey)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayKey));
    } else {
      setSelectedDays([...selectedDays, dayKey]);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (inputSuburb.trim()) params.set("suburb", inputSuburb.trim());
    if (selectedType) params.set("type", selectedType);
    if (max) params.set("max", max);
    selectedDays.forEach((d) => params.append("day", d));

    router.push(`/rooms?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto max-w-4xl rounded-3xl border border-stone-200 bg-white p-3 shadow-md shadow-stone-900/5 sm:rounded-full sm:p-2.5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex-1 px-4 py-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Location
          </label>
          <input
            type="text"
            placeholder="Richmond, Fitzroy..."
            value={inputSuburb}
            onChange={(e) => setInputSuburb(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-stone-900 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="hidden h-8 w-px bg-stone-200 sm:block" />

        <div className="flex-1 px-4 py-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Modality
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-semibold text-stone-900 focus:outline-none"
          >
            <option value="">Any room type</option>
            {Object.entries(ROOM_TYPE_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden h-8 w-px bg-stone-200 sm:block" />

        <div className="px-4 py-1">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Available Days
          </label>
          <div className="flex flex-wrap items-center gap-1">
            {Object.entries(DAY_LABEL).map(([key, label]) => {
              const active = selectedDays.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleDay(key)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                    active
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="ml-1 flex h-11 items-center justify-center rounded-2xl bg-teal-900 px-6 font-semibold text-white transition-all hover:bg-teal-950 active:scale-[0.98] sm:rounded-full"
        >
          <span className="text-sm">Search</span>
        </button>
      </div>
    </form>
  );
}
