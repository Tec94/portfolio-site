create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  project_type text not null check (char_length(project_type) between 2 and 80),
  timeline text not null check (char_length(timeline) between 2 and 80),
  budget_range text not null check (char_length(budget_range) between 2 and 80),
  message text not null check (char_length(message) between 20 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

revoke all on table public.contact_submissions from anon, authenticated;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

comment on table public.contact_submissions is
  'Insert-only contact inbox. Writes are performed by the submit-contact Edge Function.';
