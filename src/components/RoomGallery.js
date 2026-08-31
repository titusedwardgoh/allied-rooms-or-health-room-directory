"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import RoomPlaceholder from "./RoomPlaceholder";

export default function RoomGallery({ images, title, roomType }) {
  const urls = (images || []).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const count = urls.length;
  const hasMany = count > 1;
  const current = urls[Math.min(index, Math.max(count - 1, 0))] || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const go = useCallback(
    (direction) => {
      if (count < 2) return;
      setIndex((currentIndex) => (currentIndex + direction + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!open) return undefined;

    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  function onTouchStart(event) {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  }

  function onTouchEnd(event) {
    if (touchStartX == null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (delta > 40) go(-1);
    if (delta < -40) go(1);
    setTouchStartX(null);
  }

  if (count === 0) {
    return (
      <div className="relative aspect-video max-h-[420px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
        <RoomPlaceholder roomType={roomType} />
      </div>
    );
  }

  const lightbox =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/90 p-4 sm:p-8"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photos`}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Close photos"
            >
              <X className="h-5 w-5" />
            </button>

            {hasMany ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt={`${title} — photo ${index + 1} of ${count}`}
              className="max-h-[88vh] max-w-full object-contain"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />

            {hasMany ? (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-semibold text-white">
                {index + 1} / {count}
              </p>
            ) : null}
          </div>,
          document.body,
        )
      : null;

  return (
    <div>
      <div className="relative aspect-video max-h-[420px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
        <button
          type="button"
          onClick={() => setOpen(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="absolute inset-0 cursor-zoom-in"
          aria-label={`View ${title} photos`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={title}
            className="h-full w-full object-cover object-center"
          />
        </button>

        <span className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-semibold text-white">
          <Expand className="h-3 w-3" />
          {hasMany ? `${index + 1} / ${count}` : "View photo"}
        </span>

        {hasMany ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-1.5 text-stone-800 shadow-sm hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                go(1);
              }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-1.5 text-stone-800 shadow-sm hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {hasMany ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, photoIndex) => (
            <button
              key={url}
              type="button"
              onClick={() => {
                setIndex(photoIndex);
                setOpen(true);
              }}
              className={`h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border ${
                photoIndex === index
                  ? "border-teal-900 ring-2 ring-teal-900/30"
                  : "border-stone-200"
              }`}
              aria-label={`Show photo ${photoIndex + 1}`}
              aria-current={photoIndex === index ? "true" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightbox}
    </div>
  );
}
