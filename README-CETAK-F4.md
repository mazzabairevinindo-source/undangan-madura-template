# Cetak Undangan Madura - F4 + Sampul Amplop

Tambahan ini tidak mengganti desain online V8.2/V8.3.1. Cukup tambahkan dua file ke root repository GitHub Pages:

- `cetak.html`
- `cetak-cover-f4.png`

## Cara memasang
1. Ekstrak ZIP.
2. Buka repository `undangan-madura-template`.
3. Pilih **Add file → Upload files**.
4. Unggah `cetak.html` dan `cetak-cover-f4.png` ke root repository (sejajar dengan `index.html`).
5. Commit dengan pesan `Add F4 printable invitation and envelope`.

Tidak perlu mengganti `index.html`, `script.js`, `admin.js`, CSS utama, konfigurasi Supabase, atau SQL.

## Cara mencetak satu undangan
1. Pastikan undangan sudah disimpan melalui admin dan mendapat tautan publik.
2. Buka `https://mazzabairevinindo-source.github.io/undangan-madura-template/cetak.html`.
3. Tempel seluruh tautan undangan atau slug ke kotak di bagian atas.
4. Klik **Muat Undangan**. Halaman mengambil data dari RPC `get_public_invitation` yang sudah digunakan website.
5. Klik **Cetak / Simpan PDF**.

## Isi paket cetak
Tiga lembar ukuran F4 (215 × 330 mm):
1. **Sampul kartu** dengan ilustrasi rumah adat Madura dan nama tamu.
2. **Isi undangan** dengan nama mempelai, orang tua, akad/resepsi sesuai jenis acara, waktu kehadiran, lokasi, dan rekening jika diisi.
3. **Pola amplop** dengan ukuran jadi sekitar 120 × 170 mm, untuk kartu sekitar 110 × 165 mm. Garis utuh = potong; garis putus-putus = lipat. Kedua sayap samping direkatkan dengan lem. Tutup bawah dilipat ke atas, kemudian tutup atas dilipat ke bawah.

## Pengaturan cetak Chrome/Edge
- Paper size: **F4/Folio 215 × 330 mm**.
- Scale: **100% / Actual size**.
- Margins: **None / Tidak ada**.
- Background graphics: **ON**.
- Headers and footers: **OFF**.

Jika printer tidak memiliki pilihan F4/Folio, tambahkan ukuran kertas khusus 215 × 330 mm di pengaturan driver printer. Jangan gunakan opsi Fit to page karena dapat mengubah ukuran kartu dan pola amplop.

Catatan kualitas: halaman cetak tidak melakukan kompresi foto lagi. Foto ditampilkan dari data gambar yang tersimpan. Ketajaman hasil cetak tetap dipengaruhi resolusi file sumber dan kemampuan printer.
