-- Pupil avatars: cartoon heads made from pupils' photos.
-- PRIVATE storage: only the signed-in teacher (public.is_teacher()) can read, upload, change or delete.
-- Nothing here is ever public. Run once in Supabase > SQL Editor.
insert into storage.buckets (id, name, public, file_size_limit)
values ('pupil-avatars', 'pupil-avatars', false, 5242880)
on conflict (id) do update set public = false;

drop policy if exists "pupil-avatars teacher read" on storage.objects;
drop policy if exists "pupil-avatars teacher upload" on storage.objects;
drop policy if exists "pupil-avatars teacher update" on storage.objects;
drop policy if exists "pupil-avatars teacher delete" on storage.objects;

create policy "pupil-avatars teacher read" on storage.objects for select to authenticated
  using (bucket_id = 'pupil-avatars' and public.is_teacher());
create policy "pupil-avatars teacher upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'pupil-avatars' and public.is_teacher());
create policy "pupil-avatars teacher update" on storage.objects for update to authenticated
  using (bucket_id = 'pupil-avatars' and public.is_teacher())
  with check (bucket_id = 'pupil-avatars' and public.is_teacher());
create policy "pupil-avatars teacher delete" on storage.objects for delete to authenticated
  using (bucket_id = 'pupil-avatars' and public.is_teacher());
