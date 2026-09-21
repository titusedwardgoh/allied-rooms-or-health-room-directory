import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Terms — AlliedRooms",
  description:
    "Terms of use for the AlliedRooms sessional room directory.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <FadeIn>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Legal
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900">
            Terms
          </h1>
          <p className="mt-2 text-sm text-stone-500">Last updated 2026</p>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-stone-600 sm:text-base">
            <p>
              AlliedRooms is a peer-to-peer directory. We publish room listings
              with a public day rate so practitioners and hosts can find each
              other. We are not a booking, payment, or leasing agent.
            </p>
            <p>
              Hosts are responsible for the accuracy of their listings, including
              availability, amenities, and rates. Enquiries and any hire
              arrangement are between the practitioner and the host.
            </p>
            <p>
              We may remove listings that are incomplete, misleading, or
              unrelated to sessional allied health rooms. Using the directory
              does not create a lease, tenancy, or employment relationship with
              AlliedRooms.
            </p>
            <p>
              Questions?{" "}
              <Link href="/contact" className="font-semibold text-teal-950 hover:underline">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
