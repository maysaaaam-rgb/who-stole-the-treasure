-- The Magic Book: a PRIVATE storage folder for the real textbook pages.
-- Only the signed-in teacher (public.is_teacher()) can read or upload. Run once in Supabase > SQL Editor.
insert into storage.buckets (id, name, public, file_size_limit)
values ('magic-book', 'magic-book', false, 52428800)
on conflict (id) do update set public = false;

drop policy if exists "magic-book teacher read" on storage.objects;
drop policy if exists "magic-book teacher upload" on storage.objects;
drop policy if exists "magic-book teacher update" on storage.objects;

create policy "magic-book teacher read" on storage.objects for select to authenticated
  using (bucket_id = 'magic-book' and public.is_teacher());
create policy "magic-book teacher upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'magic-book' and public.is_teacher());
create policy "magic-book teacher update" on storage.objects for update to authenticated
  using (bucket_id = 'magic-book' and public.is_teacher())
  with check (bucket_id = 'magic-book' and public.is_teacher());
