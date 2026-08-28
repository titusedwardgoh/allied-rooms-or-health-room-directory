import Link from "next/link";
import RoomCard from "@/components/RoomCard";
import RoomGrid from "@/components/RoomGrid";
import SearchBar from "@/components/SearchBar";
import { getPublishedRooms } from "@/lib/rooms";

function toDayArray(day) {
  if (!day) return [];
  return Array.isArray(day) ? day : [day];
}

export default async function RoomsPage({ searchParams }) {
  const params = await searchParams;
  const suburb = params.suburb ?? "";
  const type = params.type ?? "";
  const days = toDayArray(params.day);
  const rooms = getPublishedRooms({ suburb, type, days, max: params.max });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
        Directory
      </p>
      <h1 className="mt-2 font-display text-4xl text-stone-900">Rooms</h1>
      <p className="mt-2 text-stone-600">
        {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
        {suburb ? ` in ${suburb}` : " across Melbourne"}
      </p>

      <div className="mt-8">
        <SearchBar suburb={suburb} roomType={type} days={days} />
      </div>

      <div className="mt-10">
        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-stone-700">No rooms match these filters.</p>
            <Link href="/rooms" className="mt-3 inline-block text-sm font-medium text-clay">
              Clear filters
            </Link>
          </div>
        ) : (
          <RoomGrid>
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </RoomGrid>
        )}
      </div>
    </main>
  );
}
