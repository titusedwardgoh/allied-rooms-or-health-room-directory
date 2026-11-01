import Link from "next/link";
import Image from "next/image";
import { FadeIn, FadeInOnView, Stagger, StaggerItem } from "@/components/FadeIn";
import { SUBURB_HUBS } from "@/lib/hubs";
import { hrefForSuburb } from "@/lib/locations";

export const metadata = {
  title: "Melbourne Location Hubs",
  description:
    "Browse sessional allied health consulting rooms by Melbourne suburb — Brunswick, Camberwell, Carlton, Fitzroy, Hawthorn, Richmond, South Melbourne, South Yarra, and Southbank.",
};

const SUBURBS = Object.keys(SUBURB_HUBS).sort((a, b) => a.localeCompare(b));

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-stone-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-700">
            Locations
          </span>
          <h1 className="mt-6 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Melbourne location hubs
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            Sessional consulting rooms across Melbourne, grouped by suburb so
            you can compare day rates and reach hosts directly.
          </p>
        </FadeIn>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SUBURBS.map((suburb) => {
            const hub = SUBURB_HUBS[suburb];
            const href = hrefForSuburb(suburb);
            const isHub = href.startsWith("/locations/");

            return (
              <StaggerItem key={suburb}>
                <Link
                  href={href}
                  className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-stone-200 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-stone-900/5"
                >
                  <Image
                    src={hub.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
                  <div className="relative z-10 flex min-h-[172px] flex-1 flex-col justify-between text-white [text-shadow:0_1px_8px_rgb(0_0_0_/_0.45)]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-200">
                        {isHub ? "Location hub" : hub.tag}
                      </span>
                      <h2 className="mt-1 font-sans text-2xl font-bold">
                        {suburb}
                      </h2>
                    </div>
                    <span className="text-xs font-bold transition-transform group-hover:translate-x-1">
                      {isHub ? "Open hub →" : "Browse rooms →"}
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <FadeInOnView className="mt-12 text-center text-sm text-stone-600">
          <p className="leading-relaxed">
            Looking citywide?{" "}
            <Link
              href="/rooms"
              className="font-semibold text-teal-950 hover:underline"
            >
              Find a Room
            </Link>
            {" "}
            or{" "}
            <Link
              href="/list-a-room"
              className="font-semibold text-teal-950 hover:underline"
            >
              list your space
            </Link>
            .
          </p>
        </FadeInOnView>
      </div>
    </main>
  );
}
