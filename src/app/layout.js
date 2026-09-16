import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import Logo from "@/components/Logo";
import SiteHeader from "@/components/SiteHeader";
import { FadeInOnView, MotionProvider } from "@/components/FadeIn";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "AlliedRooms — Sessional allied health rooms",
  description:
    "Find a consulting room by suburb, day, and rate. Peer-to-peer directory for allied health and therapy rooms across Melbourne.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/apple-icon",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={plusJakarta.variable}>
      <body className="min-h-screen bg-paper font-sans text-stone-900 antialiased">
        <MotionProvider>
          <SiteHeader />
          {children}
          <footer className="border-t border-stone-200 bg-white">
            <FadeInOnView className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <Logo />
                <p className="mt-1 text-stone-600">
                  Sessional rooms for allied health, listed with the day rate up
                  front.
                </p>
              </div>
              <nav className="flex flex-wrap gap-4 text-sm text-stone-600">
                <Link href="/rooms" className="hover:text-stone-900">
                  Find a Room
                </Link>
                <Link href="/list-a-room" className="hover:text-stone-900">
                  List a Room
                </Link>
                <span>Melbourne · VIC</span>
              </nav>
            </FadeInOnView>
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}
