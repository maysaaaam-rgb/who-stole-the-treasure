-- ============================================================================
-- ENGLISH ADVENTURE ACADEMY — SMARTBOARD 6-DIGIT PHONE VERIFICATION CODES
-- Run once in Supabase Dashboard -> SQL Editor
-- ============================================================================
-- Security invariants:
--  1. Only the authenticated teacher (public.is_teacher()) can insert/check/delete codes.
--  2. Public/anon callers have ZERO direct SELECT/INSERT/UPDATE/DELETE access.
--  3. Payloads are AES-256-GCM encrypted client-side with PBKDF2-SHA256 (300,000 rounds)
--     keyed by the 6-digit code, containing ONLY a short-lived access_token (never refresh_token).
--  4. Codes expire in 90 seconds, are atomically deleted on first valid claim (single-use),
--     and self-destruct immediately after 5 failed attempts globally.

create table if not exists public.smartboard_pairings (
  code_hash text primary key,
  salt text not null,
  iv text not null,
  ciphertext text not null,
  failed_attempts int not null default 0,
  expires_at timestamptz not null default (now() + interval '90 seconds'),
  created_at timestamptz not null default now()
);

alter table public.smartboard_pairings enable row level security;

drop policy if exists "teacher select pairing" on public.smartboard_pairings;
drop policy if exists "teacher insert pairing" on public.smartboard_pairings;
drop policy if exists "teacher delete pairing" on public.smartboard_pairings;

create policy "teacher select pairing" on public.smartboard_pairings
  for select to authenticated
  using (public.is_teacher());

create policy "teacher insert pairing" on public.smartboard_pairings
  for insert to authenticated
  with check (public.is_teacher());

create policy "teacher delete pairing" on public.smartboard_pairings
  for delete to authenticated
  using (public.is_teacher());

create or replace function public.claim_smartboard_pairing(p_code_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.smartboard_pairings%rowtype;
begin
  delete from public.smartboard_pairings where expires_at <= now();

  delete from public.smartboard_pairings
  where code_hash = p_code_hash
    and expires_at > now()
    and failed_attempts < 5
  returning * into v_row;

  if found then
    return jsonb_build_object(
      'ok', true,
      'salt', v_row.salt,
      'iv', v_row.iv,
      'ciphertext', v_row.ciphertext
    );
  end if;

  update public.smartboard_pairings
  set failed_attempts = failed_attempts + 1
  where expires_at > now();

  delete from public.smartboard_pairings
  where failed_attempts >= 5;

  return jsonb_build_object('ok', false);
end;
$$;

grant execute on function public.claim_smartboard_pairing(text) to anon, authenticated;
