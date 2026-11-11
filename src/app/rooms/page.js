import { Suspense } from "react";
import MarkListingOrigin from "@/components/MarkListingOrigin";
import SearchBar from "@/components/SearchBar";
import { parseRoomSort } from "@/lib/roomsSort";
import RoomsResults, { RoomsResultsFallback } from "./RoomsResults";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Find a Room",
  description:
    "Browse sessional allied health consulting rooms across Melbourne by suburb, day, and daily rate.",
};

function toDayArray(day) {
  if (!day) return [];
  return Array.isArray(day) ? day : [day];
}

function roomsClearHref(sort) {
  const params = new URLSearchParams();
  if (sort && sort !== "newest") params.set("sort", sort);
  const query = params.toString();
  return query ? `/rooms?${query}` : "/rooms";
}

export default async function RoomsPage({ searchParams }) {
  const params = await searchParams;
  const suburb = params.suburb ?? "";
  const type = params.type ?? "";
  const days = toDayArray(params.day);
  const max = params.max ?? "";
  const sort = parseRoomSort(params.sort);
  const hasFilters = Boolean(suburb || type || days.length || max);
  const clearHref = roomsClearHref(sort);
  const resultsKey = [suburb, type, days.join(","), max, sort].join("|");

  return (
    <main className="min-h-screen bg-stone-50">
      <Suspense fallback={null}>
        <MarkListingOrigin from="search" />
      </Suspense>
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8 2xl:max-w-page-inset">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Directory
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Find a Room
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            Browse sessional allied health rooms across Melbourne by suburb,
            day, and daily rate.
          </p>
        </div>

        <div className="mt-12">
          <SearchBar
            suburb={suburb}
            roomType={type}
            days={days}
            maxPrice={max}
            sort={sort}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-12 pb-12 sm:px-6 lg:px-8 2xl:max-w-page-inset min-[1720px]:!max-w-[106rem]">
        <Suspense key={resultsKey} fallback={<RoomsResultsFallback />}>
          <RoomsResults
            suburb={suburb}
            type={type}
            days={days}
            max={max}
            sort={sort}
            hasFilters={hasFilters}
            clearHref={clearHref}
          />
        </Suspense>
      </div>
    </main>
  );
}
