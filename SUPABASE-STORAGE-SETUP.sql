-- UNDANGAN MADURA: STORAGE MEDIA SETUP
-- Jalankan SEKALI di Supabase Dashboard > SQL Editor > New query.
-- Bucket publik diperlukan agar foto dan musik dapat ditampilkan kepada tamu.
-- Upload hanya diizinkan bagi pengguna yang sudah login (admin).

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'undangan-media',
  'undangan-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'audio/mpeg',
    'audio/ogg',
    'audio/mp4',
    'audio/aac',
    'audio/x-m4a',
    'audio/webm',
    'audio/wav'
  ]::text[]
)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Hapus kebijakan lama dengan nama yang sama bila patch dijalankan ulang.
drop policy if exists "Authenticated admins can upload undangan media" on storage.objects;

-- File diunggah ke bucket ini hanya oleh pengguna yang sudah login.
-- Nama objek memakai folder slug dan nama acak agar tidak menimpa foto lama.
create policy "Authenticated admins can upload undangan media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'undangan-media');

-- Catatan: bucket bersifat PUBLIC agar foto/musik dapat dimuat di website undangan.
-- Operasi upload tetap dilindungi RLS di atas. Tidak ada akses publik untuk upload,
-- update, delete, atau daftar isi bucket.
