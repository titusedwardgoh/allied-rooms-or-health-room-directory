import Link from "next/link";
import { connection } from "next/server";
import RoomCard from "@/components/RoomCard";
import RoomSortSelect from "@/components/RoomSortSelect";
import { getPublishedRooms } from "@/lib/db/rooms";
import { sortPublishedRooms } from "@/lib/roomsSort";

const GRID_CLASS =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-[1720px]:!grid-cols-4";

function ResultsToolbar({ countLabel, hasFilters, clearHref, showSort }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-sm font-medium text-stone-500">{countLabel}</p>
        {hasFilters ? (
          <Link
            href={clearHref}
            className="text-sm font-bold text-teal-950 hover:underline"
          >
            Clear filters
          </Link>
        ) : null}
      </div>
      {showSort ? <RoomSortSelect /> : null}
    </div>
  );
}

export function RoomsResultsFallback() {
  return (
    <>
      <ResultsToolbar countLabel="Loading rooms…" />
      <div
        className={GRID_CLASS}
        aria-busy="true"
        aria-live="polite"
        aria-label="Loading rooms"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white"
          >
            <div className="aspect-video animate-pulse bg-stone-200" />
            <div className="p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-stone-200" />
              <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-3">
                <div className="h-4 flex-1 animate-pulse rounded bg-stone-100" />
                <div className="h-4 w-16 animate-pulse rounded bg-stone-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default async function RoomsResults({
  suburb,
  type,
  days,
  max,
  sort,
  hasFilters,
  clearHref,
}) {
  await connection();
  const rooms = sortPublishedRooms(
    await getPublishedRooms({ suburb, type, days, max }),
    sort,
  );

  return (
    <>
      <ResultsToolbar
        countLabel={`${rooms.length} ${rooms.length === 1 ? "room" : "rooms"}${
          suburb ? ` in ${suburb}` : " across Melbourne"
        }`}
        hasFilters={hasFilters}
        clearHref={clearHref}
        showSort={rooms.length > 0}
      />

      {rooms.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
          <p className="text-stone-700">No rooms match these filters.</p>
          {hasFilters ? (
            <Link
              href={clearHref}
              className="mt-3 inline-block text-sm font-bold text-teal-950 hover:underline"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      ) : (
        <div className={GRID_CLASS}>
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="rooms-in h-full"
              style={{ animationDelay: `${Math.min(index, 11) * 70}ms` }}
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
