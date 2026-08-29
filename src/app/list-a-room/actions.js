"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/format";
import { createSupabaseAdminClient } from "@/lib/supabase";

const ROOM_TYPES = ["talk_therapy", "bodywork", "medical"];
const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const AMENITIES = [
  "soundproofing",
  "hicaps",
  "plinth",
  "parking",
  "waiting_room",
  "wheelchair",
  "wifi",
  "kitchen",
];
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 6 * 1024 * 1024;

function emptyToNull(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed ? trimmed : null;
}

async function uniqueSlug(admin, title, suburb) {
  const base = slugify(`${title}-${suburb}`) || "room";
  let slug = base;
  let n = 2;

  while (n < 50) {
    const { data, error } = await admin
      .from("rooms")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { slug };
    slug = `${base}-${n}`;
    n += 1;
  }

  return { slug: `${base}-${Date.now()}` };
}

function collectPhotos(formData) {
  return formData
    .getAll("photos")
    .filter((file) => file && typeof file === "object" && file.size > 0);
}

function photoExtension(file) {
  const name = typeof file.name === "string" ? file.name : "";
  const ext = (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext || "jpg";
}

function photoContentType(file, ext) {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

async function uploadPhoto(admin, roomId, file, index) {
  const ext = photoExtension(file);
  const path = `${roomId}/${index}.${ext}`;
  const body =
    typeof file.arrayBuffer === "function"
      ? Buffer.from(await file.arrayBuffer())
      : file;

  const { error } = await admin.storage.from("room-photos").upload(path, body, {
    cacheControl: "3600",
    upsert: true,
    contentType: photoContentType(file, ext),
  });

  if (error) {
    console.error("createRoomListing photo:", error.message);
    return null;
  }

  const { data } = admin.storage.from("room-photos").getPublicUrl(path);
  return data?.publicUrl || null;
}

export async function createRoomListing(prevState, formData) {
  let publishedSlug = null;

  try {
    if (formData.get("company")) {
      return { error: "Unable to publish this listing. Please try again." };
    }

    const admin = createSupabaseAdminClient();
    if (!admin) {
      return {
        error:
          "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel Environment Variables and redeploy.",
      };
    }

    const practiceName = String(formData.get("practice_name") ?? "").trim();
    const contactEmail = String(formData.get("contact_email") ?? "").trim();
    const phone = emptyToNull(formData.get("phone"));
    const websiteUrl = emptyToNull(formData.get("website_url"));
    const title = String(formData.get("title") ?? "").trim();
    const suburb = String(formData.get("suburb") ?? "").trim();
    const state = String(formData.get("state") ?? "VIC").trim();
    const roomType = String(formData.get("room_type") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const dollars = Number(formData.get("price_per_day"));
    const availableDays = formData
      .getAll("available_days")
      .map(String)
      .filter((day) => DAYS.includes(day));
    const amenities = formData
      .getAll("amenities")
      .map(String)
      .filter((item) => AMENITIES.includes(item));
    const photos = collectPhotos(formData);

    if (!practiceName || !contactEmail) {
      return { error: "Practice name and contact email are required." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return { error: "Enter a valid contact email." };
    }
    if (!title || !suburb) {
      return { error: "Room title and suburb are required." };
    }
    if (!STATES.includes(state)) {
      return { error: "Choose a valid Australian state." };
    }
    if (!ROOM_TYPES.includes(roomType)) {
      return { error: "Choose a room type." };
    }
    if (!Number.isFinite(dollars) || dollars <= 0) {
      return { error: "Enter a daily rate greater than $0." };
    }
    if (availableDays.length === 0) {
      return { error: "Select at least one available day." };
    }
    if (photos.length > MAX_PHOTOS) {
      return { error: `You can upload up to ${MAX_PHOTOS} photos.` };
    }
    if (photos.some((file) => file.size > MAX_PHOTO_BYTES)) {
      return { error: "Each photo must be 6MB or smaller." };
    }

    const slugResult = await uniqueSlug(admin, title, suburb);
    if (slugResult.error) {
      console.error("createRoomListing slug:", slugResult.error);
      return { error: "Could not reach the listings database. Check Supabase env vars on Vercel." };
    }

    const slug = slugResult.slug;
    const pricePerDayCents = Math.round(dollars * 100);

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .insert({
        practice_name: practiceName,
        contact_email: contactEmail,
        phone,
        website_url: websiteUrl,
      })
      .select("id")
      .single();

    if (profileError) {
      console.error("createRoomListing profile:", profileError.message);
      return { error: "Could not save clinic details. Please try again." };
    }

    const { data: room, error: roomError } = await admin
      .from("rooms")
      .insert({
        host_id: profile.id,
        title,
        slug,
        suburb,
        state,
        price_per_day_cents: pricePerDayCents,
        room_type: roomType,
        available_days: availableDays,
        amenities,
        image_urls: [],
        description,
        is_published: true,
      })
      .select("id, slug")
      .single();

    if (roomError) {
      console.error("createRoomListing room:", roomError.message);
      await admin.from("profiles").delete().eq("id", profile.id);
      return { error: "Could not publish the room. Please try again." };
    }

    const imageUrls = [];
    for (let i = 0; i < photos.length; i += 1) {
      try {
        const url = await uploadPhoto(admin, room.id, photos[i], i);
        if (url) imageUrls.push(url);
      } catch (uploadError) {
        console.error("createRoomListing photo:", uploadError?.message || uploadError);
      }
    }

    if (imageUrls.length > 0) {
      const { error: updateError } = await admin
        .from("rooms")
        .update({ image_urls: imageUrls })
        .eq("id", room.id);

      if (updateError) {
        console.error("createRoomListing images:", updateError.message);
      }
    }

    publishedSlug = room.slug;
  } catch (error) {
    console.error("createRoomListing:", error?.message || error);
    return { error: "Something went wrong while publishing. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${publishedSlug}`);
  redirect(`/rooms/${publishedSlug}`);
}
