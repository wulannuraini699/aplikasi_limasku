/*
 * materi.js — 5 kartu modul pra-latihan (pre-training). Sumber: KONTEN.md §3.
 * Penanda warna: {alas|...} biru, {tinggi|...} ungu, {ts|...} oranye.
 */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});

  LK.materi = [
    {
      judul: 'Unsur-unsur limas',
      gambar: { s: 6, t: 5, sorot: ['alas'], label: { s: true } },
      teks: [
        'Limas segiempat beraturan punya {alas|alas berbentuk persegi}, satu titik puncak di atas, dan 4 {ts|sisi tegak} berbentuk segitiga yang sama besar.',
        'Di aplikasi ini warna selalu punya arti yang sama: biru = alas, ungu = tinggi limas, oranye = sisi tegak.'
      ],
      cek: {
        tanya: 'Berapa banyak sisi tegak (segitiga) pada limas segiempat?',
        opsi: [{ id: '3', teks: '3' }, { id: '4', teks: '4' }, { id: '5', teks: '5' }],
        benar: '4',
        penjelasan: 'Alasnya persegi dengan 4 sisi, dan setiap sisi alas menjadi alas satu segitiga. Jadi ada 4 sisi tegak.'
      }
    },
    {
      judul: 'Luas alas dan volume',
      gambar: { s: 6, t: 12, sorot: ['alas', 'tinggi'], label: { s: '6 cm', t: '12 cm' } },
      teks: [
        '{alas|Luas alas} persegi = s × s.',
        'Volume limas = ⅓ × {alas|luas alas} × {tinggi|tinggi limas}.',
        'Mengapa ⅓? Tiga limas yang sama tepat mengisi satu prisma dengan alas dan tinggi yang sama. Volume prisma = luas alas × tinggi, jadi satu limas = sepertiganya.'
      ],
      cek: {
        tanya: 'Luas alas limas 36 cm² dan tingginya 12 cm. Berapa volumenya?',
        opsi: [{ id: '432', teks: '432 cm³' }, { id: '144', teks: '144 cm³' }, { id: '216', teks: '216 cm³' }],
        benar: '144',
        penjelasan: 'V = ⅓ × 36 × 12. Bagi dulu 36 ÷ 3 = 12, lalu 12 × 12 = 144 cm³. (432 adalah jawaban kalau lupa dikali ⅓.)'
      }
    },
    {
      judul: 'Dua jenis tinggi',
      gambar: { s: 6, t: 4, sorot: ['tinggi', 'sisiTegak'], label: { t: true, ts: true } },
      teks: [
        '{tinggi|Tinggi limas (t)} diukur dari puncak lurus ke bawah sampai tengah alas. Garisnya ada di DALAM limas.',
        '{ts|Tinggi sisi tegak (tₛ)} diukur dari puncak ke tengah sisi alas. Garisnya ada di PERMUKAAN segitiga.',
        'Volume memakai t. Luas segitiga sisi tegak memakai tₛ.'
      ],
      cek: {
        tanya: 'Untuk menghitung VOLUME limas, tinggi mana yang dipakai?',
        opsi: [{ id: 't', teks: 'Tinggi limas (t)' }, { id: 'ts', teks: 'Tinggi sisi tegak (tₛ)' }, { id: 'dua', teks: 'Keduanya dijumlahkan' }],
        benar: 't',
        penjelasan: 'Volume = ⅓ × luas alas × t. Tinggi sisi tegak (tₛ) dipakai untuk luas segitiga, bukan volume.'
      }
    },
    {
      judul: 'Pythagoras di dalam limas',
      gambar: { s: 6, t: 4, sorot: ['pythagoras'], label: { t: '4', h: '3', ts: '?' } },
      teks: [
        '{tinggi|t}, setengah sisi alas (½ s), dan {ts|tₛ} membentuk segitiga siku-siku.',
        '{ts|tₛ} adalah sisi miring, jadi: tₛ² = t² + (½ s)².',
        'Cara cepat memeriksa: tₛ selalu lebih panjang dari t.'
      ],
      cek: {
        tanya: 't = 4 dan ½ s = 3. Berapa tₛ?',
        opsi: [{ id: '7', teks: '7' }, { id: '5', teks: '5' }, { id: '12', teks: '12' }],
        benar: '5',
        penjelasan: 'tₛ = √(4² + 3²) = √(16 + 9) = √25 = 5.'
      }
    },
    {
      judul: 'Selimut atau permukaan?',
      gambar: { s: 6, t: 4, sorot: ['selimut'], label: {} },
      teks: [
        '{ts|Luas selimut} = 4 × luas satu segitiga sisi tegak = 4 × ½ × s × tₛ.',
        'Luas permukaan = {alas|luas alas} + {ts|luas selimut}.',
        'Di soal cerita, tanyakan dulu: bagian mana yang dipakai? Atap atau tenda tanpa lantai → selimut saja. Kotak tertutup → seluruh permukaan.'
      ],
      cek: {
        tanya: 'Menghitung kain untuk tenda TANPA lantai memakai …',
        opsi: [{ id: 'permukaan', teks: 'Luas permukaan' }, { id: 'selimut', teks: 'Luas selimut' }, { id: 'volume', teks: 'Volume' }],
        benar: 'selimut',
        penjelasan: 'Tanpa lantai berarti alas tidak dihitung. Yang dipakai hanya 4 sisi tegak = luas selimut.'
      }
    }
  ];

  LK.rumus = [
    { nama: 'Luas alas (persegi)', rumus: 'La = s × s', warna: 'alas' },
    { nama: 'Volume limas', rumus: 'V = ⅓ × La × t', warna: 'tinggi' },
    { nama: 'Tinggi sisi tegak', rumus: 'tₛ = √(t² + (½ s)²)', warna: 'ts' },
    { nama: 'Luas satu sisi tegak', rumus: '½ × s × tₛ', warna: 'ts' },
    { nama: 'Luas selimut', rumus: 'Ls = 4 × ½ × s × tₛ', warna: 'ts' },
    { nama: 'Luas permukaan', rumus: 'Lp = La + Ls', warna: 'alas' }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
