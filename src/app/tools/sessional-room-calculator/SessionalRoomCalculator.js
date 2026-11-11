"use client";

import { useMemo, useState } from "react";

const MBS_PRESETS = [
  { id: "registered", label: "Registered Psych", amount: 101.55 },
  { id: "clinical", label: "Clinical Psych", amount: 149.05 },
  { id: "amhsw", label: "AMHSW", amount: 89.5 },
  { id: "custom", label: "Custom / Private", amount: 0 },
];

const RANGE = {
  dailyRoomRate: { min: 50, max: 350, step: 5 },
  sessionFee: { min: 50, max: 500, step: 5 },
  variableCost: { min: 0, max: 80, step: 1 },
  daysPerWeek: { min: 1, max: 5, step: 1 },
  clientsPerDay: { min: 1, max: 10, step: 1 },
};

const SLIDER_CLASS =
  "w-full cursor-pointer accent-teal-900";
const NUMBER_CLASS =
  "w-24 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-stone-900 outline-none focus:border-teal-900 focus:ring-2 focus:ring-teal-900/10";

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

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <label className="text-sm font-semibold text-stone-900">{label}</label>
        {hint}
      </div>
      {children}
    </div>
  );
}

function SliderRow({ id, value, min, max, step, prefix, onChange }) {
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
      />
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            {prefix}
          </span>
        ) : null}
        <input
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
          aria-label={id}
        />
      </div>
    </div>
  );
}

