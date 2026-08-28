import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import RoomCard from "@/components/RoomCard";
import RoomGrid from "@/components/RoomGrid";
import SuburbBento from "@/components/SuburbBento";
import { getFeaturedRooms, getSuburbStats } from "@/lib/rooms";

export default function Home() {
  const featured = getFeaturedRooms(6);
  const suburbStats = getSuburbStats();

  return (
    <main>
      <section className="relative overflow-hidden px-4 pb-8 pt-16 sm:px-6 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ccfbf180,_transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
            Melbourne · VIC
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-stone-900 sm:text-6xl">
            A consulting room,
            <br />
            by the day.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-600">
            Sessional allied health spaces in Melbourne. Suburb, day, and rate —
            before you inquire.
          </p>
          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
              Health hubs
            </p>
            <h2 className="mt-2 font-display text-3xl text-stone-900">
              Melbourne, suburb first
            </h2>
          </div>
        </div>
        <SuburbBento stats={suburbStats} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
              Recently listed
            </p>
            <h2 className="mt-2 font-display text-3xl text-stone-900">
              Rooms with the rate on the card
            </h2>
          </div>
          <Link
            href="/rooms"
            className="hidden text-sm font-medium text-clay sm:inline hover:text-orange-900"
          >
            Browse all rooms
          </Link>
        </div>
        <RoomGrid>
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </RoomGrid>
      </section>

      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-3xl text-stone-900">
              Have a spare consulting room?
            </h2>
            <p className="mt-2 max-w-lg text-stone-600">
              List it with the day rate up front. Practitioners inquire directly —
              no broker, no “call for pricing”.
            </p>
          </div>
          <Link
            href="/list-a-room"
            className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-white transition-transform duration-150 hover:bg-orange-900 active:scale-[0.99]"
          >
            List a room
          </Link>
        </div>
      </section>
    </main>
  );
}
