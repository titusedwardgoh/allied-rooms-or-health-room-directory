import Link from "next/link";
import RoomCard from "@/components/RoomCard";
import { FadeInOnView, Stagger, StaggerItem } from "@/components/FadeIn";

export default function SimilarRooms({ room, rooms }) {
  if (!rooms?.length) return null;

  const suburb = String(room?.suburb || "").trim();
  const nearby = suburb
    ? rooms.some(
        (item) =>
          String(item.suburb || "").trim().toLowerCase() ===
          suburb.toLowerCase(),
      )
    : false;
  const browseHref = nearby
    ? `/rooms?suburb=${encodeURIComponent(suburb.toLowerCase())}`
    : "/rooms";

  return (
    <FadeInOnView className="mt-16 border-t border-stone-200 pt-10">
      <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Keep exploring
          </span>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            {nearby
              ? "Similar rooms nearby"
              : "Other consulting rooms in Melbourne"}
          </h2>
        </div>
        <Link
          href={browseHref}
          className="text-sm font-bold text-teal-950 hover:underline"
        >
          View all →
        </Link>
      </div>

      <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((item) => (
          <StaggerItem key={item.id || item.slug} className="h-full">
            <RoomCard room={item} />
          </StaggerItem>
        ))}
      </Stagger>
    </FadeInOnView>
  );
}