export default function SessionalRoomCalculator() {
  const [dailyRoomRate, setDailyRoomRate] = useState(120);
  const [sessionFee, setSessionFee] = useState(220);
  const [mbsPreset, setMbsPreset] = useState("registered");
  const [mbsRebate, setMbsRebate] = useState(101.55);
  const [variableCost, setVariableCost] = useState(15);
  const [daysPerWeek, setDaysPerWeek] = useState(1);
  const [clientsPerDay, setClientsPerDay] = useState(5);

  const results = useMemo(() => {
    const rate = clamp(dailyRoomRate, RANGE.dailyRoomRate.min, RANGE.dailyRoomRate.max);
    const fee = clamp(sessionFee, RANGE.sessionFee.min, RANGE.sessionFee.max);
    const rebate = Math.max(0, Number(mbsRebate) || 0);
    const variable = clamp(variableCost, RANGE.variableCost.min, RANGE.variableCost.max);
    const days = clamp(daysPerWeek, RANGE.daysPerWeek.min, RANGE.daysPerWeek.max);
    const clients = clamp(clientsPerDay, RANGE.clientsPerDay.min, RANGE.clientsPerDay.max);

    const netMarginPerSession = fee - variable;
    const gapFee = Math.max(0, fee - rebate);
    const breakEvenSessions =
      netMarginPerSession > 0 ? rate / netMarginPerSession : null;
    const dailyNetProfit = clients * netMarginPerSession - rate;
    const weeklyNetProfit = dailyNetProfit * days;
    const annualNetProfit = weeklyNetProfit * 48;
    const equivalentSplitCost = clients * fee * 0.3;
    const dailySavingsVsSplit = equivalentSplitCost - rate;
    const annualSavingsVsSplit = dailySavingsVsSplit * days * 48;

    return {
      rate,
      netMarginPerSession,
      gapFee,
      breakEvenSessions,
      dailyNetProfit,
      weeklyNetProfit,
      annualNetProfit,
      equivalentSplitCost,
      dailySavingsVsSplit,
      annualSavingsVsSplit,
    };
  }, [
    dailyRoomRate,
    sessionFee,
    mbsRebate,
    variableCost,
    daysPerWeek,
    clientsPerDay,
  ]);

  function selectPreset(preset) {
    setMbsPreset(preset.id);
    setMbsRebate(preset.amount);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-sans text-xl font-black text-stone-900">
          Your numbers
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Day rate, session fee, and how many clients you see.
        </p>

        <div className="mt-6 space-y-6">
          <Field label="Daily room rate">
            <SliderRow
              id="dailyRoomRate"
              value={dailyRoomRate}
              {...RANGE.dailyRoomRate}
              prefix="$"
              onChange={setDailyRoomRate}
            />
          </Field>

          <Field label="Session fee">
            <SliderRow
              id="sessionFee"
              value={sessionFee}
              {...RANGE.sessionFee}
              prefix="$"
              onChange={setSessionFee}
            />
          </Field>

          <div>
            <p className="mb-2 text-sm font-semibold text-stone-900">
              MBS rebate (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {MBS_PRESETS.map((preset) => {
                const active = mbsPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-teal-900 bg-teal-900 text-white"
                        : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-white"
                    }`}
                  >
                    {preset.label}
                    {preset.id === "custom"
                      ? ""
                      : ` ${formatAUD(preset.amount, 2)}`}
                  </button>
                );
              })}
            </div>
            {mbsPreset === "custom" ? (
              <div className="mt-3">
                <label htmlFor="custom-rebate" className="sr-only">
                  Custom rebate amount
                </label>
                <input
                  id="custom-rebate"
                  type="number"
                  min={0}
                  max={500}
                  step={0.05}
                  value={mbsRebate}
                  onChange={(event) => setMbsRebate(event.target.value)}
                  onBlur={(event) =>
                    setMbsRebate(clamp(event.target.value, 0, 500))
                  }
                  className="w-full rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-900 outline-none focus:border-teal-900 focus:ring-2 focus:ring-teal-900/10"
                />
              </div>
            ) : null}
          </div>

          <Field label="Variable cost per session">
            <SliderRow
              id="variableCost"
              value={variableCost}
              {...RANGE.variableCost}
              prefix="$"
              onChange={setVariableCost}
            />
            <p className="mt-1 text-xs text-stone-500">
              Merchant fees, software, and other costs per consult.
            </p>
          </Field>

          <Field label="Days per week">
            <SliderRow
              id="daysPerWeek"
              value={daysPerWeek}
              {...RANGE.daysPerWeek}
              onChange={(value) =>
                setDaysPerWeek(
                  Math.round(clamp(value, 1, 5)),
                )
              }
            />
          </Field>

          <Field label="Clients per day">
            <SliderRow
              id="clientsPerDay"
              value={clientsPerDay}
              {...RANGE.clientsPerDay}
              onChange={(value) =>
                setClientsPerDay(Math.round(clamp(value, 1, 10)))
              }
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl bg-[#0f4c45] p-6 text-white shadow-sm sm:p-8">
        <span className="text-xs font-bold uppercase tracking-wider text-white/50">
          Results
        </span>
        <h2 className="mt-2 font-sans text-xl font-black">
          Break-even and net profit
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Break-even sessions / day
            </p>
            <p className="mt-1 font-sans text-3xl font-black">
              {results.breakEvenSessions == null
                ? "—"
                : results.breakEvenSessions.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-white/70">
              Clients needed to cover {formatAUD(results.rate)} room hire
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Daily net profit
            </p>
            <p className="mt-1 font-sans text-3xl font-black">
              {formatAUD(results.dailyNetProfit)}
            </p>
            <p className="mt-1 text-xs text-white/70">
              After the day rate, at {clientsPerDay} clients
            </p>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <dt className="text-white/70">Net margin / session</dt>
            <dd className="font-semibold">
              {formatAUD(results.netMarginPerSession)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <dt className="text-white/70">Gap fee (client pays)</dt>
            <dd className="font-semibold">{formatAUD(results.gapFee, 2)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <dt className="text-white/70">Weekly net profit</dt>
            <dd className="font-semibold">{formatAUD(results.weeklyNetProfit)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-white/70">Annual net profit (48 weeks)</dt>
            <dd className="font-semibold">{formatAUD(results.annualNetProfit)}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-2xl bg-white px-4 py-4 text-sm leading-relaxed text-stone-700">
          {results.dailySavingsVsSplit >= 0 ? (
            <p>
              By paying flat room hire ({formatAUD(results.rate)}/day) instead of
              a 30% clinic split, you save{" "}
              <strong className="font-semibold text-teal-950">
                {formatAUD(results.dailySavingsVsSplit)}/day
              </strong>{" "}
              ({formatAUD(results.annualSavingsVsSplit)}/year at {daysPerWeek}{" "}
              day{daysPerWeek === 1 ? "" : "s"}/week).
            </p>
          ) : (
            <p>
              At this volume, a 30% clinic split would be{" "}
              <strong className="font-semibold text-teal-950">
                {formatAUD(Math.abs(results.dailySavingsVsSplit))}/day
              </strong>{" "}
              cheaper than {formatAUD(results.rate)} flat hire.
            </p>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/55">
          Estimates only — they do not include tax, super, or insurance, and
          they are not financial advice. Confirm current MBS items with
          Services Australia.
        </p>
      </section>
    </div>
  );
}
