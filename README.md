# Undangan Digital Adat Madura — V8.2 Pretty Permalink

Pembaruan ini mempertahankan desain dan fitur V8/V8.1, lalu menambahkan permalink bersih tanpa `?id=`.

## Format alamat
`https://mazzabairevinindo-source.github.io/undangan-madura-template/undangan-pernikahan-bapak-ibu-guru-yamista`

Bagian `/undangan-madura-template/` tetap ada karena alamat GitHub Pages ini menggunakan project site.

## Cara membuat undangan dengan alamat pendek
1. Buka `admin.html` dan isi data undangan seperti biasa.
2. Isi nama tamu, misalnya `Bapak/Ibu Guru Yamista`, lalu klik Buat / Perbarui Undangan.
3. Admin membuat alamat dengan slug `undangan-pernikahan-bapak-ibu-guru-yamista`.
4. Klik **Unduh Data JSON**. File akan bernama `undangan-pernikahan-bapak-ibu-guru-yamista.json`.
5. Klik **Unggah JSON ke GitHub** di halaman admin. Unggah file ke folder `data` pada repository, lalu klik **Commit changes** pada branch `main`.
6. Setelah GitHub Pages menerbitkan commit tersebut, alamat pendek dapat dibuka dan dibagikan.

## File tambahan
- `404.html`: fallback untuk menangani URL slug dan memuat desain V8 yang sama.
- `data/README.md`: memastikan folder `data` tersedia dan menjelaskan lokasi file JSON.

## Batasan hosting statis
GitHub Pages tidak memiliki database atau API tulis dari halaman admin. Karena itu, file data JSON untuk setiap slug harus diunggah dan di-commit ke folder `data`. Satu nama tamu menghasilkan satu slug; jika nama yang sama digunakan ulang, file JSON dengan nama sama akan diganti. Gunakan nama yang unik bila diperlukan.

Fitur V8 tetap dipertahankan: seluruh editor teks, upload foto/musik, pilihan akad/resepsi, lokasi Google Maps, rekening bank/e-wallet, countdown, RSVP WhatsApp, dan penyimpanan draf lokal. Tautan lama V8 dengan hash terkompresi juga tetap didukung.
