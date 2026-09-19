"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LEAVE_MESSAGE =
  "You haven’t published this listing. If you leave now, your room details will be lost.";

export function listingHasProgress(values, photos, step) {
  if (step > 1 || photos.length > 0) return true;
  if (values.available_days.length > 0 || values.amenities.length > 0) {
    return true;
  }
  if (values.state !== "VIC" || values.room_type !== "talk_therapy") {
    return true;
  }
  return [
    values.practice_name,
    values.contact_email,
    values.phone,
    values.website_url,
    values.title,
    values.address_line,
    values.suburb,
    values.price_per_day,
    values.description,
    values.amenities_other,
    values.room_type_other,
  ].some((field) => String(field ?? "").trim().length > 0);
}

export function useLeaveListingGuard({ active, allowLeaveRef }) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState("");

  useEffect(() => {
    if (!active) return undefined;

    const onBeforeUnload = (event) => {
      if (allowLeaveRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [active, allowLeaveRef]);

  useEffect(() => {
    if (!active) return undefined;

    const onClick = (event) => {
      if (allowLeaveRef.current || event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      let url;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === "/list-a-room") return;

      event.preventDefault();
      event.stopPropagation();
      setPendingHref(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [active, allowLeaveRef]);

  return {
    pendingHref,
    stay() {
      setPendingHref("");
    },
    leave() {
      allowLeaveRef.current = true;
      const href = pendingHref;
      setPendingHref("");
      router.push(href);
    },
  };
}

export function LeaveListingModal({ open, onStay, onLeave }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-listing-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/10">
        <h2
          id="leave-listing-title"
          className="font-sans text-xl font-bold text-stone-900"
        >
          Leave this listing?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {LEAVE_MESSAGE}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onStay}
            className="rounded-full cursor-pointer border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-full cursor-pointer bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
