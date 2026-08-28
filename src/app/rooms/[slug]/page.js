import Link from "next/link";
import { notFound } from "next/navigation";
import { DAY_LABEL, ROOM_TYPE_LABEL, pricePerDayLabel } from "@/lib/format";
import { getPublishedRooms, getRoomBySlug } from "@/lib/rooms";

export function generateStaticParams() {
  return getPublishedRooms().map((room) => ({ slug: room.slug }));
}

export default async function RoomDetailPage({ params }) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);

  if (!room || !room.is_published) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/rooms" className="text-sm font-medium text-clay hover:text-orange-900">
        ← All rooms
      </Link>
      <p className="mt-6 text-xs uppercase tracking-widest text-stone-500">
        {room.suburb} · {room.state} · {ROOM_TYPE_LABEL[room.room_type]}
      </p>
      <h1 className="mt-2 font-display text-4xl text-stone-900">{room.title}</h1>
      <p className="mt-4 font-display text-3xl text-stone-900">
        {pricePerDayLabel(room.price_per_day_cents)}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-stone-600">{room.description}</p>
      <div className="mt-6 flex flex-wrap gap-1">
        {room.available_days.map((day) => (
          <span
            key={day}
            className="rounded-full border border-stone-200 px-3 py-1 text-sm text-stone-700"
          >
            {DAY_LABEL[day]}
          </span>
        ))}
      </div>
      <p className="mt-8 text-sm text-stone-500">
        Hosted by {room.host?.practice_name}. Full inquiry card arrives in Phase 3.
      </p>
    </main>
  );
}
