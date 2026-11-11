"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PulseDots from "@/components/PulseDots";

export default function PulseOverlay({ label = "Please wait" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-white/70 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <PulseDots />
      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
        {label}
      </p>
    </div>,
    document.body,
  );
}
