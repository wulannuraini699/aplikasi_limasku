/*
 * Kasus uji penilaian & kalkulator. Dipakai bersama oleh:
 *   - tests/penilaian.test.html (browser)
 *   - tests/jalankan-node.js    (terminal: node tests/jalankan-node.js)
 */
(function (G) {
  'use strict';

  G.jalankanTes = function (LK) {
    const P = LK.penilaian;
    const hasil = [];
    function uji(nama, fn) {
      try { fn(); hasil.push({ nama: nama, lulus: true }); }
      catch (e) { hasil.push({ nama: nama, lulus: false, pesan: e.message }); }
    }
    function sama(a, b, pesan) {
      if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((pesan || '') + ' diharapkan ' + JSON.stringify(b) + ', didapat ' + JSON.stringify(a));
    }
    /** Isi semua tahap dengan jawaban benar secara berurutan. */
    function isiBenar(soal) {
      const j = {};
      soal.tahap.forEach(function (t) { Object.assign(j, P.jawabanBenar(t, j)); });
      return j;
    }
    function skorTahap(soal, j) { return P.nilaiSoal(soal, j).perTahap.map(function (x) { return x.skor; }); }

    // ---- parseAngka ----
    uji('parseAngka menerima koma dan titik', function () {
      sama(P.parseAngka('12,5'), 12.5); sama(P.parseAngka('12.5'), 12.5); sama(P.parseAngka(' 48 '), 48);
    });
    uji('parseAngka menolak teks bukan angka', function () {
      sama(P.parseAngka('abc'), null); sama(P.parseAngka(''), null); sama(P.parseAngka('4 8x'), null); sama(P.parseAngka(undefined), null);
    });

    // ---- skor maksimum sesuai Tabel 2 ----
    uji('Setiap soal uji bernilai maksimum 6, total 30', function () {
      let total = 0;
      LK.soal.uji.forEach(function (s) { const m = P.nilaiSoal(s, {}).maks; sama(m, 6, 'soal ' + s.nomor); total += m; });
      sama(total, 30);
    });
    uji('Jawaban benar penuh mendapat 30', function () {
      let total = 0;
      LK.soal.uji.forEach(function (s) { const n = P.nilaiSoal(s, isiBenar(s)); sama(n.skor, 6, 'soal ' + s.nomor); total += n.skor; });
      sama(total, 30);
    });
    uji('Semua soal latihan bisa dijawab penuh (6/6)', function () {
      Object.keys(LK.soal.latihan).forEach(function (no) {
        LK.soal.latihan[no].forEach(function (s) { sama(P.nilaiSoal(s, isiBenar(s)).skor, 6, s.id); });
      });
    });
    uji('Jawaban kosong mendapat 0', function () {
      LK.soal.uji.forEach(function (s) { sama(P.nilaiSoal(s, {}).skor, 0, 'soal ' + s.nomor); });
    });

    // ---- kunci sesuai instrumen ----
    uji('Kunci soal uji sesuai instrumen', function () {
      const j1 = isiBenar(LK.soal.uji[0]); sama([j1.la, j1.v, j1.satuan], ['36', '48', 'cm³']);
      const j2 = isiBenar(LK.soal.uji[1]); sama([j2.laA, j2.laB, j2.vA, j2.vB, j2.banding, j2.keputusan], ['36', '81', '108', '162', 'B', 'tidak']);
      const j3 = isiBenar(LK.soal.uji[2]); sama([j3.satu, j3.atap, j3.banding, j3.selisih, j3.kesimpulan], ['20', '80', 'kurang', '10', 'kurang']);
      const j4 = isiBenar(LK.soal.uji[3]); sama([j4.s, j4.hs, j4.ts, j4.la, j4.ls, j4.lp], ['10', '5', '13', '100', '260', '360']);
      const j5 = isiBenar(LK.soal.uji[4]); sama([j5.ts, j5.satu, j5.selimut], ['5', '15', '60']);
    });

    // ---- error carried forward ----
    uji('ECF soal 1: luas alas salah, langkah berikutnya konsisten → 5', function () {
      const s = LK.soal.uji[0];
      const j = { rumus: 'b', la: '30', subs: 'V = ⅓ × 30 × 4', v: '40', satuan: 'cm³', kesimpulan: 'vol' };
      sama(skorTahap(s, j), [1, 0, 1, 1, 1, 1]);
    });
    uji('ECF soal 2: luas alas B salah → perbandingan & keputusan mengikuti', function () {
      const s = LK.soal.uji[1];
      const j = { laA: '36', laB: '18', vA: '108', vB: '36', banding: 'A', keputusan: 'setuju', alasan: 'dua' };
      sama(skorTahap(s, j), [0, 1, 1, 1, 1, 1]);
    });
    uji('ECF soal 3: luas satu sisi salah → kesimpulan "cukup" tetap dinilai', function () {
      const s = LK.soal.uji[2];
      const j = { tafsir: 'selimut', satu: '16', atap: '64', banding: 'lebih', selisih: '6', kesimpulan: 'lebih' };
      sama(skorTahap(s, j), [1, 0, 1, 1, 1, 1]);
    });
    uji('ECF soal 4: sisi alas salah, akar dibulatkan 2 desimal → 5', function () {
      const s = LK.soal.uji[3];
      // s=8 → ½s=4 → tₛ=√160≈12,65 → La=64 → Ls=2·8·12,65=202,4 → Lp=266,4
      const j = { s: '8', hs: '4', ts: '12,65', la: '64', ls: '202,4', lp: '266,4' };
      sama(skorTahap(s, j), [0, 1, 1, 1, 1, 1]);
    });
    uji('Pedoman: salah menjumlah di akhir soal 4 hanya kehilangan tahap terakhir', function () {
      const s = LK.soal.uji[3];
      const j = { s: '10', hs: '5', ts: '13', la: '100', ls: '260', lp: '350' };
      sama(P.nilaiSoal(s, j).skor, 5);
    });
    uji('Keputusan tidak konsisten dengan perbandingan tidak diberi skor', function () {
      const s = LK.soal.uji[1];
      const j = { laA: '36', laB: '81', vA: '108', vB: '162', banding: 'B', keputusan: 'setuju', alasan: 'tinggi' };
      sama(skorTahap(s, j), [1, 1, 1, 1, 0, 0]);
    });
    uji('Input bukan angka tidak diberi skor', function () {
      const s = LK.soal.uji[0];
      sama(P.nilaiTahap(s.tahap[1], { la: 'tiga puluh enam' }).skor, 0);
    });
    uji('Pilih-banyak tidak bergantung urutan (soal 5 tahap 1)', function () {
      const t = LK.soal.uji[4].tahap[0];
      sama(P.nilaiTahap(t, { diketahui: ['kain', 't', 's'], ditanya: 'kain' }).skor, 1);
      sama(P.nilaiTahap(t, { diketahui: ['kain', 't', 's', 'nama'], ditanya: 'kain' }).skor, 0);
      sama(P.nilaiTahap(t, { diketahui: ['kain', 't', 's'], ditanya: 'volume' }).skor, 0);
    });
    uji('Soal latihan dengan hasil "sama besar" & "pas" dinilai benar', function () {
      const j2 = isiBenar(LK.soal.latihan[2][1]); sama([j2.vA, j2.vB, j2.banding, j2.keputusan], ['48', '48', 'sama', 'tidak']);
      const j3 = isiBenar(LK.soal.latihan[3][2]); sama([j3.atap, j3.banding, j3.selisih, j3.kesimpulan], ['240', 'sama', '0', 'sama']);
      const j2c = isiBenar(LK.soal.latihan[2][2]); sama([j2c.banding, j2c.keputusan], ['A', 'setuju']);
    });
    uji('Opsi pilihan tidak ada yang kembar', function () {
      LK.soal.uji.concat([].concat.apply([], Object.keys(LK.soal.latihan).map(function (k) { return LK.soal.latihan[k]; }))).forEach(function (s) {
        const j = isiBenar(s);
        s.tahap.forEach(function (t) {
          t.isian.forEach(function (is) {
            if (is.jenis === 'angka') return;
            const ids = P.opsiDari(is, j).map(function (o) { return o.id; });
            ids.forEach(function (id, i) { if (ids.indexOf(id) !== i) throw new Error(s.id + ' ' + t.id + ' opsi kembar: ' + id); });
          });
        });
      });
    });

    // ---- kalkulator ----
    uji('Kalkulator: operasi dasar, ⅓, akar, kuadrat', function () {
      const H = LK.kalkulator.hitung;
      sama(H('⅓×36×4'), 48); sama(H('√(12²+5²)'), 13); sama(H('2(3+4)'), 14); sama(H('12,5×2'), 25);
      sama(H('100−4×5'), 80); sama(H('½×8×5'), 20); sama(H('−3+5'), 2);
    });
    uji('Kalkulator: ekspresi tidak valid → null', function () {
      const H = LK.kalkulator.hitung;
      sama(H('5÷0'), null); sama(H('3+'), null); sama(H('(2+3'), null); sama(H('√(−4)'), null); sama(H(''), null);
    });

    return hasil;
  };
})(typeof window !== 'undefined' ? window : globalThis);
