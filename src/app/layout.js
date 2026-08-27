import { Cormorant, Unbounded } from "next/font/google";
import "./globals.css";

const cormorantFont = Cormorant({
  display: "swap",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  display: "swap",
  subsets: ["latin"],
});


export const metadata = {
  title: "Next Boiler",
  description: "Change description",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="corporate">
      <body
        className={cormorantFont.className}
      >
        {children}
        <footer className="">
          <div className = "bg-accent text-base-100">Footer goes here</div>
        </footer>
      </body>
    </html>
  );
}
