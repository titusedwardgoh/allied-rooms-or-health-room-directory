import { Suspense } from "react";

export const metadata = {
  title: "List a Room",
  description:
    "Publish a sessional allied health consulting room with a public day rate.",
};

export default function ListARoomLayout({ children }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-stone-50/60">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-stone-500">Loading listing form…</p>
          </div>
        </main>
      }
    >
      {children}
    </Suspense>
  );
}
