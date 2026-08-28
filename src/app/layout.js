import Link from "next/link";
import { Cormorant, Unbounded } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const cormorant = Cormorant({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-cormorant-face",
});

const unbounded = Unbounded({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-unbounded",
});

export const metadata = {
  title: "AlliedRooms — Sessional allied health rooms",
  description:
    "Find a consulting room by suburb, day, and rate. Peer-to-peer directory for allied health and therapy rooms across Melbourne.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={`${unbounded.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-stone-900 antialiased">
        <SiteHeader />
        {children}
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <p className="font-display text-lg text-stone-900">AlliedRooms</p>
              <p className="mt-1 font-cormorant text-lg text-stone-600">
                Sessional rooms for allied health, listed with the day rate up front.
              </p>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-stone-600">
              <Link href="/rooms" className="hover:text-stone-900">
                Rooms
              </Link>
              <Link href="/list-a-room" className="hover:text-stone-900">
                List a room
              </Link>
              <span>Melbourne · VIC</span>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
