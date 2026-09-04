"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  AMENITY_LABEL,
  CUSTOM_AMENITY_PREFIX,
  customAmenityError,
  normalizeCustomAmenity,
} from "@/lib/format";
import {
  insertPublishedRoom,
  uniqueSlug,
  updateRoomImageUrls,
} from "@/lib/db/rooms";
import { deleteHostProfile, insertHostProfile } from "@/lib/db/profiles";
import {
  markListingLeadComplete,
  upsertListingLead,
} from "@/lib/db/leads";
import { createSupabaseAdminClient } from "@/lib/supabase";
import {
  isAuPhone,
  normalizeWebsiteUrl,
  addressLineError,
  dailyRateError,
  practiceDetailsError,
  toAuPhoneDigits,
} from "@/lib/validate";

const ROOM_TYPES = [
  "talk_therapy",
  "bodywork",
  "medical",
  "flexible",
  "other",
];
const MIN_DESCRIPTION_CHARS = 30;
const MAX_DESCRIPTION_CHARS = 1500;
const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const AMENITIES = Object.keys(AMENITY_LABEL);
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 6 * 1024 * 1024;

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

function readPracticeFields(formData) {
  return {
    practiceName: String(formData.get("practice_name") ?? "").trim(),
    contactEmail: String(formData.get("contact_email") ?? "").trim(),
    phoneRaw: String(formData.get("phone") ?? "").trim(),
    websiteRaw: String(formData.get("website_url") ?? "").trim(),
  };
}

export async function captureListingLead(formData) {
  try {
    if (formData.get("company")) {
      return { ok: true };
    }

    const admin = createSupabaseAdminClient();
    if (!admin) {
      console.error("captureListingLead: missing SUPABASE_SERVICE_ROLE_KEY");
      return { ok: false };
    }

    const { practiceName, contactEmail, phoneRaw, websiteRaw } =
      readPracticeFields(formData);
    const practiceError = practiceDetailsError({
      practiceName,
      contactEmail,
      phone: phoneRaw,
      websiteUrl: websiteRaw,
    });
    if (practiceError) {
      return { ok: false };
    }

    const lastStep = Number(formData.get("last_step")) === 3 ? 3 : 2;
    const phone = isAuPhone(phoneRaw) ? toAuPhoneDigits(phoneRaw) : null;
    const websiteUrl =
      websiteRaw && !/^https?:\/\/$/i.test(websiteRaw)
        ? normalizeWebsiteUrl(websiteRaw)
        : null;

    const { error } = await upsertListingLead(admin, {
      practice_name: practiceName,
      contact_email: contactEmail,
      phone,
      website_url: websiteUrl,
      last_step: lastStep,
    });

    if (error) {
      console.error("captureListingLead:", error.message);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("captureListingLead:", error?.message || error);
    return { ok: false };
  }
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

    const { practiceName, contactEmail, phoneRaw, websiteRaw } =
      readPracticeFields(formData);
    const practiceError = practiceDetailsError({
      practiceName,
      contactEmail,
      phone: phoneRaw,
      websiteUrl: websiteRaw,
    });
    if (practiceError) {
      return { error: practiceError };
    }

    const phone = isAuPhone(phoneRaw) ? toAuPhoneDigits(phoneRaw) : null;
    const websiteUrl =
      websiteRaw && !/^https?:\/\/$/i.test(websiteRaw)
        ? normalizeWebsiteUrl(websiteRaw)
        : null;
    const title = String(formData.get("title") ?? "").trim();
    const addressLine = String(formData.get("address_line") ?? "").trim();
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
    const customAmenity = normalizeCustomAmenity(
      formData.get("amenities_other"),
    );
    const otherError = customAmenityError(customAmenity, {
      required: amenities.includes("other"),
    });
    if (otherError) {
      return { error: otherError };
    }
    if (amenities.includes("other") && customAmenity) {
      amenities.push(`${CUSTOM_AMENITY_PREFIX}${customAmenity}`);
    }
    const photos = collectPhotos(formData);

    if (!title || title.length < 8) {
      return { error: "Room title must be at least 8 characters long." };
    }
    const streetError = addressLineError(addressLine);
    if (streetError) {
      return { error: streetError };
    }
    if (!suburb) {
      return { error: "Suburb is required." };
    }
    if (!description || description.length < MIN_DESCRIPTION_CHARS) {
      return {
        error: `Description must be at least ${MIN_DESCRIPTION_CHARS} characters.`,
      };
    }
    if (description.length > MAX_DESCRIPTION_CHARS) {
      return {
        error: `Description must be ${MAX_DESCRIPTION_CHARS} characters or fewer.`,
      };
    }
    if (!STATES.includes(state)) {
      return { error: "Choose a valid Australian state." };
    }
    if (!ROOM_TYPES.includes(roomType)) {
      return { error: "Choose a room type." };
    }
    const rateError = dailyRateError(dollars);
    if (rateError) {
      return { error: rateError };
    }
    if (availableDays.length === 0) {
      return { error: "Select at least one available day." };
    }
    if (photos.length === 0) {
      return { error: "Upload at least one photo." };
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

    const { data: profile, error: profileError } = await insertHostProfile(
      admin,
      {
        practice_name: practiceName,
        contact_email: contactEmail,
        phone,
        website_url: websiteUrl,
      },
    );

    if (profileError) {
      console.error("createRoomListing profile:", profileError.message);
      return { error: "Could not save clinic details. Please try again." };
    }

    const { data: room, error: roomError } = await insertPublishedRoom(admin, {
      host_id: profile.id,
      title,
      slug,
      address_line: addressLine,
      suburb,
      state,
      price_per_day_cents: pricePerDayCents,
      room_type: roomType,
      available_days: availableDays,
      amenities,
      image_urls: [],
      description,
      is_published: true,
    });

    if (roomError) {
      console.error("createRoomListing room:", roomError.message);
      await deleteHostProfile(admin, profile.id);
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
      const { error: updateError } = await updateRoomImageUrls(
        admin,
        room.id,
        imageUrls,
      );

      if (updateError) {
        console.error("createRoomListing images:", updateError.message);
      }
    }

    const { error: leadError } = await markListingLeadComplete(
      admin,
      contactEmail,
      practiceName,
    );
    if (leadError) {
      console.error("createRoomListing lead:", leadError.message);
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
