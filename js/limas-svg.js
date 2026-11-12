/*
 * limas-svg.js — gambar limas segiempat beraturan (SVG) dengan bagian yang bisa disorot.
 * Warna tetap: alas/sisi alas = biru, tinggi limas = ungu, tinggi sisi tegak & selimut = oranye.
 * Angka diketahui ditulis langsung di gambar (prinsip spatial contiguity).
 *
 * sorot: 'alas' | 'tinggi' | 'sisiTegak' | 'pythagoras' | 'selimut' | 'permukaan'
 */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});
  const DX = 0.45, DY = 0.3; // arah kedalaman (proyeksi miring)

  function skala(s, t, lebar, tinggi) {
    return Math.min((lebar - 40) / (s * (1 + DX)), (tinggi - 64) / (t + s * DY));
  }
  const f = function (n) { return n.toFixed(1); };
  const esc = function (x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  function garis(a, b, kelas) { return '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" class="' + kelas + '"/>'; }
  function poli(pts, kelas) { return '<polygon points="' + pts.map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' ') + '" class="' + kelas + '"/>'; }
  function teks(p, isi, kelas, anchor) {
    const isiSvg = esc(isi).split('ₛ').join('<tspan class="lm-sub" dy="4">s</tspan><tspan dy="-4">​</tspan>');
    return '<text x="' + f(p[0]) + '" y="' + f(p[1]) + '" class="lm-label ' + kelas + '" text-anchor="' + (anchor || 'middle') + '">' + isiSvg + '</text>';
  }

  function limas(o) {
    const LB = o.lebar || 300, TG = o.tinggi || 250;
    const s = o.s, t = o.t;
    const k = o.k || skala(s, t, LB, TG);
    const W = s * k, H = t * k, dx = W * DX, dy = W * DY;
    const x0 = (LB - (W + dx)) / 2, y0 = TG - 34;
    const A = [x0, y0], B = [x0 + W, y0], C = [x0 + W + dx, y0 - dy], D = [x0 + dx, y0 - dy];
    const O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
    const P = [O[0], O[1] - H];
    const M = [(A[0] + B[0]) / 2, y0];

    const sor = [].concat(o.sorot || []);
    const ada = function (x) { return sor.indexOf(x) >= 0; };
    const lab = Object.assign({}, o.label || {});
    const pyt = ada('pythagoras');
    if ((ada('tinggi') || pyt) && lab.t == null) lab.t = '?';
    if ((ada('sisiTegak') || pyt) && lab.ts == null) lab.ts = '?';
    if (pyt && lab.h == null) lab.h = '?';

    const tampilT = lab.t != null, tampilTs = lab.ts != null, tampilH = lab.h != null;
    const alasAktif = ada('alas') || ada('permukaan');
    const selimutAktif = ada('selimut') || ada('permukaan');
    const depanAktif = selimutAktif || ada('sisiTegak');

    let svg = '';
    svg += poli([A, B, C, D], 'lm-alas-isi' + (alasAktif ? ' aktif' : ''));
    svg += poli([P, B, C], 'lm-selimut-isi samping' + (selimutAktif ? ' aktif' : ''));
    svg += poli([P, A, B], 'lm-selimut-isi' + (depanAktif ? ' aktif' : ''));
    if (pyt) svg += poli([P, O, M], 'lm-pyt-isi');
    // rusuk tersembunyi (putus-putus)
    svg += garis(A, D, 'lm-garis putus') + garis(D, C, 'lm-garis putus') + garis(P, D, 'lm-garis putus');
    // rusuk terlihat
    svg += garis(B, C, 'lm-garis') + garis(P, A, 'lm-garis') + garis(P, B, 'lm-garis') + garis(P, C, 'lm-garis');
    svg += garis(A, B, 'lm-sisi' + (alasAktif || lab.s != null ? ' tebal' : ''));
    if (tampilH) svg += garis(O, M, 'lm-setengah' + (pyt ? ' tebal' : ''));
    if (tampilT) svg += garis(P, O, 'lm-tinggi' + (ada('tinggi') || pyt ? ' tebal' : ''));
    if (tampilTs) svg += garis(P, M, 'lm-ts' + (ada('sisiTegak') || pyt ? ' tebal' : ''));
    if (tampilT && tampilH) {
      // tanda siku-siku di titik O
      const ux = M[0] - O[0], uy = M[1] - O[1], pj = Math.hypot(ux, uy) || 1, r = 9;
      const a = [O[0] + ux / pj * r, O[1] + uy / pj * r], c = [O[0], O[1] - r], b = [a[0], a[1] - r];
      svg += '<polyline points="' + [a, b, c].map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' ') + '" class="lm-siku"/>';
    }
    svg += '<circle cx="' + f(P[0]) + '" cy="' + f(P[1]) + '" r="3" class="lm-titik"/>';

    // label (nilai true = tampilkan simbolnya saja)
    const tulis = function (simbol, v) { return v === true ? simbol : simbol + ' = ' + v; };
    if (lab.s != null) svg += teks([M[0], y0 + 24], tulis('s', lab.s), 'warna-alas');
    if (tampilT) svg += teks([O[0] + 8, (O[1] + P[1]) / 2 + 4], tulis('t', lab.t), 'warna-tinggi', 'start');
    if (tampilTs) svg += teks([(P[0] + M[0]) / 2 - 8, (P[1] + M[1]) / 2], tulis('tₛ', lab.ts), 'warna-ts', 'end');
    if (tampilH) svg += teks([(O[0] + M[0]) / 2 + 12, (O[1] + M[1]) / 2 + 6], tulis('½s', lab.h), 'warna-alas kecil', 'start');

    const judul = o.judul || ('Limas segiempat beraturan' + (lab.s != null ? ', sisi alas ' + lab.s : '') + (tampilT ? ', tinggi limas ' + lab.t : '') + (tampilTs ? ', tinggi sisi tegak ' + lab.ts : ''));
    return '<svg viewBox="0 0 ' + LB + ' ' + TG + '" class="limas-svg" role="img" aria-label="' + esc(judul) + '"><title>' + esc(judul) + '</title>' + svg + '</svg>';
  }

  /** Gambar untuk satu soal (satu limas, atau dua limas dengan skala sama untuk soal perbandingan). */
  function untukSoal(soal, sorot) {
    const g = soal.gambar;
    if (g.dua) {
      const L = 220, T = 240;
      const k = Math.min(skala(g.A.s, g.A.t, L, T), skala(g.B.s, g.B.t, L, T));
      const satu = function (x, nama) {
        return '<figure>' + limas({ s: x.s, t: x.t, label: x.label, sorot: sorot, k: k, lebar: L, tinggi: T, judul: 'Limas ' + nama + ', sisi alas ' + x.label.s + ', tinggi ' + x.label.t }) + '<figcaption>Limas ' + nama + '</figcaption></figure>';
      };
      return '<div class="gambar-dua">' + satu(g.A, 'A') + satu(g.B, 'B') + '</div>';
    }
    return limas({ s: g.s, t: g.t, label: g.label, sorot: sorot });
  }

  LK.gambar = { limas: limas, untukSoal: untukSoal };
})(typeof window !== 'undefined' ? window : globalThis);
