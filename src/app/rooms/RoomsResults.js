import Link from "next/link";
import { connection } from "next/server";
import PulseDots from "@/components/PulseDots";
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
        className="flex min-h-[22rem] items-center justify-center sm:min-h-[28rem]"
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label="Loading rooms"
      >
        <PulseDots />
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
