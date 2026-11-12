/* unduh.js — hasil Uji Kemampuan diunduh manual (CSV) atau disalin sebagai teks. */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});

  function selCSV(v) {
    const s = String(v === undefined || v === null ? '' : v);
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  /** CSV pemisah titik koma (cocok untuk Excel berbahasa Indonesia), dengan BOM UTF-8. */
  function buatCSV(entri) {
    const P = LK.penilaian;
    const baris = [['Nama', 'Kelas', 'Tanggal', 'Soal', 'Indikator', 'Tahap', 'Jawaban siswa', 'Skor', 'Skor maksimum']];
    const tgl = LK.util.tanggalIndo(entri.waktu);
    LK.soal.uji.forEach(function (soal) {
      const j = entri.jawaban[soal.id] || {};
      const n = P.nilaiSoal(soal, j);
      soal.tahap.forEach(function (t, i) {
        const jwb = t.isian.map(function (is) { return P.teksJawaban(is, j[is.id], j); }).join(' | ');
        baris.push([entri.nama, entri.kelas, tgl, 'Soal ' + soal.nomor, soal.indikator, t.label, jwb, n.perTahap[i].skor, n.perTahap[i].maks]);
      });
      baris.push([entri.nama, entri.kelas, tgl, 'Soal ' + soal.nomor, soal.indikator, 'Jumlah soal ' + soal.nomor, '', n.skor, n.maks]);
    });
    baris.push([entri.nama, entri.kelas, tgl, 'TOTAL', '', '', '', entri.total, 30]);
    return '﻿' + baris.map(function (b) { return b.map(selCSV).join(';'); }).join('\r\n');
  }

  function buatTeks(entri) {
    const per = entri.perSoal.map(function (s) { return 'Soal ' + s.nomor + ': ' + s.skor + '/' + s.maks; }).join(' · ');
    return 'Hasil Uji Kemampuan Limas — ' + entri.nama + (entri.kelas ? ' (' + entri.kelas + ')' : '') + ' — ' + LK.util.tanggalIndo(entri.waktu) + '\n' +
      per + '\nTotal: ' + entri.total + '/30';
  }

  function namaFile(entri) {
    const aman = String(entri.nama || 'siswa').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'siswa';
    const d = new Date(entri.waktu);
    const tgl = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return 'hasil-limas-' + aman + '-' + tgl + '.csv';
  }

  function unduhCSV(entri) {
    try {
      const blob = new Blob([buatCSV(entri)], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = namaFile(entri);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      return true;
    } catch (e) {
      return false;
    }
  }

  function salinTeks(teks) {
    if (navigator.clipboard && G.isSecureContext) {
      return navigator.clipboard.writeText(teks).then(function () { return true; }, function () { return salinLama(teks); });
    }
    return Promise.resolve(salinLama(teks));
  }
  function salinLama(teks) {
    const ta = document.createElement('textarea');
    ta.value = teks; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  LK.unduh = { buatCSV: buatCSV, buatTeks: buatTeks, namaFile: namaFile, unduhCSV: unduhCSV, salinTeks: salinTeks };
})(typeof window !== 'undefined' ? window : globalThis);
