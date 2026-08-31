import { ROOM_TYPE_LABEL } from "@/lib/format";

export default function RoomPlaceholder({ roomType }) {
  if (roomType === "talk_therapy") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-stone-100 p-6 text-stone-400">
        <svg
          className="h-12 w-12 stroke-[1.25]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0A9 9 0 004 12m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 12H4"
          />
        </svg>
        <span className="mt-2 text-xs font-medium text-stone-500">
          {ROOM_TYPE_LABEL[roomType] || "Talk Therapy Suite"}
        </span>
      </div>
    );
  }

  if (roomType === "bodywork") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-teal-50/50 p-6 text-teal-600/60">
        <svg
          className="h-12 w-12 stroke-[1.25]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span className="mt-2 text-xs font-medium text-teal-800/70">
          {ROOM_TYPE_LABEL[roomType] || "Treatment / Plinth Room"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-stone-100 p-6 text-stone-400">
      <svg
        className="h-12 w-12 stroke-[1.25]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9"
        />
      </svg>
      <span className="mt-2 text-xs font-medium text-stone-500">
        {ROOM_TYPE_LABEL[roomType] || "Consulting room"}
      </span>
    </div>
  );
}
