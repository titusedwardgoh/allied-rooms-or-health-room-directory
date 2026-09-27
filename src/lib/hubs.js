export const SUBURB_HUBS = {
  Richmond: { image: "/hubs/richmond.jpg", tag: "Inner East" },
  "South Yarra": { image: "/hubs/south-yarra.jpg", tag: "Metro" },
  Fitzroy: { image: "/hubs/fitzroy.jpg", tag: "Inner North" },
  Hawthorn: { image: "/hubs/hawthorn.jpg", tag: "East" },
  Brunswick: { image: "/hubs/brunswick.jpg", tag: "North" },
  "South Melbourne": { image: "/hubs/South Melbourne.jpg", tag: "Inner South" },
  Camberwell: { image: "/hubs/Camberwell.jpg", tag: "East" },
  Carlton: { image: "/hubs/Carlton.webp", tag: "Inner North" },
};

const HUB_BY_KEY = Object.fromEntries(
  Object.entries(SUBURB_HUBS).map(([suburb, hub]) => [
    suburb.toLowerCase(),
    { suburb, ...hub },
  ]),
);

export function canonicalHubSuburb(suburb) {
  const key = String(suburb || "").trim().toLowerCase();
  return HUB_BY_KEY[key]?.suburb || null;
}

export function suburbStatsFromRooms(rooms, limit = 5) {
  const counts = {};

  for (const room of rooms) {
    if (room?.is_published === false) continue;
    const suburb = canonicalHubSuburb(room?.suburb);
    if (!suburb) continue;
    counts[suburb] = (counts[suburb] || 0) + 1;
  }

  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([suburb, count]) => ({
      suburb,
      tag: SUBURB_HUBS[suburb].tag,
      image: SUBURB_HUBS[suburb].image,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.suburb.localeCompare(b.suburb))
    .slice(0, limit);
}
