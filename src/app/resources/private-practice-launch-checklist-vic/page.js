import Link from "next/link";
import { FadeIn, FadeInOnView, Stagger, StaggerItem } from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE_URL } from "@/lib/site";

const PAGE_PATH = "/resources/private-practice-launch-checklist-vic";
const DATE_PUBLISHED = "2026-11-20T08:00:00+11:00";
const DATE_MODIFIED = "2026-11-24T08:00:00+11:00";
const DATE_MODIFIED_DAY = "2026-11-24";

const CHECKLIST_FAQS = [
  {
    question:
      "How soon do I need to update my AHPRA address when I start private practice in Victoria?",
    answer:
      "AHPRA requires you to update your Principal Place of Practice (PPP) within 30 days of changing location. If you move from public health or a group clinic into independent sessional rooms, log in to the AHPRA portal and update the practice address before you start seeing clients there.",
  },
  {
    question:
      "How long does a Medicare provider number take for a new sessional location?",
    answer:
      "Each sessional clinic address needs its own Medicare provider number, applied for through Health Professional Online Services (HPOS). Complete applications often take around two to four weeks, though times vary. Confirm current processing times with Services Australia and do not assume you can bill Medicare from a new room until that location number is issued.",
  },
  {
    question: "What are typical Melbourne sessional room rates?",
    answer:
      "Sessional consulting rooms in core Melbourne precincts such as Camberwell, South Yarra, and Richmond typically list between $110 and $180 per full day, depending on fit-out, parking, and included amenities. Compare that flat hire against a 30% clinic split using the AlliedRooms sessional room calculator before you commit to days.",
  },
];

const PHASES = [
  {
    phase: "Phase 1",
    title: "AHPRA & Professional Registration",
    summary:
      "Keep your registration current before the first private client.",
    items: [
      {
        label: "Principal Place of Practice",
        detail:
          "Update your PPP address in the AHPRA portal within 30 days of changing locations.",
      },
      {
        label: "Endorsement status",
        detail:
          "Confirm Clinical vs Registered Psychologist (or equivalent) so MBS item numbers match your registration.",
      },
      {
        label: "Association membership",
        detail:
          "Join APS, AAPi, AASW, Occupational Therapy Australia, or your profession’s peak body before you advertise independently.",
      },
    ],
  },
  {
    phase: "Phase 2",
    title: "Medicare Provider Numbers & Billing",
    summary: "One provider number per sessional address — not per clinician only.",
    items: [
      {
        label: "Location-specific provider number",
        detail:
          "Apply via HPOS for each clinic address you will use. A Camberwell day and a Richmond day need separate numbers.",
      },
      {
        label: "PRODA / HPOS + practice software",
        detail:
          "Connect PRODA and HPOS to Cliniko, Halaxy, or Power Diary so Medicare claims leave from the correct location.",
      },
      {
        label: "Gap-fee processing",
        detail:
          "Set up EFTPOS or Tyro so clients can pay the gap on the day, including Better Access item numbers.",
      },
    ],
  },
  {
    phase: "Phase 3",
    title: "Insurance, ABN & Compliance",
    summary: "Host clinics will ask for this before you get keys.",
    items: [
      {
        label: "Professional indemnity & public liability",
        detail:
          "Most hosts expect $10M+ professional indemnity plus public liability. Keep certificates of currency ready to send.",
      },
      {
        label: "ABN and structure",
        detail:
          "Get an ABN. Decide sole trader vs Pty Ltd with an accountant before you issue invoices.",
      },
      {
        label: "Consent and privacy",
        detail:
          "Prepare a standard client consent form and privacy policy that covers the Privacy Act 1988 and the Victorian Health Records Act 2001.",
      },
    ],
  },
  {
    phase: "Phase 4",
    title: "Sessional Room Sourcing & Budgeting",
    summary: "Know your break-even before you book the room.",
    items: [
      {
        label: "Break-even client volume",
        detail:
          "Use the AlliedRooms sessional room calculator to see how many clients cover a flat daily rate.",
      },
      {
        label: "Flat hire vs 30% split",
        detail:
          "Core Melbourne day rates of $110–$180 often cost less than a 30% service split once you see a handful of clients.",
      },
      {
        label: "Book without commission",
        detail:
          "List or inquire on AlliedRooms — day rates up front, inquiries go to the host, no booking cut.",
      },
    ],
  },
];

