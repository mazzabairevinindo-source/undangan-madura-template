# Undangan Digital Adat Madura — V8 Stabil

Paket ini dibuat ulang dengan acuan tiga gambar desain yang diberikan pengguna:
- Sampul memakai gambar rumah adat Madura dalam bingkai batik.
- Setelah tombol buka ditekan, halaman menampilkan foto pasangan sebagai poster potret.
- Isi undangan menggunakan panel krem, merah marun, hitam, dan emas.
- Admin bergaya dashboard dengan navigasi bagian dan pilihan bank/e-wallet berbentuk tombol.

## File
- `index.html` — halaman publik undangan.
- `admin.html` — pembuat undangan.
- `config.js` — teks dan data bawaan.
- `script.js` — pembacaan tautan, tampilan undangan, lokasi, rekening, countdown, RSVP.
- `admin.js` — editor semua teks, unggah media, pilihan bank, simpan draf, buat tautan.
- `style.css`, `admin.css` — desain responsif.
- `rumah-adat-madura-cover.jpg` — gambar sampul rumah adat Madura yang diberikan pengguna.

## Cara memakai
1. Buka `admin.html`.
2. Isi nama kedua mempelai.
3. Pilih jenis acara: akad + resepsi, resepsi saja, atau akad saja.
4. Isi tanggal dan jam sesuai jenis acara.
5. Isi lokasi dan tautan Google Maps.
6. Klik tombol pilih foto untuk memilih dari galeri HP / folder komputer.
7. Pilih metode pembayaran lewat tombol bank/e-wallet, lalu isi nomor dan nama pemilik. Tambahkan metode lain bila perlu.
8. Buka bagian Semua Teks untuk mengubah judul, salam, paragraf, label, tombol, RSVP dan penutup.
9. Masukkan nomor WhatsApp panitia.
10. Klik Buat / Perbarui Undangan, lalu salin tautannya dan unduh JSON sebagai cadangan.

## Uji sebelum dibagikan
- Buka tautan yang dihasilkan di tab baru.
- Tekan tombol Buka Undangan.
- Coba tombol Musik jika musik sudah diunggah.
- Klik pilihan bank/e-wallet pada bagian hadiah.
- Isi RSVP untuk membuka pesan WhatsApp.

## Catatan teknis
GitHub Pages adalah hosting statis, tanpa database atau server. Data undangan disimpan di dalam fragmen tautan yang terkompresi; draf admin hanya tersimpan pada browser/perangkat admin. Foto diperkecil otomatis agar tautan tidak terlalu besar. File musik dibatasi 100 KB untuk menghindari tautan yang terlalu panjang. RSVP diteruskan melalui WhatsApp dan tidak direkap otomatis di server.
