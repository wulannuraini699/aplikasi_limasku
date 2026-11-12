/*
 * kalkulator.js — kalkulator bantu (temuan wawancara: "kalau angkanya besar suka salah menghitung").
 * Parser ekspresi sendiri (tanpa eval) yang mendukung + − × ÷ ( ) √ ² ⅓ dan koma desimal.
 */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});

  function hitung(ekspr) {
    const s = String(ekspr).replace(/\s+/g, '').replace(/,/g, '.');
    if (!s) return null;
    let i = 0;
    const lihat = function () { return s[i]; };
    function angka() {
      const m = /^(\d+(\.\d*)?|\.\d+)/.exec(s.slice(i));
      if (!m) throw new Error('angka');
      i += m[0].length;
      return parseFloat(m[0]);
    }
    function primer() {
      const c = lihat();
      if (c === '(') {
        i++;
        const v = ekspresi();
        if (lihat() !== ')') throw new Error('kurung');
        i++;
        return v;
      }
      if (c === '√') { i++; const v = pangkat(); if (v < 0) throw new Error('akar'); return Math.sqrt(v); }
      if (c === '⅓') { i++; return 1 / 3; }
      if (c === '½') { i++; return 1 / 2; }
      return angka();
    }
    function pangkat() { let v = primer(); while (lihat() === '²') { i++; v = v * v; } return v; }
    function unary() { if (lihat() === '−' || lihat() === '-') { i++; return -unary(); } return pangkat(); }
    function suku() {
      let v = unary();
      for (;;) {
        const c = lihat();
        if (c === '×' || c === '*') { i++; v *= unary(); }
        else if (c === '÷' || c === '/') { i++; const d = unary(); if (d === 0) throw new Error('nol'); v /= d; }
        else if (c === '(' || c === '√' || c === '⅓' || c === '½') { v *= unary(); } // perkalian tersirat: 2(3+4)
        else break;
      }
      return v;
    }
    function ekspresi() {
      let v = suku();
      for (;;) {
        const c = lihat();
        if (c === '+') { i++; v += suku(); }
        else if (c === '−' || c === '-') { i++; v -= suku(); }
        else break;
      }
      return v;
    }
    try {
      const v = ekspresi();
      if (i !== s.length || !isFinite(v)) return null;
      return Math.round(v * 1e9) / 1e9;
    } catch (e) {
      return null;
    }
  }

  /** Teks hasil: maks 4 desimal, koma. */
  function teksHasil(v) {
    if (v === null) return '';
    const r = Math.round(v * 10000) / 10000;
    return String(r).replace('.', ',');
  }

  function buka() {
    const h = LK.util.h;
    let ekspr = '';
    const layar = h('div', { class: 'kalk-ekspr', 'aria-label': 'Ekspresi' });
    const hasil = h('output', { class: 'kalk-hasil', 'aria-live': 'polite' });
    function perbarui() {
      layar.textContent = ekspr || '0';
      const v = hitung(ekspr);
      hasil.textContent = ekspr ? (v === null ? '…' : '= ' + teksHasil(v)) : '';
    }
    function tekan(k) {
      if (k === 'C') ekspr = '';
      else if (k === '⌫') ekspr = ekspr.slice(0, -1);
      else if (k === '=') { const v = hitung(ekspr); if (v !== null) ekspr = teksHasil(v); }
      else if (k === 'x²') ekspr += '²';
      else ekspr += k;
      perbarui();
    }
    const tombol = ['C', '(', ')', '⌫', '⅓', '√', 'x²', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', ',', '½', '='];
    const kisi = h('div', { class: 'kalk-kisi' }, tombol.map(function (k) {
      const jenis = k === '=' ? ' kalk-sama' : (/[÷×−+]/.test(k) ? ' kalk-op' : (/[C⌫]/.test(k) ? ' kalk-hapus' : ''));
      return h('button', { type: 'button', class: 'kalk-tombol' + jenis, onclick: function () { tekan(k); }, 'aria-label': k === '⌫' ? 'Hapus satu' : k }, k);
    }));
    function keyboard(e) {
      const peta = { '*': '×', '/': '÷', '-': '−', '.': ',', Enter: '=', Backspace: '⌫', Delete: 'C' };
      const k = peta[e.key] || e.key;
      if (/^[0-9+()×÷−,=⌫C]$/.test(k) || k === '⌫') { e.preventDefault(); tekan(k); }
    }
    document.addEventListener('keydown', keyboard);
    LK.sheet.buka('Kalkulator', [h('div', { class: 'kalk-layar' }, layar, hasil), kisi,
      h('p', { class: 'kecil redup' }, 'Kalkulator membantu menghitung. Kamu tetap yang memilih rumus dan langkahnya.')]);
    LK.sheet.onTutup = function () { document.removeEventListener('keydown', keyboard); };
    perbarui();
  }

  LK.kalkulator = { hitung: hitung, teksHasil: teksHasil, buka: buka };
})(typeof window !== 'undefined' ? window : globalThis);
