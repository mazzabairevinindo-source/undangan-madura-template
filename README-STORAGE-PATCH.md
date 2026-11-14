# V8.3 — Supabase Storage: Foto Asli + Musik 500 KB

Patch ini mempertahankan desain V8.2/V8.3. Perubahan hanya pada konfigurasi Supabase dan cara media diunggah.

## Konfigurasi yang sudah diisi
- Project URL: `https://qulivfsmhqgosgvufes.supabase.co`
- Publishable key: sudah dimasukkan ke `supabase-config.js` dari nilai yang diberikan pemilik project.
- Tabel: `invitations`
- Bucket: `undangan-media`

Publishable key memang ditujukan untuk aplikasi browser. Keamanan penulisan tetap bergantung pada RLS. Jangan pernah mengganti key tersebut dengan `sb_secret_...` atau `service_role`.

## Cara memasang patch
Unggah dan timpa hanya tiga file berikut ke root repository GitHub Pages:
1. `admin.js`
2. `admin.html`
3. `supabase-config.js`

Jangan mengganti `index.html`, `404.html`, `script.js`, `style.css`, `admin.css`, `config.js`, atau aset desain. Patch menggunakan struktur V8.3 yang sudah ada.

## Pengaturan Storage satu kali
1. Buka Supabase → SQL Editor → New query.
2. Buka `SUPABASE-STORAGE-SETUP.sql` dari paket patch ini.
3. Salin seluruh SQL ke SQL Editor dan tekan Run.
4. Pastikan hasilnya berhasil.

Tabel `public.invitations` dan fungsi `get_public_invitation` tidak dibuat ulang oleh SQL Storage ini karena sudah dibuat pada tahap sebelumnya.

## Perilaku unggah media
- Foto pasangan, pria, dan wanita diunggah sebagai objek `File` asli langsung ke Supabase Storage.
- Tidak menggunakan canvas, tidak melakukan resize, tidak mengubah format, dan tidak mengompres foto.
- Resolusi dan byte file asli dipertahankan saat disimpan. Tampilan website dapat menyesuaikan ukuran visual melalui CSS, tetapi file Storage tetap asli.
- Batas satu file pada project Supabase Free adalah 50 MB. Foto yang lebih besar ditolak apa adanya, bukan dikompres.
- Musik diunggah sebagai file asli dan dibatasi maksimal 500 KB.
- Database menyimpan URL publik media; URL pendek undangan hanya membawa slug.

## Keamanan dan privasi
Bucket `undangan-media` bersifat publik agar tamu dapat melihat foto/mendengar musik tanpa login. Artinya siapa pun yang memiliki URL langsung suatu file dapat mengakses file tersebut. Upload tetap hanya diizinkan untuk pengguna Supabase yang sudah login.

Pastikan pendaftaran pengguna publik Supabase dimatikan setelah akun admin dibuat. Jangan menambahkan Secret Key ke file website.

## Proses setelah patch terpasang
1. Buka `admin.html`.
2. Login menggunakan email dan password admin Supabase.
3. Isi undangan dan pilih foto dari perangkat.
4. Pilih musik maksimal 500 KB bila diperlukan.
5. Klik `Buat / Perbarui Undangan`.
6. Admin mengunggah media asli, menyimpan data undangan, lalu menghasilkan tautan singkat.

Pengujian upload dan baca data nyata memerlukan patch dipasang di GitHub Pages dan SQL Storage dijalankan pada project Supabase pemilik.
