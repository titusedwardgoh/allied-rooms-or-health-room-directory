import Link from "next/link";
import Logo from "@/components/Logo";
import { FadeInOnView } from "@/components/FadeIn";

const SUPPORT_EMAIL = "alliedrooms@gmail.com";

const LINK_CLASS =
  "text-sm text-stone-600 transition-colors hover:text-teal-900";

const MARKETPLACE = [
  { href: "/rooms", label: "Find a Room" },
  { href: "/list-a-room", label: "List a Room" },
];

const COMPANY = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="flex h-9 items-center text-xs font-bold uppercase leading-none tracking-wider text-stone-400">
        {title}
      </h2>
      <ul className="m-0 list-none space-y-2.5 p-0">{children}</ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-50/80">
      <FadeInOnView className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-14 2xl:max-w-page">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm shrink-0">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Sessional rooms for allied health. Listed with the day rate up
              front — no long leases, no broker fees.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Melbourne, VIC
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-8 sm:flex sm:gap-12"
          >
            <FooterColumn title="Marketplace">
              {MARKETPLACE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Company">
              {COMPANY.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Support">
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className={LINK_CLASS}>
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </FooterColumn>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-stone-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">© 2026 AlliedRooms</p>
          <div className="flex gap-4 text-xs text-stone-500">
            <Link href="/privacy" className="transition-colors hover:text-teal-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-teal-900">
              Terms
            </Link>
          </div>
        </div>
      </FadeInOnView>
    </footer>
  );
}
