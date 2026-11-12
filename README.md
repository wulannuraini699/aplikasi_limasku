# LimasKu — Media Pembelajaran Limas

Aplikasi web untuk siswa SMP kelas VIII belajar bangun ruang **limas** langkah demi langkah,
dirancang dengan prinsip *Cognitive Load Theory* untuk melatih **mathematical literacy**.
Berjalan di HP dan browser laptop, tanpa server, tanpa instalasi.

## Fitur

| Menu | Isi |
|---|---|
| **Belajar** | 5 kartu konsep (unsur limas, volume & alasan ⅓, dua jenis tinggi, Pythagoras, selimut vs permukaan), masing-masing dengan cek cepat |
| **Latihan** | 5 soal cerita × 3 level: *Contoh* (worked example) → *Lengkapi* (separuh langkah) → *Mandiri*; umpan balik per langkah, petunjuk bertingkat, refleksi |
| **Uji Kemampuan** | 5 soal instrumen (skor maks 30, rubrik Tabel 2), tanpa petunjuk, bisa ditinggal & dilanjutkan, penilaian *error carried forward* |
| **Hasil** | Skor per soal/indikator, langkah yang perlu diulang, pembahasan, **unduh CSV** & **salin ringkasan** untuk guru |
| **Alat Hitung** | Volume, tinggi sisi tegak, luas selimut/permukaan — menampilkan langkahnya |
| Kalkulator & Kartu Rumus | Tersedia saat latihan (kalkulator juga saat uji) |

## Cara Menjalankan

**Paling mudah:** klik dua kali `index.html` (terbuka di browser).

**Dengan server lokal** (disarankan saat mengembangkan):
```
python -m http.server 8000
```
lalu buka `http://localhost:8000`.

**Mencoba di HP:** unggah folder ini ke GitHub, lalu aktifkan GitHub Pages
(Settings → Pages → Branch `main` / root). Bagikan tautannya ke siswa.

## Menjalankan Uji

```
node tests/jalankan-node.js
```
atau buka `tests/penilaian.test.html` di browser. Uji mencakup kunci jawaban sesuai instrumen,
skor total 30, penilaian *error carried forward*, input tidak valid, dan kalkulator.

## Mengubah Isi

- **Soal, kunci, petunjuk, pembahasan:** `js/data/soal.js` (dokumentasi di `KONTEN.md`).
  Soal latihan baru cukup memanggil templat dengan angka lain, mis. `soalVolume({ id: 'lat1-4', s: 15, t: 4 })`.
- **Kartu belajar & kartu rumus:** `js/data/materi.js`.
- **Warna & tampilan:** variabel di bagian atas `css/style.css`.
- Setelah mengubah soal, jalankan uji lagi.

## Dokumen Perencanaan

| File | Isi |
|---|---|
| [PRD.md](PRD.md) | Kebutuhan, temuan wawancara, daftar fitur |
| [DESAIN.md](DESAIN.md) | Desain antarmuka & alasan CLT |
| [KONTEN.md](KONTEN.md) | Soal, kunci, rubrik, materi |
| [ROADMAP.md](ROADMAP.md) | Tahapan pengerjaan |
| [CLAUDE.md](CLAUDE.md) | Aturan proyek untuk asisten AI |

## Data & Privasi

Semua data (nama panggilan, progres, hasil) hanya tersimpan di browser perangkat siswa
(`localStorage`). Tidak ada data yang dikirim ke internet. Hasil sampai ke guru hanya jika
siswa mengunduh/menyalin dan mengirimkannya sendiri.
