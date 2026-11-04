"use client";

import HostListingForm from "../HostListingForm";

export default function NewListingPage() {
  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <HostListingForm />
      </div>
    </main>
  );
}
