# PRD — Product Requirements Document
## LimasKu: Aplikasi Web Literasi Matematika Bangun Ruang Limas

| | |
|---|---|
| Versi | 0.1 (draf, sebelum coding) |
| Penyusun | Mahasiswa S1 Pendidikan Matematika |
| Status | Lengkap — siap dikembangkan (MVP v1.0) |

---

## 1. Latar Belakang

Soal *mathematical literacy* (model PISA) menuntut siswa memahami konteks cerita, memilih informasi
relevan, membuat model matematika, menghitung, lalu menafsirkan hasil. Pada materi limas, beban
kognitif siswa tinggi karena dalam satu soal mereka harus sekaligus:

- membaca cerita dan memisahkan informasi penting,
- membayangkan bangun 3D dari teks,
- membedakan **tinggi limas** dengan **tinggi sisi tegak**,
- memakai teorema Pythagoras di dalam limas,
- membedakan **luas selimut** dengan **luas permukaan**,
- menyimpulkan sesuai konteks (cukup/tidak cukup, setuju/tidak setuju).

Menurut *Cognitive Load Theory* (Sweller), memori kerja terbatas. Bila beban yang tidak perlu
(*extraneous*) tinggi dan beban materi (*intrinsic*) tidak dikelola, siswa kehabisan kapasitas
untuk membangun pemahaman (*germane*). Aplikasi ini dirancang untuk mengelola ketiga beban tersebut.

## 2. Tujuan

| Kode | Tujuan | Ukuran keberhasilan |
|---|---|---|
| T1 | Menurunkan beban kognitif siswa saat belajar limas | Siswa dapat menyelesaikan latihan per tahap tanpa bantuan guru; angket respon siswa menunjukkan materi "mudah dipahami" |
| T2 | Melatih kemampuan mathematical literacy | Siswa menyelesaikan Uji Kemampuan (maks 30) dan memahami tahap mana yang perlu diulang |
| T3 | Mudah dipakai di HP | Tidak ada keluhan tampilan terpotong; siswa tidak tersesat saat navigasi |
| T4 | Hasil belajar dapat dilaporkan | Siswa dapat mengunduh hasil (skor per soal dan per tahap) secara manual untuk diserahkan ke guru |

> **Keputusan:** aplikasi ini adalah **media pembelajaran**, bukan instrumen penelitian
> eksperimen. Tidak ada pretest/posttest. Hasil cukup **diunduh manual**, tanpa server.

## 3. Temuan Wawancara Siswa

Sumber: wawancara mahasiswa dengan satu siswa SMP (via panggilan video) tentang materi limas.

