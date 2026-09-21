import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Page not found — AlliedRooms",
  description:
    "This page or listing isn’t available on AlliedRooms. Browse rooms or return home.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
        <FadeIn className="flex flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-700">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" aria-hidden="true" />
            404
          </span>
          <h1 className="mt-6 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.1]">
            This room isn’t available
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            The page or listing you’re looking for doesn’t exist, has been
            moved, or is no longer listed.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/rooms"
              className="rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-950 active:scale-95"
            >
              Find a Room
            </Link>
            <Link
              href="/"
              className="rounded-full border border-stone-900 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-all hover:bg-stone-100 active:scale-95"
            >
              Back to Homepage
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-2 text-sm text-stone-500">
            <Link
              href="/list-a-room"
              className="transition-colors hover:text-stone-900"
            >
              List a room
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/contact"
              className="transition-colors hover:text-stone-900"
            >
              Contact support
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
