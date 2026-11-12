# CLAUDE.md — Panduan Kerja untuk Asisten AI

File ini dibaca otomatis oleh Claude Code setiap sesi. Isinya aturan proyek yang wajib diikuti
saat menulis kode. Detail kebutuhan ada di [PRD.md](PRD.md), detail tampilan di [DESAIN.md](DESAIN.md),
isi soal dan rubrik di [KONTEN.md](KONTEN.md), urutan pengerjaan di [ROADMAP.md](ROADMAP.md).

## Ringkasan Proyek

**LimasKu** (nama kerja) adalah aplikasi web pembelajaran bangun ruang **limas** untuk siswa SMP.
Tujuannya menurunkan *cognitive load* siswa agar kemampuan **mathematical literacy** (PISA) meningkat.
Aplikasi dipakai di smartphone (utama) dan browser laptop. Pembuat: mahasiswa S1 Pendidikan Matematika.

Aplikasi ini **media pembelajaran**, bukan instrumen penelitian: tidak ada pretest/posttest,
tidak ada server. Hasil Uji Kemampuan **diunduh manual** oleh siswa (CSV + salin teks).

## Stack Teknis (jangan diganti tanpa persetujuan)

- HTML + CSS + JavaScript murni (vanilla), **tanpa build step**, tanpa framework.
- Gambar limas dibuat dengan **SVG inline** (bukan gambar raster), agar label bisa disorot per bagian.
- Penyimpanan progres: `localStorage` (dibungkus try/catch). Tidak ada server/backend di MVP.
- Bisa di-hosting gratis di GitHub Pages. Opsional: PWA (manifest + service worker) agar bisa offline.
- Tidak memakai CDN wajib; aplikasi harus tetap jalan tanpa internet setelah dibuka.

## Struktur Folder Target

```
index.html            satu-satunya halaman; memuat semua skrip berurutan
css/style.css         satu file gaya, pakai CSS variables dari DESAIN.md
js/util.js            fmt angka, pembuat elemen h(), teks berwarna, lembar bawah (sheet)
js/penilaian.js       fungsi penskoran per tahap (murni, tanpa DOM, mudah diuji)
js/limas-svg.js       pembuat gambar limas SVG dengan bagian yang bisa disorot
js/data/materi.js     data 5 kartu modul pra-latihan
js/data/soal.js       templat soal berparameter → soal uji + soal paralel latihan (sumber: KONTEN.md)
js/storage.js         simpan/muat progres (localStorage, aman bila diblokir)
js/kalkulator.js      parser ekspresi aman (tanpa eval) + kalkulator di lembar bawah
js/unduh.js           buat CSV + teks ringkasan, tombol unduh dan salin
js/runner.js          mesin pengerjaan soal per tahap (mode latihan L1/L2/L3 dan uji)
js/app.js             router hash (#/belajar, #/latihan, #/uji, #/hasil, #/alat) dan layar-layar
tests/penilaian.test.js     kasus uji (dipakai bersama oleh html & node)
tests/penilaian.test.html   jalankan uji di browser
tests/jalankan-node.js      jalankan uji di terminal: node tests/jalankan-node.js
```

Skrip memakai pola *namespace global* `LK` (bukan ES module) agar `index.html` bisa dibuka
langsung dari file tanpa server. Urutan `<script>` di `index.html` penting.

## Prinsip Wajib (berasal dari Cognitive Load Theory)

1. **Satu langkah per layar.** Jangan tampilkan seluruh soal + semua isian sekaligus di HP.
   Soal dipecah sesuai *tahapan* rubrik di KONTEN.md.
2. **Teks dan gambar menyatu** (hindari *split-attention*): angka diketahui ditulis langsung
   pada gambar SVG, bukan di paragraf terpisah.
3. **Tanpa hiasan yang tidak membantu** (animasi dekoratif, maskot, musik). Setiap elemen
   visual harus punya fungsi belajar.
4. **Worked example → fading → mandiri.** Bantuan dikurangi bertahap sesuai keberhasilan siswa.
5. **Istilah konsisten.** Gunakan persis: "tinggi limas" (t), "tinggi sisi tegak" (tₛ),
   "sisi alas" (s), "luas alas", "luas selimut", "luas permukaan". Jangan bergantian dengan
   "apotema", "tinggi segitiga", dsb. kecuali sebagai penjelasan sekali.
6. **Uji Kemampuan tidak memberi petunjuk selama mengerjakan**; pembahasan per tahap baru
   muncul setelah semua soal selesai.

## Aturan Penilaian (jangan diubah tanpa persetujuan)

- Rubrik resmi = **Tabel 2** di KONTEN.md: 5 soal × skor maksimum 6 = **30**.
- **Error carried forward (ECF):** jika siswa salah di tahap awal tetapi tahap berikutnya
  dihitung benar *berdasarkan angka salahnya sendiri*, tahap berikutnya tetap diberi skor.
  Ini sesuai Pedoman Umum Penskoran (mengukur proses, bukan hanya jawaban akhir).
- Toleransi angka: bandingkan dengan selisih ≤ 0,01; terima koma atau titik desimal ("12,5" = "12.5").
- Fungsi di `penilaian.js` harus murni dan punya uji untuk setiap soal (jawaban benar penuh,
  salah di tahap 1 dengan ECF, input kosong, input bukan angka).

## Gaya Kode

- Bahasa antarmuka: **Bahasa Indonesia** yang ramah siswa SMP (kalimat pendek, kata sederhana).
- Nama variabel/fungsi boleh bahasa Indonesia, konsisten dalam satu file (`hitungSkor`, `luasAlas`).
- Mobile-first: rancang untuk lebar 360px dulu, baru diperlebar.
- Area sentuh minimal 44×44 px; input angka pakai `inputmode="decimal"`.
- Aksesibilitas: kontras teks ≥ 4.5:1, semua SVG punya `<title>`, jangan andalkan warna saja.

## Yang Tidak Boleh Dilakukan

- Jangan mengubah isi soal/kunci/rubrik di KONTEN.md tanpa diminta.
- Jangan menambah library atau backend tanpa persetujuan.
- Jangan mengumpulkan data pribadi siswa selain nama panggilan/kode siswa.

## Cara Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:
`python -m http.server 8000` lalu buka `http://localhost:8000`.
Uji di HP: gunakan mode responsif DevTools (360×740) dan uji langsung di HP lewat GitHub Pages.
