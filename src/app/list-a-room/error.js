"use client";

export default function ListARoomError({ reset }) {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
            Could not save this listing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            Something went wrong while publishing. Your photos may be too large,
            or the connection dropped. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 cursor-pointer rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-950"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
