# Undangan Digital Adat Madura — V8.2 Direct Link Patch

Patch ini mempertahankan desain dan fitur undangan V8.2, serta menyederhanakan pembuatan tautan.

## Perubahan
- Tombol **Buat / Perbarui Undangan** langsung menghasilkan tautan yang membawa data undangan dalam fragmen URL terkompresi.
- Tidak perlu mengunduh JSON, mengunggah file ke folder `data`, atau melakukan commit GitHub untuk setiap undangan.
- Bagian slug/alamat setelah nama repository dibatasi maksimal **50 karakter**, termasuk awalan `undangan-pernikahan-`.
- Musik dapat dipilih dari perangkat dengan batas ukuran file **500 KB**.
- Unduh JSON tetap tersedia hanya sebagai cadangan opsional.
- `script.js` membaca payload terkompresi dari URL, dan tetap mendukung tautan lama yang menggunakan file JSON di folder `data`.

## File patch
Unggah dan timpa file berikut ke root repository:
- `admin.js`
- `admin.html`
- `script.js`
- `README.md`

`404.html` pada repository harus tetap ada dan tetap memuat `script.js` serta `style.css` dengan alamat absolut `/undangan-madura-template/...` agar jalur slug dapat ditangani oleh GitHub Pages. Tidak perlu mengubah desain/CSS atau file gambar.

## Cara menggunakan
1. Unggah patch dan commit satu kali.
2. Buka `admin.html`.
3. Isi data undangan seperti biasa.
4. Masukkan nama tamu, lalu klik **Buat / Perbarui Undangan**.
5. Klik **Salin Tautan** atau **Lihat Hasil**. Tidak ada unggahan JSON manual.
6. Gunakan **Simpan Cadangan JSON (opsional)** untuk arsip data.

## Batasan teknis
GitHub Pages adalah hosting statis. Agar tidak memerlukan database atau unggahan JSON setiap kali, data dibawa di fragmen URL setelah tanda `#` dan dikompresi gzip pada browser yang mendukungnya. Fragmen ini tidak dikirim ke server, tetapi dibaca oleh JavaScript saat undangan dibuka. Karena itu, slug dapat singkat (maksimal 50 karakter), sementara keseluruhan URL tetap lebih panjang sesuai foto, musik, dan data undangan. Musik dibatasi 500 KB sebelum dimasukkan ke tautan. Tautan berukuran besar sebaiknya diuji sebelum dibagikan luas.

Draf admin tetap lokal pada browser yang digunakan. RSVP diteruskan lewat WhatsApp dan tidak disimpan sebagai rekap server.
