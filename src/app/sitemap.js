import { getPublishedRooms } from "@/lib/db/rooms";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "", priority: 1 },
  { path: "/rooms", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/list-a-room", priority: 0.8 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default async function sitemap() {
  const now = new Date();
  const staticRoutes = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));

  let roomRoutes = [];
  try {
    const rooms = await getPublishedRooms();
    roomRoutes = rooms
      .filter((room) => room?.slug)
      .map((room) => ({
        url: `${SITE_URL}/rooms/${room.slug}`,
        lastModified: room.created_at ? new Date(room.created_at) : now,
        changeFrequency: "weekly",
        priority: 0.9,
      }));
  } catch (error) {
    console.error("sitemap rooms:", error?.message || error);
  }

  return [...staticRoutes, ...roomRoutes];
}
