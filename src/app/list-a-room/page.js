import { redirect } from "next/navigation";
import HostLanding from "./HostLanding";

function firstValue(value) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function ListARoomPage({ searchParams }) {
  const params = await searchParams;
  const next = new URLSearchParams();
  for (const key of ["edit", "step", "listed_by", "key"]) {
    const value = firstValue(params?.[key]);
    if (value) next.set(key, value);
  }
  if ([...next.keys()].length > 0) {
    redirect(`/list-a-room/new?${next.toString()}`);
  }

  return (
    <main className="min-h-screen bg-stone-50/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <HostLanding />
      </div>
    </main>
  );
}
