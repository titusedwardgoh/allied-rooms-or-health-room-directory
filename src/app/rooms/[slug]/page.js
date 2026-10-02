import { notFound } from "next/navigation";
import { roomLocationLabel } from "@/lib/auAddress";
import { getRoomBySlug } from "@/lib/db/rooms";
import {
  DAY_LABEL,
  listingRoomTypeLabel,
  listingTitle,
  amenityLabel,
  pricePerDayLabel,
  visibleAmenities,
} from "@/lib/format";
import RoomGallery from "@/components/RoomGallery";
import BackButton from "@/components/BackButton";
import { FadeIn } from "@/components/FadeIn";
import ScrollToTop from "@/components/ScrollToTop";
import PublishListingBar from "@/components/PublishListingBar";
import InquireWithClinic from "@/components/InquireWithClinic";
import ListingDescription from "@/components/ListingDescription";

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
  const room = await getRoomBySlug(slug);

  if (!room) notFound();

  const host = room.host ?? {};
  const title = listingTitle(room.title);
  const isDraft = room.is_published === false;
  const inquiryMessage = `Hi ${host.practice_name || "there"},

I noticed your consulting room ${title} listed on AlliedRooms for ${pricePerDayLabel(
    room.price_per_day_cents,
  )}.

I am interested in leasing this space for sessional use.

Days I am looking for:
About my practice:

Sent via AlliedRooms`;

  return (
    <>
      <ScrollToTop />
      <PublishListingBar
        slug={room.slug}
        isDraft={isDraft}
        editHref={`/list-a-room?edit=${encodeURIComponent(room.slug)}`}
      />
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 2xl:max-w-page-inset">
      <BackButton />
      <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <FadeIn className="min-w-0">
          <RoomGallery
            images={room.image_urls}
            title={title}
            roomType={room.room_type}
          />

          <div className="mt-6">
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-semibold text-stone-700">
              {listingRoomTypeLabel(room)}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-stone-900">
              {title}
            </h1>
            <p className="mt-1 text-sm font-medium text-stone-500">
              {roomLocationLabel(room)} · Hosted by {host.practice_name || "the clinic"}
            </p>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="font-display text-lg font-semibold text-stone-900">
              Amenities & Clinical Specs
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {visibleAmenities(room.amenities).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700"
                >
                  ✓ {amenityLabel(item)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="font-display text-lg font-semibold text-stone-900">
              About the Space
            </h3>
            <ListingDescription text={room.description} />
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className={`lg:sticky lg:h-fit ${isDraft ? "lg:top-[11.8rem]" : "lg:top-[6.8rem]"}`}>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Daily Rate
              </span>
              <div className="font-display text-3xl font-bold text-stone-900">
                {pricePerDayLabel(room.price_per_day_cents)}
              </div>
              <span className="text-xs text-stone-500">
                Sessional hire · No long-term lease
              </span>
            </div>

            <div className="py-4">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">
                Available Days
              </span>
              <div className="flex flex-wrap gap-1">
                {room.available_days.map((d) => (
                  <span
                    key={d}
                    className="rounded bg-stone-900 px-2 py-1 text-xs font-bold uppercase text-white"
                  >
                    {DAY_LABEL[d]}
                  </span>
                ))}
              </div>
            </div>

            {isDraft ? (
              <p className="mt-4 text-center text-sm text-stone-500">
                Publish this listing to receive inquiries.
              </p>
            ) : (
              <InquireWithClinic
                slug={room.slug}
                initialMessage={inquiryMessage}
              />
            )}
          </div>
        </FadeIn>
      </div>
    </main>
    </>
  );
}
