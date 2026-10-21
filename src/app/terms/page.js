import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/FadeIn";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of use for the AlliedRooms Melbourne clinical room directory.",
};

const SECTIONS = [
  {
    title: "About these terms",
    body: [
      "These terms govern your use of AlliedRooms (alliedrooms.com.au), a peer-to-peer directory of sessional allied health and clinical rooms in Melbourne.",
      "By using the site, listing a room, or sending an enquiry, you agree to these terms. If you do not agree, do not use the directory.",
    ],
  },
  {
    title: "What AlliedRooms is — and is not",
    body: [
      "AlliedRooms publishes listings so practitioners and clinic hosts can find each other. We are a directory, not a booking, payment, tenancy, or leasing service.",
      "We are not a real estate agent, property manager, or party to any hire, licence, or lease. We do not collect rent, hold bonds, or confirm that a room is clinically suitable, insured, or compliant for a particular modality.",
    ],
  },
  {
    title: "Directory disclaimer",
    body: [
      "Listings are supplied by hosts. We do not inspect rooms, verify AHPRA registration, check occupancy rights, or guarantee that rates, amenities, photos, or availability are accurate or up to date.",
      "Search results and suburb information are provided as a guide only. You should confirm all details directly with the host before relying on a listing.",
    ],
  },
  {
    title: "Host content and responsibility",
    body: [
      "If you list a room, you are responsible for the accuracy of your listing: title, address, photos, rate, availability, amenities, and contact details. You must have the right to offer the space and to use any photos or text you upload.",
      "You grant AlliedRooms a licence to display that content on the directory, in search results, and in related emails. We may edit, refuse, or remove a listing that is incomplete, misleading, spam, or unrelated to sessional clinical space.",
    ],
  },
  {
    title: "Enquiries",
    body: [
      "Enquiries on a listing are passed to the host using the contact details they provided. Sending an enquiry does not reserve a room, create a booking, or form a contract with AlliedRooms.",
    ],
  },
  {
    title: "Hire arrangements are independent of AlliedRooms",
    body: [
      "Any agreement to use a room — including dates, keys, insurance, clinical standards, payment, cancellation, and access — is solely between the practitioner and the host. AlliedRooms is not a party to that arrangement and does not mediate disputes.",
      "Using the directory does not create a lease, tenancy, partnership, employment, or agency relationship with us.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Do not use the site to submit false details, scrape listings, interfere with the service, or list spaces that are not genuine sessional clinical rooms. We may suspend access or remove content where we reasonably believe these terms have been breached.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the extent permitted by law, AlliedRooms provides the directory as-is. We are not liable for loss arising from a listing, an enquiry, a hire arrangement, host or practitioner conduct, room condition, or downtime of the site.",
      "Nothing in these terms excludes, restricts, or modifies any right or guarantee you have under the Australian Consumer Law that cannot be excluded.",
    ],
  },
  {
    title: "Changes and governing law",
    body: [
      "We may update these terms from time to time. The updated terms apply once published on this page. These terms are governed by the laws of Victoria, Australia, and the courts of Victoria have jurisdiction.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <FadeIn>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Legal
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            Terms of use for the AlliedRooms Melbourne clinical room directory.
          </p>
          <p className="mt-2 text-sm text-stone-500">Last updated 22 October 2026</p>
        </FadeIn>

        <FadeInOnView className="mt-10">
          <article className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm shadow-stone-900/5 sm:p-10">
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
                  </div>
                </section>
              ))}

              <section>
                <h2 className="font-sans text-xl font-black text-stone-900">
                  Contact
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone-600">
                  Questions about these terms:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-semibold text-teal-950 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  {" "}
                  or{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-teal-950 hover:underline"
                  >
                    get in touch
                  </Link>
                  . See also our{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-teal-950 hover:underline"
                  >
                    Privacy Policy
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
