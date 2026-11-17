import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE_URL } from "@/lib/site";
import SessionalRoomCalculator from "./SessionalRoomCalculator";

const PAGE_PATH = "/tools/sessional-room-calculator";

const CALCULATOR_FAQS = [
  {
    question: "What is the average sessional room rate in Melbourne?",
    answer:
      "Sessional room rates across core Melbourne health precincts (such as Camberwell, Richmond, and South Yarra) typically range from $110 to $180 per full day, depending on location, practice quality, and included amenities.",
  },
  {
    question: "When is flat room hire cheaper than a 30% clinic split?",
    answer:
      "For a standard $220 consultation fee, a 30% service split costs $66 per client. Seeing 5 clients per day equals $330 in split fees. A flat sessional room rate of $120/day saves $210 per day at that volume.",
  },
];

function jsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Clinician Room Budget Calculator",
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
              Clinician Room Budget Calculator
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

        <FadeInOnView className="mt-16">
          <PracticeFinancialGuide />
        </FadeInOnView>

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

function GuideCheck({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="font-bold text-teal-900">✓</span>
      <span>{children}</span>
    </li>
  );
}

function PracticeFinancialGuide() {
  return (
    <section className="border-t border-stone-200 pt-12 text-stone-700">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-900">
            Practice Economics Guide
          </span>
          <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">
            Sessional Room Hire & Overhead Guide
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            A practical breakdown of private practice overheads, 2026 MBS
            rebates, and flat rate vs 30% split margins for Melbourne
            clinicians.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Fixed Costs
                </span>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
                  Base Overheads
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-stone-900">
                Predictable Room Hire
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Expenses that stay constant regardless of client volume.
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
                <GuideCheck>
                  <strong className="font-semibold text-stone-800">
                    Room Hire Rate:
                  </strong>{" "}
                  $110 – $180/day in Camberwell, South Yarra & Richmond.
                </GuideCheck>
                <GuideCheck>
                  <strong className="font-semibold text-stone-800">
                    Annual Memberships:
                  </strong>{" "}
                  AHPRA, APS, AAPi, or AASW fees.
                </GuideCheck>
                <GuideCheck>
                  <strong className="font-semibold text-stone-800">
                    Insurance:
                  </strong>{" "}
                  Professional indemnity & public liability coverage.
                </GuideCheck>
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Variable Costs
                </span>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
                  Per-Session
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-stone-900">
                Per-Client Overheads
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Costs that scale directly with consultation volume.
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
                <GuideCheck>
                  <strong className="font-semibold text-stone-800">
                    EFTPOS Fees:
                  </strong>{" "}
                  Tyro, Square, or Stripe transactions (~1.1%–1.9%).
                </GuideCheck>
                <GuideCheck>
                  <strong className="font-semibold text-stone-800">
                    Practice Software:
                  </strong>{" "}
                  Cliniko, Halaxy, or Power Diary usage fees.
                </GuideCheck>
                <GuideCheck>
                  <strong className="font-semibold text-stone-800">
                    Assessment Tools:
                  </strong>{" "}
                  Psychological protocols (WAIS/WISC) & printing.
                </GuideCheck>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-stone-900">
              2026 Medicare Rebate Benchmarks
            </h3>
            <span className="text-xs font-medium text-stone-500">
              Better Access MHTP Items (50+ mins)
            </span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-stone-200/60 bg-stone-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Registered Psych
              </p>
              <p className="mt-1 font-sans text-2xl font-black text-teal-900">
                $101.55
              </p>
              <p className="mt-1 text-xs text-stone-500">Item 80110</p>
            </div>
            <div className="rounded-xl border border-stone-200/60 bg-stone-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Clinical Psych
              </p>
              <p className="mt-1 font-sans text-2xl font-black text-teal-900">
                $149.05
              </p>
              <p className="mt-1 text-xs text-stone-500">Item 80010</p>
            </div>
            <div className="rounded-xl border border-stone-200/60 bg-stone-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                AMHSW
              </p>
              <p className="mt-1 font-sans text-2xl font-black text-teal-900">
                $89.50
              </p>
              <p className="mt-1 text-xs text-stone-500">Item 80150</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-teal-900/10 bg-teal-50/60 p-3.5 text-sm leading-relaxed text-stone-700">
            <strong>Client Gap Fee Formula:</strong> Gap Fee = Full Session Fee
            – Medicare Rebate. E.g. $220 Session Fee – $101.55 Rebate ={" "}
            <strong className="font-semibold text-stone-900">
              $118.45 Out-of-Pocket Cost
            </strong>
            .
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold text-stone-900">
            Sessional Hire vs 30% Clinic Split
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Percentage splits reduce initial risk, but flat room hire preserves
            your profit as diary volume grows.
          </p>
          <div className="mt-5 rounded-2xl bg-[#0f4c45] p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                The Tipping Point
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                5 Clients / Day Example
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="border-l-2 border-white/20 pl-4">
                <p className="text-xs text-white/70">30% Practice Split</p>
                <p className="mt-1 font-sans text-2xl font-bold text-amber-300">
                  $330/day
                </p>
                <p className="mt-1 text-xs text-white/70">
                  5 clients × $66 split fee ($220 consult)
                </p>
              </div>
              <div className="border-l-2 border-emerald-400 pl-4">
                <p className="text-xs text-emerald-300">Flat Sessional Hire</p>
                <p className="mt-1 font-sans text-2xl font-bold text-emerald-300">
                  $120/day
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Saves <strong className="text-white">$210/day</strong>{" "}
                  ($10,000+/yr per weekly day)
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
            Sessional rates and when flat hire beats a clinic split.
          </p>
          <FaqAccordion items={CALCULATOR_FAQS} />
        </section>

        <div className="mx-auto max-w-3xl rounded-xl border border-stone-200 bg-stone-100/70 p-4 text-center text-xs leading-relaxed text-stone-500">
          <strong>Disclaimer:</strong> This calculator and guide provide general
          estimates for educational and budgeting purposes only. Figures do not
          account for income tax, GST, superannuation, or personal insurance,
          and do not constitute formal financial, legal, or accounting advice.
          Always consult a qualified CPA or legal advisor for your practice
          structure, and confirm active MBS item requirements with Services
          Australia.
        </div>
      </div>
    </section>
  );
}
