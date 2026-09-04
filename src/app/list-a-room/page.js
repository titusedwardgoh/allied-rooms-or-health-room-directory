"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AMENITY_LABEL,
  AU_STATES,
  CUSTOM_AMENITY_PREFIX,
  DAY_LABEL,
  MAX_CUSTOM_AMENITY_CHARS,
  MIN_CUSTOM_AMENITY_CHARS,
  ROOM_TYPE_LABEL,
  amenityLabel,
  customAmenityError,
  normalizeCustomAmenity,
  pricePerDayLabel,
  visibleAmenities,
} from "@/lib/format";
import { captureListingLead, createRoomListing } from "./actions";
import {
  MAX_PRICE_PER_DAY_DOLLARS,
  dailyRateError,
  practiceDetailsError,
} from "@/lib/validate";
import PhotoCropModal from "@/components/PhotoCropModal";
import RoomPlaceholder from "@/components/RoomPlaceholder";
import { fileToDataUrl, ensurePhotoFile } from "@/lib/cropImage";
import { FadeIn } from "@/components/FadeIn";

const STEPS = ["Practice", "Room", "Photos & review"];
const TOTAL_STEPS = 3;

function parseStepParam(value) {
  const step = Number(value);
  if (step === 2 || step === 3) return step;
  return 1;
}

function stepHref(pathname, step) {
  if (step <= 1) return pathname;
  return `${pathname}?step=${step}`;
}

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
  amenities_other: "",
  description: "",
};

function Field({ label, required, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
        {label}
        {required ? (
          <span className="font-semibold normal-case tracking-normal text-teal-900">
            Required
          </span>
        ) : null}
        {optional ? (
          <span className="font-medium normal-case tracking-normal text-stone-400">
            Optional
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function FormError({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
    >
      {message}
    </p>
  );
}

const MAX_PHOTO_BYTES = 6 * 1024 * 1024;
const MIN_PHOTO_WIDTH = 800;
const MIN_PHOTO_HEIGHT = 500;
const PHOTO_REQUIRED_ERROR = "Upload at least one photo.";

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-900 placeholder-stone-400 outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-900/15";

const selectClass = `${inputClass} cursor-pointer`;

function actionErrorMessage(state) {
  if (!state || typeof state !== "object") return "";
  return typeof state.error === "string" ? state.error : "";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateImageDimensions(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width < MIN_PHOTO_WIDTH || img.height < MIN_PHOTO_HEIGHT) {
        resolve({
          valid: false,
          error: `"${file.name}" is too low resolution (${img.width}×${img.height}px). Photos must be at least ${MIN_PHOTO_WIDTH}×${MIN_PHOTO_HEIGHT}px.`,
        });
      } else {
        resolve({ valid: true });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: `Could not read image "${file.name}".`,
      });
    };
    img.src = url;
  });
}

function reorderPhotos(list, indexToPromote) {
  if (indexToPromote === 0) return list;
  const target = list[indexToPromote];
  return [target, ...list.filter((_, i) => i !== indexToPromote)];
}

function previewAmenityItems(amenities, amenitiesOther) {
  const items = [...amenities];
  const custom = normalizeCustomAmenity(amenitiesOther);
  if (items.includes("other") && custom) {
    items.push(`${CUSTOM_AMENITY_PREFIX}${custom}`);
  }
  return visibleAmenities(items);
}

