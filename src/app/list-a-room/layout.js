import { Suspense } from "react";

export const metadata = {
  title: "List a Room — AlliedRooms",
  description:
    "Publish a sessional allied health consulting room with a public day rate.",
};

export default function ListARoomLayout({ children }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-stone-50">
          <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
            <p className="text-sm text-stone-500">Loading listing form…</p>
          </div>
        </main>
      }
    >
      {children}
    </Suspense>
  );
}
