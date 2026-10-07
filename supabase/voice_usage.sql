-- Studio voice changer: counts how many transformations were made each day (so ElevenLabs credits cannot run away).
-- Run this once: Supabase dashboard > SQL Editor > paste > Run.
create table if not exists public.voice_usage (
  day date primary key,
  n   integer not null default 0
);

-- Nobody can read or write it from the browser. Only the edge function (service role) can.
alter table public.voice_usage enable row level security;
