"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { sendListingInquiry } from "@/app/rooms/inquiry-actions";

const INPUT_CLASS =
  "w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 placeholder-stone-400 outline-none transition focus:border-teal-800 focus:bg-white focus:ring-2 focus:ring-teal-900/10";

const BUTTON_CLASS =
  "mt-4 block w-full cursor-pointer rounded-full bg-teal-900 py-3 text-center text-sm font-semibold text-white transition-transform hover:bg-teal-950 active:scale-95 disabled:opacity-60";

export default function InquireWithClinic({ slug, initialMessage }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: initialMessage,
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const nameRef = useRef(null);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  }

  function revealForm() {
    setError("");
    setOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;

    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!message) {
      setError("Please include a short message.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const result = await sendListingInquiry({
        slug,
        name,
        email,
        phone: values.phone.trim(),
        message,
      });
      if (!result?.ok) {
        setError(result?.error || "Couldn't send right now. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Couldn't send right now. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-900 text-white">
          <Check className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-semibold text-stone-900">Message sent!</p>
        <p className="mt-1 text-xs leading-relaxed text-stone-600">
          The host will reply you directly at {values.email.trim()}. Please check your email for a reply.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={revealForm} className={BUTTON_CLASS}>
        Inquire with Clinic
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
        onAnimationComplete={() => nameRef.current?.focus()}
      >
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Name
            </span>
            <input
              ref={nameRef}
              type="text"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Your name"
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Email
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@clinic.com.au"
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Phone
              <span className="ml-1 font-medium normal-case tracking-normal text-stone-400">
                optional
              </span>
            </span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => update("phone", event.target.value)}
              placeholder="03 9000 0000"
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Message
            </span>
            <textarea
              name="message"
              rows={6}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              className={`${INPUT_CLASS} resize-y`}
            />
          </label>
        </div>
      </motion.div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={sending} className={BUTTON_CLASS}>
        {sending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
