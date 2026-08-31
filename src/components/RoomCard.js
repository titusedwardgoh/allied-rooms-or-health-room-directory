import Link from "next/link";
import { DAY_LABEL, ROOM_TYPE_LABEL, pricePerDayLabel } from "@/lib/format";
import RoomPlaceholder from "./RoomPlaceholder";

export default function RoomCard({ room }) {
  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-stone-900/5"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
        {room.image_urls && room.image_urls.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={room.image_urls[0]}
            alt={room.title}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <RoomPlaceholder roomType={room.room_type} />
        )}
        <div className="absolute left-3 top-3 rounded-full bg-stone-900/80 px-3 py-1 text-[11px] font-medium text-stone-50 backdrop-blur-sm">
          {ROOM_TYPE_LABEL[room.room_type]}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-stone-700">
              {room.suburb}, {room.state}
            </span>
            <span className="truncate pl-3">{room.host?.practice_name}</span>
          </div>

          <h3 className="mt-2 line-clamp-1 font-sans text-base font-bold text-stone-900 transition-colors group-hover:text-teal-900">
            {room.title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <div className="flex flex-wrap gap-1">
            {room.available_days.map((d) => (
              <span
                key={d}
                className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-stone-600"
              >
                {DAY_LABEL[d]}
              </span>
            ))}
          </div>

          <div className="text-right">
            <span className="font-display text-base font-bold text-stone-900">
              {pricePerDayLabel(room.price_per_day_cents)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
