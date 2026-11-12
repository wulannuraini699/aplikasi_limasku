/* util.js — fungsi bantu umum. Dipakai oleh semua modul lain. */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});

  /** Format angka gaya Indonesia: maks 2 desimal, koma sebagai pemisah desimal. */
  function fmt(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '';
    const r = Math.round(n * 100) / 100;
    return String(Object.is(r, -0) ? 0 : r).replace('.', ',');
  }

  /** Pembuat elemen DOM ringkas: h('div', {class:'x', onclick: fn}, 'teks', anak) */
  function h(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        const v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'html') el.innerHTML = v; // hanya untuk konten buatan aplikasi (SVG)
        else if (k === 'value') el.value = v;
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    for (let i = 2; i < arguments.length; i++) tambah(el, arguments[i]);
    return el;
  }
  function tambah(el, anak) {
    if (anak === null || anak === undefined || anak === false) return;
    if (Array.isArray(anak)) { anak.forEach(function (a) { tambah(el, a); }); return; }
    if (anak.nodeType) { el.appendChild(anak); return; }
    // "tₛ": karakter subskrip ₛ tidak ada di banyak font HP, jadi tampilkan sebagai <sub>s</sub>
    String(anak).split('ₛ').forEach(function (bagian, i) {
      if (i > 0) { const sub = document.createElement('sub'); sub.textContent = 's'; el.appendChild(sub); }
      if (bagian) el.appendChild(document.createTextNode(bagian));
    });
  }

  /**
   * Teks dengan penanda warna konsisten:
   * "{alas|sisi 6 cm}" -> biru, "{tinggi|tinggi limas 4 cm}" -> ungu, "{ts|tinggi sisi tegak}" -> oranye
   */
  function teksBerwarna(str) {
    const hasil = [];
    const re = /\{(alas|tinggi|ts)\|([^}]*)\}/g;
    let akhir = 0, m;
    while ((m = re.exec(str))) {
      if (m.index > akhir) hasil.push(str.slice(akhir, m.index));
      hasil.push(h('span', { class: 'tanda tanda-' + m[1] }, m[2]));
      akhir = re.lastIndex;
    }
    if (akhir < str.length) hasil.push(str.slice(akhir));
    return hasil;
  }

  /** Lembar bawah (bottom sheet) untuk kalkulator & kartu rumus. */
  const sheet = {
    el: null,
    buka: function (judul, isi) {
      sheet.tutup();
      const panel = h('div', { class: 'sheet-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': judul },
        h('div', { class: 'sheet-kepala' },
          h('h2', null, judul),
          h('button', { class: 'tombol-ikon', type: 'button', 'aria-label': 'Tutup', onclick: sheet.tutup }, '✕')),
        h('div', { class: 'sheet-isi' }, isi));
      const latar = h('div', { class: 'sheet-latar', onclick: function (e) { if (e.target === latar) sheet.tutup(); } }, panel);
      document.body.appendChild(latar);
      document.addEventListener('keydown', sheet._esc);
      sheet.el = latar;
      const fokus = panel.querySelector('button');
      if (fokus) fokus.focus();
    },
    tutup: function () {
      if (sheet.el) { sheet.el.remove(); sheet.el = null; }
      document.removeEventListener('keydown', sheet._esc);
      if (sheet.onTutup) { const f = sheet.onTutup; sheet.onTutup = null; f(); }
    },
    _esc: function (e) { if (e.key === 'Escape') sheet.tutup(); }
  };

  function tanggalIndo(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const dua = function (x) { return (x < 10 ? '0' : '') + x; };
    return dua(d.getDate()) + '/' + dua(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + dua(d.getHours()) + '.' + dua(d.getMinutes());
  }

  LK.util = { fmt: fmt, h: h, teksBerwarna: teksBerwarna, tanggalIndo: tanggalIndo };
  LK.sheet = sheet;
})(typeof window !== 'undefined' ? window : globalThis);
