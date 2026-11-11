"use client";

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

export default function PulseDots() {
  return (
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
  );
}
