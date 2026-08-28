import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group min-w-0">
          <span className="font-display text-lg tracking-tight text-stone-900 sm:text-xl">
            AlliedRooms
          </span>
          <span className="mt-0.5 hidden font-cormorant text-sm text-stone-500 sm:block">
            Sessional rooms, by the day
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/rooms"
            className="rounded-full px-3 py-2 text-sm font-medium text-stone-700 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-900"
          >
            Rooms
          </Link>
          <Link
            href="/list-a-room"
            className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-white transition-transform duration-150 hover:bg-orange-900 active:scale-[0.99]"
          >
            List a room
          </Link>
        </nav>
      </div>
    </header>
  );
}
