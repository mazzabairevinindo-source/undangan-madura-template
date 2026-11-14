PATCH PEMULIHAN KATA SANDI ADMIN — UNDANGAN MADURA

Isi patch:
- admin.html: memuat Supabase JS UMD dan memakai admin.js yang diperbarui.
- admin.js: menambahkan tombol "Lupa kata sandi?" dan mengirim permintaan recovery.
- reset-password.html: halaman aman untuk mengatur kata sandi baru setelah tautan email diverifikasi.

Pemasangan:
1. Unggah dan timpa admin.html dan admin.js ke root repository.
2. Tambahkan reset-password.html ke root repository.
3. Jangan mengganti supabase-config.js jika Project URL dan Publishable Key sudah benar.
4. Di Supabase Dashboard > Authentication > URL Configuration, pastikan Additional Redirect URLs memuat:
   https://mazzabairevinindo-source.github.io/undangan-madura-template/reset-password.html
   Jika wildcard berikut sudah ada, halaman ini sudah termasuk:
   https://mazzabairevinindo-source.github.io/undangan-madura-template/**
5. Commit changes dan tunggu GitHub Pages terbit.
6. Buka admin.html, isi email admin, klik "Lupa kata sandi?" satu kali.
7. Buka email pemulihan terbaru pada browser yang sama dan klik tautannya.
8. Buat kata sandi baru di halaman reset-password.html, lalu kembali ke admin untuk login.

Catatan:
- Jangan mengirim password, access token, recovery token, atau Secret Key kepada siapa pun.
- Supabase Free memiliki pembatasan email bawaan; jika muncul rate limit, tunggu sebelum meminta email baru.
- Patch ini hanya menambahkan alur pemulihan akun dan tidak mengubah file desain utama.
