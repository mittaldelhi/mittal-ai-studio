insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio screenshots public read" on storage.objects;
drop policy if exists "portfolio screenshots admin upload" on storage.objects;
drop policy if exists "portfolio screenshots admin update" on storage.objects;

create policy "portfolio screenshots public read"
on storage.objects for select
using (bucket_id = 'portfolio');

create policy "portfolio screenshots admin upload"
on storage.objects for insert
with check (bucket_id = 'portfolio' and is_admin());

create policy "portfolio screenshots admin update"
on storage.objects for update
using (bucket_id = 'portfolio' and is_admin());

update storage.buckets
set file_size_limit = 15728640
where id = 'avatars';

notify pgrst, 'reload schema';
