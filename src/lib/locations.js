import { SUBURB_HUBS } from "@/lib/hubs";

function createLocationHub({
  slug,
  name,
  image,
  subtitle,
  overview,
  nearby,
  localContext = "",
  typicalMinCents = 12000,
}) {
  const place = [name, localContext].filter(Boolean).join(" ");
  const where = localContext || `in ${name}`;

  return {
    slug,
    name,
    image,
    pill: `Location Hub · ${name}`,
    h1: `Sessional Consulting Rooms for Rent in ${name}`,
    subtitle,
    metaTitle: `Sessional Consulting Rooms for Rent in ${name} | AlliedRooms`,
    metaDescription: `Find sessional therapy rooms, psychology suites, and allied health spaces in ${name}, Melbourne. Direct host contact, transparent day rates, and zero long leases.`,
    ogImage: image,
    typicalMinCents,
    overview,
    faqs: [
      {
        question: `What is the average cost to rent a sessional consulting room in ${name}?`,
        answer: `Day rates are set directly by practice hosts. Across ${place}, sessional allied health and therapy suites typically range from $120–$180 per day, including access to shared waiting rooms, Wi-Fi, and clinical amenities.`,
      },
      {
        question: `Are there long-term leases required for rooms in ${name}?`,
        answer: `Generally no. AlliedRooms is a sessional directory, not a leasing agent. Rooms ${where} are hired by the day — for example specific weekdays — on terms you agree directly with the host clinic.`,
      },
      {
        question: `How do I inspect or book a room at a ${name} clinic?`,
        answer: `Open a ${name} listing and send an inquiry. Your message goes to the practice host ${where}, who can confirm available days, arrange a walkthrough, and agree a sessional arrangement. AlliedRooms does not take a booking commission.`,
      },
    ],
    nearby,
  };
}

