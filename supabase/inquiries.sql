-- Paste this in the Supabase SQL Editor and run it.
-- rooms.id is uuid, so room_id is uuid with ON DELETE SET NULL to keep
-- inquiry history if a listing is removed. RLS is on with no public
-- policies, so only the service role (server) can read or write.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'contact'
    check (source in ('contact', 'listing')),
  room_id uuid references public.rooms (id) on delete set null,
  room_title text,
  room_slug text,
  host_email text,
  sender_name text not null,
  sender_email text not null,
  sender_phone text,
  topic text,
  message text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed'))
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_room_id_idx
  on public.inquiries (room_id);

create index if not exists inquiries_status_idx
  on public.inquiries (status);

alter table public.inquiries enable row level security;
