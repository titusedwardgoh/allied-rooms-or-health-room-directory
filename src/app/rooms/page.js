import Link from "next/link";
import RoomCard from "@/components/RoomCard";
import SearchBar from "@/components/SearchBar";
import { getPublishedRooms } from "@/lib/rooms";

export const dynamic = "force-dynamic";

function toDayArray(day) {
  if (!day) return [];
  return Array.isArray(day) ? day : [day];
}

export default async function RoomsPage({ searchParams }) {
  const params = await searchParams;
  const suburb = params.suburb ?? "";
  const type = params.type ?? "";
  const days = toDayArray(params.day);
  const max = params.max ?? "";
  const rooms = await getPublishedRooms({ suburb, type, days, max });

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Directory
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-stone-900">
          Find a Room
        </h1>
        <p className="mt-2 text-stone-600">
          {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
          {suburb ? ` in ${suburb}` : " across Melbourne"}
        </p>

        <div className="mt-8">
          <SearchBar
            suburb={suburb}
            roomType={type}
            days={days}
            maxPrice={max}
          />
        </div>

        <div className="mt-10">
          {rooms.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
              <p className="text-stone-700">No rooms match these filters.</p>
              <Link
                href="/rooms"
                className="mt-3 inline-block text-sm font-bold text-teal-950 hover:underline"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