function jsonLd() {
  const url = `${SITE_URL}${PAGE_PATH}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Private Practice Launch Checklist (VIC)",
      description:
        "Step-by-step launch checklist for psychologists, social workers, and allied health clinicians starting private practice in Melbourne, Victoria.",
      url,
      datePublished: DATE_PUBLISHED,
      dateModified: DATE_MODIFIED,
      inLanguage: "en-AU",
      author: {
        "@type": "Organization",
        name: "AlliedRooms",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "AlliedRooms",
        url: SITE_URL,
      },
      about: [
        "AHPRA principal place of practice",
        "Medicare provider numbers",
        "private practice Victoria",
        "sessional consulting rooms Melbourne",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: CHECKLIST_FAQS.map((item) => ({
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

function GuideCheck({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="font-bold text-teal-900">✓</span>
      <span>{children}</span>
    </li>
  );
}

export default function PrivatePracticeLaunchChecklistPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block rounded-full bg-stone-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-700">
                Resources
              </span>
              <span className="text-xs text-stone-400">•</span>
              <time
                dateTime={DATE_MODIFIED_DAY}
                className="text-xs font-medium text-stone-500"
              >
                Updated Nov 2026
              </time>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.1]">
              Private Practice Launch{" "}
              <span className="text-teal-900">Checklist (VIC)</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              A four-phase checklist for psychologists, social workers, OTs, and
              other allied health clinicians leaving public or group practice:
              AHPRA address updates, Medicare provider numbers, insurance, and
              sessional budgeting in Melbourne.
            </p>
          </FadeIn>
        </div>

        <Stagger
          delay={0.24}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {PHASES.map((phase) => (
            <StaggerItem key={phase.phase} className="h-full">
              <section className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  {phase.phase}
                </span>
                <h2 className="mt-2 font-sans text-lg font-black text-stone-900">
                  {phase.title}
                </h2>
                <p className="mt-1 text-sm text-stone-600">{phase.summary}</p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
                  {phase.items.map((item) => (
                    <GuideCheck key={item.label}>
                      <strong className="font-semibold text-stone-800">
                        {item.label}:
                      </strong>{" "}
                      {item.detail}
                    </GuideCheck>
                  ))}
                </ul>
              </section>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeInOnView className="mt-8">
          <aside className="rounded-2xl border border-teal-900/10 bg-teal-50/70 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-900">
              Next step
            </p>
            <h2 className="mt-2 font-sans text-xl font-black text-stone-900 sm:text-2xl">
              Benchmark Your Room Overheads
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
              Run your day rate, session fee, and client volume through the
              sessional room calculator to see break-even sessions and how a
              flat Melbourne hire compares with a 30% clinic split.
            </p>
            <Link
              href="/tools/sessional-room-calculator"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#0f4c45] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-[#0c3d38] active:scale-95"
            >
              Open the room budget calculator
            </Link>
          </aside>
        </FadeInOnView>

        <FadeInOnView className="mt-8">
          <section className="rounded-2xl border border-stone-200 bg-white px-6 pb-6 shadow-sm sm:px-8">
            <h2 className="pt-6 font-sans text-xl font-black text-stone-900">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              AHPRA address updates, Medicare location numbers, and Melbourne
              sessional rates.
            </p>
            <FaqAccordion items={CHECKLIST_FAQS} />
          </section>
        </FadeInOnView>

        <FadeInOnView className="mt-8">
          <aside className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#0f4c45] p-8 text-center text-white sm:flex-row sm:p-10 sm:text-left">
            <div className="max-w-xl">
              <h2 className="font-sans text-2xl font-black tracking-tight sm:text-3xl">
                Browse Melbourne Sessional Rooms
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                Camberwell, South Yarra, Richmond, and more — day rates listed
                up front, zero commission, inquiries go straight to the host.
              </p>
            </div>
            <Link
              href="/rooms"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f4c45] shadow-sm transition-transform hover:bg-stone-100 active:scale-95"
            >
              Browse Melbourne Sessional Rooms
            </Link>
          </aside>
        </FadeInOnView>

        <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-stone-200 bg-stone-100/70 p-4 text-center text-xs leading-relaxed text-stone-500">
          <strong>Disclaimer:</strong> This checklist is general information for
          clinicians considering private practice in Victoria. It is not legal,
          tax, insurance, or Medicare advice. Confirm current AHPRA, Services
          Australia, and insurer requirements before you change location or
          start billing.
        </p>
      </div>
    </main>
  );
}
