import Link from "next/link";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { FadeIn, FadeInOnView, Stagger, StaggerItem } from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import RoomCard from "@/components/RoomCard";
import { getPublishedRooms } from "@/lib/db/rooms";
import { formatAUDFromCents } from "@/lib/format";
import {
  filterRoomsBySuburb,
  getLocationHub,
  locationFaqJsonLd,
  locationHubList,
  locationListingStats,
} from "@/lib/locations";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

const getCachedLocationRooms = unstable_cache(
  async (suburbName) =>
    filterRoomsBySuburb(
      await getPublishedRooms({ suburb: suburbName }),
      suburbName,
    ),
  ["location-hub-rooms"],
  { revalidate: 60 },
);

export function generateStaticParams() {
  return locationHubList().map((hub) => ({ suburb: hub.slug }));
}

export async function generateMetadata({ params }) {
  const { suburb } = await params;
  const hub = getLocationHub(suburb);
  if (!hub) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: { absolute: hub.metaTitle },
    description: hub.metaDescription,
    alternates: { canonical: `${SITE_URL}/locations/${hub.slug}` },
    openGraph: {
      title: hub.metaTitle,
      description: hub.metaDescription,
      url: `/locations/${hub.slug}`,
      type: "website",
      locale: "en_AU",
      siteName: "AlliedRooms",
      images: hub.ogImage ? [{ url: hub.ogImage }] : undefined,
    },
  };
}

export default async function LocationHubPage({ params }) {
  const { suburb } = await params;
  const hub = getLocationHub(suburb);
  if (!hub) notFound();

  const rooms = await getCachedLocationRooms(hub.name);
  const stats = locationListingStats(rooms, hub.typicalMinCents);
  const heroImage = hub.image || "/images/clinic-hero.jpg";
  const metrics = [
    { label: "Active Spaces", value: String(stats.count) },
    {
      label: "Rates from",
      value: `${formatAUDFromCents(stats.minCents)}/day`,
    },
    { label: "Zero Commission Fees", value: "$0" },
  ];

  return (
    <main className="min-h-screen bg-stone-50/60">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationFaqJsonLd(hub)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 text-stone-900 shadow-md sm:p-12">
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-600">
                {hub.pill}
              </span>
              <h1 className="mt-4 font-sans text-3xl font-black tracking-tight text-stone-900 sm:text-4xl sm:leading-tight">
                {hub.h1}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                {hub.subtitle}
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {metric.label}
                    </p>
                    <p className="mt-1 font-sans text-xl font-black text-stone-900">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-stone-200 shadow-lg sm:aspect-[4/3]">
                <img
                  src={heroImage}
                  alt={`Consulting rooms in ${hub.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </FadeIn>

        <section className="mt-12 sm:mt-16">
          <FadeInOnView className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Listings
            </span>
            <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
              Active rooms in {hub.name}
            </h2>
          </FadeInOnView>

          {rooms.length === 0 ? (
            <FadeInOnView>
              <div className="rounded-2xl border border-stone-200 bg-white p-8 sm:p-10 text-center shadow-sm">
                <p className="text-base leading-relaxed text-stone-700">
                  No active rooms listed in {hub.name} right now.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/list-a-room"
                    className="rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-950"
                  >
                    List a Room
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full border border-stone-900 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-stone-100"
                  >
                    Get notified when rooms open up
                  </Link>
                </div>
              </div>
            </FadeInOnView>
          ) : (
            <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <StaggerItem key={room.id} className="h-full">
                  <RoomCard room={room} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>

        <FadeInOnView className="mt-12 sm:mt-16">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Market insights
            </span>
            <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
              Practising in {hub.name}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-stone-600">
              {hub.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </FadeInOnView>

        <FadeInOnView className="mt-12 sm:mt-16">
          <section className="rounded-2xl border border-stone-200 bg-white px-6 pb-6 shadow-sm sm:px-8">
            <h2 className="pt-6 font-sans text-xl font-black text-stone-900">
              {hub.name} FAQs
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Sessional hire, rates, and how to inspect a room.
            </p>
            <FaqAccordion items={hub.faqs} />
          </section>
        </FadeInOnView>

        <FadeInOnView className="mt-12 sm:mt-16">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Nearby
            </span>
            <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
              Other Melbourne suburbs
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {hub.nearby.map((place) => (
                <Link
                  key={place.name}
                  href={place.href}
                  className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-800 shadow-2xs transition-all hover:border-teal-900/20 hover:bg-white hover:text-teal-950 hover:shadow-sm"
                >
                  {place.name}
                </Link>
              ))}
              <Link
                href="/locations"
                className="rounded-full bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-950"
              >
                View all locations →
              </Link>
            </div>
          </section>
        </FadeInOnView>
      </div>
    </main>
  );
}
