# AlliedRooms — MVP Product Specification & Architecture Plan

Last updated: 2026-08-29 (design direction: warm professional — Airbnb grammar, Lyvi job-to-be-done, Figma trends used sparingly)  
Stack: Next.js 15 (App Router, JavaScript) · Tailwind CSS 4 · daisyUI 5 · Vercel · Supabase (Phase 4)

This document is the execution spec for the AlliedRooms MVP. Build against it in order. Prefer the file paths, data shapes, and URL contracts below over improvising new ones.

---

## 1. Vision & Core Philosophy

### Product Goal

Build a fast, transparent, peer-to-peer directory for sessional allied health and therapy consulting rooms across Australia.

AlliedRooms lets practitioners find a room by suburb, modality, and day — and see the day rate before they inquire. Clinic hosts list spare rooms without a broker, a membership wall, or a “call for pricing” loop.

### The Gap We Fill

| Model | Example | Friction | AlliedRooms response |
| --- | --- | --- | --- |
| Legacy classifieds | Med.Estate | Cluttered listings, opaque rates, weak local search | Clean directory, `$/day` on every card, suburb-first search |
| Sales / broker | Wellshare | Intermediated, slow, often aimed at sale or long lease | Direct practitioner ↔ host, sessional by default |
| Generic marketplaces | Airbnb-like but not clinical | No modality, amenities, or clinical fit | Room type, HICAPS, plinth, soundproofing, parking as first-class filters |

Core promises for MVP:

1. **100% upfront day-rate transparency.** Every published listing shows `price_per_day` as `$120 / day`. No ranges, no “POA”.
2. **Hyper-local suburb search.** Melbourne suburbs first (Richmond, South Yarra, Fitzroy, Hawthorn, Brunswick, then adjacent hubs). State is stored from day one so NSW/QLD can land later without a schema rewrite.
3. **Direct inquiry.** No in-app chat in MVP. Sticky `mailto:` with a prefilled subject and body. Host email is the conversion event.
4. **Peer-to-peer, not classifieds chrome.** Hosts are practices, not anonymous posters. Show `practice_name` and a host badge on the room page.

### Who it is for

- **Seekers:** Psychologists, counsellors, physios, osteos, chiropractors, dietitians, speech pathologists, and other registered allied health practitioners who need 1–3 days/week in a clinical room.
- **Hosts:** Established clinics with an unused consulting room, wanting sessional income without a property agent.

### MVP non-goals (explicit)

- Payments, bookings, calendars, or availability locking
- In-app messaging or accounts for seekers
- Reviews, ratings, or verification badges beyond a simple host practice name
- National coverage at launch (schema is national; seed data is Melbourne)
- Map pins as a primary UI (suburb text search is enough)
- Scraping or reproducing competitor listing copy/photos

### Success for this MVP

A practitioner in Richmond can filter to talk-therapy rooms available Wednesday under $180/day, open a listing, and send a prefilled inquiry email in under 60 seconds.

---

## 2. Design System & Aesthetics (Lyvi + Airbnb + Modern Web Trends)

**North star:** A consulting room at 10am — natural light, timber, a plant, a quiet waiting room. Clean and current, not a hospital portal, not a beauty marketplace, not a travel app.

Temperature: **warm professional.** Plenty of whitespace and clear type (so it feels competent), cream paper and a clay/sage accent (so it does not feel dead). Copy is plain Australian. Prices are always visible.

