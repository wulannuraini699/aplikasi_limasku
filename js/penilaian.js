/*
 * penilaian.js — penskoran per tahap. Fungsi murni (tanpa DOM) agar mudah diuji.
 *
 * Struktur tahap (lihat data/soal.js):
 *   { id, label, skor, isian: [{id, jenis:'angka'|'pilih'|'pilih-banyak', opsi}], kunci(j) }
 * kunci(j) mengembalikan { idIsian: [nilai yang diterima, ...] }.
 * Daftar kunci sudah memuat jawaban benar + jawaban hasil "error carried forward" (ECF),
 * yaitu nilai yang benar bila dihitung dari jawaban siswa sendiri di tahap sebelumnya.
 */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});

  /** "12,5" / "12.5" / " 48 " -> angka; selain itu null. */
  function parseAngka(x) {
    if (x === null || x === undefined) return null;
    if (typeof x === 'number') return isFinite(x) ? x : null;
    const s = String(x).trim().replace(/\s+/g, '').replace(',', '.');
    if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(s)) return null;
    const n = Number(s);
    return isFinite(n) ? n : null;
  }

  /** Kunci bulat: selisih maks 0,01. Kunci desimal (mis. hasil akar): boleh dibulatkan 1 desimal. */
  function toleransi(k) {
    if (Math.abs(k - Math.round(k)) < 1e-9) return 0.011;
    return Math.max(0.051, Math.abs(k) * 0.005);
  }

  function cocokAngka(nilai, kunci) {
    const n = parseAngka(nilai);
    if (n === null || typeof kunci !== 'number' || !isFinite(kunci)) return false;
    return Math.abs(n - kunci) <= toleransi(kunci);
  }

  function samaHimpunan(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    const x = a.slice().sort(), y = b.slice().sort();
    return x.length === y.length && x.every(function (v, i) { return v === y[i]; });
  }

  function opsiDari(isian, j) {
    return typeof isian.opsi === 'function' ? isian.opsi(j || {}) : (isian.opsi || []);
  }

  function terisi(isian, nilai) {
    if (isian.jenis === 'angka') return parseAngka(nilai) !== null;
    if (isian.jenis === 'pilih-banyak') return Array.isArray(nilai) && nilai.length > 0;
    return typeof nilai === 'string' && nilai !== '';
  }

  function cocokIsian(isian, nilai, daftarKunci) {
    if (!daftarKunci || !daftarKunci.length) return false;
    if (isian.jenis === 'angka') return daftarKunci.some(function (k) { return cocokAngka(nilai, k); });
    if (isian.jenis === 'pilih-banyak') return daftarKunci.some(function (k) { return samaHimpunan(nilai, k); });
    return daftarKunci.indexOf(nilai) >= 0;
  }

  /** Semua isian dalam satu tahap harus benar untuk mendapat skor tahap tersebut. */
  function nilaiTahap(tahap, j) {
    j = j || {};
    const k = tahap.kunci(j);
    const benar = tahap.isian.every(function (is) { return cocokIsian(is, j[is.id], k[is.id]); });
    return { id: tahap.id, label: tahap.label, benar: benar, skor: benar ? tahap.skor : 0, maks: tahap.skor };
  }

  function nilaiSoal(soal, j) {
    const per = soal.tahap.map(function (t) { return nilaiTahap(t, j); });
    return {
      id: soal.id, nomor: soal.nomor, indikator: soal.indikator,
      skor: per.reduce(function (a, b) { return a + b.skor; }, 0),
      maks: per.reduce(function (a, b) { return a + b.maks; }, 0),
      perTahap: per
    };
  }

  /** Jawaban benar (kunci pertama) untuk satu tahap — dipakai contoh lengkap & bantuan. */
  function jawabanBenar(tahap, j) {
    const k = tahap.kunci(j || {});
    const out = {};
    tahap.isian.forEach(function (is) {
      const v = k[is.id][0];
      out[is.id] = is.jenis === 'angka' ? LK.util.fmt(v) : (Array.isArray(v) ? v.slice() : v);
    });
    return out;
  }

  /** Teks jawaban siswa yang mudah dibaca (untuk pembahasan & unduhan). */
  function teksJawaban(isian, nilai, j) {
    if (!terisi(isian, nilai)) return '(kosong)';
    if (isian.jenis === 'angka') return String(nilai).trim() + (isian.satuan ? ' ' + isian.satuan : '');
    const opsi = opsiDari(isian, j);
    const cari = function (id) { const o = opsi.filter(function (x) { return x.id === id; })[0]; return o ? o.teks : id; };
    if (isian.jenis === 'pilih-banyak') return nilai.map(cari).join('; ');
    return cari(nilai);
  }

  LK.penilaian = {
    parseAngka: parseAngka, cocokAngka: cocokAngka, samaHimpunan: samaHimpunan,
    opsiDari: opsiDari, terisi: terisi, cocokIsian: cocokIsian,
    nilaiTahap: nilaiTahap, nilaiSoal: nilaiSoal, jawabanBenar: jawabanBenar, teksJawaban: teksJawaban
  };
})(typeof window !== 'undefined' ? window : globalThis);
