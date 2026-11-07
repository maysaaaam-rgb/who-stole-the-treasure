-- Smart Board AI: counts AI requests and pictures each day (so the Gemini bill can never run away).
-- Run this once: Supabase dashboard > SQL Editor > paste > Run.
create table if not exists public.ai_usage (
  day  date not null,
  kind text not null check (kind in ('text', 'image')),
  n    integer not null default 0,
  primary key (day, kind)
);

-- Nobody can read or write it from the browser. Only the edge function (service role) can.
alter table public.ai_usage enable row level security;
