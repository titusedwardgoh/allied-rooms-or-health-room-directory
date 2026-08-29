import Link from "next/link";

export default function SuburbBento({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, idx) => {
        const isFeatured = idx === 0;
        return (
          <Link
            key={item.suburb}
            href={`/rooms?suburb=${item.suburb.toLowerCase()}`}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-6 transition-all hover:scale-[1.01] hover:shadow-lg ${
              isFeatured
                ? "bg-gradient-to-br from-teal-900/5 to-transparent sm:col-span-2 sm:row-span-2"
                : ""
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {item.tag}
              </span>
              <h3 className="mt-1 font-sans text-2xl font-bold text-stone-900 transition-colors group-hover:text-teal-900">
                {item.suburb}
              </h3>
            </div>

            <div className="mt-8 flex items-end justify-between">
              <span className="text-sm font-medium text-stone-500">
                {item.count} {item.count === 1 ? "room" : "rooms"} listed
              </span>
              <span className="text-xs font-bold text-teal-950 group-hover:underline">
                Explore →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
