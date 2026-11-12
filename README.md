# Template Undangan Digital Adat Madura V6

Template statis untuk GitHub Pages dengan:
- Sampul ilustrasi rumah adat Madura.
- Setelah sampul dibuka, tampil poster foto pasangan full-portrait.
- Tema merah marun, hitam, dan emas.
- Pilihan jenis acara: akad + resepsi atau resepsi saja.
- Lokasi acara dengan peta Google Maps, alamat dan tombol petunjuk.
- Pilihan bank/e-wallet (DANA, BRI, BCA, BNI, Mandiri, BSI, BTN, CIMB, Permata, Danamon, Jatim, OVO, GoPay, ShopeePay, LinkAja).
- Kartu rekening satu metode pada satu waktu, lengkap dengan logo teks/warna, nomor dan tombol salin.
- Upload foto langsung dari galeri HP/komputer; foto diperkecil dan ditampilkan sebagai pratinjau lokal.
- Upload musik singkat langsung dari perangkat.
- Seluruh tulisan undangan dapat diubah di halaman admin.
- Tautan undangan memakai data terkompresi di bagian fragment URL agar data tidak dikirim sebagai query ke server GitHub Pages.
- Tautan versi lama V4-V6 dengan `?data=` tetap bisa dibaca.
- Pratinjau foto mempunyai fallback untuk browser tanpa `createImageBitmap`.
- Tanggal akad dan resepsi disimpan terpisah saat membuat/memuat draf.

## Unggah ke GitHub Pages
Ekstrak ZIP lalu unggah semua file dan folder ke root repository yang sama. Timpa file lama jika diminta. Pastikan file `rumah-adat-madura-illustration.svg` ikut diunggah di root repository.

## Halaman
- Website undangan: `index.html`
- Admin/pembuat: `admin.html`

## Cara menggunakan
1. Buka `admin.html`.
2. Masukkan identitas kedua mempelai.
3. Pilih jenis acara: akad + resepsi atau resepsi saja.
4. Isi tanggal, jam acara, jam tamu hadir dan lokasi.
5. Klik bidang pilih foto untuk membuka galeri HP/folder komputer. Lihat pratinjau foto.
6. Pilih musik singkat jika diperlukan.
7. Tambahkan metode pembayaran yang ingin ditampilkan. Bisa menambahkan beberapa bank/e-wallet.
8. Ubah teks pada bagian "Semua tulisan undangan" jika diperlukan.
9. Klik Buat tautan. Tautan akan membawa data pasangan dan foto/musik terkompresi.
10. Unduh JSON sebagai cadangan dan simpan tautan yang sudah dibuat.

## Batasan hosting gratis statis
GitHub Pages tidak menjalankan database atau server. Data draf tersimpan di browser yang digunakan, bukan tersinkron antar perangkat. Data setiap undangan dibawa melalui parameter tautan. Foto dikompresi ke WebP/JPEG dan audio dibatasi agar tautan lebih pendek. Bagian fragment tidak dikirim ke server GitHub Pages, tetapi tetap menjadi bagian tautan yang dibagikan. Tautan masih dapat panjang bila foto dan audio sama-sama disertakan; simpan JSON dan tautan sebagai cadangan. RSVP diteruskan ke WhatsApp panitia; tidak ada rekap otomatis ke server.
