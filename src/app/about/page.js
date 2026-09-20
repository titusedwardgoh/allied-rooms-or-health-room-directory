import Link from "next/link";
import { CalendarOff, CircleDollarSign, MessagesSquare } from "lucide-react";
import { FadeIn, FadeInOnView, Stagger, StaggerItem } from "@/components/FadeIn";

export const metadata = {
  title: "About — AlliedRooms",
  description:
    "AlliedRooms connects Melbourne health practitioners with sessional consulting rooms — clear daily rates, zero long leases, direct host contact.",
};

const PILLARS = [
  {
    title: "Clear Daily Rates",
    description:
      "Transparent day rates published up front. Compare spaces by suburb and price instantly without waiting for quotes.",
    icon: CircleDollarSign,
    href: "/rooms",
    cta: "Browse rooms",
  },
  {
    title: "Zero Long Leases",
    description:
      "Hire rooms strictly by the day. Scale your practice flexibly without lock-in contracts or unused rent.",
    icon: CalendarOff,
    href: "/rooms",
    cta: "Explore flexible spaces",
  },
  {
    title: "Direct Host Contact",
    description:
      "Connect directly with practice owners. No middleman brokers, zero booking commissions, no hidden fees.",
    icon: MessagesSquare,
    href: "/list-a-room",
    cta: "List your space",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <FadeIn>
          <span className="inline-block rounded-full bg-stone-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-700">
            About AlliedRooms
          </span>
          <h1 className="mt-6 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.1]">
            Sessional clinical spaces,{" "}
            <br className="hidden sm:inline" />
            <span className="text-teal-900">without the lease.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Melbourne’s direct directory for allied health and therapy rooms —
            connected straight with clinic hosts.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/rooms"
              className="rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-950 active:scale-95"
            >
              Find a Room
            </Link>
            <Link
              href="/list-a-room"
              className="rounded-full border border-stone-900 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-all hover:bg-stone-100 active:scale-95"
            >
              List a Room
            </Link>
          </div>
        </FadeIn>

        <FadeInOnView className="mt-12">
          <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm shadow-stone-900/5 sm:p-10">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Why AlliedRooms
            </span>
            <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
              Unlocking unused clinical capacity in Melbourne.
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 text-base leading-relaxed text-stone-600">
              <p>
                Established practices often have rooms sitting empty on specific
                days of the week. Independent practitioners need professional
                clinical space without a multi-year commercial lease.
              </p>
              <p>
                AlliedRooms bridges that gap. We remove brokers, lock-in
                contracts, and paywalls so clinicians can find space quickly, and
                practice owners can fill unused days.
              </p>
            </div>
          </section>
        </FadeInOnView>

        <section className="mt-12 sm:mt-16">
          <FadeInOnView className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              The platform
            </span>
            <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
              Built for modern allied health practice.
            </h2>
          </FadeInOnView>

          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={pillar.title}>
                  <article className="flex h-full flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm shadow-stone-900/5">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-900/10 text-teal-900">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 font-sans text-lg font-black text-stone-900">
                        {pillar.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-stone-100 pt-4">
                      <Link
                        href={pillar.href}
                        className="text-sm font-bold text-teal-950 hover:underline"
                      >
                        {pillar.cta} →
                      </Link>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        <FadeInOnView className="mt-12 sm:mt-16">
          <aside className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-teal-900 px-6 py-8 sm:flex-row sm:items-center sm:px-10 sm:py-10">
            <div className="max-w-xl">
              <h2 className="font-sans text-2xl font-black tracking-tight text-white sm:text-3xl">
                Have spare room capacity?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-teal-50/80 sm:text-base">
                Three short steps. You’ll get a private preview link before the
                listing appears in search.
              </p>
            </div>
            <Link
              href="/list-a-room"
              className="inline-flex shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-teal-950 shadow-sm transition-transform hover:bg-stone-100 active:scale-95"
            >
              List a Room
            </Link>
          </aside>
        </FadeInOnView>
      </div>
    </main>
  );
}
