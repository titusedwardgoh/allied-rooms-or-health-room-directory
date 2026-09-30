"use client";

import { useEffect, useRef, useState } from "react";

const LINE_CLAMP = "line-clamp-[10]";

export default function ListingDescription({ text }) {
  const description = String(text ?? "").trim();
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    setExpanded(false);
    setNeedsToggle(false);
  }, [description]);

  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return undefined;

    function measure() {
      if (el.scrollHeight > el.clientHeight + 1) {
        setNeedsToggle(true);
      }
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [description, expanded]);

  if (!description) {
    return (
      <p className="mt-3 text-sm leading-relaxed text-stone-500">
        No description yet.
      </p>
    );
  }

  return (
    <>
      <p
        ref={textRef}
        className={`mt-3 min-w-0 whitespace-pre-wrap break-words leading-relaxed text-stone-600 ${
          expanded ? "" : LINE_CLAMP
        }`}
      >
        {description}
      </p>
      {needsToggle ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
          className="mt-4 cursor-pointer rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 active:scale-95"
        >
          {expanded ? "Show less" : "Show full description"}
        </button>
      ) : null}
    </>
  );
}
