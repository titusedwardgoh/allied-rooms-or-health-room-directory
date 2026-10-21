"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-4 divide-y divide-stone-200/80 border-t border-stone-200/80">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-base font-semibold text-stone-900 transition-colors hover:text-teal-800"
            >
              <span>{item.question}</span>
              {isOpen ? (
                <Minus
                  className="h-4 w-4 shrink-0 text-stone-400"
                  aria-hidden="true"
                />
              ) : (
                <Plus
                  className="h-4 w-4 shrink-0 text-stone-400"
                  aria-hidden="true"
                />
              )}
            </button>
            {isOpen ? (
              <p className="pb-4 text-sm leading-relaxed text-stone-600">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
