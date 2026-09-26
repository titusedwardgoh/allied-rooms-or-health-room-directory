"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import PulseOverlay from "@/components/PulseOverlay";

const PUBLISH_DELAY_MS = 1100;
const PUBLISHED_KEY = "alliedrooms:just-published";

function readJustPublished(slug) {
  try {
    return sessionStorage.getItem(PUBLISHED_KEY) === slug;
  } catch {
    return false;
  }
}

function markJustPublished(slug) {
  try {
    sessionStorage.setItem(PUBLISHED_KEY, slug);
  } catch {
    /* ignore */
  }
}

function clearJustPublished() {
  try {
    sessionStorage.removeItem(PUBLISHED_KEY);
  } catch {
    /* ignore */
  }
}

export default function PublishListingBar({ slug, editHref, isDraft }) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (readJustPublished(slug)) setPublished(true);
  }, [slug]);

  useEffect(() => {
    if (!published) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") closeToListing();
    }
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [published]);

  function publicUrl() {
    return `${window.location.origin}/rooms/${slug}`;
  }

  async function handlePublish() {
    if (isPublishing || published) return;
    setIsPublishing(true);
    setError("");

    try {
      const [response] = await Promise.all([
        fetch("/api/listings/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        }),
        new Promise((resolve) => setTimeout(resolve, PUBLISH_DELAY_MS)),
      ]);
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result?.error) {
        setError(result?.error || "Could not publish this listing. Please try again.");
        return;
      }

      markJustPublished(slug);
      setPublished(true);
    } catch (publishError) {
      console.error("publishListing:", publishError);
      setError("Could not publish this listing. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function copyPublicLink() {
    try {
      await navigator.clipboard.writeText(publicUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (copyError) {
      console.error("copyPublicLink:", copyError);
      setError("Could not copy the link. Please copy it from the address bar.");
    }
  }

  function closeToListing() {
    clearJustPublished();
    setPublished(false);
    router.refresh();
  }

  function closeToHome() {
    clearJustPublished();
    setPublished(false);
    router.push("/");
  }

  const showBanner = isDraft && !published;
  const modal = published ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-success-title"
      onClick={closeToListing}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-xl shadow-stone-900/10 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-900 text-white shadow-lg shadow-teal-900/20 ring-8 ring-teal-900/10"
        >
          <Check className="h-8 w-8" strokeWidth={2.75} aria-hidden="true" />
        </motion.div>

        <h2
          id="publish-success-title"
          className="mt-5 font-sans text-xl font-bold text-stone-900 sm:text-2xl"
        >
          Congratulations! Your listing is now live.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Practitioners across Melbourne can now discover and book your
          consulting room.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={copyPublicLink}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-teal-900" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy Public Link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={closeToListing}
            className="cursor-pointer rounded-full bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-950"
          >
            View Live Listing
          </button>
          <button
            type="button"
            onClick={closeToHome}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-800"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  ) : null;

  return (
    <>
      {showBanner ? (
        <div className="sticky top-16 z-40 bg-amber-300 shadow-md shadow-stone-900/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 2xl:max-w-page">
            <p className="text-base font-medium leading-snug text-stone-900 sm:text-lg">
              <span className="font-extrabold">Draft Preview</span>
              {" — "}
              Your listing is not yet visible, click the button to publish.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={editHref}
                className={`rounded-full border border-stone-900 bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-stone-100 ${
                  isPublishing ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Edit listing
              </a>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex min-w-44 cursor-pointer items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-wait disabled:opacity-80"
              >
                {isPublishing ? "Publishing listing..." : "Publish listing"}
              </button>
            </div>
          </div>
          {error ? (
            <p
              role="alert"
              className="mx-auto max-w-6xl px-6 pb-4 text-sm font-medium text-red-800 sm:px-8 2xl:max-w-page"
            >
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
      {mounted && modal ? createPortal(modal, document.body) : modal}
      {isPublishing ? <PulseOverlay label="Publishing listing" /> : null}
    </>
  );
}
