import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-xs font-bold tracking-wider text-stone-50">
            AR
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-stone-900 transition-colors group-hover:text-stone-700">
              AlliedRooms
            </span>
            <span className="-mt-1 text-[10px] font-medium text-stone-500">
              Melbourne sessional spaces
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/rooms"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
          >
            Find a Room
          </Link>
          <Link
            href="/list-a-room"
            className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-50 shadow-sm transition-all hover:bg-stone-800 active:scale-95"
          >
            List a Room
          </Link>
        </nav>
      </div>
    </header>
  );
}
