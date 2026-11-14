-- Practice Island: let a pupil's island show their own avatar.
-- Run once in Supabase (SQL Editor). Safe to run again.
--
-- What it does: given an island code, returns ONLY the avatar of the pupil who owns that code,
-- and only if the teacher has approved it: T-shirt colour, skin tone, clothes and the cartoon face.
-- It cannot list pupils, cannot read another pupil's avatar and cannot change anything.
create or replace function public.island_avatar(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $function$
declare
  v_sid text; v_entry jsonb; v_head text;
begin
  select description::jsonb -> 'codes' ->> p_code into v_sid
    from public.classes where id = 'class-island-sync';
  if v_sid is null then
    return null;
  end if;
  select description::jsonb -> 'approved' -> v_sid into v_entry
    from public.classes where id = 'class-pupil-avatars';
  if v_entry is null then
    return null;
  end if;
  select description into v_head
    from public.classes where id = 'class-pupil-avatar-head-' || v_sid;
  return jsonb_build_object(
    'tee', v_entry -> 'tee',
    'skin', v_entry -> 'skin',
    'gender', v_entry -> 'gender',
    'wear', coalesce(v_entry -> 'wear', '{}'::jsonb),
    'head', case when v_head like 'data:image/%' then v_head end
  );
end;
$function$;

revoke all on function public.island_avatar(text) from public;
grant execute on function public.island_avatar(text) to anon, authenticated;