| No | Kutipan siswa | Analisis | Jenis beban kognitif | Fitur yang menjawab |
|---|---|---|---|---|
| 1 | "Jujur belum terlalu paham, kak. Apalagi kalau disuruh menghitung volumenya." | Pemahaman konsep dasar belum kuat sebelum masuk soal | Intrinsic (tinggi karena prasyarat belum dikuasai) | F03 modul pra-latihan, F06 contoh lengkap |
| 2 | "Saya suka bingung sama rumusnya, kak. Kadang lupa harus dikali berapa" | Siswa ingat bentuk rumus tetapi lupa faktor ⅓ — hafalan tanpa makna | Intrinsic | F03 kartu "mengapa ⅓", F17 kartu rumus selalu bisa dibuka saat latihan, F10 refleksi "mengapa ⅓" |
| 3 | "kalau angkanya besar juga suka salah menghitung" | Beban hitung (aritmetika) menghabiskan memori kerja sehingga tidak tersisa untuk memahami konteks | Extraneous (terhadap tujuan literasi) | F18 kalkulator bantu di semua mode, F05 perhitungan dipecah per tahap, petunjuk tahap 3 memecah hitungan (mis. 36 ÷ 3 dulu, baru × 12) |
| 4 | "saya masih suka kebalik antara tinggi limas sama tinggi sisi segitiganya" | Miskonsepsi utama materi limas; dua besaran mirip namanya dan tidak terlihat di gambar biasa | Intrinsic + extraneous (gambar statis tanpa penanda) | F03 kartu "Dua jenis tinggi", F04 gambar SVG dengan warna tetap (t ungu, tₛ oranye), istilah konsisten |
| 5 | "Saya bisa coba, kak, tapi takut salah. Biasanya saya harus menghitung manual dulu di kertas." | Kecemasan matematika; tidak ada umpan balik saat belajar sendiri | Extraneous (kecemasan memakan memori kerja) | F07 umpan balik netral per tahap + boleh mencoba lagi, tanpa timer, tanpa papan peringkat |
| 6 | "Kalau ada cara yang lebih gampang pasti membantu banget." / "Wah, berarti nggak perlu menghitung manual lagi, kak?" | Siswa tertarik pada alat hitung (program Python), tetapi berisiko hanya menyalin hasil tanpa paham | — | F19 Alat Hitung yang **menampilkan langkah**, bukan hanya hasil; latihan tetap menuntut siswa memilih rumus dan memodelkan |
| 7 | Contoh soal mahasiswa: luas alas 36 cm², tinggi 12 cm → 144 cm³ | Soal dengan luas alas langsung diketahui adalah titik awal yang cocok | — | Dipakai sebagai cek cepat di modul pra-latihan dan contoh di Alat Hitung |

**Kesimpulan untuk desain:** kesulitan siswa bukan pada membaca cerita saja, tetapi pada
(a) makna rumus, (b) membedakan dua jenis tinggi, dan (c) beban hitung. Maka aplikasi
memindahkan beban hitung ke kalkulator, memusatkan perhatian siswa pada **pemilihan rumus,
pemodelan, dan penafsiran** (inti mathematical literacy), dan memakai warna konsisten untuk
dua jenis tinggi.

## 4. Pengguna

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Siswa SMP kelas VIII** (pengguna utama) | Memakai HP Android kelas menengah, kuota terbatas, mudah bingung pada soal cerita panjang | Langkah jelas, gambar yang membantu, umpan balik langsung |
| **Guru** | Guru matematika yang memakai aplikasi di kelas | Menerima file hasil siswa (diunduh manual oleh siswa) berisi skor per soal/indikator |

## 5. Ruang Lingkup

**Termasuk (MVP):** materi limas segiempat beraturan beralas persegi: unsur limas, luas alas,
volume, tinggi sisi tegak (Pythagoras), luas selimut, luas permukaan; 5 soal instrumen; latihan
dengan soal paralel; penskoran otomatis per tahap.

**Tidak termasuk (MVP):** limas segitiga/segi-n, akun login, server/database, papan peringkat,
fitur chat, AI generatif.

## 6. Fitur

### Alur besar

```
Beranda → Modul Belajar → Latihan Bertahap → Uji Kemampuan → Hasil (unduh)
```

Siswa boleh langsung membuka bagian mana pun dari Beranda; urutan di atas hanya saran.

