"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ROOM_SORT_OPTIONS, parseRoomSort } from "@/lib/roomsSort";

export default function RoomSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = parseRoomSort(searchParams.get("sort"));

  function onChange(event) {
    const next = parseRoomSort(event.target.value);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "newest") params.delete("sort");
    else params.set("sort", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="relative inline-flex items-center gap-1.5 text-xs text-stone-500">
      <span>Sort by:</span>
      <div className="relative">
        <select
          aria-label="Sort rooms"
          value={value}
          onChange={onChange}
          className="appearance-none cursor-pointer bg-transparent py-1.5 pr-6 pl-0.5 font-semibold text-stone-900 focus:outline-none"
        >
          {ROOM_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 size-3.5 -translate-y-1/2 text-stone-400"
          strokeWidth={2.25}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
