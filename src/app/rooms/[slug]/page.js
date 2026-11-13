import { Suspense } from "react";
import { getRoomBySlug } from "@/lib/db/rooms";
import { listingTitle } from "@/lib/format";
import BackButton from "@/components/BackButton";
import ScrollToTop from "@/components/ScrollToTop";
import RoomListing, { RoomListingFallback } from "./RoomListing";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "Room" };

  return {
    title: listingTitle(room.title),
    robots: room.is_published ? undefined : { index: false, follow: false },
  };
}

export default async function RoomDetailPage({ params }) {
  const { slug } = await params;

  return (
    <>
      <ScrollToTop />
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 2xl:max-w-page-inset">
        <BackButton />
        <Suspense fallback={<RoomListingFallback />}>
          <RoomListing slug={slug} />
        </Suspense>
      </main>
    </>
  );
}
