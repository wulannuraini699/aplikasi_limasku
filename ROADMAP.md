# ROADMAP.md — Urutan Pengerjaan

Setiap fase menghasilkan sesuatu yang bisa dicoba di HP. Centang bila selesai.

## Fase 0 — Persiapan (sebelum coding)
- [x] Isi temuan wawancara di PRD.md §3 dan cocokkan dengan daftar fitur
- [x] Putuskan ketidaksesuaian rubrik (PRD.md §9) dan pertanyaan terbuka (PRD.md §10)
- [x] Tentukan nama aplikasi (LimasKu)
- [x] Buat repo GitHub baru + aktifkan GitHub Pages → https://wulannuraini699.github.io/aplikasi_limasku/

## Fase 1 — Kerangka dan Data
- [x] `index.html`, `css/style.css` (token warna dari DESAIN.md §3), router hash di `js/app.js`
- [x] `js/data/soal.js` dari KONTEN.md §2
- [x] `js/penilaian.js` + `tests/penilaian.test.html` (termasuk kasus ECF)
- **Hasil:** buka di HP, menu tampil, uji penilaian lulus semua

## Fase 2 — Gambar Limas
- [x] `js/limas-svg.js` dengan mode sorot: alas, tinggi, sisiTegak, segitigaPythagoras, selimut
- [x] Label angka di gambar, `<title>`/`<desc>` untuk aksesibilitas
- **Hasil:** halaman uji yang menampilkan semua mode gambar

## Fase 3 — Uji Kemampuan dan Hasil
- [x] Layar tahap (DESAIN.md §5) tanpa umpan balik selama mengerjakan
- [x] Simpan jawaban per tahap ke localStorage
- [x] Pembahasan per tahap setelah selesai
- [x] Halaman hasil + tombol "Unduh hasil" (CSV) dan "Salin hasil" (teks)
- **Hasil:** siswa bisa mengerjakan 5 soal, melihat pembahasan, dan mengunduh hasilnya

## Fase 4 — Modul Belajar dan Latihan
- [x] 5 kartu pre-training
- [x] Latihan L1 → L2 → L3 dengan soal paralel
- [x] Umpan balik + petunjuk bertingkat
- [x] Pertanyaan refleksi

## Fase 5 — Uji Coba dan Perbaikan
- [x] Uji otomatis di Chrome headless (alur utama, layar 360px, mode gelap, tanpa error)
- [ ] Uji keterbacaan dengan 2–3 siswa (catat di mana mereka bingung)
- [ ] Validasi ahli materi dan ahli media (jika penelitian R&D)
- [ ] Perbaiki, lalu uji coba kelas

## Fase 6 — Opsional
- [ ] PWA offline
- [ ] Jaring-jaring limas interaktif
