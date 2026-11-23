"use client";

import { useMemo, useState } from "react";
import { Stagger, StaggerItem } from "@/components/FadeIn";

const RANGE = {
  rooms: { min: 1, max: 10, step: 1 },
  daysPerWeek: { min: 1, max: 7, step: 1 },
  dailyRate: { min: 50, max: 1000, step: 10 },
  dailyOverhead: { min: 0, max: 1000, step: 5 },
  activeWeeks: { min: 1, max: 52, step: 1 },
};

const WEEK_PRESETS = [
  { id: 48, label: "48 weeks", hint: "48 weeks leaves a 4-week holiday buffer." },
  { id: 52, label: "52 weeks", hint: "52 weeks is a full calendar year with no downtime." },
  { id: "custom", label: "Custom", hint: "Enter the weeks you expect the rooms to be listed." },
];

const SLIDER_CLASS = "w-full cursor-pointer accent-teal-900";
const NUMBER_CLASS =
  "w-28 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-stone-900 outline-none focus:border-teal-900 focus:ring-2 focus:ring-teal-900/10";

function formatAUD(value, digits = 0) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function Field({ label, hint, htmlFor, children }) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-stone-900">
          {label}
        </label>
        {hint}
      </div>
      {children}
    </div>
  );
}

function SliderRow({ id, label, value, min, max, step, prefix, onChange }) {
  const name = label || id;
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={SLIDER_CLASS}
        aria-label={name}
      />
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            {prefix}
          </span>
        ) : null}
        <input
          id={`${id}-number`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next === "" ? min : Number(next));
          }}
          onBlur={(event) => onChange(clamp(event.target.value, min, max))}
          className={`${NUMBER_CLASS} ${prefix ? "pl-6" : ""}`}
          aria-label={`${name} amount`}
        />
      </div>
    </div>
  );
}

