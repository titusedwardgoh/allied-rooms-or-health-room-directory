import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";
import { CONTACT_EMAIL } from "@/lib/contact";

function MailLink() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="font-semibold text-teal-950 hover:underline"
    >
      {CONTACT_EMAIL}
    </a>
  );
}

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "How AlliedRooms works for Melbourne practitioners hiring sessional rooms and clinics listing spare consulting space.",
};

const PRACTITIONERS = [
  {
    question: "How do I know these listings are from real clinics?",
    answer:
      "Every listing on AlliedRooms is manually reviewed and vetted before going live. We only feature active, established healthcare, medical, and wellness practices across Melbourne with verified clinic addresses.",
  },
  {
    question: "How do I book or inspect a room?",
    answer:
      "Submit an inquiry directly through the listing page. Your message goes straight to the practice owner, who will follow up with you to discuss availability, arrange a walkthrough, or finalise a sessional agreement.",
  },
  {
    question: "Can I inspect the room before committing?",
    answer:
      "Yes. Sending an inquiry connects you directly with the clinic owner so you can schedule a walkthrough, discuss sessional availability, and review the space in person.",
  },
  {
    question: "Are there any hidden booking fees or commission cuts?",
    answer:
      "No. AlliedRooms takes zero commission on rental arrangements. Pricing on the site is the day rate the host listed, and payment is arranged directly between you and the practice.",
  },
  {
    question: "Are there long-term leases or lock-in contracts?",
    answer:
      "No. AlliedRooms focuses on sessional and flexible room hire — for example specific days per week — set directly between you and the host clinic. We are a directory, not a leasing agent.",
  },
  {
    question: "What equipment and amenities are included in the daily rate?",
    answer:
      "Each listing outlines the clinical amenities for that room — such as Wi-Fi, treatment tables, waiting areas, kitchen facilities, or HICAPS terminals. Confirm access to specific equipment when you speak with the host.",
  },
  {
    question: "Do I need my own professional indemnity insurance?",
    answer:
      "Yes. Host clinics will almost always require proof of your own professional indemnity and public liability insurance, and relevant registration (for example AHPRA), before you begin practising in their space.",
  },
  {
    question: "What if I can't find a room in my preferred Melbourne suburb?",
    answer:
      "We are expanding across Melbourne weekly. If your target suburb — for example Richmond, South Yarra, or Hawthorn — does not have a suite listed yet, reach out via our contact form and we will notify you when space opens up.",
  },
];

const HOSTS = [
  {
    question: "Who can list a room on AlliedRooms?",
    answer:
      "Any established healthcare, medical, or wellness practice in Melbourne with spare consulting suites, treatment rooms, or allied health spaces available for sessional hire.",
  },
  {
    question: "How much does it cost to list a room?",
    answer:
      "Listing your room on AlliedRooms is currently free while we are in early access.",
  },
  {
    question: "How do I receive practitioner inquiries?",
    answer:
      "When a practitioner submits an inquiry on your listing, we send their details and message directly to your nominated email address so you can coordinate with them.",
  },
  {
    question: "How do I edit or update my room listing?",
    answer: (
      <>
        Since AlliedRooms is currently in early access, listings are managed
        directly by our team to save you setup time. To update your pricing,
        available days, photos, or description, email <MailLink /> (or reply to
        your listing confirmation email) with your listing link and requested
        changes. Updates are typically processed within 24 hours.
      </>
    ),
  },
  {
    question: "How do I remove or pause my listing if my room is filled?",
    answer: (
      <>
        If your consulting suite has been hired or is no longer available, email{" "}
        <MailLink /> with your practice name or listing link. We will unpublish
        your room so you stop receiving practitioner inquiries.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            FAQ
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            How the directory works if you are looking for a sessional room, or
            listing unused clinic space in Melbourne.
          </p>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <FadeInOnView className="h-full">
            <section className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white px-6 pb-6 shadow-sm sm:px-8">
              <h2 className="pt-6 font-sans text-xl font-black text-stone-900">
                For practitioners
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Hiring a consulting room by the day.
              </p>
              <FaqAccordion items={PRACTITIONERS} />
            </section>
          </FadeInOnView>

          <FadeInOnView className="h-full">
            <section className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white px-6 pb-6 shadow-sm sm:px-8">
              <h2 className="pt-6 font-sans text-xl font-black text-stone-900">
                For clinic hosts
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Listing spare rooms on the directory.
              </p>
              <FaqAccordion items={HOSTS} />
            </section>
          </FadeInOnView>
        </div>

        <FadeInOnView className="mt-12 text-center text-sm text-stone-600">
          <p className="leading-relaxed">
            Still have a question?{" "}
            <Link
              href="/contact"
              className="font-semibold text-teal-950 hover:underline"
            >
              Get in touch
            </Link>
            {" "}
            or{" "}
            <Link
              href="/rooms"
              className="font-semibold text-teal-950 hover:underline"
            >
              browse rooms
            </Link>
            .
          </p>
        </FadeInOnView>
      </div>
    </main>
  );
}