References: [Lyvi](https://lyvi.com.au/) (AU space marketplace, direct inquire, price on the card), [Airbnb Australia](https://www.airbnb.com.au/) (search capsule + photo cards + calm hierarchy), [Figma 2026 web design trends](https://www.figma.com/resource-library/web-design-trends/) (take a few, ignore most).

### 2.0 What we steal vs what we leave

**From Airbnb — steal the grammar, not the holiday vibe**

- Search is the product: one floating capsule (Where + What + When), sticky, obvious.
- Every card shows a picture (or a strong fallback), a place name, and a price. No hunting.
- Generous padding, rounded media, one primary action per view.
- Filters that update the URL so a Wednesday-in-Richmond search is shareable.

Do not copy travel photography, guest reviews as social proof for MVP, or map-first browsing.

**From Lyvi — steal the marketplace job, not the chrome**

Lyvi is the closest AU analogue: list a space, explore spaces, connect directly, no in-platform booking. Steal:

- Price + cadence on the card (`$120 / day`, never “POA” or mixed `/Flexible` `/Week` `/Month` on the same grid).
- A loud **List a room** path for hosts.
- Detail page built to convert: sticky inquiry, host visible, amenities as badges.

Leave behind: promo tickers, emoji listing titles, cluttered card chrome, “featured” ribbons on everything, and a feed that feels like a classifieds wall. AlliedRooms should feel quieter and more clinical-professional than Lyvi’s beauty/wellness mix.

**From Figma 2026 — adopt only what fits a health directory**

Figma’s list is broad (3D, gamification, collage, neo-brutalism, dark-mode-first). Most of it would make a therapy-room product feel gimmicky. Use this filter: *Would this still feel trustworthy if a psychologist opened it between clients?*

| Trend | AlliedRooms |
| --- | --- |
| Bold / kinetic type | **Yes, hero only.** Oversized Unbounded headline. No animated letter-scramble. |
| Motion | **Yes, micro.** Hover `scale-[1.01]`, pill fill, 150–200ms colour. No scrollytelling. |
| Tactile / soft depth | **Yes, light.** 1px `neutral-200` borders, cream fills, soft ambient shadow. Not full neumorphism. |
| Bento layouts | **Yes, Home stats only.** Asymmetric suburb tiles, then a normal listing grid. |
| Glass | **Yes, chrome only.** Sticky header, search capsule, inquiry card. |
| Sustainable / accessible | **Yes.** SVG placeholders, compressed images later, keyboard pills, real contrast. |
| Vibrant “dopamine” colour | **No.** One warm accent, not neons. |
| Dark mode default | **No for MVP.** Consulting rooms are daylight. Optional later. |
| 3D, WebGL, AR tours | **No.** |
| Experimental nav, radial menus | **No.** Home / Rooms / List a room. |
| Gamification, chatbots, voice | **No.** |
| Maximalism, collage, neo-brutalism, retrofuturism | **No.** |

### 2.1 Type

Already in `src/app/layout.js`. Keep both; assign roles so the site feels human, not a dashboard.

| Role | Font | Use |
| --- | --- | --- |
| Display | **Unbounded** | Hero, section titles, `$120 / day`. Confident, slightly geometric — modern without being tech-bro. |
| Warm accent type | **Cormorant** | Short host bios, the wordmark subtitle, one pull-quote on Home. Editorial warmth. |
| Body / UI | **System sans** (`ui-sans-serif` / `font-sans`) | Nav, forms, cards, filters. Cormorant is too soft for inputs and tables. |

Put `font-sans` on `body`. Do not set the whole document in Cormorant.

Hero: large Unbounded, two lines max, leftover space around it. Warm, not shouty.

```text
A consulting room,
by the day.

Sessional allied health spaces in Melbourne.
Suburb, day, and rate — before you inquire.
```

Tiny overlines only (`uppercase tracking-widest text-xs text-stone-500`), e.g. `Melbourne · VIC`. No all-caps headlines.

### 2.2 Colour & surface

Drop daisyUI `corporate` / `retro` as the public look (`layout.js` currently uses `data-theme="corporate"`). daisyUI can stay for unstyled primitives if needed; **brand surfaces are custom Tailwind**.

Palette is **cream + ink + clay**, not grey-on-grey and not Lyvi-bright.

| Token | Tailwind | Hex (lock these) | Use |
| --- | --- | --- | --- |
| Paper | `stone-50` | `#fafaf9` | Page background — warm off-white, not clinic fluorescent |
| Surface | `white` | `#ffffff` | Cards, capsule, inquiry |
| Ink | `stone-900` | `#1c1917` | Headings, price |
| Mute | `stone-500` | `#78716c` | Suburb · state, helper text |
| Line | `stone-200` | `#e7e5e4` | 1px borders |
| Clay | `orange-800` / custom `--clay` | `#9a3412` | Primary CTA, selected day pills, focus ring |
| Sage | `teal-800` / custom `--sage` | `#115e59` | Secondary: amenity ticks, “List a room” ghost, bento washes |
| Glass | `bg-white/75 backdrop-blur-md` | — | Header, search, sticky inquiry |

Clay is the heartbeat (inquiry, search submit). Sage is the calm (health, amenities). Never use both as competing filled buttons on the same row.

Shadows: `shadow-[0_12px_40px_-12px_rgb(28,25,23,0.12)]` — warm, low, like afternoon light. No cold blue-grey drop shadows. No neon glow.

Placeholders (no photos yet): soft sage-to-cream gradients + simple architectural SVG (window, chair, plinth) keyed by `room_type`. That keeps empty listings from looking like broken image boxes.

### 2.3 Airbnb-style search experience

Sticky, floating **search capsule** at the top of the viewport on Home and `/rooms`.

**Anatomy (one row on desktop, stacked on mobile):**

1. **Location** — text input, placeholder `Suburb or postcode` (e.g. Richmond)
2. **Modality** — select: `Any` · `Talk therapy` · `Bodywork` · `Medical`
3. **Day-of-week pills** — `Mon`–`Sun`, multi-select, selected = filled accent, unselected = `border border-neutral-200`
4. **Search** — pill button, submits to `/rooms` with query string

Behaviour:

- Capsule is `rounded-full` (desktop) / `rounded-2xl` (mobile wrap)
- `sticky top-4 z-40 mx-auto max-w-4xl border border-stone-200 bg-white/75 backdrop-blur-md`
- On Home, it sits in the hero (the search *is* the hero control, Airbnb-style). On `/rooms`, it sits under a slim glass header.
- Selected day pills: clay fill, white type. Unselected: `border-stone-200` on cream.
- Submit never waits on a server round-trip for MVP filters (client navigation via `useRouter` + `URLSearchParams`)

### 2.4 Lyvi-style room detail

`/rooms/[slug]` is a conversion page, not a blog post.

**Desktop grid:** `lg:grid-cols-[1fr_340px]`  
**Left:** gallery → title/suburb → amenity badges → description → host summary  
**Right:** sticky inquiry card (`lg:sticky lg:top-24`)

Sticky card **must** contain:

- Price as the hero of the card: `$120 / day` in Unbounded, large
- Cadence line: `Sessional · no lock-in` (copy, not a calculated field)
- Host practice badge: practice name + suburb
- Available days as small pills
- Primary CTA: `Inquire about this room` → `mailto:`
- Secondary: host phone as `tel:` if present

Mobile: inquiry card collapses to a bottom glass bar (`fixed bottom-0`) with price + CTA, so the gallery can be full-width.

### 2.5 Modern UI styling (Tailwind)

**Bento grid (Home + suburb stats)**

Home “Melbourne health hubs” section uses an asymmetric Bento, not a uniform 3-column card row.

Suggested `grid-cols-4 grid-rows-2` on desktop:

| Cell | Span | Content |
| --- | --- | --- |
| Richmond | `col-span-2 row-span-2` | Large suburb tile, count of rooms, CTA `Browse Richmond` |
| Fitzroy | `col-span-1` | Compact stat tile |
| South Yarra | `col-span-1` | Compact stat tile |
| Hawthorn | `col-span-2` | Wide tile with one-line blurb |
| Brunswick | `col-span-2` | Wide tile |

Each tile: `rounded-2xl border border-stone-200 bg-white p-6 transition-transform duration-200 hover:scale-[1.01]`  
No photos required in MVP — sage/cream wash + `room_type` SVG, not stock Unsplash (Lyvi leans on stock; we should not).

**Tactile UI & glassmorphism**

- Cards and inputs: `border border-stone-200`, `rounded-2xl`, white on stone-50
- Tags: `rounded-full px-3 py-1 text-sm border border-stone-200`
- Headers / search / inquiry: `bg-white/75 backdrop-blur-md`
- Focus: `focus-visible:ring-2 focus-visible:ring-orange-800/25`
- Inquiry CTA: clay fill, `rounded-full`, not a sharp rectangle

**Micro-interactions (motion, kept quiet)**

- RoomCard hover: `hover:scale-[1.01]` + the warm ambient shadow
- Pill toggle: `transition-colors duration-150`
- Filter changes: URL replace, no full reload
- Inquiry button: `active:scale-[0.99]`
- Hero headline: optional 200ms fade-in on first paint — once, not on every scroll

**Explicitly do not**

- Parallax, autoplay video, custom cursors, marquee strips
- Promo banners above the header (Lyvi’s “12 months free” pattern)
- Dark glass on a dark page
- Mixed price units on one grid

The listing **grid** stays even (Airbnb). Bento is only for suburb stats on Home, so the product still scans like a directory.

### 2.6 Component inventory (build these once)

| Component | Path | Notes |
| --- | --- | --- |
| `SiteHeader` | `src/components/SiteHeader.js` | Logo, Rooms, List a room. Glass, sticky. |
| `SearchBar` | `src/components/SearchBar.js` | Airbnb capsule. Props: `suburb`, `roomType`, `days`, `onChange` or form GET to `/rooms`. |
| `RoomCard` | `src/components/RoomCard.js` | Image/fallback, title, suburb, type pill, `$n / day`, available days. |
| `RoomGrid` | `src/components/RoomGrid.js` | Responsive `grid gap-6 sm:grid-cols-2 xl:grid-cols-3`. |
| `FilterBar` | `src/components/FilterBar.js` | `/rooms` only: suburb, type tabs, day pills, max price. |
| `AmenityBadge` | `src/components/AmenityBadge.js` | Icon + label. |
| `InquiryCard` | `src/components/InquiryCard.js` | Lyvi sticky card + mailto builder. |
| `SuburbBento` | `src/components/SuburbBento.js` | Home stats grid. |
| `ImageGallery` | `src/components/ImageGallery.js` | Main image + thumb strip; SVG fallback if `image_urls` empty. |
| `HostBadge` | `src/components/HostBadge.js` | Practice name, suburb, optional website. |

---

## 3. Database Schema & Architecture (Supabase / Postgres)

Phase 2–3 run on a mock module that **mirrors** these tables. Phase 4 replaces the mock with Supabase without changing component props.

IDs: `uuid`. Timestamps: `timestamptz`. Money: integer **cents** in the database (`price_per_day_cents`) so we never store `$120.00` as float. UI always formats with `formatAUD(cents)`.

### 3.1 JavaScript shapes (source of truth for UI)

```js
// lib/types.js — documentation-only shapes (JSDoc)

/**
 * @typedef {'talk_therapy' | 'bodywork' | 'medical'} RoomType
 * @typedef {'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun'} DayKey
 * @typedef {'soundproofing'|'hicaps'|'plinth'|'parking'|'waiting_room'|'wheelchair'|'wifi'|'kitchen'} AmenityKey
 * @typedef {'VIC'|'NSW'|'QLD'|'SA'|'WA'|'TAS'|'NT'|'ACT'} AusState
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} practice_name
 * @property {string} contact_email
 * @property {string|null} phone
 * @property {string|null} website_url
 * @property {string} created_at
 */

/**
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} host_id
 * @property {string} title
 * @property {string} slug          // unique, kebab-case
 * @property {string} suburb
 * @property {AusState} state
 * @property {number} price_per_day_cents
 * @property {RoomType} room_type
 * @property {DayKey[]} available_days
 * @property {AmenityKey[]} amenities
 * @property {string[]} image_urls
 * @property {string} description
 * @property {boolean} is_published
 * @property {string} created_at
 * @property {Profile} [host]       // joined in queries / mock
 */
```

Display helpers (put in `lib/format.js`):

```js
export const ROOM_TYPE_LABEL = {
  talk_therapy: 'Talk therapy',
  bodywork: 'Bodywork',
  medical: 'Medical',
}

export const DAY_LABEL = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

export function formatAUDFromCents(cents) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function pricePerDayLabel(cents) {
  return `${formatAUDFromCents(cents)} / day`
}
```

UI copy always uses `/ day`, never `/session` or `/hr`, unless we add those price units later.

### 3.2 SQL (Supabase)

```sql
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  practice_name text not null,
  contact_email text not null,
  phone text,
  website_url text,
  created_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null unique,
  suburb text not null,
  state text not null check (state in ('VIC','NSW','QLD','SA','WA','TAS','NT','ACT')),
  price_per_day_cents integer not null check (price_per_day_cents > 0),
  room_type text not null check (room_type in ('talk_therapy','bodywork','medical')),
  available_days text[] not null default '{}',
  amenities text[] not null default '{}',
  image_urls text[] not null default '{}',
  description text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index rooms_suburb_idx on public.rooms (lower(suburb));
create index rooms_published_idx on public.rooms (is_published);
create index rooms_type_idx on public.rooms (room_type);
```

Row Level Security (Phase 4):

- Public `select` on `rooms` where `is_published = true`, with a join to `profiles` exposing `practice_name`, `website_url` only (not email/phone) **or** expose contact on the room page because inquiry is the product. MVP choice: **email and phone are visible on published rooms** (directory model, like a clinic website). Document this in the host wizard.
- `insert` on `rooms` + `profiles` via the list-a-room server action using the service role **or** an authenticated host login. Phase 5 can start with a server action + honeypot, no Auth, and flip to Supabase Auth immediately after if spam appears.

### 3.3 Storage

Bucket: `room-photos`  
Path: `{room_id}/{index}.jpg`  
Public read. Hosts upload in Phase 5; seed listings may have empty `image_urls`.

### 3.4 Data access layer

Single module so pages never talk to Supabase directly:

```
lib/rooms.js
  getPublishedRooms(filters) → Room[]
  getRoomBySlug(slug) → Room | null
  getSuburbStats() → { suburb, count }[]
  getFeaturedRooms(limit = 6) → Room[]
  createListing(payload) → { room, profile }   // Phase 5
```

Phase 2–3: implement `lib/rooms.js` against `lib/mockData.js`.  
Phase 4: swap the internals; keep the function signatures.

---

## 4. MVP Route Structure & User Flows (Next.js App Router)

All routes live under `src/app/` (this repo already uses `src/`).

Shared chrome: `src/app/layout.js` wraps `SiteHeader` + `{children}` + a real footer (Rooms, List a room, Melbourne, email). Set metadata to AlliedRooms.

### Screen 1 — `src/app/page.js` (Home)

**Job:** Orient, search, and jump into a suburb or a recent room.

**Layout (top → bottom):**

1. Full-width hero on paper/gradient. Kinetic headline + one-sentence sub (`Sessional allied health rooms across Melbourne. Rates on every listing.`).
2. Airbnb `SearchBar` overlapping the hero (negative margin or pinned in the hero column).
3. `SuburbBento` — counts derived from published rooms.
4. “Recently listed” — `RoomGrid` of 6 newest published rooms.
5. Host CTA band — “Have a spare consulting room?” → `/list-a-room`.

**Search submit:** `GET /rooms?suburb=richmond&type=talk_therapy&day=wed&day=thu`  
Empty fields are omitted.

No auth. Server-render the bento + recent rooms (Phase 2: import mock at request time).

### Screen 2 — `src/app/rooms/page.js` (Discovery)

**Job:** Instant, shareable, filterable feed.

This page is a **client-driven filter shell** with a server-friendly URL.

**Query contract:**

| Param | Repeatable | Example | Maps to |
| --- | --- | --- | --- |
| `suburb` | no | `richmond` | case-insensitive suburb contains / exact |
| `type` | no | `talk_therapy` | `room_type` |
| `day` | yes | `day=wed&day=fri` | room must include **all** selected days |
| `max` | no | `180` | max **dollars** per day (convert to cents in filter) |

Unknown params ignored. Missing params = no constraint.

**UI:**

- Sticky glass `SearchBar` or the denser `FilterBar`
- Room type as **tabs** (Any / Talk therapy / Bodywork / Medical)
- Available days as **pill checkboxes**
- Max price as a slider (`$80`–`$400`, step `$10`, default `$400`)
- Result count: `12 rooms in Richmond`
- Empty state: “No rooms match. Clear filters or list a room.”

**URL sync:** `useSearchParams` + `router.replace(pathname + '?' + params, { scroll: false })` on every filter change. Filters must be restorable from a pasted link.

**Performance:** Phase 2–3 filter in memory on the client from the mock array (≤25 rows). Phase 4: either keep client filter if still small, or pass params into `getPublishedRooms` (SQL `ilike`, `=`, `available_days @> array[...]`, `price_per_day_cents <= n`).

### Screen 3 — `src/app/rooms/[slug]/page.js` (Detail)

**Job:** Convince and convert to email.

**Layout:** see §2.4.

**Gallery:** first `image_urls[0]` large; rest as thumbs. If empty, show a **category SVG** keyed by `room_type` (talk / bodywork / medical) — never a competitor photo.

**Amenity badges (show only if present):**

| Key | Label on badge |
| --- | --- |
| `soundproofing` | Soundproofing |
| `hicaps` | HICAPS |
| `plinth` | Plinth / treatment table |
| `parking` | Parking |
| `waiting_room` | Waiting room |
| `wheelchair` | Wheelchair access |
| `wifi` | Wifi |
| `kitchen` | Kitchen / tea point |

**Host summary:** practice name, suburb + state, website if any, 2–4 sentence `description` from the room (room copy, not scraped clinic About pages — write original seed blurbs).

**Inquiry `mailto:` (required format):**

```
To: {host.contact_email}
Subject: Inquiry — {room.title} ({room.suburb}) via AlliedRooms
Body:
Hi {practice_name},

I'm interested in your room "{title}" in {suburb} listed at {price} / day.

Days I'm looking for: {seeker can edit}
About me: {seeker can edit}

Sent via AlliedRooms
```

Use `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`.

`generateStaticParams` can prebuild slugs from mock/seed. `notFound()` if slug missing or unpublished.

### Screen 4 — `src/app/list-a-room/page.js` (Host wizard)

**Job:** Capture a publishable listing without a full CMS.

**Three steps, one URL** (`?step=1` optional). Client state in React; submit once at the end.

| Step | Fields |
| --- | --- |
| 1. Practice | `practice_name`, `contact_email`, `phone`, `website_url` |
| 2. Room | `title`, `suburb`, `state` (default VIC), `room_type`, `price_per_day` (dollars input → cents), `available_days`, `amenities` (checkbox grid), `description` |
| 3. Review | Read-only summary + “Publish listing” (sets `is_published: true`) + photo note (“photos after we add storage”) |

Validation: email required, suburb required, price > 0, at least one available day. Slug: `slugify(title + '-' + suburb)` with a numeric suffix if collision.

Phase 2–3: wizard UI only; submit `console.log` or toast “Supabase connects in Phase 4”.  
Phase 5: server action writes profile + room.

No multi-room dashboard in MVP. One form, one listing per submit. Hosts can submit twice.

### Site-wide navigation

```
AlliedRooms          Rooms          List a room
```

Footer repeats those plus a one-line privacy note: listing contact details are public.

---

## 5. Cold Start & Seeding Strategy (Non-Infringing)

### Principles

- Seed **original** titles and descriptions. Do not copy Med.Estate, Wellshare, or clinic marketing pages.
- Store only **factual, non-copyrightable** directory facts we are comfortable standing behind: suburb, indicative day rate, typical available days, a contact email we are allowed to use.
- **No scraped interior photos.** Use architectural SVG placeholders and `room_type` colour washes until a host claims the page.
- Outreach is permission-based: “We’ve drafted a public directory stub for a room in {suburb}. Claim it to edit copy and add photos, or ask us to remove it.”

### Volume & geography

**25 published rooms** across Melbourne inner-east / inner-north health hubs:

| Suburb | Target listings |
| --- | --- |
| Richmond | 6 |
| South Yarra | 5 |
| Fitzroy | 5 |
| Hawthorn | 5 |
| Brunswick | 4 |

Mix room types (~40% talk_therapy, ~40% bodywork, ~20% medical). Spread `available_days` so Wednesday/Thursday filters are non-empty. Prices in a believable 2026 Melbourne sessional band (e.g. $90–$250 / day) as **indicative** seed rates, flagged in outreach as “placeholder — update when you claim”.

### Seed files

```
lib/mockData.js      // Phase 2–3, also the source we upsert in Phase 5
lib/seed/placeholders.js  // SVG/component map by room_type
```

Each mock room includes a real-looking but **controlled** `contact_email` (e.g. a plus-address on the AlliedRooms inbox, or a documented placeholder `hello+richmond-1@…` until the host claims).

Do not put personal practitioner home addresses in the seed. Suburb + state only.

### Claim / outreach (manual in MVP)

Spreadsheet columns: slug, suburb, placeholder email, outreach date, claimed (y/n), take-down (y/n).  
Email template lives in the same spreadsheet, not in the app. No in-app claim token until after Phase 5.

When a host claims: replace email/phone, description, amenities, and `image_urls`. Keep the slug stable so `/rooms/richmond-consulting-1` does not 404.

---

## 6. Implementation Checklist & Sprint Phases

### Repo conventions

- JavaScript only (match existing `src/app/page.js`).
- App Router under `src/app`.
- Client components only where needed (`SearchBar`, `FilterBar`, wizard). Pages stay Server Components when they only fetch and render.
- Format prices only through `formatAUDFromCents` / `pricePerDayLabel`.
- No competitor assets in `public/`.

Suggested tree after Phase 3:

```
src/app/page.js
src/app/layout.js
src/app/rooms/page.js
src/app/rooms/[slug]/page.js
src/app/list-a-room/page.js
src/components/...
src/app/globals.css
lib/mockData.js
lib/rooms.js
lib/format.js
```

---

### Phase 1 (Done)

- [x] Next.js 15 App Router + Tailwind 4 + daisyUI
- [x] Git initialized
- [x] GitHub remote + Vercel project linked

Follow-ups (do at the start of Phase 2, not a separate product phase): rename site metadata from “Next Boiler” to AlliedRooms; add `SiteHeader` / footer; keep Next.js on a patched 15.5.x line for Vercel.

---

### Phase 2 — Mock data + Home primitives

**Build**

- [ ] `lib/format.js` + JSDoc types
- [ ] `lib/mockData.js` — at least 8 rooms (subset of the 25) so Home and cards are real
- [ ] `lib/rooms.js` mock implementation
- [ ] `RoomCard`, `RoomGrid`, `SearchBar`, `SuburbBento`, `SiteHeader`
- [ ] Home: hero, search capsule, bento, recent listings, host CTA
- [ ] Search navigates to `/rooms` with query params

**Done when:** Home looks like a directory, not a starter template; clicking Search lands on `/rooms?suburb=...`.

---

### Phase 3 — Discovery + detail + inquiry

**Build**

- [ ] `src/app/rooms/page.js` + `FilterBar` with URL sync (`suburb`, `type`, `day`, `max`)
- [ ] Instant client filter over mock data
- [ ] `src/app/rooms/[slug]/page.js` — gallery fallback, amenity badges, host summary
- [ ] `InquiryCard` with prefilled `mailto:`
- [ ] Empty states + `notFound()` for unknown slugs
- [ ] Responsive: bottom inquiry bar on small screens

**Done when:** A shareable URL like `/rooms?suburb=richmond&day=wednesday&type=talk_therapy` restores filters; a room page sends a correctly encoded mailto.

---

### Phase 4 — Supabase

**Build**

- [ ] Supabase project (ap-southeast-2), env in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and server-only service role if needed)
- [ ] Run SQL from §3.2; enable RLS
- [ ] Storage bucket `room-photos`
- [ ] Swap `lib/rooms.js` internals; keep exports stable
- [ ] Confirm Home / `/rooms` / `[slug]` still work against empty-then-seeded tables

**Done when:** Mock can be deleted or gated behind `USE_MOCK=true` for local UI work; production reads Postgres.

---

### Phase 5 — Host wizard + 25 Melbourne rooms

**Build**

- [ ] `src/app/list-a-room/page.js` three-step wizard + server action insert
- [ ] Slug uniqueness handling
- [ ] Seed script or SQL upsert for 25 original Melbourne listings + placeholder visuals
- [ ] Outreach spreadsheet + permission email
- [ ] Basic spam guard (honeypot + optional rate limit) on the wizard

**Done when:** A host can publish a room from the wizard; seekers can find seeded Richmond/Fitzroy/etc. listings with public day rates and a working inquiry email.

---

### Phase exit criteria (product)

| Check | Phase |
| --- | --- |
| `$ / day` visible on every card and detail page | 2 |
| Suburb + day + type filters round-trip through the URL | 3 |
| Inquiry mailto includes title, suburb, price | 3 |
| Published flag respected (drafts not listed) | 4 |
| 25 Melbourne rooms live, photos optional | 5 |

Ship Phase 3 publicly if Vercel/hosting is stable; Phase 4–5 can follow without changing the four-screen IA.
