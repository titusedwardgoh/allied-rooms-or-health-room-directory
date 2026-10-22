import { formatAUDFromCents } from "@/lib/format";

export default function PricePerDay({ cents }) {
  const amount =
    cents == null || !Number.isFinite(Number(cents))
      ? "$—"
      : formatAUDFromCents(cents);

  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap tabular-nums">
      <span className="text-xs font-normal text-stone-400">From</span>
      <span>
        {amount} / day
      </span>
    </span>
  );
}