| ID | Fitur | Prioritas | Prinsip CLT |
|---|---|---|---|
| F01 | **Identitas singkat**: nama panggilan / kode siswa, kelas (tanpa data pribadi lain) | Wajib | — |
| F02 | **Uji Kemampuan**: 5 soal instrumen (KONTEN.md), tanpa petunjuk selama mengerjakan, dinilai per tahap; setelah selesai, siswa melihat pembahasan tiap tahap. Boleh diulang. | Wajib | Evaluasi diri |
| F03 | **Modul pra-latihan (pre-training)**: 5 kartu pendek mengenalkan unsur limas sebelum soal cerita (lihat KONTEN.md §3) | Wajib | Pre-training effect |
| F04 | **Gambar limas interaktif (SVG)**: bagian yang sedang dibahas disorot (alas, tinggi, sisi tegak, segitiga Pythagoras); angka ditulis di gambar | Wajib | Split-attention, spatial contiguity |
| F05 | **Pengerjaan per tahap**: soal dipecah sesuai tahapan rubrik; satu tahap per layar, isian angka + pilihan | Wajib | Segmenting |
| F06 | **Worked example → completion → mandiri**: Level 1 contoh lengkap dengan penjelasan; Level 2 sebagian tahap dikosongkan; Level 3 siswa mengerjakan semua tahap | Wajib | Worked-example & fading effect |
| F07 | **Umpan balik langsung per tahap** (mode Latihan): benar/salah + petunjuk bertingkat (petunjuk 1: konsep, petunjuk 2: rumus, petunjuk 3: langkah) | Wajib | Mengurangi pencarian buntu (means-ends) |
| F08 | **Kotak "Diketahui–Ditanya"** yang diisi siswa dengan mengetuk informasi di teks soal | Wajib | Formulating; mengurangi beban membaca |
| F09 | **Soal paralel**: angka berbeda dengan struktur sama untuk tiap soal instrumen (KONTEN.md §4) | Wajib | Latihan tanpa menghafal jawaban tes |
| F10 | **Pertanyaan refleksi singkat** setelah soal ("Mengapa tinggi sisi tegak tidak sama dengan tinggi limas?") — pilihan ganda | Sebaiknya | Self-explanation |
| F11 | ~~Skala beban kognitif~~ — **dihapus** (tidak diperlukan karena bukan penelitian eksperimen; mengurangi isian yang tidak perlu) | — | — |
| F12 | **Halaman hasil**: skor total /30, skor per indikator, tahap yang perlu diulang + tautan ke latihan terkait | Wajib | — |
| F13 | **Unduh hasil manual**: tombol "Unduh hasil" (file CSV yang bisa dibuka di Excel) dan "Salin hasil" (teks untuk dikirim lewat WhatsApp/LMS) | Wajib | T4 |
| F17 | **Kartu rumus**: tombol "Rumus" di layar latihan membuka daftar rumus berwarna (tidak tersedia di Uji Kemampuan karena tahap 1 menanyakan rumus) | Wajib | Mengurangi beban mengingat (temuan 2) |
| F18 | **Kalkulator bantu**: kalkulator sederhana dengan tombol ⅓, √, dan x² di semua mode | Wajib | Memindahkan beban aritmetika (temuan 3) |
| F19 | **Alat Hitung**: volume, tinggi sisi tegak, luas selimut/permukaan — menampilkan langkah lengkap (pengembangan dari program Python di wawancara) | Wajib | Worked example sesuai permintaan siswa (temuan 6) |
| F14 | **Fading bertahap**: level Latihan terbuka semua; aplikasi menandai level yang disarankan berikutnya. (Lompat otomatis ditunda ke versi berikutnya.) | Sebaiknya | Expertise reversal effect |
| F15 | **Mode offline (PWA)** | Opsional | — |
| F16 | ~~Kirim hasil ke Google Sheets~~ — **dihapus** (keputusan: cukup unduh manual) | — | — |

## 7. Kebutuhan Non-Fungsional

| Kode | Kebutuhan |
|---|---|
| NF1 | Berfungsi di layar 360px ke atas dan di browser desktop (Chrome, Firefox, Edge, Safari) |
| NF2 | Ukuran total aplikasi < 500 KB, terbuka < 3 detik di koneksi 3G |
| NF3 | Tetap berjalan tanpa internet setelah dibuka pertama kali |
| NF4 | Progres tidak hilang bila halaman tertutup (localStorage) |
| NF5 | Bahasa Indonesia sederhana; teks per layar ≤ ±40 kata |
| NF6 | Kontras warna memenuhi WCAG AA; tidak bergantung pada warna saja |
| NF7 | Tidak menyimpan data pribadi selain nama panggilan/kode |

