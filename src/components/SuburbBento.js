import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const TILES = [
  {
    suburb: "Richmond",
    blurb: "Bridge Road and Swan Street clinics.",
    className: "md:col-span-2 md:row-span-2 min-h-[220px] bg-gradient-to-br from-teal-50 to-stone-50",
  },
  {
    suburb: "Fitzroy",
    blurb: "Gertrude and Smith Street terraces.",
    className: "bg-gradient-to-br from-stone-50 to-orange-50",
  },
  {
    suburb: "South Yarra",
    blurb: "Chapel Street and Toorak Road.",
    className: "bg-gradient-to-br from-orange-50 to-stone-50",
  },
  {
    suburb: "Hawthorn",
    blurb: "A short walk from Glenferrie Station.",
    className: "md:col-span-2 bg-gradient-to-br from-stone-50 to-teal-50",
  },
  {
    suburb: "Brunswick",
    blurb: "Sydney Road, tram at the door.",
    className: "md:col-span-2 bg-gradient-to-br from-teal-50/80 to-stone-100",
  },
];

export default function SuburbBento({ stats = [] }) {
  const counts = Object.fromEntries(
    stats.map((item) => [item.suburb, item.count]),
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
      {TILES.map((tile) => {
        const count = counts[tile.suburb] ?? 0;
        return (
          <Link
            key={tile.suburb}
            href={`/rooms?suburb=${encodeURIComponent(tile.suburb.toLowerCase())}`}
            className={`flex flex-col justify-between rounded-2xl border border-stone-200 p-6 transition-transform duration-200 hover:scale-[1.01] ${tile.className}`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl text-stone-900 md:text-3xl">
                {tile.suburb}
              </h3>
              <span className="rounded-full border border-stone-200 bg-white/80 px-2.5 py-1 text-xs font-medium text-sage">
                {count} {count === 1 ? "room" : "rooms"}
              </span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-3">
              <p className="max-w-[16rem] text-sm text-stone-600">{tile.blurb}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-clay">
                Browse
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
