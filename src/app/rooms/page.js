import Link from "next/link";
import MarkListingOrigin from "@/components/MarkListingOrigin";
import RoomCard from "@/components/RoomCard";
import RoomSortSelect from "@/components/RoomSortSelect";
import SearchBar from "@/components/SearchBar";
import { FadeIn, Stagger, StaggerItem } from "@/components/FadeIn";
import { getPublishedRooms } from "@/lib/db/rooms";
import { parseRoomSort, sortPublishedRooms } from "@/lib/roomsSort";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Find a Room",
  description:
    "Browse sessional allied health consulting rooms across Melbourne by suburb, day, and daily rate.",
};

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
  const sort = parseRoomSort(params.sort);
  const rooms = sortPublishedRooms(
    await getPublishedRooms({ suburb, type, days, max }),
    sort,
  );

  return (
    <main className="min-h-screen bg-stone-50">
      <MarkListingOrigin from="search" />
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8 2xl:max-w-page-inset">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Directory
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Find a Room
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            Browse sessional allied health rooms across Melbourne by suburb,
            day, and daily rate.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <SearchBar
            suburb={suburb}
            roomType={type}
            days={days}
            maxPrice={max}
            sort={sort}
          />
        </FadeIn>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-12 pb-12 sm:px-6 lg:px-8 2xl:max-w-page-inset min-[1720px]:!max-w-[106rem]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-stone-500">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            {suburb ? ` in ${suburb}` : " across Melbourne"}
          </p>
          {rooms.length > 0 ? <RoomSortSelect /> : null}
        </div>

        {rooms.length === 0 ? (
          <FadeIn delay={0.16}>
            <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
              <p className="text-stone-700">No rooms match these filters.</p>
              <Link
                href="/rooms"
                className="mt-3 inline-block text-sm font-bold text-teal-950 hover:underline"
              >
                Clear filters
              </Link>
            </div>
          </FadeIn>
        ) : (
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-[1720px]:!grid-cols-4">
            {rooms.map((room) => (
              <StaggerItem key={room.id} className="h-full">
                <RoomCard room={room} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </main>
  );
}