## 8. Aturan Penskoran

Mengikuti Tabel 2 dan Pedoman Umum Penskoran (detail di KONTEN.md):

- 5 soal, masing-masing maksimum 6, total **30**.
- Setiap tahap dinilai terpisah. Skor tahap diberikan bila prosesnya benar, walau angka yang
  dipakai berasal dari kesalahan tahap sebelumnya (**error carried forward**).
- Tahap berupa kesimpulan/keputusan (setuju/tidak, cukup/tidak) dinilai lewat pilihan, lalu
  alasan dipilih dari opsi agar bisa dinilai otomatis.
- Di mode Latihan, skor hanya untuk motivasi dan tidak dicampur dengan data tes.

## 9. Catatan Ketidaksesuaian pada Dokumen Soal (perlu diputuskan)

1. **Tabel 1** memberi skor maksimum 5, 5, 4, 5, 6 (total 25), sedangkan **Rekapitulasi** dan
   **Tabel 2** memberi 6 per soal (total 30). → Rencana: **memakai Tabel 2**.
2. Soal 4 di Tabel 2 berjumlah 1+2+1+1+1 = 6 dengan 5 tahap (Tahap 2 bernilai 2), berbeda dari
   soal lain yang 6 tahap × 1. Sudah benar, hanya perlu diperhatikan di kode.
3. **Struktur Konstruk** menyebut urutan Reasoning → Formulating → Employing → Interpreting,
   tetapi urutan nomor soal 1–5 berbeda, dan indikator *Employing* muncul dua kali (soal 1 dan 4).
   → Perlu diputuskan apakah urutan soal di aplikasi mengikuti nomor soal atau alur konstruk.
4. Pedoman menyebut "Contoh pada Tabel 2 soal nomor 4 … tetap memperoleh skor Tahap 1 sampai
   Tahap 4", padahal Tabel 2 soal 4 punya Tahap 5 (menjumlahkan). Artinya siswa kehilangan skor
   Tahap 5 saja — konsisten, tetapi kalimatnya bisa diperjelas.

## 10. Pertanyaan Terbuka

- [x] ~~Isi temuan wawancara~~ → Bagian 3.
- [x] ~~Rubrik mana yang dipakai?~~ → **Tabel 2** (total 30).
- [x] ~~Urutan soal?~~ → Mengikuti **nomor soal 1–5** (dari prosedur sederhana ke konteks). Alur konstruk tetap dipakai untuk analisis skor per indikator.
- [x] ~~Nama aplikasi?~~ → **LimasKu** (boleh diganti nanti; cukup ubah di `index.html`).
- [x] ~~Kelas sasaran?~~ → SMP kelas VIII (materi bangun ruang sisi datar).
- [x] ~~Hasil terkumpul otomatis atau manual?~~ → **Unduh manual.**
- [x] ~~Pretest/posttest atau media belajar?~~ → **Media pembelajaran saja.**
- [ ] Jumlah siswa untuk uji coba keterbacaan (disarankan 2–3 siswa dulu).

## 11. Risiko

| Risiko | Mitigasi |
|---|---|
| Siswa menebak-nebak angka di mode Latihan | Batasi percobaan per tahap (mis. 3 kali), lalu tampilkan langkah lengkap |
| Jawaban alasan (esai) sulit dinilai otomatis | Gunakan pilihan alasan; opsional kolom teks bebas yang dinilai guru manual |
| HP siswa lambat/kuota terbatas | Tanpa library, tanpa gambar besar, dukungan offline |
| Siswa menghafal jawaban Uji Kemampuan dari latihan | Latihan memakai soal paralel, bukan soal uji |
| Unduhan file diblokir di beberapa browser HP (mis. dalam aplikasi WhatsApp/Instagram) | Sediakan juga tombol "Salin hasil" sebagai cadangan; sarankan membuka di Chrome |
