-- Paste this in the Supabase SQL Editor and run it.
-- Manual cold-outreach log for clinics you contact about listing supply.
-- Edit rows in the Table Editor. RLS is on with no public policies, so
-- the website cannot read or write this table.

create table if not exists public.clinic_outreach (
  id uuid primary key default gen_random_uuid(),
  clinic_name text not null,
  email text not null,
  suburb text not null,
  responded boolean not null default false,
  notes text,
  contacted_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clinic_outreach_suburb_idx
  on public.clinic_outreach (suburb);

create index if not exists clinic_outreach_responded_idx
  on public.clinic_outreach (responded);

create index if not exists clinic_outreach_contacted_at_idx
  on public.clinic_outreach (contacted_at desc);

alter table public.clinic_outreach enable row level security;
