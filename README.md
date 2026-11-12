# Template Undangan Pernikahan Adat Madura – Versi 3

Versi desain yang diperbarui dengan ornamen batik Madura bergaya pesisir/gentongan, warna merah-biru-hijau-emas, bingkai lengkung, animasi sampul, elemen dekoratif, dan animasi saat halaman digulir. Motif SVG adalah interpretasi dekoratif baru yang terinspirasi dari ragam flora, sulur, dan warna batik Madura; bukan salinan satu motif tradisional tertentu.

## Cara mengubah data undangan
Edit file `config.js` saja untuk mengganti nama mempelai, nama orang tua, tanggal, waktu akad/resepsi, jam kehadiran tamu, alamat, tautan peta, WhatsApp panitia, rekening, foto, dan musik.

- `heroImage`: contoh `assets/foto/mempelai.jpg`
- `musicFile`: contoh `assets/musik/islami.mp3`
- `whatsappNumber`: nomor format internasional tanpa `+` atau spasi, misalnya `6281234567890`

Foto dan musik dapat ditambahkan kemudian. Pastikan Anda memiliki hak untuk menggunakan file musik tersebut.

## RSVP
Form mengirim konfirmasi dan pilihan jam kedatangan ke WhatsApp panitia. Template ini belum menyimpan RSVP ke database atau Google Sheets secara otomatis.

## Tautan nama tamu
Tambahkan `?to=Nama+Tamu` pada URL, misalnya:
`https://USERNAME.github.io/undangan-madura-template/?to=Keluarga+Bapak+Ahmad`

## Memperbarui repository GitHub
Unggah dan timpa file `index.html`, `style.css`, `script.js`, `config.js`, dan `README.md` pada root repository. Tambahkan juga `batik-madura.svg` pada root yang sama. Jangan meletakkan file-file ini di dalam folder lain.
