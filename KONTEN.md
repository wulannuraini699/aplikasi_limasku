# KONTEN.md — Soal, Kunci, Rubrik, dan Materi

Sumber: *Soal Mathematical Literacy: Bangun Ruang Limas*, **Tabel 2** (rubrik resmi, total 30).
File ini menjadi sumber data untuk `js/data/soal.js` dan `js/data/materi.js`.

Singkatan: s = sisi alas, t = tinggi limas, tₛ = tinggi sisi tegak, La = luas alas,
Ls = luas selimut, Lp = luas permukaan, V = volume.

---

## 1. Rumus yang Dipakai

| Besaran | Rumus |
|---|---|
| Luas alas persegi | La = s × s |
| Volume limas | V = ⅓ × La × t |
| Tinggi sisi tegak | tₛ = √(t² + (½s)²) |
| Luas satu sisi tegak | ½ × s × tₛ |
| Luas selimut | Ls = 4 × ½ × s × tₛ |
| Luas permukaan | Lp = La + Ls |

## 2. Soal Uji Kemampuan

Setiap tahap: `jenis` isian, `kunci`, `skor`, dan `ecf` (rumus untuk menghitung kunci dari
jawaban siswa sebelumnya bila memakai *error carried forward*).

### Soal 1 — Volume limas
**Indikator:** Employing Mathematical Concepts, Facts, and Procedures
**Soal:** Sebuah limas segiempat beraturan memiliki alas berbentuk persegi dengan panjang sisi
6 cm dan tinggi limas 4 cm. Tentukan volume limas tersebut. Tuliskan rumus yang kamu gunakan.

| Tahap | Isi | Jenis | Kunci | ECF | Skor |
|---|---|---|---|---|---|
| 1 | Rumus volume limas | pilih rumus | V = ⅓ × La × t | — | 1 |
| 2 | Luas alas | angka | 36 | — | 1 |
| 3 | Substitusi | pilih/isi | ⅓ × 36 × 4 | memakai La siswa (T2) | 1 |
| 4 | Hasil hitung | angka | 48 | ⅓ × T2 × 4 | 1 |
| 5 | Satuan | pilih satuan | cm³ | — | 1 |
| 6 | Kesimpulan | pilih kalimat | "Volume limas 48 cm³" | memakai nilai T4 | 1 |
| | | | | **Total** | **6** |

### Soal 2 — Membandingkan dua limas
**Indikator:** Mathematical Reasoning
**Soal:** Limas A beralas persegi dengan sisi 6 cm dan tinggi 9 cm. Limas B beralas persegi
dengan sisi 9 cm dan tinggi 6 cm. Andi berpendapat bahwa volume limas A lebih besar karena
limas A lebih tinggi. Apakah kamu setuju dengan pendapat Andi? Jelaskan dengan perhitungan.

| Tahap | Isi | Jenis | Kunci | ECF | Skor |
|---|---|---|---|---|---|
| 1 | Luas alas A dan B | 2 angka | 36 dan 81 | — | 1 (keduanya benar) |
| 2 | Volume A | angka | 108 | ⅓ × LaA × 9 | 1 |
| 3 | Volume B | angka | 162 | ⅓ × LaB × 6 | 1 |
| 4 | Membandingkan | pilih (A>B / A<B / sama) | B lebih besar | sesuai T2, T3 siswa | 1 |
| 5 | Keputusan | setuju / tidak setuju | tidak setuju | konsisten dengan T4 | 1 |
| 6 | Alasan | pilih alasan | volume ditentukan luas alas **dan** tinggi bersama-sama | — | 1 |

Pengecoh alasan: "Karena limas B lebih lebar", "Karena tinggi tidak berpengaruh pada volume",
"Karena limas yang lebih tinggi selalu lebih besar".

### Soal 3 — Atap pendopo
**Indikator:** Interpreting, Applying, and Evaluating Mathematical Outcomes
**Soal:** Atap sebuah pendopo berbentuk limas segiempat beraturan dengan alas persegi bersisi
8 m. Tinggi setiap sisi tegak atap (tinggi segitiga) adalah 5 m. Pak Rudi membeli genteng yang
cukup untuk menutup luas 70 m². Apakah genteng tersebut cukup untuk menutup seluruh permukaan
atap? Jelaskan dan berikan kesimpulanmu.

| Tahap | Isi | Jenis | Kunci | ECF | Skor |
|---|---|---|---|---|---|
| 1 | Menafsirkan konteks | pilih | atap = selimut (4 segitiga), alas tidak ditutup | — | 1 |
| 2 | Luas satu sisi tegak | angka | 20 | — | 1 |
| 3 | Luas seluruh atap | angka | 80 | 4 × T2 | 1 |
| 4 | Membandingkan | pilih (<, =, >) | 70 < 80 | sesuai T3 | 1 |
| 5 | Selisih | angka | 10 | \|T3 − 70\| | 1 |
| 6 | Kesimpulan | pilih | tidak cukup, perlu tambah minimal 10 m² | konsisten T4, T5 | 1 |

### Soal 4 — Informasi tidak langsung
**Indikator:** Employing Mathematical Concepts, Facts, and Procedures
**Soal:** Sebuah limas segiempat beraturan memiliki keliling alas 40 cm dan tinggi limas
12 cm. Tentukan luas permukaan limas tersebut. Tunjukkan cara kamu menentukan tinggi sisi tegaknya.

