import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import RoomCard from "@/components/RoomCard";
import SuburbBento from "@/components/SuburbBento";
import { getFeaturedRooms, getSuburbStats } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await getFeaturedRooms(6);
  const stats = await getSuburbStats();

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="relative px-4 pb-12 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-6xl text-center">
          <span className="rounded-full bg-stone-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-700">
            Melbourne Allied Health
          </span>

          <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl sm:leading-[1.1]">
            Find consulting rooms, <br className="hidden sm:inline" />
            <span className="font-extrabold text-teal-900">by the day.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-stone-600 sm:text-lg">
            Sessional clinical spaces across Melbourne. Clear daily rates
            upfront—no brokers, no membership walls.
          </p>

          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Explore Locations
          </span>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Popular Melbourne Hubs
          </h2>
        </div>
        <SuburbBento stats={stats} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Directory Highlights
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Recently Listed Rooms
            </h2>
          </div>
          <Link
            href="/rooms"
            className="text-sm font-bold text-teal-950 hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </main>
  );
}