export default function SubleaseRevenueCalculator() {
  const [rooms, setRooms] = useState(1);
  const [daysPerWeek, setDaysPerWeek] = useState(2);
  const [dailyRate, setDailyRate] = useState(130);
  const [weekPreset, setWeekPreset] = useState(48);
  const [activeWeeks, setActiveWeeks] = useState(48);
  const [dailyOverhead, setDailyOverhead] = useState(10);

  const results = useMemo(() => {
    const roomCount = Math.round(clamp(rooms, RANGE.rooms.min, RANGE.rooms.max));
    const days = Math.round(
      clamp(daysPerWeek, RANGE.daysPerWeek.min, RANGE.daysPerWeek.max),
    );
    const rate = clamp(dailyRate, RANGE.dailyRate.min, RANGE.dailyRate.max);
    const weeks = Math.round(
      clamp(activeWeeks, RANGE.activeWeeks.min, RANGE.activeWeeks.max),
    );
    const overhead = clamp(
      dailyOverhead,
      RANGE.dailyOverhead.min,
      RANGE.dailyOverhead.max,
    );

    const grossWeekly = roomCount * days * rate;
    const grossAnnual = grossWeekly * weeks;
    const grossMonthly = grossAnnual / 12;
    const annualOverhead = roomCount * days * overhead * weeks;
    const netAnnual = grossAnnual - annualOverhead;
    const agencyFeeSavings = grossAnnual * 0.12;

    return {
      roomCount,
      days,
      rate,
      weeks,
      overhead,
      grossWeekly,
      grossAnnual,
      grossMonthly,
      annualOverhead,
      netAnnual,
      agencyFeeSavings,
    };
  }, [rooms, daysPerWeek, dailyRate, activeWeeks, dailyOverhead]);

  return (
    <Stagger
      delay={0.24}
      className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2"
    >
      <StaggerItem className="h-full">
      <section className="flex h-full flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="font-sans text-xl font-black text-stone-900">
            Your idle capacity
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Rooms, days, and the sessional rate you would list.
          </p>

          <div className="mt-6 space-y-6">
            <Field label="Idle rooms" htmlFor="rooms">
              <SliderRow
                id="rooms"
                label="Idle rooms"
                value={rooms}
                {...RANGE.rooms}
                onChange={(value) =>
                  setRooms(
                    Math.round(clamp(value, RANGE.rooms.min, RANGE.rooms.max)),
                  )
                }
              />
            </Field>

            <Field label="Days available per week" htmlFor="daysPerWeek">
              <SliderRow
                id="daysPerWeek"
                label="Days available per week"
                value={daysPerWeek}
                {...RANGE.daysPerWeek}
                onChange={(value) =>
                  setDaysPerWeek(
                    Math.round(
                      clamp(
                        value,
                        RANGE.daysPerWeek.min,
                        RANGE.daysPerWeek.max,
                      ),
                    ),
                  )
                }
              />
            </Field>

            <Field label="Target daily rate" htmlFor="dailyRate">
              <SliderRow
                id="dailyRate"
                label="Target daily rate"
                value={dailyRate}
                {...RANGE.dailyRate}
                prefix="$"
                onChange={setDailyRate}
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-semibold text-stone-900">
                Active weeks per year
              </p>
              <div className="flex flex-wrap gap-2">
                {WEEK_PRESETS.map((preset) => {
                  const active = weekPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setWeekPreset(preset.id);
                        if (preset.id !== "custom") {
                          setActiveWeeks(preset.id);
                        }
                      }}
                      aria-pressed={active}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-teal-900 bg-teal-900 text-white"
                          : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              {weekPreset === "custom" ? (
                <div className="mt-3">
                  <label htmlFor="custom-weeks" className="sr-only">
                    Custom active weeks per year
                  </label>
                  <input
                    id="custom-weeks"
                    type="number"
                    min={RANGE.activeWeeks.min}
                    max={RANGE.activeWeeks.max}
                    step={RANGE.activeWeeks.step}
                    value={activeWeeks}
                    onChange={(event) => {
                      const next = event.target.value;
                      setWeekPreset("custom");
                      setActiveWeeks(
                        next === "" ? RANGE.activeWeeks.min : Number(next),
                      );
                    }}
                    onBlur={(event) =>
                      setActiveWeeks(
                        Math.round(
                          clamp(
                            event.target.value,
                            RANGE.activeWeeks.min,
                            RANGE.activeWeeks.max,
                          ),
                        ),
                      )
                    }
                    className={NUMBER_CLASS}
                    aria-label="Custom active weeks per year"
                  />
                </div>
              ) : null}
              <p className="mt-1 text-xs text-stone-500">
                {WEEK_PRESETS.find((preset) => preset.id === weekPreset)?.hint}
              </p>
            </div>

            <Field label="Host overheads per room / day" htmlFor="dailyOverhead">
              <SliderRow
                id="dailyOverhead"
                label="Host overheads per room per day"
                value={dailyOverhead}
                {...RANGE.dailyOverhead}
                prefix="$"
                onChange={setDailyOverhead}
              />
              <p className="mt-1 text-xs text-stone-500">
                Optional: tea, coffee, Wi-Fi, and printing supplies.
              </p>
            </Field>
          </div>
        </div>
      </section>
      </StaggerItem>

      <StaggerItem className="h-full">
      <section className="flex h-full flex-col justify-between rounded-2xl bg-[#0f4c45] p-6 text-white shadow-sm sm:p-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-white/50">
            Results
          </span>
          <h2 className="mt-2 font-sans text-xl font-black">
            Sublease income
          </h2>

          <div className="mt-6 rounded-2xl bg-white p-4 text-stone-900 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Annual gross sublease income
            </p>
            <p className="mt-1 font-sans text-3xl font-black text-teal-950">
              {formatAUD(results.grossAnnual)}
            </p>
            <p className="mt-1 text-xs text-stone-600">
              {results.roomCount} room{results.roomCount === 1 ? "" : "s"} ×{" "}
              {results.days} day{results.days === 1 ? "" : "s"}/week ×{" "}
              {formatAUD(results.rate)} × {results.weeks} weeks
            </p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 text-stone-900 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Monthly passive revenue
              </p>
              <p className="mt-1 font-sans text-3xl font-black text-teal-950">
                {formatAUD(results.grossMonthly)}
              </p>
              <p className="mt-1 text-xs text-stone-600">Annual gross ÷ 12</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-stone-900 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Net host earnings
              </p>
              <p className="mt-1 font-sans text-3xl font-black text-teal-950">
                {formatAUD(results.netAnnual)}
              </p>
              <p className="mt-1 text-xs text-stone-600">
                After {formatAUD(results.annualOverhead)} amenity costs
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt className="text-white/70">Weekly gross</dt>
              <dd className="font-semibold">{formatAUD(results.grossWeekly)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt className="text-white/70">Annual amenity overheads</dt>
              <dd className="font-semibold">
                {formatAUD(results.annualOverhead)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-white/70">Avoided 12% agency fees</dt>
              <dd className="font-semibold">
                {formatAUD(results.agencyFeeSavings)}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="mt-6 rounded-2xl bg-white/95 px-4 py-4 text-sm leading-relaxed text-stone-800 shadow-sm">
            <p>
              Listing direct on AlliedRooms keeps{" "}
              <strong className="font-bold text-teal-950">100%</strong> of the
              sessional rent. Avoiding typical 10–15% commercial placement or
              management fees saves about{" "}
              <strong className="font-bold text-teal-950">
                {formatAUD(results.agencyFeeSavings)}/year
              </strong>{" "}
              at a 12% agency rate.
            </p>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/55">
            Estimates only — they assume rooms fill on the days you list, and
            they do not include tax, GST, or legal costs.
          </p>
        </div>
      </section>
      </StaggerItem>
    </Stagger>
  );
}
