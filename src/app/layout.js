import { Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { MotionProvider } from "@/components/FadeIn";
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
    icon: [
      { url: "/favicon.png?v=3", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={plusJakarta.variable}>
      <body className="min-h-screen bg-paper font-sans text-stone-900 antialiased">
        <MotionProvider>
          <SiteHeader />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
