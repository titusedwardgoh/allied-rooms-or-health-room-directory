import Link from "next/link";
import { DAY_LABEL, listingRoomTypeLabel, pricePerDayLabel } from "@/lib/format";
import RoomPlaceholder from "./RoomPlaceholder";

const DAYS = Object.keys(DAY_LABEL);

export default function RoomCard({ room }) {
  const selectedDays = new Set(room.available_days ?? []);

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-stone-900/5"
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
          {listingRoomTypeLabel(room)}
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

        <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-3">
          <div className="grid min-w-0 flex-1 grid-cols-7 gap-0.5">
            {DAYS.map((day) => {
              const on = selectedDays.has(day);
              return (
                <span
                  key={day}
                  className={`rounded py-0.5 text-center text-[9px] font-semibold uppercase leading-none sm:text-[10px] ${
                    on ? "bg-stone-100 text-stone-700" : "text-stone-300"
                  }`}
                >
                  {DAY_LABEL[day]}
                </span>
              );
            })}
          </div>

          <p className="shrink-0 whitespace-nowrap text-right font-display text-base font-bold tabular-nums text-stone-900">
            {pricePerDayLabel(room.price_per_day_cents)}
          </p>
        </div>
      </div>
    </Link>
  );
}
