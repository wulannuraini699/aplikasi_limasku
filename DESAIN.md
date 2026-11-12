# DESAIN.md — Desain Antarmuka dan Pengalaman Belajar

Dokumen ini menjelaskan *bagaimana aplikasi terlihat dan terasa*. Setiap keputusan dikaitkan
dengan prinsip Cognitive Load Theory (CLT) agar bisa dipertanggungjawabkan di laporan.

---

## 1. Prinsip Desain

| Prinsip | Penerapan di LimasKu |
|---|---|
| **Kurangi beban extraneous** | Satu tugas per layar, tanpa animasi hiasan, tanpa iklan/maskot, navigasi selalu di tempat yang sama |
| **Kelola beban intrinsic** | Pre-training konsep dulu; soal dipecah per tahap; gambar membantu membayangkan 3D |
| **Dorong beban germane** | Worked example, refleksi "mengapa", soal paralel dengan variasi angka |
| **Spatial contiguity** | Angka dan label ditulis *di dalam* gambar limas, dekat bagiannya |
| **Signaling** | Bagian gambar yang dibahas diberi warna aksen + garis tebal; bagian lain dipudarkan |
| **Konsistensi** | Satu warna = satu makna di seluruh aplikasi (lihat §3) |

## 2. Peta Layar

```
Beranda
 ├─ Mulai (isi nama panggilan/kode)
 ├─ Belajar (pre-training) 5 kartu konsep
 ├─ Latihan
 │    ├─ Soal 1 Volume         L1 contoh → L2 lengkapi → L3 mandiri
 │    ├─ Soal 2 Bandingkan
 │    ├─ Soal 3 Atap
 │    ├─ Soal 4 Keliling→Luas permukaan
 │    └─ Soal 5 Tenda
 ├─ Uji Kemampuan ─────── 5 soal, tanpa petunjuk → Pembahasan per tahap
 └─ Hasil & Unduh (CSV / salin teks)
```

Navigasi memakai URL hash (`#/belajar`, `#/latihan/3`, `#/uji`, `#/hasil`) agar tombol *back* HP berfungsi.

## 3. Sistem Warna (makna tetap)

Warna dipakai untuk **makna**, bukan hiasan. Selalu disertai label/ikon, tidak hanya warna.

| Token | Makna | Contoh nilai (terang) |
|---|---|---|
| `--warna-alas` | Alas limas, luas alas, sisi alas | biru `#2563EB` |
| `--warna-tinggi` | Tinggi limas (t) | ungu `#7C3AED` |
| `--warna-sisi-tegak` | Tinggi sisi tegak (tₛ), selimut | oranye `#EA580C` |
| `--warna-benar` | Jawaban benar | hijau `#16A34A` + ikon ✓ |
| `--warna-salah` | Perlu diperbaiki | merah `#DC2626` + ikon ! |
| `--latar`, `--teks`, `--garis` | Netral | `#FFFFFF`, `#1F2937`, `#E5E7EB` |

Mode gelap: token yang sama didefinisikan ulang di `@media (prefers-color-scheme: dark)`.

Contoh konsistensi: kata "tinggi limas" di teks soal diberi garis bawah ungu, dan garis tinggi
di gambar juga ungu. Siswa tidak perlu mencari-cari hubungan teks dengan gambar.

## 4. Tipografi dan Tata Letak