| Tahap | Isi | Jenis | Kunci | ECF | Skor |
|---|---|---|---|---|---|
| 1 | Sisi alas | angka | 10 | — | 1 |
| 2 | Tinggi sisi tegak (Pythagoras) | 2 sub-isian: ½s, lalu tₛ | 5 dan 13 | ½ × T1; √(12² + (½s)²) | **2** (1 per sub-isian) |
| 3 | Luas alas | angka | 100 | T1² | 1 |
| 4 | Luas selimut | angka | 260 | 4 × ½ × T1 × tₛ | 1 |
| 5 | Luas permukaan | angka | 360 | T3 + T4 | 1 |

### Soal 5 — Tenda
**Indikator:** Formulating Situations Mathematically
**Soal:** Pak Dedi akan membuat tenda berbentuk limas segiempat beraturan dari kain. Alas tenda
berbentuk persegi dengan sisi 6 m dan tinggi tenda 4 m. Kain hanya digunakan untuk keempat sisi
tegak (lantai tidak dilapisi kain). Berapa luas kain minimal yang dibutuhkan? Tunjukkan alasanmu.

| Tahap | Isi | Jenis | Kunci | ECF | Skor |
|---|---|---|---|---|---|
| 1 | Diketahui & ditanya | ketuk informasi | s = 6 m, t = 4 m; ditanya luas kain | — | 1 |
| 2 | Model | pilih | kain = selimut (4 sisi tegak), tanpa alas | — | 1 |
| 3 | Tinggi sisi tegak | angka | 5 | — | 1 |
| 4 | Luas satu sisi tegak | angka | 15 | ½ × 6 × T3 | 1 |
| 5 | Luas selimut | angka | 60 | 4 × T4 | 1 |
| 6 | Kesimpulan | pilih | kain minimal 60 m² | sesuai T5 | 1 |

### Rekap Indikator

| Soal | Indikator | Maks |
|---|---|---|
| 1 | Employing | 6 |
| 2 | Mathematical Reasoning | 6 |
| 3 | Interpreting, Applying, and Evaluating | 6 |
| 4 | Employing | 6 |
| 5 | Formulating | 6 |
| | **Total** | **30** |

## 3. Modul Pra-Latihan (Pre-training)

Kartu pendek (±40 kata + gambar), dibaca sebelum latihan soal cerita:

1. **Unsur limas** — alas, titik puncak, sisi tegak, rusuk. Gambar menyorot tiap unsur.
2. **Luas alas dan volume** — La = s × s; V = ⅓ × La × t. Ilustrasi: 3 limas mengisi 1 kubus/prisma.
3. **Dua jenis tinggi** — tinggi limas (t, tegak lurus alas, ungu) vs tinggi sisi tegak
   (tₛ, pada segitiga, oranye). *Konsep paling rawan tertukar.*
4. **Segitiga Pythagoras di dalam limas** — sisi t, ½s, tₛ; tₛ sisi miring.
5. **Selimut vs permukaan** — selimut = 4 segitiga; permukaan = selimut + alas.
   Contoh konteks: atap/tenda = selimut saja; kotak hadiah tertutup = permukaan.

Setiap kartu diakhiri 1 pertanyaan cek cepat (pilihan ganda).

## 4. Soal Paralel untuk Latihan

Struktur sama dengan soal uji, angka berbeda. Setiap soal punya 3 level dengan angka berbeda:
**L1 Contoh** (semua tahap sudah dikerjakan + penjelasan), **L2 Lengkapi** (separuh tahap awal
terisi, separuh akhir dikosongkan — *backward fading*), **L3 Mandiri**. Angka dipilih dari tripel
Pythagoras (3-4-5, 5-12-13, 6-8-10, 8-15-17) agar hasil bulat.

| Soal | L1 Contoh | L2 Lengkapi | L3 Mandiri |
|---|---|---|---|
| 1 Volume | s 9 cm, t 5 cm → La 81, V 135 cm³ | s 12 cm, t 7 cm → La 144, V 336 cm³ | s 6 cm, t 10 cm → La 36, V 120 cm³ |
| 2 Bandingkan | A: s 3, t 12 → 36 · B: s 6, t 5 → 60 → **B lebih besar**, tidak setuju | A: s 4, t 9 → 48 · B: s 6, t 4 → 48 → **sama besar**, tidak setuju | A: s 6, t 12 → 144 · B: s 8, t 3 → 64 → **A lebih besar**, setuju |
| 3 Atap | s 10 m, tₛ 6 m → 120 m²; genteng 130 m² → **cukup, sisa 10** | s 6 m, tₛ 4 m → 48 m²; genteng 40 m² → **kurang 8** | s 12 m, tₛ 10 m → 240 m²; genteng 240 m² → **pas** |
| 4 Keliling | kel 24 cm, t 4 cm → s 6, ½s 3, tₛ 5, Lp 36 + 60 = 96 cm² | kel 64 cm, t 15 cm → s 16, ½s 8, tₛ 17, Lp 256 + 544 = 800 cm² | kel 48 cm, t 8 cm → s 12, ½s 6, tₛ 10, Lp 144 + 240 = 384 cm² |
| 5 Tenda | s 8 m, t 3 m → tₛ 5, satu sisi 20, kain 80 m² | s 16 m, t 6 m → tₛ 10, satu sisi 80, kain 320 m² | s 12 m, t 8 m → tₛ 10, satu sisi 60, kain 240 m² |

Variasi jawaban (sama besar / A lebih besar / cukup / pas) sengaja dibuat agar siswa tidak
menebak pola "tidak setuju / tidak cukup" seperti pada soal uji.

## 5. Pertanyaan Refleksi (contoh)

- "Mengapa tinggi sisi tegak selalu lebih panjang daripada tinggi limas?"
  (benar: karena tₛ adalah sisi miring segitiga siku-siku)
- "Mengapa pada soal atap, alas tidak dihitung?"
- "Jika tinggi limas dijadikan dua kali, volumenya menjadi …?"

