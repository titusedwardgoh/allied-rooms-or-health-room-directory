import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE_URL } from "@/lib/site";
import SubleaseRevenueCalculator from "./SubleaseRevenueCalculator";

const PAGE_PATH = "/tools/sublease-revenue-calculator";

const CALCULATOR_FAQS = [
  {
    question: "How much can I earn if I sublease a medical room in Melbourne?",
    answer:
      "Host earnings depend on idle rooms, days available, and your consulting room day rate. A typical Melbourne sessional rate of $110–$180/day, listed two days a week for 48 weeks, can generate roughly $10,000–$17,000 in annual gross sublease income per room before tax.",
  },
  {
    question: "What consulting room day rate should a host charge?",
    answer:
      "In core health precincts such as Camberwell, South Yarra, and Richmond, sessional consulting rooms commonly list between $110 and $180 per full day. Amenities, parking, and fit-out quality sit at the top of that range.",
  },
  {
    question: "How do I rent out idle therapy space?",
    answer:
      "Confirm landlord consent under your head lease, verify visiting practitioners hold AHPRA registration and indemnity insurance, then list the spare days with a clear day rate. AlliedRooms sends inquiries directly to you with no booking commission.",
  },
];

function jsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Host Practice Sublease Income Calculator",
      url: `${SITE_URL}${PAGE_PATH}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AUD",
      },
      description:
        "Calculate passive rental income from unutilized medical and consulting rooms in Melbourne. Compare sessional day rates and zero-commission direct hosting.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: CALCULATOR_FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

export default function SubleaseRevenueCalculatorPage() {
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
              Host Practice Sublease Income Calculator
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Estimate passive rental income from idle consulting rooms, then
              compare direct hosting with typical 10–15% agency placement fees
              in Melbourne.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.24} className="mt-10">
          <SubleaseRevenueCalculator />
        </FadeIn>

        <FadeInOnView className="mt-16">
          <PracticeHostGuide />
        </FadeInOnView>
      </div>
    </main>
  );
}

function GuideCheck({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="font-bold text-teal-900">✓</span>
      <span>{children}</span>
    </li>
  );
}

function PracticeHostGuide() {
  return (
    <section className="border-t border-stone-200 pt-12 text-stone-700">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-900">
            Host Economics & Practice Optimization
          </span>
          <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
            Sublease Medical Rooms in Melbourne
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Typical consulting room day rates, a host operations checklist, and
            how to rent out idle therapy space without a broker.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Market rates
              </span>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
                Melbourne
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-stone-900">
              Sublease Market Rates
            </h3>
            <p className="mt-1 text-sm text-stone-600">
              Benchmark sessional day rates in core allied health precincts.
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
              <GuideCheck>
                <strong className="font-semibold text-stone-800">
                  Camberwell, South Yarra & Richmond:
                </strong>{" "}
                $110 – $180 per full day, depending on fit-out and parking.
              </GuideCheck>
              <GuideCheck>
                <strong className="font-semibold text-stone-800">
                  Host earnings:
                </strong>{" "}
                Two idle days at $130/day over 48 weeks is about $12,480 gross
                per room.
              </GuideCheck>
              <GuideCheck>
                <strong className="font-semibold text-stone-800">
                  Direct listing:
                </strong>{" "}
                Day rates sit up front. AlliedRooms does not take a booking
                cut.
              </GuideCheck>
            </ul>
          </div>

          <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Host checklist
              </span>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
                Operations
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-stone-900">
              Host Operations Checklist
            </h3>
            <p className="mt-1 text-sm text-stone-600">
              Confirm these before a visiting practitioner starts.
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
              <GuideCheck>
                <strong className="font-semibold text-stone-800">
                  Head lease:
                </strong>{" "}
                Check landlord consent before you sublease a medical room.
              </GuideCheck>
              <GuideCheck>
                <strong className="font-semibold text-stone-800">
                  Credentials:
                </strong>{" "}
                Verify AHPRA registration and professional indemnity insurance.
              </GuideCheck>
              <GuideCheck>
                <strong className="font-semibold text-stone-800">
                  Shared amenities:
                </strong>{" "}
                Agree room scheduling, waiting-room access, and consumables.
              </GuideCheck>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold text-stone-900">
            Direct hosting vs agency placement fees
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Commercial lease placement and property management typically take
            10–15% of rent. Listing direct keeps 100% of the sessional income.
          </p>
          <div className="mt-5 rounded-2xl bg-[#0f4c45] p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                Agency savings
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                12% example
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="border-l-2 border-white/20 pl-4">
                <p className="text-xs text-white/70">Broker or agency cut</p>
                <p className="mt-1 font-sans text-2xl font-bold text-amber-300">
                  10–15%
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Typical commercial placement or management fee
                </p>
              </div>
              <div className="border-l-2 border-emerald-400 pl-4">
                <p className="text-xs text-emerald-300">AlliedRooms listing</p>
                <p className="mt-1 font-sans text-2xl font-bold text-emerald-300">
                  0% commission
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Inquiries go straight to the practice. You keep the rent.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white px-6 pb-6 shadow-sm sm:px-8">
          <h3 className="pt-6 font-sans text-xl font-black text-stone-900">
            Frequently asked questions
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Subleasing medical rooms and host day-rate earnings.
          </p>
          <FaqAccordion items={CALCULATOR_FAQS} />
        </section>

        <aside className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#0f4c45] p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
          <div className="max-w-xl">
            <h2 className="font-sans text-2xl font-black tracking-tight sm:text-3xl">
              List idle rooms, keep 100% of the rent
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
              Publish a day rate, the days the suite is free, and receive
              practitioner inquiries directly — no agency contract.
            </p>
          </div>
          <Link
            href="/list-a-room"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f4c45] shadow-sm transition-transform hover:bg-stone-100 active:scale-95"
          >
            List Your Room for Free
          </Link>
        </aside>

        <div className="mx-auto max-w-3xl rounded-xl border border-stone-200 bg-stone-100/70 p-4 text-center text-xs leading-relaxed text-stone-500">
          <strong>Disclaimer:</strong> These figures are gross turnover
          projections for educational and budgeting purposes only. They assume
          the listed days fill, and they do not account for income tax, GST,
          vacancy, or the cost of drafting a sessional licence. Confirm head
          lease permissions with your landlord and seek legal or accounting
          advice before hosting.
        </div>
      </div>
    </section>
  );
}
