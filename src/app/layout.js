import { Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { MotionProvider } from "@/components/FadeIn";
import { ListingFlowProvider } from "@/components/ListingFlow";
import { SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AlliedRooms — Sessional allied health rooms",
    template: "%s | AlliedRooms",
  },
  description:
    "Find a consulting room by suburb, day, and rate. Peer-to-peer directory for allied health and therapy rooms across Melbourne.",
  openGraph: {
    title: "AlliedRooms — Sessional allied health rooms",
    description:
      "Find a consulting room by suburb, day, and rate across Melbourne.",
    siteName: "AlliedRooms",
    locale: "en_AU",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon.png?v=3", type: "image/png", sizes: "32x32" }],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={plusJakarta.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(location.pathname!=="/rooms"||!location.search)return;var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload")location.replace(location.pathname);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-paper font-sans text-stone-900 antialiased">
        <MotionProvider>
          <ListingFlowProvider>
            <SiteHeader />
            {children}
            <Footer />
          </ListingFlowProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
