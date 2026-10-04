"use client";

export default function ListARoomError({ reset }) {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-sans text-3xl font-extrabold text-stone-900">
          Could not save this listing
        </h1>
        <p className="mt-2 text-stone-600">
          Something went wrong while publishing. Your photos may be too large,
          or the connection dropped. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 cursor-pointer rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-950"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