- Font sistem (tanpa unduhan): `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Ukuran dasar 17px di HP (lebih besar dari biasa, agar nyaman dibaca siswa), tinggi baris 1.5.
- Lebar konten maksimal 640px, di tengah layar pada desktop.
- Padding samping minimal 16px.
- Tombol utama selalu di bawah layar (zona jempol), lebar penuh, tinggi 48px.

## 5. Anatomi Layar Tahap (paling penting)

```
┌─────────────────────────────┐
│ ← Soal 4 · Tahap 2 dari 5   │  ← bilah progres tipis
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░  │
├─────────────────────────────┤
│        [ GAMBAR LIMAS ]     │  ← SVG, bagian aktif disorot
│      t = 12 cm (ungu)       │     angka diketahui ada DI gambar
│      ½ s = 5 cm (biru)      │
│      tₛ = ?  (oranye)       │
├─────────────────────────────┤
│ Tentukan tinggi sisi tegak  │  ← instruksi 1 kalimat
│ (tₛ).                       │
│                             │
│  tₛ = [  ____  ] cm         │  ← input angka besar
│                             │
│  💡 Butuh petunjuk?          │  ← hanya di mode Latihan
├─────────────────────────────┤
│ [        Periksa         ]  │  ← tombol utama, zona jempol
└─────────────────────────────┘
```

Teks soal lengkap dapat dibuka lewat tombol "Lihat soal" (lembar bawah / *bottom sheet*), tidak
ditampilkan terus-menerus agar layar tidak penuh.

## 6. Gambar Limas SVG

Satu komponen `gambarLimas(opsi)` yang dipakai di semua layar:

- Limas segiempat beraturan digambar proyeksi miring (garis belakang putus-putus).
- Parameter: `sisi`, `tinggi`, `tinggiSisiTegak`, `sorot` (salah satu: `alas`, `tinggi`,
  `sisiTegak`, `segitigaPythagoras`, `selimut`), `label` (angka yang ditampilkan atau "?").
- Mode `segitigaPythagoras`: menampilkan segitiga siku-siku dari puncak – titik tengah alas –
  titik tengah sisi alas, dengan sisi t, ½s, dan tₛ. Ini konsep tersulit, jadi diberi
  kemungkinan "dikeluarkan" dari limas (segitiga digambar ulang di sampingnya, datar).
- Mode `selimut`: 4 segitiga tegak berwarna oranye, alas dipudarkan — membedakan selimut vs
  permukaan secara visual.
- Opsional (fase 2): tombol "Buka jaring-jaring" yang menampilkan jaring limas.

Gambar tidak perlu skala sebenarnya, tetapi proporsi harus wajar (limas tinggi tampak tinggi).

## 7. Jenis Isian

| Jenis | Dipakai untuk | Catatan |
|---|---|---|
| Angka | Hasil hitung | `inputmode="decimal"`, terima koma/titik, satuan ditulis di luar kotak |
| Pilih rumus | Tahap "menuliskan rumus" | 3–4 kartu rumus, satu benar |
| Pilih satuan | cm, cm², cm³ | Tombol segmen |
| Ketuk informasi | Diketahui–Ditanya | Siswa mengetuk frasa di teks soal; frasa masuk ke kotak |
| Keputusan + alasan | Setuju/tidak, cukup/tidak | Dua langkah: pilih keputusan, lalu pilih alasan |

Hindari ketik rumus bebas (sulit di HP dan sulit dinilai).

## 8. Umpan Balik dan Petunjuk

- **Benar:** garis hijau + ✓ + satu kalimat penguat konsep ("Tepat! Luas alas persegi = s × s.").
  Lanjut otomatis tidak dipakai; siswa menekan "Lanjut" (memberi waktu memproses).
- **Salah:** tidak langsung memberi jawaban. Pesan netral ("Coba cek lagi") + tombol petunjuk.
- **Petunjuk bertingkat:**
  1. Konsep: "Tinggi sisi tegak adalah sisi miring segitiga siku-siku di dalam limas."
  2. Rumus: "tₛ² = t² + (½ s)²" + gambar segitiga disorot.
  3. Langkah: "tₛ = √(12² + 5²) = √(144 + 25) = ..."
- Setelah 3 kali salah: tampilkan langkah lengkap, tahap ditandai "dibantu".
- **Uji Kemampuan:** tidak ada umpan balik benar/salah sampai semua soal selesai; setelah itu
  tampil pembahasan lengkap tiap tahap (jawaban siswa vs langkah benar).

## 9. Tingkat Bantuan (Fading)

| Level | Nama | Yang ditampilkan |
|---|---|---|
| L1 | Contoh Lengkap | Semua tahap sudah terisi + penjelasan; siswa hanya menjawab pertanyaan refleksi |
| L2 | Lengkapi | Tahap awal terisi; 2–3 tahap terakhir dikosongkan |
| L3 | Mandiri | Semua tahap dikosongkan, petunjuk tersedia |

Urutan pengosongan memakai *backward fading* (tahap terakhir dikosongkan dulu).

## 10. Halaman Hasil

- Skor total besar di atas: "22 / 30".
- Batang horizontal per soal/indikator (5 batang, maks 6), diberi label teks, bukan hanya warna.
- Daftar "Tahap yang perlu diulang" dengan tautan langsung ke latihan terkait.
- Dua tombol di bawah: **"Unduh hasil"** (CSV, nama file `hasil-limas-<nama>-<tanggal>.csv`)
  dan **"Salin hasil"** (ringkasan teks siap ditempel di WhatsApp). Isi: nama/kode, kelas,
  tanggal, skor tiap tahap, skor per soal, total.
- Contoh teks salin:
  ```
  Hasil Uji Kemampuan Limas — Ayu (8B) — 12/11/2026
  Soal 1: 6/6 · Soal 2: 5/6 · Soal 3: 4/6 · Soal 4: 3/6 · Soal 5: 6/6
  Total: 24/30
  ```

## 11. Aksesibilitas

- Semua kontrol bisa dipakai dengan keyboard; urutan fokus logis.
- `aria-live="polite"` untuk pesan umpan balik.
- SVG memiliki `<title>` dan `<desc>` ("Limas dengan sisi alas 10 cm, tinggi 12 cm").
- Tidak ada informasi yang hanya disampaikan lewat warna.
- Menghormati `prefers-reduced-motion`.

## 12. Hal yang Sengaja Tidak Dipakai (beserta alasan)

| Tidak dipakai | Alasan CLT |
|---|---|
| Maskot/karakter animasi | *Seductive details* menambah beban extraneous |
| Musik latar | *Coherence principle* |
| Timer hitung mundur | Menambah kecemasan, mengganggu memori kerja |
| Papan peringkat | Fokus pindah ke kompetisi, bukan pemahaman |
| Teks soal + gambar + semua isian dalam satu layar panjang | Siswa harus menggulir bolak-balik (split-attention) |
