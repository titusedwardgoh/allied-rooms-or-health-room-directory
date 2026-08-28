import Link from "next/link";
import { DAY_LABEL, ROOM_TYPE_LABEL, pricePerDayLabel } from "@/lib/format";

function RoomTypeVisual({ roomType }) {
  const washes = {
    talk_therapy: "from-teal-50 to-stone-100",
    bodywork: "from-orange-50 to-stone-100",
    medical: "from-stone-100 to-teal-50",
  };

  return (
    <div
      className={`relative flex aspect-[4/3] items-end overflow-hidden bg-gradient-to-br ${washes[roomType] ?? "from-stone-100 to-stone-50"}`}
    >
      <svg
        viewBox="0 0 160 120"
        className="absolute inset-0 h-full w-full text-sage/25"
        aria-hidden="true"
      >
        {roomType === "bodywork" ? (
          <>
            <rect x="28" y="58" width="104" height="14" rx="3" fill="currentColor" />
            <rect x="36" y="48" width="88" height="10" rx="5" fill="currentColor" />
            <rect x="44" y="72" width="8" height="22" rx="1" fill="currentColor" />
            <rect x="108" y="72" width="8" height="22" rx="1" fill="currentColor" />
          </>
        ) : roomType === "medical" ? (
          <>
            <rect x="24" y="36" width="70" height="58" rx="4" fill="currentColor" />
            <rect x="108" y="44" width="28" height="50" rx="3" fill="currentColor" />
            <rect x="48" y="22" width="22" height="18" rx="2" fill="currentColor" />
          </>
        ) : (
          <>
            <rect x="22" y="28" width="52" height="64" rx="2" fill="currentColor" />
            <rect x="28" y="34" width="40" height="28" rx="1" fill="currentColor" opacity="0.45" />
            <rect x="92" y="62" width="36" height="30" rx="3" fill="currentColor" />
            <rect x="98" y="52" width="24" height="12" rx="6" fill="currentColor" />
          </>
        )}
      </svg>
      <span className="relative m-3 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-xs font-medium text-stone-700 backdrop-blur-sm">
        {ROOM_TYPE_LABEL[roomType]}
      </span>
    </div>
  );
}

export default function RoomCard({ room }) {
  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_12px_40px_-12px_rgb(28,25,23,0.08)] transition-transform duration-200 hover:scale-[1.01] hover:shadow-warm"
    >
      {room.image_urls?.[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={room.image_urls[0]}
          alt=""
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <RoomTypeVisual roomType={room.room_type} />
      )}

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500">
            {room.suburb} · {room.state}
          </p>
          <h3 className="mt-1 font-display text-base leading-snug text-stone-900">
            {room.title}
          </h3>
        </div>

        <p className="font-display text-lg text-stone-900">
          {pricePerDayLabel(room.price_per_day_cents)}
        </p>

        <div className="flex flex-wrap gap-1">
          {room.available_days.map((day) => (
            <span
              key={day}
              className="rounded-full border border-stone-200 px-2 py-0.5 text-xs text-stone-600"
            >
              {DAY_LABEL[day]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
