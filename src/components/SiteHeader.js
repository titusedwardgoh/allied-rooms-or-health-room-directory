"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";

const PAGE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const MENU_LINKS = [
  { href: "/rooms", label: "Find a Room" },
  { href: "/list-a-room", label: "List a Room" },
  ...PAGE_LINKS,
];

function pageLinkClass(active) {
  return `rounded-full px-3 py-1.5 text-sm font-semibold transition ${
    active
      ? "bg-stone-200/70 text-stone-900"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
  }`;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [entered, setEntered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    function onResize() {
      if (window.matchMedia("(min-width: 640px)").matches) setMenuOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
          <div className="flex min-w-0 items-center gap-5 sm:gap-7">
            <Logo priority wordmarkClassName="hidden sm:inline" />
            <nav className="hidden items-center gap-1 sm:flex" aria-label="About and contact">
              {PAGE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pageLinkClass(pathname === link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/rooms"
              className="rounded-full border border-stone-900 bg-white px-4 py-2 text-xs font-semibold text-stone-900 transition-all hover:bg-stone-100 active:scale-95"
            >
              <span className="sm:hidden">Find</span>
              <span className="hidden sm:inline">Find a Room</span>
            </Link>
            <Link
              href="/list-a-room"
              className="rounded-full border border-stone-900 bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-50 shadow-sm transition-all hover:bg-stone-800 active:scale-95"
            >
              <span className="sm:hidden">List</span>
              <span className="hidden sm:inline">List a Room</span>
            </Link>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center sm:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <div className="space-y-1.5">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-6 bg-stone-900 transition-all duration-300"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-0.5 w-6 bg-stone-900 transition-all duration-300"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-6 bg-stone-900 transition-all duration-300"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed top-16 right-0 bottom-0 left-0 z-[60] bg-stone-900/40 sm:hidden"
            />
            <motion.div
              key="mobile-menu-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-16 right-0 bottom-0 z-[70] w-[min(20rem,85vw)] border-l border-stone-200/80 bg-stone-50 shadow-xl sm:hidden"
            >
              <nav aria-label="Mobile" className="flex h-full flex-col pt-4">
                <ul>
                  {MENU_LINKS.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={`block border-b border-stone-200 px-6 py-4 text-base font-semibold transition ${
                            active
                              ? "bg-stone-200/70 text-stone-900"
                              : "text-stone-800 hover:bg-stone-100"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
