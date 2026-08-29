"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import {
  AMENITY_LABEL,
  AU_STATES,
  DAY_LABEL,
  ROOM_TYPE_LABEL,
  pricePerDayLabel,
} from "@/lib/format";
import { createRoomListing } from "./actions";

const STEPS = ["Practice", "Room", "Photos & review"];

const INITIAL = {
  practice_name: "",
  contact_email: "",
  phone: "",
  website_url: "",
  title: "",
  suburb: "",
  state: "VIC",
  room_type: "talk_therapy",
  price_per_day: "",
  available_days: [],
  amenities: [],
  description: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-400">
        {label}
      </span>
      {children}
    </label>
  );
}

const MAX_PHOTO_BYTES = 6 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-900 placeholder-stone-400 outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-900/15";

function actionErrorMessage(state) {
  if (!state || typeof state !== "object") return "";
  return typeof state.error === "string" ? state.error : "";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function ListARoomPage() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState(INITIAL);
  const [photos, setPhotos] = useState([]);
  const [stepError, setStepError] = useState("");
  const [state, formAction, pending] = useActionState(createRoomListing, null);
  const fileInputRef = useRef(null);

  const previews = useMemo(
    () => photos.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [photos],
  );

  useEffect(() => {
    return () => {
      previews.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [previews]);

  useEffect(() => {
    if (!fileInputRef.current || typeof DataTransfer === "undefined") return;
    const transfer = new DataTransfer();
    photos.forEach((file) => transfer.items.add(file));
    fileInputRef.current.files = transfer.files;
  }, [photos]);

  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function toggleList(name, key) {
    setValues((current) => {
      const list = current[name];
      return {
        ...current,
        [name]: list.includes(key)
          ? list.filter((item) => item !== key)
          : [...list, key],
      };
    });
  }

  function addFiles(fileList) {
    const incoming = Array.from(fileList || [])
      .filter((file) => file.type.startsWith("image/"))
      .filter((file) => file.size <= MAX_PHOTO_BYTES);

    if (incoming.length === 0 && (fileList?.length ?? 0) > 0) {
      setStepError("Each photo must be an image of 6MB or smaller.");
      return;
    }

    setStepError("");
    setPhotos((current) => [...current, ...incoming].slice(0, 6));
  }

  function validateStep(currentStep) {
    if (currentStep === 1) {
      if (!values.practice_name.trim() || !values.contact_email.trim()) {
        return "Practice name and contact email are required.";
      }
    }
    if (currentStep === 2) {
      if (!values.title.trim() || !values.suburb.trim()) {
        return "Room title and suburb are required.";
      }
      if (!Number(values.price_per_day) || Number(values.price_per_day) <= 0) {
        return "Enter a daily rate greater than $0.";
      }
      if (values.available_days.length === 0) {
        return "Select at least one available day.";
      }
    }
    return "";
  }

  function goNext() {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError("");
    setStep((current) => Math.min(3, current + 1));
    scrollToTop();
  }

  function goBack() {
    setStepError("");
    setStep((current) => Math.max(1, current - 1));
    scrollToTop();
  }

  const actionError = actionErrorMessage(state);

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
          For clinic hosts
        </span>
        <h1 className="mt-2 font-sans text-4xl font-extrabold text-stone-900">
          List a Room
        </h1>
        <p className="mt-2 text-stone-600">
          Three short steps. The day rate is public as soon as you publish.
        </p>

        <ol className="mt-8 grid grid-cols-3 gap-2">
          {STEPS.map((label, index) => {
            const n = index + 1;
            const active = step === n;
            const done = step > n;
            return (
              <li
                key={label}
                className={`rounded-xl border px-3 py-2 text-center text-xs font-semibold ${
                  active
                    ? "border-teal-900 bg-teal-900 text-white"
                    : done
                      ? "border-stone-200 bg-white text-teal-900"
                      : "border-stone-200 bg-white text-stone-400"
                }`}
              >
                {n}. {label}
              </li>
            );
          })}
        </ol>

        <form
          action={formAction}
          noValidate
          onKeyDown={(e) => {
            if (e.key === "Enter" && step < 3 && e.target.tagName === "INPUT") {
              e.preventDefault();
              goNext();
            }
          }}
          className="mt-8 space-y-6"
        >
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <section className={step === 1 ? "space-y-4" : "hidden"}>
            <p className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-500">
              Practice name, email, and phone are shown on the public room page so
              practitioners can enquire directly.
            </p>
            <Field label="Practice name">
              <input
                name="practice_name"
                value={values.practice_name}
                onChange={(e) => update("practice_name", e.target.value)}
                className={inputClass}
                placeholder="Richmond Wellness Collective"
              />
            </Field>
            <Field label="Contact email">
              <input
                type="email"
                name="contact_email"
                value={values.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
                className={inputClass}
                placeholder="hello@clinic.com.au"
              />
            </Field>
            <Field label="Phone number">
              <input
                name="phone"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="03 9000 0000"
              />
            </Field>
            <Field label="Website">
              <input
                name="website_url"
                value={values.website_url}
                onChange={(e) => update("website_url", e.target.value)}
                className={inputClass}
                placeholder="https://"
              />
            </Field>
          </section>

          <section className={step === 2 ? "space-y-4" : "hidden"}>
            <Field label="Room title">
              <input
                name="title"
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
                className={inputClass}
                placeholder="Acoustic psychotherapy suite"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Suburb">
                <input
                  name="suburb"
                  value={values.suburb}
                  onChange={(e) => update("suburb", e.target.value)}
                  className={inputClass}
                  placeholder="Richmond"
                />
              </Field>
              <Field label="State">
                <select
                  name="state"
                  value={values.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputClass}
                >
                  {AU_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Room type">
                <select
                  name="room_type"
                  value={values.room_type}
                  onChange={(e) => update("room_type", e.target.value)}
                  className={inputClass}
                >
                  {Object.entries(ROOM_TYPE_LABEL).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Daily rate (AUD)">
                <input
                  type="number"
                  min="1"
                  step="1"
                  name="price_per_day"
                  value={values.price_per_day}
                  onChange={(e) => update("price_per_day", e.target.value)}
                  className={inputClass}
                  placeholder="130"
                />
              </Field>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                Available days
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(DAY_LABEL).map(([key, label]) => (
                  <label
                    key={key}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      values.available_days.includes(key)
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="available_days"
                      value={key}
                      checked={values.available_days.includes(key)}
                      onChange={() => toggleList("available_days", key)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                Amenities
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(AMENITY_LABEL).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700"
                  >
                    <input
                      type="checkbox"
                      name="amenities"
                      value={key}
                      checked={values.amenities.includes(key)}
                      onChange={() => toggleList("amenities", key)}
                      className="accent-teal-900"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Description">
              <textarea
                name="description"
                rows={4}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                className={inputClass}
                placeholder="Light, acoustic treatment, shared waiting room..."
              />
            </Field>
          </section>

          <section className={step === 3 ? "space-y-5" : "hidden"}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="block cursor-pointer rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-10 text-center transition-colors hover:border-teal-800"
            >
              <p className="text-sm font-semibold text-stone-800">
                Drag photos here, or click to select files
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Up to 6 images, 6MB each. Optional — SVG placeholders are used if you skip this.
              </p>
              <button
                type="button"
                className="mt-4 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                name="photos"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previews.map((photo, index) => (
                  <div
                    key={photo.url}
                    className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotos((current) => current.filter((_, i) => i !== index));
                      }}
                      className="absolute right-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-stone-700 hover:bg-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Review
              </p>
              <h2 className="mt-2 text-xl font-bold text-stone-900">
                {values.title || "Untitled room"}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {values.suburb || "Suburb"}, {values.state} · {values.practice_name || "Practice"}
              </p>
              <p className="mt-3 text-lg font-bold text-stone-900">
                {values.price_per_day
                  ? pricePerDayLabel(Number(values.price_per_day) * 100)
                  : "$— / day"}
              </p>
              <p className="mt-2 text-sm text-stone-600">
                {ROOM_TYPE_LABEL[values.room_type]} ·{" "}
                {values.available_days.map((d) => DAY_LABEL[d]).join(", ") || "No days selected"}
              </p>
            </div>
          </section>

          {(stepError || actionError) && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {stepError || actionError}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1 || pending}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:opacity-40"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                key="continue"
                type="button"
                onClick={goNext}
                className="rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-950"
              >
                Continue
              </button>
            ) : (
              <button
                key="publish"
                type="button"
                disabled={pending}
                onClick={(event) => {
                  event.currentTarget.form?.requestSubmit();
                }}
                className="rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-950 disabled:opacity-60"
              >
                {pending ? "Publishing…" : "Publish listing"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
