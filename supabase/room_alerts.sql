-- Paste this in the Supabase SQL Editor and run it.
-- Unique (email, suburb) is a column constraint so PostgREST upserts
-- with onConflict: "email,suburb" work. The app always stores lowercase
-- email and hub slug. RLS is on with no public policies, so only the
-- service role (server action) can read or write.

create table if not exists public.room_alerts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  suburb text not null,
  days text[] not null default '{}',
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, suburb)
);

create index if not exists room_alerts_suburb_idx
  on public.room_alerts (suburb);

create index if not exists room_alerts_created_at_idx
  on public.room_alerts (created_at desc);

alter table public.room_alerts enable row level security;
