# Template Undangan Digital Adat Madura — V5

Template statis untuk GitHub Pages. Tema visual diperbarui menjadi merah marun, hitam, dan emas dengan ilustrasi sampul rumah tradisional bernuansa Madura.

## File utama
- `index.html` — undangan untuk tamu
- `admin.html` — pembuat undangan
- `config.js`, `script.js`, `style.css` — data, fungsi, dan tampilan
- `admin.js`, `admin.css` — pembuat undangan
- `rumah-adat-madura-cover.jpg` — ilustrasi sampul

## Fitur
- Sampul bergambar rumah, tombol buka, transisi pembukaan dan animasi bagian saat digulir.
- Semua teks undangan dapat diedit dari halaman admin.
- Unggah foto dari perangkat melalui pemilih file (foto dikompres di browser).
- Pilih musik dari perangkat; MP3/OGG disarankan maksimal 300 KB.
- Lokasi acara dengan peta Google Maps tertanam dan tombol petunjuk lokasi.
- Kartu hadiah DANA dan BRI; tab hanya tampil jika nomor rekening diisi.
- Jam kedatangan tamu dan RSVP WhatsApp.
- Simpan draf di browser, buat tautan, unduh cadangan JSON.

## Cara memasang
1. Unggah semua file ke root repository GitHub Pages.
2. Commit langsung ke branch `main`.
3. Buka `https://USERNAME.github.io/NAMA-REPOSITORY/admin.html`.

## Batasan hosting statis
GitHub Pages tidak menyediakan database atau unggah server-side. Foto dan musik yang dipilih di admin akan dikompres/diubah menjadi data URL dan disertakan dalam tautan undangan. Gunakan foto terkompresi dan audio pendek agar tautan tidak terlalu panjang. Draf disimpan di browser perangkat admin; unduh JSON sebagai cadangan. RSVP diarahkan ke WhatsApp panitia, bukan disimpan ke database.
