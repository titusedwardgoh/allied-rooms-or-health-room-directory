"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { CONTACT_EMAIL, CONTACT_TOPICS } from "@/lib/contact";
import { sendContactMessage } from "./actions";

const INPUT_CLASS =
  "w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm font-medium text-stone-900 placeholder-stone-400 outline-none transition focus:border-teal-800 focus:bg-white focus:ring-2 focus:ring-teal-900/10";

const INITIAL = {
  name: "",
  email: "",
  topic: "General enquiry",
  message: "",
};

export default function ContactPage() {
  const [values, setValues] = useState(INITIAL);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError("");
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
      const result = await sendContactMessage({
        name,
        email,
        topic: values.topic,
        message,
      });

      if (!result?.ok) {
        setError(result?.error || `Couldn't send right now. Email us at ${CONTACT_EMAIL}.`);
        return;
      }
      setSent(true);
    } catch {
      setError(`Couldn't send right now. Email us at ${CONTACT_EMAIL}.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <FadeIn>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Contact
          </span>
          <h1 className="mt-2 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Get in touch.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            Questions about listing a room, finding a space, or the directory
            itself? Send a note and we will get back to you.
          </p>
          <p className="mt-3 text-sm text-stone-600">
            Prefer email?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-teal-950 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          {sent ? (
            <div className="rounded-2xl border border-stone-200/80 bg-white p-8 text-center shadow-sm shadow-stone-900/5 sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-900 text-white shadow-lg shadow-teal-900/20 ring-8 ring-teal-900/10">
                <Check className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-6 font-sans text-2xl font-black text-stone-900">
                Message sent
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
                Thanks {values.name.trim().split(" ")[0] || "there"} — we have
                received your note and will reply shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setValues(INITIAL);
                  setSent(false);
                }}
                className="mt-8 rounded-full border cursor-pointer border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm shadow-stone-900/5 sm:p-8"
            >
              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Name
                  </span>
                  <input
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
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
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
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Topic
                  </span>
                  <select
                    name="topic"
                    value={values.topic}
                    onChange={(event) => update("topic", event.target.value)}
                    className={`${INPUT_CLASS} cursor-pointer`}
                  >
                    {CONTACT_TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Message
                  </span>
                  <textarea
                    name="message"
                    rows={6}
                    value={values.message}
                    onChange={(event) => update("message", event.target.value)}
                    placeholder="How can we help?"
                    className={`${INPUT_CLASS} resize-y`}
                  />
                </label>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  {error}
                </p>
              ) : null}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-teal-900 px-5 cursor-pointer py-2.5 text-sm font-semibold text-white transition hover:bg-teal-950 active:scale-95 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          )}
        </FadeIn>
      </div>
    </main>
  );
}