export default function ListARoomPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [values, setValues] = useState(INITIAL);
  const [photos, setPhotos] = useState([]);
  const [originals, setOriginals] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [stepError, setStepError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [state, formAction, pending] = useActionState(createRoomListing, null);
  const [advancing, setAdvancing] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  function syncPhotosToInput(nextPhotos) {
    if (!fileInputRef.current || typeof DataTransfer === "undefined") return;
    const transfer = new DataTransfer();
    nextPhotos.forEach((item) => {
      const file = ensurePhotoFile(item);
      if (file) transfer.items.add(file);
    });
    fileInputRef.current.files = transfer.files;
  }

  useEffect(() => {
    syncPhotosToInput(photos);
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

  async function addFiles(fileList) {
    const rawIncoming = Array.from(fileList || []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (rawIncoming.length === 0 && (fileList?.length ?? 0) > 0) {
      setPhotoError("Only image files are accepted.");
      syncPhotosToInput(photos);
      return;
    }

    const sizeValid = rawIncoming.filter((file) => file.size <= MAX_PHOTO_BYTES);
    if (sizeValid.length < rawIncoming.length) {
      setPhotoError("Each photo must be 6MB or smaller.");
      syncPhotosToInput(photos);
      return;
    }

    const checkedFiles = [];
    for (const file of sizeValid) {
      const result = await validateImageDimensions(file);
      if (!result.valid) {
        setPhotoError(result.error);
        syncPhotosToInput(photos);
        return;
      }
      checkedFiles.push(file);
    }

    setPhotoError("");
    const remaining = 6 - photos.length;
    const accepted = checkedFiles.slice(0, remaining);
    if (accepted.length > 0) setStepError("");
    const urls = await Promise.all(accepted.map((file) => fileToDataUrl(file)));
    setPhotos((current) => [...current, ...accepted]);
    setOriginals((current) => [...current, ...accepted]);
    setPreviewUrls((current) => [...current, ...urls]);
  }

  function makeCoverPhoto(indexToPromote) {
    setPhotos((current) => reorderPhotos(current, indexToPromote));
    setOriginals((current) => reorderPhotos(current, indexToPromote));
    setPreviewUrls((current) => reorderPhotos(current, indexToPromote));
  }

  function removePhoto(index) {
    setPhotos((current) => current.filter((_, i) => i !== index));
    setOriginals((current) => current.filter((_, i) => i !== index));
    setPreviewUrls((current) => current.filter((_, i) => i !== index));
  }

  function validateStep(currentStep) {
    if (currentStep === 1) {
      return practiceDetailsError({
        practiceName: values.practice_name,
        contactEmail: values.contact_email,
        phone: values.phone,
        websiteUrl: values.website_url,
      });
    }
    if (currentStep === 2) {
      if (!values.title.trim() || values.title.trim().length < 8) {
        return "Room title must be at least 8 characters long.";
      }
      if (!values.suburb.trim()) {
        return "Suburb is required.";
      }
      const rateError = dailyRateError(values.price_per_day);
      if (rateError) return rateError;
      if (values.available_days.length === 0) {
        return "Select at least one available day.";
      }
      const otherError = customAmenityError(values.amenities_other, {
        required: values.amenities.includes("other"),
      });
      if (otherError) return otherError;
      if (!values.description.trim() || values.description.trim().length < 30) {
        return "Description must be at least 30 characters long.";
      }
      if (values.description.trim().length > 1500) {
        return "Description must be 1500 characters or fewer.";
      }
    }
    if (currentStep === 3) {
      if (photos.length === 0) {
        return PHOTO_REQUIRED_ERROR;
      }
    }
    return "";
  }

  const requestedStep = parseStepParam(searchParams.get("step"));
  const maxAllowedStep = validateStep(1)
    ? 1
    : validateStep(2)
      ? 2
      : TOTAL_STEPS;
  const step = Math.min(requestedStep, maxAllowedStep);

  useEffect(() => {
    if (requestedStep === step) return;
    router.replace(stepHref(pathname, step), { scroll: false });
  }, [pathname, requestedStep, router, step]);

  const prevStepRef = useRef(step);
  useEffect(() => {
    if (prevStepRef.current === step) return;
    prevStepRef.current = step;
    setStepError("");
    scrollToTop();
  }, [step]);

  async function goNext() {
    if (advancing || pending) return;
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError("");

    if (step === 1 || step === 2) {
      setAdvancing(true);
      const leadData = new FormData();
      leadData.set("practice_name", values.practice_name);
      leadData.set("contact_email", values.contact_email);
      leadData.set("phone", values.phone);
      leadData.set("website_url", values.website_url);
      leadData.set("last_step", String(Math.min(TOTAL_STEPS, step + 1)));
      leadData.set("company", formRef.current?.elements?.company?.value ?? "");
      try {
        await captureListingLead(leadData);
      } catch (leadError) {
        console.error("captureListingLead:", leadError);
      } finally {
        setAdvancing(false);
      }
    }

    router.push(stepHref(pathname, Math.min(TOTAL_STEPS, step + 1)), {
      scroll: false,
    });
  }

  function goBack() {
    if (step <= 1) return;
    setStepError("");
    router.back();
  }

  const actionError = actionErrorMessage(state);
  const reviewAmenities = previewAmenityItems(
    values.amenities,
    values.amenities_other,
  );

  return (
    <main className="min-h-screen bg-stone-50">
      <FadeIn className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
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
          ref={formRef}
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
              Practice name, email, and phone are shown on the listing page so
              practitioners can enquire directly.
            </p>
            <Field label="Practice name" required>
              <input
                name="practice_name"
                value={values.practice_name}
                onChange={(e) => update("practice_name", e.target.value)}
                className={inputClass}
                placeholder="Richmond Wellness Collective"
              />
              <span className="mt-1 block text-xs text-stone-400">
                At least 4 characters.
              </span>
            </Field>
            <Field label="Contact email" required>
              <input
                type="email"
                name="contact_email"
                value={values.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
                className={inputClass}
                placeholder="hello@clinic.com.au"
              />
              <span className="mt-1 block text-xs text-stone-400">
                We may follow up if you start a listing and don’t finish.
              </span>
            </Field>
            <Field label="Phone number" required>
              <input
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="03 9000 0000"
              />
              <span className="mt-1 block text-xs text-stone-400">
                10 digits, starting with 02, 03, 04, 07 or 08.
              </span>
            </Field>
            <Field label="Website" optional>
              <input
                name="website_url"
                inputMode="url"
                autoComplete="url"
                value={values.website_url}
                onChange={(e) => update("website_url", e.target.value)}
                className={inputClass}
                placeholder="https://clinic.com.au"
              />
              <span className="mt-1 block text-xs text-stone-400">
                Leave blank if you do not have a website.
              </span>
            </Field>
          </section>

          <section className={step === 2 ? "space-y-4" : "hidden"}>
            <Field label="Room title" required>
              <input
                name="title"
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
                className={inputClass}
                placeholder="Acoustic psychotherapy suite"
                minLength={8}
              />
              <span className="mt-1 block text-xs text-stone-400">
                At least 8 characters ({values.title.length}/8).
              </span>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Suburb" required>
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
                  className={selectClass}
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
                  className={selectClass}
                >
                  {Object.entries(ROOM_TYPE_LABEL).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Daily rate (AUD)" required>
                <input
                  type="number"
                  min="1"
                  max={MAX_PRICE_PER_DAY_DOLLARS}
                  step="1"
                  name="price_per_day"
                  value={values.price_per_day}
                  onChange={(e) => update("price_per_day", e.target.value)}
                  className={inputClass}
                  placeholder="130"
                />
                <span className="mt-1 block text-xs text-stone-400">
                  Whole dollars, up to $2,000 / day.
                </span>
              </Field>
            </div>
            <div>
              <p className="mb-2 flex items-baseline gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                Available days
                <span className="font-semibold normal-case tracking-normal text-teal-900">
                  Required
                </span>
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
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 hover:border-stone-300"
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

              {values.amenities.includes("other") ? (
                <div className="mt-3 space-y-1.5 rounded-xl border border-stone-200 bg-white p-3">
                  <label
                    htmlFor="amenities_other"
                    className="flex items-baseline gap-1.5 text-xs font-semibold text-stone-600"
                  >
                    Specify custom amenity or equipment
                    <span className="font-semibold text-teal-900">
                      Required
                    </span>
                  </label>
                  <input
                    id="amenities_other"
                    type="text"
                    name="amenities_other"
                    value={values.amenities_other}
                    onChange={(e) => update("amenities_other", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Pilates reformer, Podiatry drill, Hydrotherapy bath"
                    minLength={MIN_CUSTOM_AMENITY_CHARS}
                    maxLength={MAX_CUSTOM_AMENITY_CHARS}
                    required
                  />
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>
                      {MIN_CUSTOM_AMENITY_CHARS}–{MAX_CUSTOM_AMENITY_CHARS}{" "}
                      characters.
                    </span>
                    <span
                      className={
                        values.amenities_other.length >
                        MAX_CUSTOM_AMENITY_CHARS - 10
                          ? "font-semibold text-amber-700"
                          : ""
                      }
                    >
                      {values.amenities_other.length}/{MAX_CUSTOM_AMENITY_CHARS}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
            <Field label="Description" required>
              <textarea
                name="description"
                rows={4}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                className={inputClass}
                placeholder="Natural light, acoustic treatment, shared waiting room, practitioner kitchenette..."
                minLength={30}
                maxLength={1500}
              />
              <div className="mt-1 flex items-center justify-between text-xs text-stone-400">
                <span>
                  Describe light, acoustic treatment, parking, and shared
                  amenities.
                </span>
                <span
                  className={
                    values.description.length > 1400
                      ? "font-semibold text-amber-700"
                      : ""
                  }
                >
                  {values.description.length}/1500
                </span>
              </div>
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
              className={`block cursor-pointer rounded-2xl border border-dashed bg-white px-4 py-10 text-center transition-colors hover:border-teal-800 ${
                photoError
                  ? "border-red-300"
                  : "border-stone-300"
              }`}
            >
              <p className="text-sm font-semibold text-stone-800">
                Drag high-res photos here, or click to select files
              </p>
              <p className="mt-1 text-xs text-stone-500">
                At least one photo is required. Up to 6 landscape photos.
                Minimum resolution: <strong>800 × 500 px</strong> (6MB max).
              </p>
              <button
                type="button"
                className="mt-4 cursor-pointer rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
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

            {step === 3 && photoError ? <FormError message={photoError} /> : null}

            {previewUrls.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Listing photos ({previewUrls.length}/6)
                  </p>
                  <p className="text-xs text-stone-500">
                    First photo is your main header card. Edit to reposition in
                    the 16:9 frame.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={`${photos[index]?.name || "photo"}-${index}`}
                      className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-stone-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      {index === 0 ? (
                        <span className="absolute left-2 top-2 rounded-md bg-teal-900/90 px-2 py-0.5 text-[10px] font-bold text-white">
                          Hero Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            makeCoverPhoto(index);
                          }}
                          className="absolute left-2 top-2 cursor-pointer rounded-md bg-stone-900/75 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-teal-900"
                        >
                          Make Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingIndex(index);
                        }}
                        className="absolute bottom-2 left-2 cursor-pointer rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-stone-700 hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(index);
                        }}
                        className="absolute right-2 top-2 cursor-pointer rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-stone-700 hover:bg-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Review listing
              </p>
              <p className="mt-1 text-xs text-stone-500">
                This is how the public listing will look.
              </p>

              <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                {previewUrls.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrls[0]}
                    alt="Hero preview"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <RoomPlaceholder roomType={values.room_type} />
                )}
              </div>

              <span className="mt-4 inline-block rounded-full bg-stone-200/70 px-3 py-1 text-xs font-semibold text-stone-700">
                {ROOM_TYPE_LABEL[values.room_type]}
              </span>
              <h2 className="mt-3 text-xl font-bold text-stone-900">
                {values.title || "Untitled room"}
              </h2>
              <p className="mt-1 text-sm font-medium text-stone-500">
                {values.suburb || "Suburb"}, {values.state} · Hosted by{" "}
                {values.practice_name || "the clinic"}
              </p>

              <div className="mt-5 border-t border-stone-200 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Daily rate
                </p>
                <p className="mt-1 text-lg font-bold text-stone-900">
                  {values.price_per_day
                    ? pricePerDayLabel(Number(values.price_per_day) * 100)
                    : "$— / day"}
                </p>
                <p className="text-xs text-stone-500">
                  Sessional hire · No long-term lease
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Available days
                </p>
                {values.available_days.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {values.available_days.map((d) => (
                      <span
                        key={d}
                        className="rounded bg-stone-900 px-2 py-1 text-xs font-bold uppercase text-white"
                      >
                        {DAY_LABEL[d]}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-stone-500">No days selected</p>
                )}
              </div>

              <div className="mt-4 border-t border-stone-200 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Amenities & clinical specs
                </p>
                {reviewAmenities.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reviewAmenities.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700"
                      >
                        ✓ {amenityLabel(item)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-stone-500">
                    No amenities listed
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-stone-200 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  About the space
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {values.description || "No description yet."}
                </p>
              </div>
            </div>
          </section>

          {(stepError || actionError) ? (
            <FormError message={stepError || actionError} />
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1 || pending || advancing}
              className="rounded-full cursor-pointer border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:opacity-40"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                key="continue"
                type="button"
                onClick={goNext}
                disabled={advancing || pending}
                className="rounded-full cursor-pointer bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-950 disabled:opacity-60"
              >
                {advancing ? "Saving…" : "Continue"}
              </button>
            ) : (
              <button
                key="publish"
                type="button"
                disabled={pending}
                onClick={(event) => {
                  const error = validateStep(3);
                  if (error) {
                    setStepError(error);
                    return;
                  }
                  setStepError("");
                  event.currentTarget.form?.requestSubmit();
                }}
                className="rounded-full cursor-pointer bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-950 disabled:opacity-60"
              >
                {pending ? "Publishing…" : "Publish listing"}
              </button>
            )}
          </div>
        </form>
      </FadeIn>

      {editingIndex != null && originals[editingIndex] ? (
        <PhotoCropModal
          file={originals[editingIndex]}
          onClose={() => setEditingIndex(null)}
          onSave={(cropped) => {
            const nextFile = ensurePhotoFile(
              cropped instanceof File ? cropped : cropped?.file,
              originals[editingIndex]?.name || "photo.jpg",
            );
            const nextPreview =
              typeof cropped?.previewUrl === "string"
                ? cropped.previewUrl
                : previewUrls[editingIndex];
            if (!nextFile) return;
            setPhotos((current) =>
              current.map((photo, i) => (i === editingIndex ? nextFile : photo)),
            );
            if (nextPreview) {
              setPreviewUrls((current) =>
                current.map((url, i) =>
                  i === editingIndex ? nextPreview : url,
                ),
              );
            }
            setEditingIndex(null);
          }}
        />
      ) : null}
    </main>
  );
}
