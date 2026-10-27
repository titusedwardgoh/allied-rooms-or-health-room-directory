import Link from "next/link";
import { CalendarOff, CircleDollarSign, MessagesSquare } from "lucide-react";
import { FadeIn, FadeInOnView, Stagger, StaggerItem } from "@/components/FadeIn";

export const metadata = {
  title: "About",
  description:
    "AlliedRooms connects Melbourne health practitioners with sessional consulting rooms — clear daily rates, flexible leases, direct host contact.",
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
    title: "Flexible Leases",
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
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-stone-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-700">
            About AlliedRooms
          </span>
          <h1 className="mt-6 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.1]">
            Sessional clinical spaces,<br className="hidden sm:inline" />{" "}
            <span className="text-teal-900">without the lease</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Melbourne’s direct directory for allied health and therapy rooms —
            connected straight with clinic hosts.
          </p>
        </FadeIn>

        <FadeInOnView className="mx-auto mt-12 max-w-3xl">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Why AlliedRooms
            </span>
            <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
              Unlocking unused clinical capacity in Melbourne
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-stone-600">
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
          <FadeInOnView className="mb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              The platform
            </span>
            <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
              Built for modern allied health practice
            </h2>
          </FadeInOnView>

          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={pillar.title} className="h-full">
                  <article className="flex h-full flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
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
          <aside className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#0f4c45] p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
            <div className="max-w-xl">
              <h2 className="font-sans text-2xl font-black tracking-tight sm:text-3xl">
                Have spare room capacity?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                Three short steps. You’ll get a private preview link before the
                listing appears in search.
              </p>
            </div>
            <Link
              href="/list-a-room"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f4c45] shadow-sm transition-transform hover:bg-stone-100 active:scale-95"
            >
              List a Room
            </Link>
          </aside>
        </FadeInOnView>
      </div>
    </main>
  );
}
