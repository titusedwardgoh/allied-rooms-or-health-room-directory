"use client";

import { useState } from "react";
import { captureRoomAlert } from "@/app/locations/actions";
import { FadeInOnView } from "@/components/FadeIn";
import { DAY_LABEL } from "@/lib/format";

export default function LocationAlertCard({ name, slug }) {
  const [email, setEmail] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function toggleDay(key) {
    setErrorMsg("");
    setSelectedDays((current) =>
      current.includes(key)
        ? current.filter((day) => day !== key)
        : [...current, key],
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    formData.set("suburb", slug);
    formData.delete("days");
    selectedDays.forEach((day) => formData.append("days", day));

    const result = await captureRoomAlert(formData);
    setLoading(false);

    if (result?.ok) {
      setEmailed(Boolean(result.emailed));
      setSubmitted(true);
      return;
    }

    setErrorMsg(result?.error || "Could not save your request.");
  }

  return (
    <FadeInOnView delay={0.24} className="mt-12 sm:mt-16">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Location alerts
          </span>
          <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
            Looking for space in {name}?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Join the early-access list for this suburb. Choose preferred days if
            you have them, or leave them blank if any day works.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-teal-900/20 bg-teal-900/5 p-4">
              <p className="text-sm font-semibold text-teal-950">
                You’re on the {name} list
              </p>
              <p className="mt-1 text-xs leading-relaxed text-stone-600">
                {emailed ? (
                  <>
                    We’ve sent a confirmation to <strong>{email}</strong>.
                    You’re on the {name} list.
                  </>
                ) : (
                  <>
                    You’re on the list. We’ll keep <strong>{email}</strong> on
                    file for this suburb.
                  </>
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <p className="mb-2 text-xs font-semibold text-stone-500">
                  Preferred days
                  {selectedDays.length === 0 ? " (any day is fine)" : ""}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {Object.entries(DAY_LABEL).map(([key, label]) => {
                    const active = selectedDays.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleDay(key)}
                        aria-pressed={active}
                        className={`rounded-full cursor-pointer border px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? "border-teal-900 bg-teal-900 text-white"
                            : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-2 sm:flex-row">
                <label htmlFor="room-alert-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="room-alert-email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="clinician@clinic.com.au"
                  autoComplete="email"
                  className="w-full rounded-full border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-teal-900 focus:bg-white focus:ring-2 focus:ring-teal-900/10"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer shrink-0 rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-950 disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Saving…" : "Join the list"}
                </button>
              </div>

              {errorMsg ? (
                <p className="text-xs text-red-600">{errorMsg}</p>
              ) : null}
            </form>
          )}
        </div>
      </section>
    </FadeInOnView>
  );
}
