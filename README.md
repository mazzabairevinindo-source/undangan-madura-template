# UNDANGAN MADURA — V8.3 SUPABASE SHORT LINK

Pembaruan ini mempertahankan desain undangan V8.2. Perubahan hanya pada penyimpanan dan pembacaan data supaya tautan tidak lagi membawa foto, musik, atau JSON di dalam URL.

## Hasil tautan
- Alamat dasar GitHub Pages: `https://mazzabairevinindo-source.github.io/undangan-madura-template/`
- Panjang alamat penuh dibatasi maksimal 150 karakter.
- Slug/path dibatasi otomatis agar alamat total tidak lebih dari 150 karakter.
- Musik tetap dibatasi maksimal 500 KB.
- Foto dan musik disimpan bersama data undangan di Supabase, bukan di URL.
- Tidak ada unggah JSON manual atau commit GitHub untuk setiap undangan.
- Tautan lama dengan payload `#v=...` dan file JSON lama tetap didukung sebagai kompatibilitas.

## Pengaturan satu kali

### A. Buat project Supabase
1. Buat akun dan project baru di Supabase.
2. Di Dashboard, salin **Project URL** dan **Publishable key** (`sb_publishable_...`). Pada project lama, key `anon` dapat digunakan.
3. Jangan gunakan `service_role` atau Secret key pada website.

### B. Buat tabel
1. Buka Supabase → SQL Editor → New query.
2. Buka file `SUPABASE-SETUP.sql` dari paket ini.
3. Salin seluruh isi SQL ke SQL Editor dan tekan Run.
4. SQL membuat tabel `invitations`, RLS, dan fungsi publik terbatas untuk membaca satu undangan berdasarkan slug.

### C. Buat akun admin
1. Buka Authentication → Users di Supabase.
2. Klik Add user / Invite user, lalu undang email admin yang akan dipakai.
3. Buka email undangan dan selesaikan pembuatan kata sandi. Pastikan akun sudah dikonfirmasi.
4. Matikan pendaftaran publik (public sign-ups) setelah admin selesai dibuat. Admin akan masuk dari halaman `admin.html`.

### D. Isi konfigurasi website
Buka `supabase-config.js` di repository dan ganti:
- `https://YOUR_PROJECT_REF.supabase.co` dengan Project URL Anda.
- `sb_publishable_REPLACE_WITH_YOUR_PUBLISHABLE_KEY` dengan Publishable key.

Simpan satu kali ke repository.

## File yang perlu diunggah ke root repository
Unggah dan timpa file berikut:
- `admin.html`
- `admin.js`
- `config.js`
- `index.html`
- `404.html`
- `script.js`
- `supabase-config.js` (setelah diisi URL dan Publishable key)
- `supabase-auth.css`

`SUPABASE-SETUP.sql` hanya untuk disalin ke SQL Editor Supabase; tidak perlu diunggah ke GitHub. `README.md` boleh diunggah sebagai panduan.

## Cara membuat undangan setelah pengaturan awal
1. Buka `admin.html`.
2. Masuk sekali dengan email dan kata sandi admin Supabase. Sesi akan diingat pada browser tersebut.
3. Isi undangan seperti biasa, termasuk foto dan musik (maksimal 500 KB).
4. Masukkan nama tamu.
5. Klik **Buat / Perbarui Undangan**.
6. Klik **Salin Tautan**.

Tidak perlu mengunduh JSON, membuka folder `data`, mengunggah file, atau melakukan commit GitHub setiap kali membuat undangan.

## Catatan keamanan dan operasional
- Browser hanya memakai Publishable key bersama RLS. Jangan pernah memasukkan Secret/service_role key di file website.
- Tamu membaca undangan melalui fungsi `get_public_invitation(slug)`. Tabel tidak memberi akses baca langsung kepada pengguna anonim.
- Penulisan/ubah data memerlukan akun Supabase yang sudah login.
- Foto dan musik disimpan sebagai data undangan di kolom JSONB. Musik dibatasi 500 KB dan foto dikompresi oleh admin.
- Draf lokal tetap tersimpan di browser admin. RSVP tetap diteruskan melalui WhatsApp, tidak menjadi rekap RSVP di Supabase.
- Karena URL harus <= 150 karakter dan alamat dasar sudah 68 karakter, slug dibatasi otomatis hingga maksimal 80 karakter.
