/*
 * soal.js — templat soal berparameter.
 * Sumber isi, kunci, dan rubrik: KONTEN.md (Tabel 2, maks 6 per soal, total 30).
 *
 * Setiap templat menerima angka (parameter) dan menghasilkan objek soal lengkap.
 * Soal Uji Kemampuan = angka asli dari instrumen; soal Latihan = angka paralel.
 */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});
  const fmt = function (n) { return LK.util.fmt(n); };

  // ---------- bantu ECF (error carried forward) ----------
  /** Nilai angka jawaban siswa, atau nilai benar bila kosong/bukan angka. */
  function pakai(j, id, benar) {
    const v = LK.penilaian.parseAngka(j && j[id]);
    return v === null ? benar : v;
  }
  /** [benar] + alternatif ECF bila berbeda. */
  function kunciAngka(benar, alternatif) {
    const out = [benar];
    if (typeof alternatif === 'number' && isFinite(alternatif) && Math.abs(alternatif - benar) > 1e-9) out.push(alternatif);
    return out;
  }
  function unik(arr) {
    return arr.filter(function (v, i) { return v !== undefined && v !== null && arr.indexOf(v) === i; });
  }
  function bandingId(a, b, sama, lebihA, lebihB) {
    if (Math.abs(a - b) <= 0.011) return sama;
    return a > b ? lebihA : lebihB;
  }
  function akarTeks(n) {
    const r = Math.sqrt(n);
    return Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : '≈ ' + fmt(r);
  }

  // ======================================================================
  // Soal 1 — Volume limas (Employing)
  // ======================================================================
  function soalVolume(p) {
    const s = p.s, t = p.t, u = p.u || 'cm', u2 = u + '²', u3 = u + '³';
    const La = s * s, V = La * t / 3;
    return {
      id: p.id, nomor: 1, judul: 'Volume limas',
      indikator: 'Employing Mathematical Concepts, Facts, and Procedures',
      teks: 'Sebuah limas segiempat beraturan memiliki alas berbentuk persegi dengan panjang {alas|sisi ' + s + ' ' + u + '} dan {tinggi|tinggi limas ' + t + ' ' + u + '}.',
      pertanyaan: 'Tentukan volume limas tersebut. Tuliskan rumus yang kamu gunakan.',
      gambar: { s: s, t: t, label: { s: s + ' ' + u, t: t + ' ' + u } },
      refleksi: {
        tanya: 'Mengapa rumus volume limas memakai ⅓?',
        opsi: [
          { id: 'sisi', teks: 'Karena limas punya 3 sisi.' },
          { id: 'prisma', teks: 'Karena 3 limas yang sama tepat mengisi 1 prisma dengan alas dan tinggi yang sama.' },
          { id: 'alas', teks: 'Karena alasnya berbentuk persegi.' }
        ],
        benar: 'prisma',
        penjelasan: 'Volume prisma = luas alas × tinggi. Tiga limas dengan alas dan tinggi yang sama mengisi penuh prisma itu, jadi satu limas = ⅓ × luas alas × tinggi. Kalau kamu ingat alasan ini, kamu tidak akan lupa "dikali berapa".'
      },
      tahap: [
        {
          id: 't1', label: 'Tahap 1', skor: 1, sorot: ['alas', 'tinggi'],
          instruksi: 'Pilih rumus volume limas yang tepat.',
          isian: [{ id: 'rumus', jenis: 'pilih', opsi: [
            { id: 'a', teks: 'V = luas alas × tinggi' },
            { id: 'b', teks: 'V = ⅓ × luas alas × tinggi' },
            { id: 'c', teks: 'V = ½ × luas alas × tinggi' },
            { id: 'd', teks: 'V = ⅓ × sisi alas × tinggi' }
          ] }],
          kunci: function () { return { rumus: ['b'] }; },
          penjelasan: 'V = ⅓ × luas alas × tinggi. Limas adalah sepertiga dari prisma yang alas dan tingginya sama.',
          petunjuk: [
            'Tiga limas yang sama bisa mengisi penuh satu prisma dengan alas dan tinggi yang sama.',
            'Volume prisma = luas alas × tinggi. Volume limas adalah sepertiganya.',
            'Pilih V = ⅓ × luas alas × tinggi.'
          ]
        },
        {
          id: 't2', label: 'Tahap 2', skor: 1, sorot: ['alas'],
          instruksi: 'Hitung luas alas limas.',
          isian: [{ id: 'la', jenis: 'angka', label: 'Luas alas', satuan: u2 }],
          kunci: function () { return { la: [La] }; },
          penjelasan: 'Alas berbentuk persegi, jadi luas alas = ' + s + ' × ' + s + ' = ' + La + ' ' + u2 + '.',
          petunjuk: ['Alas limas ini berbentuk persegi.', 'Luas persegi = sisi × sisi.', 'Hitung ' + s + ' × ' + s + '.']
        },
        {
          id: 't3', label: 'Tahap 3', skor: 1, sorot: ['alas', 'tinggi'],
          instruksi: 'Masukkan nilai ke rumus. Pilih bentuk yang benar.',
          isian: [{ id: 'subs', jenis: 'pilih', opsi: function (j) {
            const la = fmt(pakai(j, 'la', La));
            return unik([la + ' × ' + t, '⅓ × ' + la + ' × ' + t, '⅓ × ' + s + ' × ' + t, '⅓ × ' + la + ' × ' + s, '⅓ × ' + fmt(La) + ' × ' + t])
              .map(function (x) { return { id: 'V = ' + x, teks: 'V = ' + x }; });
          } }],
          kunci: function (j) {
            return { subs: unik(['V = ⅓ × ' + fmt(La) + ' × ' + t, 'V = ⅓ × ' + fmt(pakai(j, 'la', La)) + ' × ' + t]) };
          },
          penjelasan: 'Luas alas = ' + La + ' dan tinggi limas = ' + t + ', jadi V = ⅓ × ' + La + ' × ' + t + '.',
          petunjuk: [
            'Rumusnya: V = ⅓ × luas alas × tinggi.',
            'Ganti "luas alas" dengan hasil tahap 2, dan "tinggi" dengan tinggi limas.',
            'Luas alas = ' + La + ', tinggi = ' + t + '.'
          ]
        },
        {
          id: 't4', label: 'Tahap 4', skor: 1, sorot: [],
          instruksi: 'Hitung hasilnya. (Boleh pakai kalkulator.)',
          isian: [{ id: 'v', jenis: 'angka', label: 'V', satuan: '' }],
          kunci: function (j) { return { v: kunciAngka(V, pakai(j, 'la', La) * t / 3) }; },
          penjelasan: 'V = ⅓ × ' + La + ' × ' + t + ' = ' + fmt(La / 3) + ' × ' + t + ' = ' + fmt(V) + '.',
          petunjuk: [
            'Kerjakan sedikit demi sedikit: bagi dulu luas alas dengan 3.',
            La + ' ÷ 3 = ' + fmt(La / 3) + '.',
            fmt(La / 3) + ' × ' + t + ' = …'
          ]
        },
        {
          id: 't5', label: 'Tahap 5', skor: 1, sorot: [],
          instruksi: 'Pilih satuan volume yang benar.',
          isian: [{ id: 'satuan', jenis: 'pilih', opsi: [{ id: u, teks: u }, { id: u2, teks: u2 }, { id: u3, teks: u3 }] }],
          kunci: function () { return { satuan: [u3] }; },
          penjelasan: 'Volume memakai satuan kubik (' + u3 + ') karena tiga ukuran panjang dikalikan.',
          petunjuk: ['Luas memakai satuan persegi (²). Volume berbeda.', 'Volume = tiga ukuran panjang dikalikan.', 'Pilih satuan dengan pangkat 3.']
        },
        {
          id: 't6', label: 'Tahap 6', skor: 1, sorot: [],
          instruksi: 'Pilih kesimpulan yang tepat.',
          isian: [{ id: 'kesimpulan', jenis: 'pilih', opsi: function (j) {
            const v = fmt(pakai(j, 'v', V));
            return [
              { id: 'alas', teks: 'Jadi, luas alas limas tersebut adalah ' + v + ' ' + u2 + '.' },
              { id: 'vol', teks: 'Jadi, volume limas tersebut adalah ' + v + ' ' + u3 + '.' },
              { id: 'tinggi', teks: 'Jadi, tinggi limas tersebut adalah ' + v + ' ' + u + '.' }
            ];
          } }],
          kunci: function () { return { kesimpulan: ['vol'] }; },
          penjelasan: 'Yang ditanya adalah volume, jadi kesimpulannya: volume limas tersebut adalah ' + fmt(V) + ' ' + u3 + '.',
          petunjuk: ['Lihat lagi: apa yang ditanyakan soal?', 'Soal menanyakan volume.', 'Pilih kalimat tentang volume dengan satuan ' + u3 + '.']
        }
      ]
    };
  }

  // ======================================================================
  // Soal 2 — Membandingkan dua limas (Mathematical Reasoning)
  // ======================================================================
  function soalBandingkan(p) {
    const sA = p.sA, tA = p.tA, sB = p.sB, tB = p.tB, u = p.u || 'cm', u2 = u + '²', u3 = u + '³';
    const LaA = sA * sA, LaB = sB * sB, VA = LaA * tA / 3, VB = LaB * tB / 3;
    const bandingBenar = bandingId(VA, VB, 'sama', 'A', 'B');
    const keputusanDari = function (b) { return b === 'A' ? 'setuju' : 'tidak'; };
    const teksBanding = { A: 'volume limas A lebih besar', B: 'volume limas B lebih besar', sama: 'volume limas A dan B sama besar' };
    return {
      id: p.id, nomor: 2, judul: 'Membandingkan dua limas',
      indikator: 'Mathematical Reasoning',
      teks: 'Limas A beralas persegi dengan {alas|sisi ' + sA + ' ' + u + '} dan {tinggi|tinggi ' + tA + ' ' + u + '}. Limas B beralas persegi dengan {alas|sisi ' + sB + ' ' + u + '} dan {tinggi|tinggi ' + tB + ' ' + u + '}. Andi berpendapat bahwa volume limas A lebih besar karena limas A lebih tinggi.',
      pertanyaan: 'Apakah kamu setuju dengan pendapat Andi? Jelaskan dengan perhitungan.',
      gambar: {
        dua: true,
        A: { s: sA, t: tA, label: { s: sA + ' ' + u, t: tA + ' ' + u } },
        B: { s: sB, t: tB, label: { s: sB + ' ' + u, t: tB + ' ' + u } }
      },
      refleksi: {
        tanya: 'Jika tinggi limas dijadikan 2 kali lipat dan alasnya tetap, volumenya menjadi …',
        opsi: [
          { id: 'tetap', teks: 'Tetap sama' },
          { id: 'dua', teks: '2 kali lipat' },
          { id: 'empat', teks: '4 kali lipat' }
        ],
        benar: 'dua',
        penjelasan: 'V = ⅓ × luas alas × tinggi. Tinggi dikali 2 → volume dikali 2. Tapi kalau SISI alas dikali 2, luas alas menjadi 4 kali, sehingga volume menjadi 4 kali. Itu sebabnya alas yang lebar bisa "mengalahkan" limas yang tinggi.'
      },
      tahap: [
        {
          id: 't1', label: 'Tahap 1', skor: 1, sorot: ['alas'],
          instruksi: 'Hitung luas alas kedua limas.',
          isian: [
            { id: 'laA', jenis: 'angka', label: 'Luas alas A', satuan: u2 },
            { id: 'laB', jenis: 'angka', label: 'Luas alas B', satuan: u2 }
          ],
          kunci: function () { return { laA: [LaA], laB: [LaB] }; },
          penjelasan: 'Luas alas A = ' + sA + ' × ' + sA + ' = ' + LaA + ' ' + u2 + '; luas alas B = ' + sB + ' × ' + sB + ' = ' + LaB + ' ' + u2 + '.',
          petunjuk: ['Kedua alas berbentuk persegi.', 'Luas persegi = sisi × sisi.', 'A: ' + sA + ' × ' + sA + ', B: ' + sB + ' × ' + sB + '.']
        },
        {
          id: 't2', label: 'Tahap 2', skor: 1, sorot: ['alas', 'tinggi'],
          instruksi: 'Hitung volume limas A.',
          isian: [{ id: 'vA', jenis: 'angka', label: 'Volume A', satuan: u3 }],
          kunci: function (j) { return { vA: kunciAngka(VA, pakai(j, 'laA', LaA) * tA / 3) }; },
          penjelasan: 'V A = ⅓ × ' + LaA + ' × ' + tA + ' = ' + fmt(VA) + ' ' + u3 + '.',
          petunjuk: ['V = ⅓ × luas alas × tinggi.', 'Pakai luas alas A dan tinggi A (' + tA + ' ' + u + ').', '⅓ × ' + LaA + ' × ' + tA + ' = …']
        },
        {
          id: 't3', label: 'Tahap 3', skor: 1, sorot: ['alas', 'tinggi'],
          instruksi: 'Hitung volume limas B.',
          isian: [{ id: 'vB', jenis: 'angka', label: 'Volume B', satuan: u3 }],
          kunci: function (j) { return { vB: kunciAngka(VB, pakai(j, 'laB', LaB) * tB / 3) }; },
          penjelasan: 'V B = ⅓ × ' + LaB + ' × ' + tB + ' = ' + fmt(VB) + ' ' + u3 + '.',
          petunjuk: ['Rumusnya sama dengan limas A.', 'Pakai luas alas B dan tinggi B (' + tB + ' ' + u + ').', '⅓ × ' + LaB + ' × ' + tB + ' = …']
        },
        {
          id: 't4', label: 'Tahap 4', skor: 1, sorot: [],
          instruksi: 'Bandingkan volume kedua limas.',
          isian: [{ id: 'banding', jenis: 'pilih', opsi: [
            { id: 'A', teks: 'Volume limas A lebih besar' },
            { id: 'B', teks: 'Volume limas B lebih besar' },
            { id: 'sama', teks: 'Volume limas A dan B sama besar' }
          ] }],
          kunci: function (j) {
            return { banding: unik([bandingBenar, bandingId(pakai(j, 'vA', VA), pakai(j, 'vB', VB), 'sama', 'A', 'B')]) };
          },
          penjelasan: 'V A = ' + fmt(VA) + ' ' + u3 + ' dan V B = ' + fmt(VB) + ' ' + u3 + ', jadi ' + teksBanding[bandingBenar] + '.',
          petunjuk: ['Lihat hasil tahap 2 dan tahap 3.', 'Bandingkan dua angka itu.', 'Mana yang lebih besar: ' + fmt(VA) + ' atau ' + fmt(VB) + '?']
        },
        {
          id: 't5', label: 'Tahap 5', skor: 1, sorot: [],
          instruksi: 'Apakah kamu setuju dengan pendapat Andi?',
          isian: [{ id: 'keputusan', jenis: 'pilih', opsi: [
            { id: 'setuju', teks: 'Setuju dengan Andi' },
            { id: 'tidak', teks: 'Tidak setuju dengan Andi' }
          ] }],
          kunci: function (j) {
            const dariSiswa = j.banding ? keputusanDari(j.banding) : null;
            return { keputusan: unik([keputusanDari(bandingBenar), dariSiswa]) };
          },
          penjelasan: 'Andi bilang volume A lebih besar. Hasil hitung: ' + teksBanding[bandingBenar] + ', jadi kita ' + (bandingBenar === 'A' ? 'setuju' : 'tidak setuju') + ' dengan Andi.',
          petunjuk: ['Andi berpendapat volume A lebih besar.', 'Cocokkan pendapat Andi dengan hasil tahap 4.', 'Kalau hasil hitung tidak menunjukkan A lebih besar, berarti tidak setuju.']
        },
        {
          id: 't6', label: 'Tahap 6', skor: 1, sorot: ['alas', 'tinggi'],
          instruksi: 'Pilih alasan yang paling tepat.',
          isian: [{ id: 'alasan', jenis: 'pilih', opsi: [
            { id: 'tinggi', teks: 'Limas yang lebih tinggi pasti volumenya lebih besar.' },
            { id: 'dua', teks: 'Volume ditentukan oleh luas alas dan tinggi bersama-sama, jadi limas yang lebih tinggi belum tentu volumenya lebih besar.' },
            { id: 'lebar', teks: 'Limas yang alasnya lebih lebar pasti volumenya lebih besar.' },
            { id: 'tanpa', teks: 'Tinggi tidak berpengaruh pada volume limas.' }
          ] }],
          kunci: function () { return { alasan: ['dua'] }; },
          penjelasan: 'Di rumus V = ⅓ × luas alas × tinggi, luas alas dan tinggi sama-sama menentukan volume. Melihat tingginya saja tidak cukup.',
          petunjuk: ['Lihat lagi rumus volume: ada apa saja di dalamnya?', 'Ada luas alas DAN tinggi.', 'Pilih alasan yang menyebut keduanya.']
        }
      ]
    };
  }

  // ======================================================================
  // Soal 3 — Atap pendopo (Interpreting, Applying, Evaluating)
  // ======================================================================
  function soalAtap(p) {
    const s = p.s, ts = p.ts, g = p.g, u = p.u || 'm', u2 = u + '²';
    const L1 = s * ts / 2, L = 4 * L1, sel = Math.abs(L - g);
    const tBentuk = Math.sqrt(Math.max(ts * ts - (s / 2) * (s / 2), 1)); // hanya untuk proporsi gambar
    const cmp = function (luasAtap) { return bandingId(g, luasAtap, 'sama', 'lebih', 'kurang'); };
    const cmpBenar = cmp(L);
    const teksKesimpulan = {
      kurang: 'genteng tidak cukup; Pak Rudi perlu menambah minimal ' + fmt(sel) + ' ' + u2,
      lebih: 'genteng cukup, bahkan bersisa ' + fmt(sel) + ' ' + u2,
      sama: 'genteng pas untuk menutup seluruh atap'
    };
    return {
      id: p.id, nomor: 3, judul: 'Atap pendopo',
      indikator: 'Interpreting, Applying, and Evaluating Mathematical Outcomes',
      teks: 'Atap sebuah pendopo berbentuk limas segiempat beraturan dengan alas persegi {alas|bersisi ' + s + ' ' + u + '}. {ts|Tinggi setiap sisi tegak atap (tinggi segitiga) adalah ' + ts + ' ' + u + '}. Pak Rudi membeli genteng yang cukup untuk menutup luas ' + g + ' ' + u2 + '.',
      pertanyaan: 'Apakah genteng tersebut cukup untuk menutup seluruh permukaan atap? Jelaskan dan berikan kesimpulanmu.',
      gambar: { s: s, t: tBentuk, label: { s: s + ' ' + u, ts: ts + ' ' + u } },
      refleksi: {
        tanya: 'Mengapa pada soal atap, luas alas tidak dihitung?',
        opsi: [
          { id: 'kecil', teks: 'Karena alasnya terlalu kecil.' },
          { id: 'rumus', teks: 'Karena rumus luas atap memang tidak pernah memakai alas.' },
          { id: 'selimut', teks: 'Karena genteng hanya menutup sisi-sisi tegak (selimut); alas adalah bagian dalam pendopo yang terbuka.' }
        ],
        benar: 'selimut',
        penjelasan: 'Sebelum menghitung, tanyakan: bagian mana yang sebenarnya dipakai di dunia nyata? Atap hanya menutup 4 segitiga sisi tegak.'
      },
      tahap: [
        {
          id: 't1', label: 'Tahap 1', skor: 1, sorot: ['selimut'],
          instruksi: 'Bagian limas mana yang ditutup genteng?',
          isian: [{ id: 'tafsir', jenis: 'pilih', opsi: [
            { id: 'semua', teks: 'Seluruh permukaan limas: alas dan 4 sisi tegak' },
            { id: 'selimut', teks: 'Selimut limas: 4 segitiga sisi tegak saja, alas tidak ditutup' },
            { id: 'alas', teks: 'Alas limas saja' },
            { id: 'volume', teks: 'Isi (volume) limas' }
          ] }],
          kunci: function () { return { tafsir: ['selimut'] }; },
          penjelasan: 'Genteng hanya menutup 4 segitiga sisi tegak (selimut limas). Alasnya tidak ditutup genteng.',
          petunjuk: ['Bayangkan atap rumah atau pendopo: apakah bagian bawahnya ditutup genteng?', 'Genteng hanya ada di bagian miring atap.', 'Bagian miring itu = 4 segitiga = selimut limas.']
        },
        {
          id: 't2', label: 'Tahap 2', skor: 1, sorot: ['sisiTegak'],
          instruksi: 'Hitung luas satu sisi tegak (satu segitiga).',
          isian: [{ id: 'satu', jenis: 'angka', label: 'Luas satu sisi tegak', satuan: u2 }],
          kunci: function () { return { satu: [L1] }; },
          penjelasan: 'Luas segitiga = ½ × alas × tinggi = ½ × ' + s + ' × ' + ts + ' = ' + fmt(L1) + ' ' + u2 + '.',
          petunjuk: ['Satu sisi tegak berbentuk segitiga. Alas segitiga = sisi alas limas.', 'Luas segitiga = ½ × alas × tinggi segitiga (tₛ).', '½ × ' + s + ' × ' + ts + ' = …']
        },
        {
          id: 't3', label: 'Tahap 3', skor: 1, sorot: ['selimut'],
          instruksi: 'Hitung luas seluruh atap.',
          isian: [{ id: 'atap', jenis: 'angka', label: 'Luas atap', satuan: u2 }],
          kunci: function (j) { return { atap: kunciAngka(L, 4 * pakai(j, 'satu', L1)) }; },
          penjelasan: 'Ada 4 sisi tegak yang sama, jadi luas atap = 4 × ' + fmt(L1) + ' = ' + fmt(L) + ' ' + u2 + '.',
          petunjuk: ['Berapa banyak sisi tegak pada limas segiempat?', 'Ada 4 segitiga yang sama besar.', '4 × ' + fmt(L1) + ' = …']
        },
        {
          id: 't4', label: 'Tahap 4', skor: 1, sorot: [],
          instruksi: 'Bandingkan luas genteng dengan luas atap.',
          isian: [{ id: 'banding', jenis: 'pilih', opsi: [
            { id: 'kurang', teks: 'Luas genteng (' + g + ' ' + u2 + ') lebih kecil dari luas atap' },
            { id: 'sama', teks: 'Luas genteng (' + g + ' ' + u2 + ') sama dengan luas atap' },
            { id: 'lebih', teks: 'Luas genteng (' + g + ' ' + u2 + ') lebih besar dari luas atap' }
          ] }],
          kunci: function (j) { return { banding: unik([cmpBenar, cmp(pakai(j, 'atap', L))]) }; },
          penjelasan: 'Genteng ' + g + ' ' + u2 + ', atap ' + fmt(L) + ' ' + u2 + '.',
          petunjuk: ['Lihat hasil tahap 3.', 'Bandingkan ' + g + ' dengan luas atap.', 'Mana yang lebih besar?']
        },
        {
          id: 't5', label: 'Tahap 5', skor: 1, sorot: [],
          instruksi: 'Hitung selisih luas atap dan luas genteng.',
          isian: [{ id: 'selisih', jenis: 'angka', label: 'Selisih', satuan: u2 }],
          kunci: function (j) { return { selisih: kunciAngka(sel, Math.abs(pakai(j, 'atap', L) - g)) }; },
          penjelasan: 'Selisih = ' + (L >= g ? fmt(L) + ' − ' + g : g + ' − ' + fmt(L)) + ' = ' + fmt(sel) + ' ' + u2 + '.',
          petunjuk: ['Selisih = angka besar − angka kecil.', 'Pakai luas atap (tahap 3) dan luas genteng (' + g + ').', (L >= g ? fmt(L) + ' − ' + g : g + ' − ' + fmt(L)) + ' = …']
        },
        {
          id: 't6', label: 'Tahap 6', skor: 1, sorot: [],
          instruksi: 'Pilih kesimpulan yang tepat.',
          isian: [{ id: 'kesimpulan', jenis: 'pilih', opsi: function (j) {
            const x = fmt(pakai(j, 'selisih', sel));
            return [
              { id: 'kurang', teks: 'Genteng tidak cukup. Pak Rudi perlu menambah minimal ' + x + ' ' + u2 + '.' },
              { id: 'lebih', teks: 'Genteng cukup, bahkan bersisa ' + x + ' ' + u2 + '.' },
              { id: 'sama', teks: 'Genteng pas untuk menutup seluruh atap.' }
            ];
          } }],
          kunci: function (j) { return { kesimpulan: unik([cmpBenar, j.banding || null]) }; },
          penjelasan: 'Kesimpulan: ' + teksKesimpulan[cmpBenar] + '.',
          petunjuk: ['Gabungkan hasil tahap 4 dan tahap 5.', 'Kalau genteng lebih kecil dari atap, berarti kurang.', 'Kesimpulan harus menjawab: cukup atau tidak, dan berapa kurang/sisanya.']
        }
      ]
    };
  }

  // ======================================================================
  // Soal 4 — Informasi tidak langsung (Employing)
  // ======================================================================
  function soalPermukaan(p) {
    const kel = p.kel, t = p.t, u = p.u || 'cm', u2 = u + '²';
    const s = kel / 4, hs = s / 2, ts = Math.sqrt(t * t + hs * hs), La = s * s, Ls = 2 * s * ts, Lp = La + Ls;
    return {
      id: p.id, nomor: 4, judul: 'Informasi tidak langsung',
      indikator: 'Employing Mathematical Concepts, Facts, and Procedures',
      teks: 'Sebuah limas segiempat beraturan memiliki {alas|keliling alas ' + kel + ' ' + u + '} dan {tinggi|tinggi limas ' + t + ' ' + u + '}.',
      pertanyaan: 'Tentukan luas permukaan limas tersebut. Tunjukkan cara kamu menentukan tinggi sisi tegaknya.',
      gambar: { s: s, t: t, label: { s: '?', t: t + ' ' + u } },
      refleksi: {
        tanya: 'Mengapa tinggi sisi tegak (tₛ) selalu lebih panjang daripada tinggi limas (t)?',
        opsi: [
          { id: 'alas', teks: 'Karena tₛ diukur dari alas.' },
          { id: 'miring', teks: 'Karena tₛ adalah sisi miring segitiga siku-siku, dan sisi miring selalu paling panjang.' },
          { id: 'tidak', teks: 'Tidak selalu, kadang tₛ lebih pendek.' }
        ],
        benar: 'miring',
        penjelasan: 't, ½ s, dan tₛ membentuk segitiga siku-siku dengan tₛ sebagai sisi miring. Jadi kalau hasil tₛ-mu lebih kecil dari t, pasti ada yang salah — ini cara cepat memeriksa jawaban.'
      },
      tahap: [
        {
          id: 't1', label: 'Tahap 1', skor: 1, sorot: ['alas'],
          instruksi: 'Tentukan panjang sisi alas (s).',
          isian: [{ id: 's', jenis: 'angka', label: 's', satuan: u }],
          kunci: function () { return { s: [s] }; },
          penjelasan: 'Alas persegi punya 4 sisi sama panjang: s = ' + kel + ' ÷ 4 = ' + fmt(s) + ' ' + u + '.',
          petunjuk: ['Keliling persegi = 4 × sisi.', 'Jadi sisi = keliling ÷ 4.', kel + ' ÷ 4 = …']
        },
        {
          id: 't2a', label: 'Tahap 2 (bagian 1)', skor: 1, sorot: ['pythagoras'],
          instruksi: 'Tentukan setengah sisi alas (½ s). Ini salah satu sisi segitiga siku-siku di dalam limas.',
          isian: [{ id: 'hs', jenis: 'angka', label: '½ s', satuan: u }],
          kunci: function (j) { return { hs: kunciAngka(hs, pakai(j, 's', s) / 2) }; },
          penjelasan: '½ s = ½ × ' + fmt(s) + ' = ' + fmt(hs) + ' ' + u + '.',
          petunjuk: ['Lihat segitiga yang disorot di gambar.', 'Sisi bawahnya adalah setengah sisi alas.', fmt(s) + ' ÷ 2 = …']
        },
        {
          id: 't2b', label: 'Tahap 2 (bagian 2)', skor: 1, sorot: ['pythagoras'],
          instruksi: 'Tentukan tinggi sisi tegak (tₛ) dengan teorema Pythagoras.',
          isian: [{ id: 'ts', jenis: 'angka', label: 'tₛ', satuan: u }],
          kunci: function (j) { const h2 = pakai(j, 'hs', hs); return { ts: kunciAngka(ts, Math.sqrt(t * t + h2 * h2)) }; },
          penjelasan: 'tₛ² = t² + (½ s)² = ' + t + '² + ' + fmt(hs) + '² = ' + (t * t) + ' + ' + fmt(hs * hs) + ' = ' + fmt(t * t + hs * hs) + ', jadi tₛ = √' + fmt(t * t + hs * hs) + ' = ' + akarTeks(t * t + hs * hs) + ' ' + u + '.',
          petunjuk: ['tₛ adalah sisi miring segitiga siku-siku dengan sisi t dan ½ s.', 'tₛ² = t² + (½ s)².', 'tₛ = √(' + t + '² + ' + fmt(hs) + '²) = √(' + (t * t) + ' + ' + fmt(hs * hs) + ') = …']
        },
        {
          id: 't3', label: 'Tahap 3', skor: 1, sorot: ['alas'],
          instruksi: 'Hitung luas alas.',
          isian: [{ id: 'la', jenis: 'angka', label: 'Luas alas', satuan: u2 }],
          kunci: function (j) { const sv = pakai(j, 's', s); return { la: kunciAngka(La, sv * sv) }; },
          penjelasan: 'Luas alas = ' + fmt(s) + ' × ' + fmt(s) + ' = ' + fmt(La) + ' ' + u2 + '.',
          petunjuk: ['Alas berbentuk persegi.', 'Luas persegi = s × s.', fmt(s) + ' × ' + fmt(s) + ' = …']
        },
        {
          id: 't4', label: 'Tahap 4', skor: 1, sorot: ['selimut'],
          instruksi: 'Hitung luas selimut (4 sisi tegak).',
          isian: [{ id: 'ls', jenis: 'angka', label: 'Luas selimut', satuan: u2 }],
          kunci: function (j) { return { ls: kunciAngka(Ls, 2 * pakai(j, 's', s) * pakai(j, 'ts', ts)) }; },
          penjelasan: 'Luas selimut = 4 × ½ × ' + fmt(s) + ' × ' + fmt(ts) + ' = ' + fmt(Ls) + ' ' + u2 + '.',
          petunjuk: ['Selimut = 4 segitiga sisi tegak.', 'Luas satu segitiga = ½ × s × tₛ.', '4 × ½ × ' + fmt(s) + ' × ' + fmt(ts) + ' = …']
        },
        {
          id: 't5', label: 'Tahap 5', skor: 1, sorot: ['permukaan'],
          instruksi: 'Hitung luas permukaan limas.',
          isian: [{ id: 'lp', jenis: 'angka', label: 'Luas permukaan', satuan: u2 }],
          kunci: function (j) { return { lp: kunciAngka(Lp, pakai(j, 'la', La) + pakai(j, 'ls', Ls)) }; },
          penjelasan: 'Luas permukaan = luas alas + luas selimut = ' + fmt(La) + ' + ' + fmt(Ls) + ' = ' + fmt(Lp) + ' ' + u2 + '.',
          petunjuk: ['Permukaan = semua sisi limas.', 'Luas permukaan = luas alas + luas selimut.', fmt(La) + ' + ' + fmt(Ls) + ' = …']
        }
      ]
    };
  }

  // ======================================================================
  // Soal 5 — Tenda (Formulating)
  // ======================================================================
  function soalTenda(p) {
    const s = p.s, t = p.t, u = p.u || 'm', u2 = u + '²';
    const hs = s / 2, ts = Math.sqrt(t * t + hs * hs), L1 = s * ts / 2, L = 4 * L1;
    return {
      id: p.id, nomor: 5, judul: 'Tenda',
      indikator: 'Formulating Situations Mathematically',
      teks: 'Pak Dedi akan membuat tenda berbentuk limas segiempat beraturan dari kain. Alas tenda berbentuk persegi dengan {alas|sisi ' + s + ' ' + u + '} dan {tinggi|tinggi tenda ' + t + ' ' + u + '}. Kain hanya digunakan untuk keempat sisi tegak (lantai tidak dilapisi kain).',
      pertanyaan: 'Berapa luas kain minimal yang dibutuhkan? Tunjukkan alasanmu.',
      gambar: { s: s, t: t, label: { s: s + ' ' + u, t: t + ' ' + u } },
      refleksi: {
        tanya: 'Kapan kita cukup menghitung luas selimut, bukan luas permukaan?',
        opsi: [
          { id: 'besar', teks: 'Saat limasnya besar.' },
          { id: 'terbuka', teks: 'Saat alasnya tidak ditutup, seperti atap atau tenda tanpa lantai.' },
          { id: 'volume', teks: 'Saat soal menanyakan volume.' }
        ],
        benar: 'terbuka',
        penjelasan: 'Langkah pertama soal cerita adalah menerjemahkan situasi: bagian mana yang benar-benar dipakai? Tenda tanpa lantai = 4 sisi tegak saja = selimut.'
      },
      tahap: [
        {
          id: 't1', label: 'Tahap 1', skor: 1, sorot: [],
          instruksi: 'Tuliskan yang diketahui dan ditanya.',
          isian: [
            { id: 'diketahui', jenis: 'pilih-banyak', label: 'Diketahui — pilih SEMUA informasi yang penting untuk menghitung:', opsi: [
              { id: 's', teks: 'Sisi alas ' + s + ' ' + u },
              { id: 'nama', teks: 'Tenda dibuat oleh Pak Dedi' },
              { id: 't', teks: 'Tinggi tenda ' + t + ' ' + u },
              { id: 'lantai', teks: 'Lantai juga dilapisi kain' },
              { id: 'kain', teks: 'Kain hanya untuk 4 sisi tegak' }
            ] },
            { id: 'ditanya', jenis: 'pilih', label: 'Ditanya:', opsi: [
              { id: 'volume', teks: 'Volume tenda' },
              { id: 'kain', teks: 'Luas kain minimal' },
              { id: 'lantai', teks: 'Luas lantai tenda' }
            ] }
          ],
          kunci: function () { return { diketahui: [['s', 't', 'kain']], ditanya: ['kain'] }; },
          penjelasan: 'Diketahui: sisi alas ' + s + ' ' + u + ', tinggi tenda ' + t + ' ' + u + ', kain hanya untuk 4 sisi tegak. Ditanya: luas kain minimal. (Nama Pak Dedi tidak dipakai untuk menghitung.)',
          petunjuk: ['Informasi penting = informasi yang dipakai untuk menghitung.', 'Nama orang tidak dipakai untuk menghitung. Baca lagi: apakah lantai dilapisi kain?', 'Pilih sisi alas, tinggi tenda, dan "kain hanya untuk 4 sisi tegak". Yang ditanya: luas kain.']
        },
        {
          id: 't2', label: 'Tahap 2', skor: 1, sorot: ['selimut'],
          instruksi: 'Kain menutup bagian limas yang mana?',
          isian: [{ id: 'model', jenis: 'pilih', opsi: [
            { id: 'semua', teks: 'Seluruh permukaan limas: alas dan 4 sisi tegak' },
            { id: 'alas', teks: 'Alas (lantai) saja' },
            { id: 'selimut', teks: 'Selimut limas: 4 sisi tegak saja, tanpa alas' },
            { id: 'volume', teks: 'Isi (volume) limas' }
          ] }],
          kunci: function () { return { model: ['selimut'] }; },
          penjelasan: 'Kain hanya menutup 4 sisi tegak, jadi yang dihitung adalah luas selimut limas (tanpa alas).',
          petunjuk: ['Baca lagi kalimat terakhir pada soal.', 'Lantai tidak dilapisi kain.', 'Yang dilapisi hanya 4 sisi tegak = selimut.']
        },
        {
          id: 't3', label: 'Tahap 3', skor: 1, sorot: ['pythagoras'],
          instruksi: 'Tentukan tinggi sisi tegak (tₛ) dengan teorema Pythagoras.',
          isian: [{ id: 'ts', jenis: 'angka', label: 'tₛ', satuan: u }],
          kunci: function () { return { ts: [ts] }; },
          penjelasan: '½ s = ' + fmt(hs) + ' ' + u + ' dan t = ' + t + ' ' + u + '. tₛ = √(' + t + '² + ' + fmt(hs) + '²) = √' + fmt(t * t + hs * hs) + ' = ' + akarTeks(t * t + hs * hs) + ' ' + u + '.',
          petunjuk: ['Lihat segitiga siku-siku yang disorot: sisinya t, ½ s, dan tₛ.', '½ s = ' + fmt(hs) + ' ' + u + '. Rumusnya tₛ² = t² + (½ s)².', 'tₛ = √(' + t + '² + ' + fmt(hs) + '²) = √(' + (t * t) + ' + ' + fmt(hs * hs) + ') = …']
        },
        {
          id: 't4', label: 'Tahap 4', skor: 1, sorot: ['sisiTegak'],
          instruksi: 'Hitung luas satu sisi tegak.',
          isian: [{ id: 'satu', jenis: 'angka', label: 'Luas satu sisi tegak', satuan: u2 }],
          kunci: function (j) { return { satu: kunciAngka(L1, s * pakai(j, 'ts', ts) / 2) }; },
          penjelasan: '½ × ' + s + ' × ' + fmt(ts) + ' = ' + fmt(L1) + ' ' + u2 + '.',
          petunjuk: ['Satu sisi tegak berbentuk segitiga.', 'Luas segitiga = ½ × alas × tₛ.', '½ × ' + s + ' × ' + fmt(ts) + ' = …']
        },
        {
          id: 't5', label: 'Tahap 5', skor: 1, sorot: ['selimut'],
          instruksi: 'Hitung luas selimut (4 sisi tegak).',
          isian: [{ id: 'selimut', jenis: 'angka', label: 'Luas selimut', satuan: u2 }],
          kunci: function (j) { return { selimut: kunciAngka(L, 4 * pakai(j, 'satu', L1)) }; },
          penjelasan: '4 × ' + fmt(L1) + ' = ' + fmt(L) + ' ' + u2 + '.',
          petunjuk: ['Ada berapa sisi tegak?', 'Ada 4 segitiga yang sama.', '4 × ' + fmt(L1) + ' = …']
        },
        {
          id: 't6', label: 'Tahap 6', skor: 1, sorot: [],
          instruksi: 'Pilih kesimpulan yang tepat.',
          isian: [{ id: 'kesimpulan', jenis: 'pilih', opsi: function (j) {
            const ls = pakai(j, 'selimut', L);
            return [
              { id: 'lantai', teks: 'Kain minimal yang dibutuhkan adalah ' + fmt(ls + s * s) + ' ' + u2 + ', karena lantai juga dihitung.' },
              { id: 'selimut', teks: 'Kain minimal yang dibutuhkan adalah ' + fmt(ls) + ' ' + u2 + ' (lantai tidak dilapisi kain).' },
              { id: 'volume', teks: 'Kain minimal yang dibutuhkan adalah ' + fmt(s * s * t / 3) + ' ' + u + '³.' }
            ];
          } }],
          kunci: function () { return { kesimpulan: ['selimut'] }; },
          penjelasan: 'Kain minimal yang dibutuhkan adalah ' + fmt(L) + ' ' + u2 + ' (lantai tidak dilapisi kain).',
          petunjuk: ['Ingat model di tahap 2.', 'Kain hanya untuk selimut, bukan lantai.', 'Pilih kesimpulan yang memakai luas selimut dan satuan ' + u2 + '.']
        }
      ]
    };
  }

  // ---------- Soal Uji Kemampuan (angka asli instrumen) ----------
  const uji = [
    soalVolume({ id: 'uji1', s: 6, t: 4, u: 'cm' }),
    soalBandingkan({ id: 'uji2', sA: 6, tA: 9, sB: 9, tB: 6, u: 'cm' }),
    soalAtap({ id: 'uji3', s: 8, ts: 5, g: 70, u: 'm' }),
    soalPermukaan({ id: 'uji4', kel: 40, t: 12, u: 'cm' }),
    soalTenda({ id: 'uji5', s: 6, t: 4, u: 'm' })
  ];

  // ---------- Soal Latihan (paralel; [L1, L2, L3]) ----------
  const latihan = {
    1: [soalVolume({ id: 'lat1-1', s: 9, t: 5 }), soalVolume({ id: 'lat1-2', s: 12, t: 7 }), soalVolume({ id: 'lat1-3', s: 6, t: 10 })],
    2: [soalBandingkan({ id: 'lat2-1', sA: 3, tA: 12, sB: 6, tB: 5 }), soalBandingkan({ id: 'lat2-2', sA: 4, tA: 9, sB: 6, tB: 4 }), soalBandingkan({ id: 'lat2-3', sA: 6, tA: 12, sB: 8, tB: 3 })],
    3: [soalAtap({ id: 'lat3-1', s: 10, ts: 6, g: 130 }), soalAtap({ id: 'lat3-2', s: 6, ts: 4, g: 40 }), soalAtap({ id: 'lat3-3', s: 12, ts: 10, g: 240 })],
    4: [soalPermukaan({ id: 'lat4-1', kel: 24, t: 4 }), soalPermukaan({ id: 'lat4-2', kel: 64, t: 15 }), soalPermukaan({ id: 'lat4-3', kel: 48, t: 8 })],
    5: [soalTenda({ id: 'lat5-1', s: 8, t: 3 }), soalTenda({ id: 'lat5-2', s: 16, t: 6 }), soalTenda({ id: 'lat5-3', s: 12, t: 8 })]
  };

  const level = [
    { no: 1, nama: 'Contoh', ket: 'Lihat cara mengerjakan langkah demi langkah.' },
    { no: 2, nama: 'Lengkapi', ket: 'Separuh langkah sudah dikerjakan, kamu lanjutkan.' },
    { no: 3, nama: 'Mandiri', ket: 'Kerjakan semua langkah sendiri. Petunjuk tersedia.' }
  ];

  LK.soal = {
    uji: uji, latihan: latihan, level: level,
    templat: { soalVolume: soalVolume, soalBandingkan: soalBandingkan, soalAtap: soalAtap, soalPermukaan: soalPermukaan, soalTenda: soalTenda }
  };
})(typeof window !== 'undefined' ? window : globalThis);
