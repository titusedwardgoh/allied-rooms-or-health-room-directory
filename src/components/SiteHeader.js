"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function SiteHeader() {
  const [entered, setEntered] = useState(false);

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

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Logo priority wordmarkClassName="hidden sm:inline" />

        <nav className="flex items-center gap-2 sm:gap-3">
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
        </nav>
      </div>
    </motion.header>
  );
}
