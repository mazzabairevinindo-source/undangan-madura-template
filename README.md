# Template Undangan Digital Adat Madura — V4 Editable Text

## Semua teks undangan dapat diubah
Buka `admin.html`. Pada bagian **Semua tulisan undangan**, tersedia kolom untuk mengubah seluruh salinan yang tampil kepada tamu serta pesan status dan format pesan WhatsApp: tulisan sampul, salam, pengantar, judul bagian, label mempelai, kutipan, nama acara, jam hadir, lokasi, hitung mundur, hadiah/rekening, label dan pilihan RSVP, placeholder, tombol, serta penutup. Perubahan teks ikut dimasukkan ke tautan undangan masing-masing.

Label dan petunjuk pada halaman admin bersifat instruksi pengelola, bukan teks undangan.

## File utama
- `index.html`: halaman undangan.
- `admin.html`: pembuat tautan undangan dan editor seluruh teks.
- `config.js`: teks bawaan dan data contoh.
- `script.js`: renderer halaman undangan.
- `admin.js`: formulir pembuat undangan.
- `style.css`, `admin.css`: desain halaman.
- `batik-madura.svg`: motif ornamen.
- `batik-madura-fabric.jpg`: foto kain batik dekoratif tanpa tulisan.

## Menggunakan berulang kali
1. Buka `/admin.html`.
2. Isi nama, keluarga, acara, jam kehadiran, lokasi, foto, musik, rekening, WhatsApp.
3. Buka grup **Semua tulisan undangan** untuk mengedit copy undangan.
4. Tekan **Buat tautan undangan**.
5. Masukkan nama tamu untuk membuat tautan personal. Ulangi untuk pasangan lain atau nama tamu berbeda.
6. Unduh file JSON sebagai cadangan dan simpan tautannya.

## Batasan hosting gratis statis
GitHub Pages tidak menyediakan database atau autentikasi admin. Draf disimpan pada browser/perangkat lokal. Data acara dan teks ikut dibawa dalam URL `?data=...`; URL dapat menjadi panjang jika teks sangat banyak. RSVP dikirim langsung ke WhatsApp panitia, bukan tersimpan sebagai daftar online. Jangan memakai kata sandi atau informasi rahasia di data undangan.

Foto pasangan dan audio harus diunggah ke repository atau tersedia melalui URL publik. Foto kain batik dekoratif sudah disertakan.

## Publikasi
Unggah semua file ke root repository GitHub yang sama, timpa file yang namanya sama, commit ke branch `main`, dan pertahankan GitHub Pages pada `main` serta folder `/ (root)`.
