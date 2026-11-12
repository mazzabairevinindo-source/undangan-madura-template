# Template Undangan Pernikahan Adat Madura

Template website statis, responsif, bernuansa Madura modern dan islami.

## Cara mengganti data
1. Buka `config.js`.
2. Ubah nama mempelai, orang tua, tanggal, waktu akad/resepsi, jam kehadiran tamu, lokasi, dan tautan Google Maps.
3. Isi `whatsappNumber` dengan nomor panitia dalam format internasional tanpa tanda `+`, misalnya `6281234567890`.
4. Atur `bankName`, `accountNumber`, dan `accountHolder` di `config.js` jika ingin menampilkan rekening hadiah.
5. Unggah foto ke `assets/foto/`, lalu isi `heroImage` dengan path fotonya.
5. Unggah audio yang Anda punya hak untuk menggunakannya ke `assets/musik/`, lalu isi `musicFile`.

## RSVP
Form RSVP saat ini mengirim isi konfirmasi ke WhatsApp penyelenggara. Belum menyimpan rekap otomatis ke database/Google Sheets.

## Tautan nama tamu
Tambahkan parameter `?to=Nama+Tamu` pada URL, misalnya:
`https://USERNAME.github.io/undangan-madura-template/?to=Keluarga+Bapak+Ahmad`

## Publikasi GitHub Pages
1. Buka Settings repository.
2. Pilih Pages.
3. Pada Build and deployment, pilih Deploy from a branch.
4. Pilih branch `main` dan folder `/ (root)`, lalu Save.
5. Tunggu proses publikasi selesai. URL website akan muncul pada halaman Pages.
