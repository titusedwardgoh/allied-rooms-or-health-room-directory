import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/FadeIn";
import { SITE_URL } from "@/lib/site";
import SessionalRoomCalculator from "./SessionalRoomCalculator";

const PAGE_PATH = "/tools/sessional-room-calculator";

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Clinician Sessional Room Hire Calculator",
    url: `${SITE_URL}${PAGE_PATH}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
    },
    description:
      "Benchmark daily room overheads, calculate break-even client sessions, and compare flat sessional room hire against a 30% practice split in Melbourne.",
  };
}

export default function SessionalRoomCalculatorPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Tools
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.1]">
              Clinician Sessional Room Hire Calculator
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Benchmark your daily room overheads, calculate break-even client
              sessions, and compare flat sessional room hire against 30%
              practice splits in Melbourne.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.24} className="mt-10">
          <SessionalRoomCalculator />
        </FadeIn>

        <FadeInOnView delay={0.32} className="mt-12 sm:mt-16">
          <aside className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#0f4c45] p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
            <div className="max-w-xl">
              <h2 className="font-sans text-2xl font-black tracking-tight sm:text-3xl">
                Find Sessional Rooms Across Melbourne
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                Browse available sessional consulting suites in Camberwell,
                South Yarra, and Richmond — day rates listed up front, zero
                commission.
              </p>
            </div>
            <Link
              href="/rooms"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f4c45] shadow-sm transition-transform hover:bg-stone-100 active:scale-95"
            >
              Find a Room
            </Link>
          </aside>
        </FadeInOnView>
      </div>
    </main>
  );
}
