import Image from "next/image";
import Link from "next/link";

const SUBURB_IMAGES = {
  Richmond: "/hubs/richmond.jpg",
  "South Yarra": "/hubs/south-yarra.jpg",
  Fitzroy: "/hubs/fitzroy.jpg",
  Hawthorn: "/hubs/hawthorn.jpg",
  Brunswick: "/hubs/brunswick.jpg",
};

export default function SuburbBento({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, idx) => {
        const isFeatured = idx === 0;
        const bgImage = SUBURB_IMAGES[item.suburb] || SUBURB_IMAGES.Richmond;

        return (
          <Link
            key={item.suburb}
            href={`/rooms?suburb=${encodeURIComponent(item.suburb.toLowerCase())}`}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
              isFeatured ? "min-h-[260px] sm:col-span-2 sm:row-span-2" : "min-h-[180px]"
            }`}
          >
            <Image
              src={bgImage}
              alt=""
              fill
              sizes={
                isFeatured
                  ? "(min-width: 1024px) 50vw, 100vw"
                  : "(min-width: 1024px) 25vw, 50vw"
              }
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5" />

            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-300">
                  {item.tag}
                </span>
                <h3 className="mt-1 font-sans text-2xl font-bold sm:text-3xl">
                  {item.suburb}
                </h3>
              </div>

              <div className="mt-8 flex items-end justify-between">
                <span className="text-xs font-semibold text-stone-200 sm:text-sm">
                  {item.count} {item.count === 1 ? "room" : "rooms"} listed
                </span>
                <span className="inline-flex items-center text-xs font-bold text-white transition-transform group-hover:translate-x-1">
                  Explore →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
