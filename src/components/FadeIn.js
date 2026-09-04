"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

function useEnter() {
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

  return entered;
}

export function MotionProvider({ children }) {
  return (
    <MotionConfig reducedMotion="never" transition={{ ease: EASE }}>
      {children}
    </MotionConfig>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
}) {
  const entered = useEnter();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInOnView({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
}) {
  const entered = useEnter();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, delay = 0.08 }) {
  const entered = useEnter();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={entered ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.1, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
