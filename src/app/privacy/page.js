import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/FadeIn";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How AlliedRooms collects, uses, and stores personal information under the Australian Privacy Principles.",
};

const SECTIONS = [
  {
    title: "Who we are",
    body: [
      "AlliedRooms (alliedrooms.com.au) is a Melbourne directory for sessional allied health and clinical rooms. We help practitioners find rooms by the day, and help clinics list unused consulting space.",
      "This policy explains how we handle personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). We are based in Victoria, Australia.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "We only collect details you choose to give us, or that are needed to run the directory.",
    ],
    bullets: [
      "Contact form: name, email address, topic, and message.",
      "Room listing: practice name, contact email, phone (optional), website, room title, address, suburb, rate, availability, amenities, description, and photos.",
      "Listing enquiries: name, email, phone (optional), message, and the listing you enquired about.",
      "Incomplete listings: if you start List a Room and continue past the first steps, we may keep the practice details you entered so we can follow up.",
    ],
  },
  {
    title: "Contact form and enquiries",
    body: [
      "Messages sent through the contact form or a listing enquiry are emailed to us (and, for listing enquiries, to the host) using Resend. We also store a copy in our database so we can reply and keep a record of the request.",
      "We use this information only to respond to you, to pass a listing enquiry to the relevant host, and to operate the directory. We do not sell it.",
    ],
  },
  {
    title: "Listings on the directory",
    body: [
      "When you publish a listing, details such as practice name, suburb, day rate, description, photos, and host contact details are shown on the public directory. That is how practitioners reach the clinic directly.",
      "Draft (unpublished) listings are not shown in search. Photos are stored so they can appear on your listing once it is live.",
    ],
  },
  {
    title: "How we store and process data",
    body: [
      "The site is hosted on Vercel. Listing, profile, enquiry, and photo data are stored with Supabase. Emails are sent with Resend. Address autocomplete on List a Room uses Google Maps / Places.",
      "These providers may process data on servers outside Australia, including in the United States. We use them only to operate AlliedRooms.",
    ],
  },
  {
    title: "Analytics",
    body: [
      "We use Vercel Analytics to understand how the site is used (for example, page views). This is aggregated usage data, not a marketing profile, and we do not use it to sell advertising.",
    ],
  },
  {
    title: "How long we keep information",
    body: [
      "Published listings stay until you ask us to take them down or we remove them. Enquiry and contact records are kept as long as needed to handle the request and run the service. You can ask us to delete or correct your information at any time.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Under the Australian Privacy Principles you can ask us to access, correct, or delete personal information we hold about you, or to explain how we have used it. Email us at the address below. If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC).",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Legal
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            How AlliedRooms handles personal information for the Melbourne
            sessional room directory.
          </p>
          <p className="mt-2 text-sm text-stone-500">Last updated 22 October 2026</p>
        </FadeIn>

        <FadeInOnView className="mx-auto mt-10 max-w-3xl">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="space-y-8">
              {SECTIONS.map((section) => (
                <section key={section.title}>
                  <h2 className="font-sans text-xl font-black text-stone-900">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-base leading-relaxed text-stone-600">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul className="list-disc space-y-2 pl-5">
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}

              <section>
                <h2 className="font-sans text-xl font-black text-stone-900">
                  Contact
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone-600">
                  Privacy questions, access requests, or takedown requests:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-semibold text-teal-950 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  {" "}
                  or use our{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-teal-950 hover:underline"
                  >
                    contact form
                  </Link>
                  . See also our{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-teal-950 hover:underline"
                  >
                    Terms of Service
                  </Link>
                  .
                </p>
              </section>
            </div>
          </article>
        </FadeInOnView>
      </div>
    </main>
  );
}
