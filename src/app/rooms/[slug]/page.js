import { notFound } from "next/navigation";
import { getRoomBySlug } from "@/lib/rooms";
import { DAY_LABEL, ROOM_TYPE_LABEL, pricePerDayLabel } from "@/lib/format";
import RoomGallery from "@/components/RoomGallery";

export const dynamic = "force-dynamic";

export default async function RoomDetailPage({ params }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);

  if (!room) notFound();

  const host = room.host ?? {};

  const mailtoSubject = encodeURIComponent(
    `Inquiry — ${room.title} (${room.suburb}) via AlliedRooms`,
  );
  const mailtoBody = encodeURIComponent(
    `Hi ${host.practice_name || "there"},\n\nI noticed your consulting room "${room.title}" listed on AlliedRooms for ${pricePerDayLabel(
      room.price_per_day_cents,
    )}.\n\nI am interested in leasing this space for sessional use.\n\nDays I am looking for:\nAbout my practice:\n\nSent via AlliedRooms`,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <RoomGallery
            images={room.image_urls}
            title={room.title}
            roomType={room.room_type}
          />

          <div className="mt-6">
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-semibold text-stone-700">
              {ROOM_TYPE_LABEL[room.room_type]}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-stone-900">
              {room.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-stone-500">
              {room.suburb}, {room.state} · Hosted by {host.practice_name || "the clinic"}
            </p>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="font-display text-lg font-semibold text-stone-900">
              Amenities & Clinical Specs
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {room.amenities.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700"
                >
                  ✓ {item.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="font-display text-lg font-semibold text-stone-900">
              About the Space
            </h3>
            <p className="mt-3 leading-relaxed text-stone-600">
              {room.description}
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Daily Rate
              </span>
              <div className="font-display text-3xl font-bold text-stone-900">
                {pricePerDayLabel(room.price_per_day_cents)}
              </div>
              <span className="text-xs text-stone-500">
                Sessional hire · No long-term lease
              </span>
            </div>

            <div className="py-4">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">
                Available Days
              </span>
              <div className="flex flex-wrap gap-1">
                {room.available_days.map((d) => (
                  <span
                    key={d}
                    className="rounded bg-stone-900 px-2 py-1 text-xs font-bold uppercase text-white"
                  >
                    {DAY_LABEL[d]}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={`mailto:${host.contact_email || ""}?subject=${mailtoSubject}&body=${mailtoBody}`}
              className="mt-4 block w-full rounded-full bg-teal-900 py-3 text-center text-sm font-semibold text-white transition-transform hover:bg-teal-950 active:scale-95"
            >
              Inquire with Clinic
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
