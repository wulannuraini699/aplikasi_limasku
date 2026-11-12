/* storage.js — simpan progres di localStorage. Aman bila penyimpanan diblokir (mode privat). */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});
  const AWALAN = 'limasku:';
  const cadangan = {}; // dipakai bila localStorage tidak bisa diakses

  function baca(kunci, bawaan) {
    try {
      const v = G.localStorage.getItem(AWALAN + kunci);
      return v === null ? bawaan : JSON.parse(v);
    } catch (e) {
      return kunci in cadangan ? cadangan[kunci] : bawaan;
    }
  }
  function tulis(kunci, nilai) {
    cadangan[kunci] = nilai;
    try { G.localStorage.setItem(AWALAN + kunci, JSON.stringify(nilai)); } catch (e) { /* abaikan */ }
  }
  function hapus(kunci) {
    delete cadangan[kunci];
    try { G.localStorage.removeItem(AWALAN + kunci); } catch (e) { /* abaikan */ }
  }

  LK.simpan = { baca: baca, tulis: tulis, hapus: hapus };
})(typeof window !== 'undefined' ? window : globalThis);
