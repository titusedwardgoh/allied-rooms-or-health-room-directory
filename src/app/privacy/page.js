import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = {
  title: "Privacy Policy — AlliedRooms",
  description: "How AlliedRooms handles contact details and listing information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <FadeIn>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Legal
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-stone-500">Last updated 2026</p>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-stone-600 sm:text-base">
            <p>
              AlliedRooms is a Melbourne directory for sessional allied health
              rooms. We collect the details you choose to share when you list a
              room or send a contact message.
            </p>
            <p>
              Contact form submissions are emailed to us so we can reply. Listing
              details you publish — such as practice name, suburb, rate, and
              photos — appear on the public directory. Host contact details are
              used so practitioners can enquire directly.
            </p>
            <p>
              We do not sell your information. If you want a listing or message
              removed, email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-teal-950 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p>
              <Link href="/contact" className="font-semibold text-teal-950 hover:underline">
                Contact us
              </Link>{" "}
              with any privacy questions.
            </p>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
