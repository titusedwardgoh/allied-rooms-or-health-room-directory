"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const dotVariants = {
  pulse: {
    scale: [1, 1.5, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

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
      <motion.div
        className="flex items-center justify-center gap-5"
        animate="pulse"
        transition={{ staggerChildren: 0.2, staggerDirection: -1 }}
      >
        <motion.div
          className="size-5 rounded-full bg-teal-900 will-change-transform"
          variants={dotVariants}
        />
        <motion.div
          className="size-5 rounded-full bg-teal-900 will-change-transform"
          variants={dotVariants}
        />
        <motion.div
          className="size-5 rounded-full bg-teal-900 will-change-transform"
          variants={dotVariants}
        />
      </motion.div>
      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
        {label}
      </p>
    </div>,
    document.body,
  );
}