export const LOCATION_HUBS = {
  camberwell: createLocationHub({
    slug: "camberwell",
    name: "Camberwell",
    image: SUBURB_HUBS.Camberwell.image,
    subtitle:
      "Day-rate therapy and allied health rooms at Camberwell Junction — Burke Road, Camberwell Station, and Epworth Camberwell.",
    overview: [
      "Camberwell Junction is one of Melbourne’s established inner-east healthcare precincts. Psychology, specialist, and allied health rooms cluster along Burke Road and Camberwell Road, a short walk from Camberwell Station and Epworth Camberwell on Toorak Road.",
      "Lilydale, Belgrave, and Alamein trains stop at Camberwell Station; trams 72 and 75 serve Burke Road, Camberwell Road, and Riversdale Road. Junction paid parking and the station car park are more reliable than side-street bays, which are often permit-only. Sessional suites here typically sit inside existing clinics rather than standalone medical towers.",
    ],
    localContext: "near Camberwell Junction",
    nearby: [
      { name: "Hawthorn", href: "/locations/hawthorn" },
      { name: "Richmond", href: "/locations/richmond" },
      { name: "South Yarra", href: "/locations/south-yarra" },
      { name: "Carlton", href: "/locations/carlton" },
    ],
  }),
  richmond: createLocationHub({
    slug: "richmond",
    name: "Richmond",
    image: SUBURB_HUBS.Richmond.image,
    subtitle:
      "Sessional psychology and allied health suites around Epworth Richmond, Bridge Road, and Richmond Station.",
    overview: [
      "Epworth Richmond on Bridge Road anchors the inner-east’s busiest private-hospital precinct. Specialist consulting, psychology, and allied health rooms fill the surrounding medical buildings and converted terraces along Bridge Road, Swan Street, Church Street, and Victoria Street — a few minutes from Richmond Station and the MCG.",
      "Trams 12, 48, 70, 75, 78, and 109 run Bridge Road and Church Street; Lilydale, Belgrave, Alamein, and Glen Waverley trains stop at Richmond. Paid parking sits around Epworth and the Bridge Road shops, while most residential streets are permit-restricted. Day-rate rooms here suit practitioners whose clients already attend the hospital precinct.",
    ],
    localContext: "along Bridge Road",
    nearby: [
      { name: "South Yarra", href: "/locations/south-yarra" },
      { name: "Southbank", href: "/locations/southbank" },
      { name: "Camberwell", href: "/locations/camberwell" },
      { name: "Fitzroy", href: "/locations/fitzroy" },
    ],
  }),
  "south-yarra": createLocationHub({
    slug: "south-yarra",
    name: "South Yarra",
    image: SUBURB_HUBS["South Yarra"].image,
    subtitle:
      "Therapy and allied health rooms near Chapel Street, Toorak Road, South Yarra Station, and The Alfred.",
    overview: [
      "South Yarra sits between the Yarra, Chapel Street, and Toorak Road, with Commercial Road carrying traffic toward The Alfred. Psychology and allied health suites occupy first-floor clinic rooms above the retail strip and small medical buildings a short walk from Como Park and the river.",
      "Frankston, Sandringham, and cross-city trains stop at South Yarra Station; trams 6, 58, 72, and 78 run Chapel Street and Toorak Road. The Jam Factory and Chapel Street off-street car parks are the practical options — on-street parks on Chapel Street fill quickly. Host clinics often share a waiting room and HICAPS terminal with sessional practitioners.",
    ],
    localContext: "near Chapel Street and South Yarra Station",
    nearby: [
      { name: "Richmond", href: "/locations/richmond" },
      { name: "Southbank", href: "/locations/southbank" },
      { name: "South Melbourne", href: "/locations/south-melbourne" },
      { name: "Camberwell", href: "/locations/camberwell" },
    ],
  }),
  southbank: createLocationHub({
    slug: "southbank",
    name: "Southbank",
    image: SUBURB_HUBS.Southbank.image,
    subtitle:
      "CBD-fringe consulting rooms on the St Kilda Road corridor, near Arts Centre Melbourne and Flinders Street.",
    overview: [
      "Southbank sits on the Yarra against Melbourne’s CBD, with the Arts Centre, NGV, and St Kilda Road forming one of the city’s main specialist consulting corridors. Psychology, specialist, and allied health suites occupy commercial floors in St Kilda Road buildings used by clients already travelling into town.",
      "Trams 1, 3, 5, 6, 16, 64, 67, and 72 run St Kilda Road; Flinders Street Station is a short walk across Princes Bridge. Public parking is at Southgate, Crown, and Wilson stations rather than on-street. A sessional room here gives a St Kilda Road address without a long commercial lease.",
    ],
    localContext: "on the St Kilda Road corridor",
    nearby: [
      { name: "South Yarra", href: "/locations/south-yarra" },
      { name: "South Melbourne", href: "/locations/south-melbourne" },
      { name: "Richmond", href: "/locations/richmond" },
      { name: "Camberwell", href: "/locations/camberwell" },
    ],
  }),
  brunswick: createLocationHub({
    slug: "brunswick",
    name: "Brunswick",
    image: SUBURB_HUBS.Brunswick.image,
    subtitle:
      "Inner-north therapy rooms along Sydney Road, with tram 19, the Upfield line, and Barkly Square.",
    overview: [
      "Sydney Road is Brunswick’s main spine for shopfront psychology practices and allied health rooms, from Brunswick Station through Jewell toward the city. The northern stretch of Lygon Street and Barkly Square add a second cluster for clients coming from Coburg, Carlton, and the inner north.",
      "Tram 19 runs the length of Sydney Road; the Upfield line stops at Brunswick, Jewell, and Anstey. Side streets off Sydney Road and the Barkly Square car park are more realistic than parking on the main road. Suites are often converted retail or first-floor rooms above the strip, with a shared waiting area inside the host clinic.",
    ],
    localContext: "along Sydney Road",
    nearby: [
      { name: "Fitzroy", href: "/locations/fitzroy" },
      { name: "Carlton", href: "/locations/carlton" },
      { name: "Richmond", href: "/locations/richmond" },
      { name: "Southbank", href: "/locations/southbank" },
    ],
  }),
  carlton: createLocationHub({
    slug: "carlton",
    name: "Carlton",
    image: SUBURB_HUBS.Carlton.image,
    subtitle:
      "Lygon Street and University of Melbourne consulting rooms, next to the Parkville hospital precinct.",
    overview: [
      "Carlton sits on the CBD fringe around Lygon Street, the University of Melbourne, and Carlton Gardens. Parkville’s hospital precinct — Royal Melbourne, the Royal Women’s, and Peter Mac — is next door, so many practitioners take sessional rooms here for students, hospital staff, and inner-city clients.",
      "Swanston Street trams and trams 1 and 6 on Lygon Street connect to Melbourne Central and the university. Parking is tight: University Square and paid Lygon Street bays, with much of the residential grid permit-only. Consulting rooms tend to be terrace clinics and small medical buildings between Lygon Street and the gardens.",
    ],
    localContext: "near Lygon Street and the University of Melbourne",
    nearby: [
      { name: "Fitzroy", href: "/locations/fitzroy" },
      { name: "Brunswick", href: "/locations/brunswick" },
      { name: "Richmond", href: "/locations/richmond" },
      { name: "Southbank", href: "/locations/southbank" },
    ],
  }),
  fitzroy: createLocationHub({
    slug: "fitzroy",
    name: "Fitzroy",
    image: SUBURB_HUBS.Fitzroy.image,
    subtitle:
      "Terrace-house therapy rooms near Brunswick Street, Gertrude Street, and St Vincent’s Hospital.",
    overview: [
      "Fitzroy is a compact inner-north grid around Brunswick Street, Gertrude Street, and Smith Street. St Vincent’s Hospital on Victoria Parade anchors a specialist precinct at the southern edge, with terrace-house psychology and allied health clinics through the rest of the suburb.",
      "Trams 11, 12, 86, and 96 run Brunswick, Gertrude, and Smith Streets; Parliament Station is a short tram or walk. On-street parking is scarce and mostly permit-only; paid car parks sit toward Victoria Parade and Smith Street. Rooms are typically shared suites in converted terraces rather than large medical centres.",
    ],
    localContext: "near Brunswick Street and St Vincent’s Hospital",
    nearby: [
      { name: "Carlton", href: "/locations/carlton" },
      { name: "Brunswick", href: "/locations/brunswick" },
      { name: "Richmond", href: "/locations/richmond" },
      { name: "Hawthorn", href: "/locations/hawthorn" },
    ],
  }),
  hawthorn: createLocationHub({
    slug: "hawthorn",
    name: "Hawthorn",
    image: SUBURB_HUBS.Hawthorn.image,
    subtitle:
      "Glenferrie Road allied health rooms beside Swinburne, Hawthorn Station, and Glenferrie Station.",
    overview: [
      "Glenferrie Road is Hawthorn’s main clinical strip, from Glenferrie Station past Swinburne University toward Burwood Road. Inner-east psychology, speech, and allied health practices occupy first-floor suites above the shopping strip, between Hawthorn Station and Auburn Village.",
      "Lilydale, Belgrave, and Alamein trains stop at Hawthorn and Glenferrie; tram 16 runs Glenferrie Road, with trams 70 and 75 on nearby corridors. Glenferrie Road has paid bays and Swinburne visitor parking; side streets are largely permit-only. Day-rate rooms here suit practitioners whose clients already use the Glenferrie shops or the university.",
    ],
    localContext: "along Glenferrie Road",
    nearby: [
      { name: "Camberwell", href: "/locations/camberwell" },
      { name: "Richmond", href: "/locations/richmond" },
      { name: "South Yarra", href: "/locations/south-yarra" },
      { name: "Carlton", href: "/locations/carlton" },
    ],
  }),
  "south-melbourne": createLocationHub({
    slug: "south-melbourne",
    name: "South Melbourne",
    image: SUBURB_HUBS["South Melbourne"].image,
    subtitle:
      "Clarendon Street and South Melbourne Market consulting rooms, on the light rail between Albert Park and the CBD.",
    overview: [
      "Clarendon Street and the South Melbourne Market sit between Albert Park, Port Phillip, and the CBD. Allied health and therapy rooms cluster in Clarendon Street commercial buildings and around the Town Hall, a short trip from Southbank and The Alfred on Commercial Road.",
      "Tram 96 (light rail) and trams 1 and 12 serve Clarendon Street and the market. Off-street parking is at the market, Clarendon Street car parks, and Albert Park; weekday on-street parks fill around the market. Suites often share a waiting room in mixed medical and allied health buildings.",
    ],
    localContext: "near Clarendon Street and the South Melbourne Market",
    nearby: [
      { name: "Southbank", href: "/locations/southbank" },
      { name: "South Yarra", href: "/locations/south-yarra" },
      { name: "Richmond", href: "/locations/richmond" },
      { name: "Camberwell", href: "/locations/camberwell" },
    ],
  }),
};

export function slugFromSuburbName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function getLocationHub(slug) {
  const key = String(slug || "")
    .trim()
    .toLowerCase();
  return LOCATION_HUBS[key] || null;
}

export function locationHubList() {
  return Object.values(LOCATION_HUBS);
}

export function hrefForSuburb(suburb) {
  const hub = getLocationHub(slugFromSuburbName(suburb));
  if (hub) return `/locations/${hub.slug}`;
  const query = String(suburb || "").trim();
  if (!query) return "/rooms";
  return `/rooms?suburb=${encodeURIComponent(query)}`;
}

export function filterRoomsBySuburb(rooms, suburbName) {
  const key = String(suburbName || "").trim().toLowerCase();
  return (rooms || []).filter(
    (room) => String(room.suburb || "").trim().toLowerCase() === key,
  );
}

export function locationListingStats(rooms, typicalMinCents = 12000) {
  const prices = (rooms || [])
    .map((room) => Number(room.price_per_day_cents) || 0)
    .filter((cents) => cents > 0);
  return {
    count: rooms?.length ?? 0,
    minCents: prices.length ? Math.min(...prices) : typicalMinCents,
    fromListings: prices.length > 0,
  };
}

export function locationFaqJsonLd(hub) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (hub?.faqs ?? []).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
