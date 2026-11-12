/*
 * runner.js — mesin pengerjaan soal, satu tahap per layar (prinsip segmenting).
 *
 * Mode 'latihan':
 *   level 1 Contoh   : semua tahap sudah terisi + penjelasan (worked example)
 *   level 2 Lengkapi : separuh tahap awal terisi, sisanya dikerjakan siswa (backward fading)
 *   level 3 Mandiri  : semua tahap dikerjakan siswa
 *   Umpan balik langsung, petunjuk bertingkat (maks 3), setelah 3 kali salah jawaban ditunjukkan.
 *   Diakhiri satu pertanyaan refleksi (self-explanation).
 * Mode 'uji':
 *   Tanpa umpan balik & petunjuk. Bisa maju-mundur. Progres disimpan lewat onSimpan.
 */
(function (G) {
  'use strict';
  const LK = (G.LK = G.LK || {});

  function mulai(wadah, cfg) {
    const h = LK.util.h, P = LK.penilaian;
    const st = { iSoal: 0, iTahap: 0, jawaban: {}, info: {} };
    if (cfg.awal) Object.assign(st, JSON.parse(JSON.stringify(cfg.awal)));
    cfg.daftarSoal.forEach(function (s) {
      st.jawaban[s.id] = st.jawaban[s.id] || {};
      st.info[s.id] = st.info[s.id] || {};
    });
    if (st.iSoal >= cfg.daftarSoal.length) { st.iSoal = 0; st.iTahap = 0; }
    let fase = 'kerja';
    let peringatanKosong = false;
    const totalTahap = cfg.daftarSoal.reduce(function (a, s) { return a + s.tahap.length; }, 0);

    const soal = function () { return cfg.daftarSoal[st.iSoal]; };
    const tahap = function () { return soal().tahap[st.iTahap]; };
    const jw = function () { return st.jawaban[soal().id]; };
    function info() {
      const s = st.info[soal().id], id = tahap().id;
      return s[id] || (s[id] = { coba: 0, petunjuk: 0 });
    }
    function terisiSemua() {
      return tahap().isian.every(function (is) { return P.terisi(is, jw()[is.id]); });
    }
    function tahapContoh(idx) {
      if (cfg.mode !== 'latihan') return false;
      if (cfg.level === 1) return true;
      if (cfg.level === 2) return idx < Math.ceil(soal().tahap.length / 2);
      return false;
    }
    function nomorGlobal() {
      let n = 0;
      for (let i = 0; i < st.iSoal; i++) n += cfg.daftarSoal[i].tahap.length;
      return n + st.iTahap + 1;
    }
    function simpan() { if (cfg.onSimpan) cfg.onSimpan(JSON.parse(JSON.stringify(st))); }

    // ---------------- tampilan ----------------
    function kepala() {
      const s = soal();
      const alat = [h('button', { type: 'button', class: 'tombol-ikon', 'aria-label': 'Buka kalkulator', title: 'Kalkulator', onclick: LK.kalkulator.buka }, '🧮')];
      if (cfg.mode === 'latihan') alat.unshift(h('button', { type: 'button', class: 'tombol-teks', onclick: bukaRumus }, 'Rumus'));
      const persen = Math.round(nomorGlobal() / totalTahap * 100);
      return h('header', { class: 'kepala kepala-kerja' },
        h('div', { class: 'kepala-baris' },
          h('a', { href: cfg.kembali, class: 'tombol-ikon', 'aria-label': 'Kembali' }, '←'),
          h('div', { class: 'kepala-judul' },
            h('div', { class: 'kecil redup' }, cfg.judul),
            h('div', { class: 'tebal' }, (cfg.daftarSoal.length > 1 ? 'Soal ' + s.nomor + ' · ' : '') + 'Langkah ' + (st.iTahap + 1) + ' dari ' + s.tahap.length)),
          h('div', { class: 'kepala-alat' }, alat)),
        h('div', { class: 'progres', role: 'progressbar', 'aria-label': 'Kemajuan', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(persen) },
          h('div', { class: 'progres-isi', style: 'width:' + persen + '%' })));
    }

    function bukaRumus() {
      LK.sheet.buka('Kartu rumus', h('ul', { class: 'daftar-rumus' }, LK.rumus.map(function (r) {
        return h('li', { class: 'rumus-' + r.warna }, h('span', { class: 'kecil redup' }, r.nama), h('span', { class: 'rumus' }, r.rumus));
      })));
    }

    function kartuSoal(s, buka) {
      return h('details', { class: 'kartu soal-kartu', open: buka },
        h('summary', null, 'Soal ' + s.nomor + ': ' + s.judul),
        h('p', null, LK.util.teksBerwarna(s.teks)),
        h('p', { class: 'tebal' }, s.pertanyaan));
    }

    function isianEl(is, terkunci) {
      const j = jw();
      const label = is.label ? h('div', { class: 'isian-label', id: 'lbl-' + is.id }, is.label) : null;
      if (is.jenis === 'angka') {
        const inp = h('input', {
          id: 'in-' + is.id, class: 'input-angka', type: 'text', inputmode: 'decimal', autocomplete: 'off',
          value: j[is.id] || '', disabled: terkunci, 'aria-labelledby': is.label ? 'lbl-' + is.id : null,
          'aria-label': is.label ? null : 'Jawaban'
        });
        inp.addEventListener('input', function () { j[is.id] = inp.value; peringatanKosong = false; simpan(); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); aksiUtama(); } });
        return h('div', { class: 'isian' },
          is.label ? h('label', { class: 'isian-label', for: 'in-' + is.id, id: 'lbl-' + is.id }, is.label) : null,
          h('div', { class: 'input-grup' }, inp, is.satuan ? h('span', { class: 'satuan' }, is.satuan) : null));
      }
      const banyak = is.jenis === 'pilih-banyak';
      const opsi = P.opsiDari(is, j);
      const grup = h('div', { class: 'opsi-grup', role: banyak ? 'group' : 'radiogroup', 'aria-labelledby': is.label ? 'lbl-' + is.id : null });
      const tombol = [];
      function tandai() {
        tombol.forEach(function (b) {
          const id = b.dataset.id;
          const dipilih = banyak ? (j[is.id] || []).indexOf(id) >= 0 : j[is.id] === id;
          b.classList.toggle('dipilih', dipilih);
          b.setAttribute('aria-checked', dipilih ? 'true' : 'false');
        });
      }
      opsi.forEach(function (o) {
        const b = h('button', {
          type: 'button', class: 'opsi' + (banyak ? ' opsi-banyak' : ''), role: banyak ? 'checkbox' : 'radio', 'data-id': o.id, disabled: terkunci,
          onclick: function () {
            if (banyak) {
              const arr = (j[is.id] || []).slice();
              const i = arr.indexOf(o.id);
              if (i >= 0) arr.splice(i, 1); else arr.push(o.id);
              j[is.id] = arr;
            } else j[is.id] = o.id;
            peringatanKosong = false;
            tandai(); simpan();
          }
        }, h('span', { class: 'opsi-tanda', 'aria-hidden': 'true' }), h('span', null, o.teks));
        tombol.push(b); grup.appendChild(b);
      });
      tandai();
      return h('div', { class: 'isian' }, label, grup);
    }

    function render() {
      if (fase === 'refleksi') return renderRefleksi();
      const s = soal(), t = tahap(), inf = info(), j = jw();
      const contoh = tahapContoh(st.iTahap);
      if (contoh && !inf.selesai) { Object.assign(j, P.jawabanBenar(t, j)); inf.selesai = true; inf.contoh = true; }
      const latihan = cfg.mode === 'latihan';
      const terkunci = latihan && inf.selesai;

      let umpan = null;
      if (latihan && inf.selesai) {
        if (inf.contoh) umpan = h('div', { class: 'umpan umpan-contoh' }, h('b', null, 'Cara mengerjakan: '), t.penjelasan);
        else if (inf.dibantu) umpan = h('div', { class: 'umpan umpan-dibantu' }, h('b', null, 'Ini jawaban yang benar. '), t.penjelasan, h('div', { class: 'kecil' }, 'Tidak apa-apa. Baca langkahnya, lalu lanjutkan.'));
        else umpan = h('div', { class: 'umpan umpan-benar' }, h('b', null, '✓ Tepat! '), t.penjelasan);
      } else if (latihan && inf.umpan === 'salah') {
        umpan = h('div', { class: 'umpan umpan-salah' }, h('b', null, '! Belum tepat. '), 'Coba cek lagi. ', inf.petunjuk < 3 ? 'Kamu bisa membuka petunjuk di bawah.' : '',
          h('div', { class: 'kecil' }, 'Kesempatan tersisa: ' + (3 - inf.coba)));
      } else if (latihan && inf.umpan === 'kosong') {
        umpan = h('div', { class: 'umpan umpan-info' }, 'Isi dulu jawabanmu, lalu tekan Periksa.');
      } else if (!latihan && peringatanKosong) {
        umpan = h('div', { class: 'umpan umpan-info' }, 'Langkah ini belum diisi. Tekan sekali lagi untuk melewatinya.');
      }

      let petunjukEl = null;
      if (latihan && !inf.selesai) {
        const daftar = t.petunjuk.slice(0, inf.petunjuk).map(function (p, i) {
          return h('li', null, h('span', { class: 'kecil tebal' }, 'Petunjuk ' + (i + 1) + ': '), p);
        });
        petunjukEl = h('div', { class: 'petunjuk' },
          daftar.length ? h('ol', { class: 'daftar-petunjuk' }, daftar) : null,
          inf.petunjuk < t.petunjuk.length ? h('button', {
            type: 'button', class: 'tombol-petunjuk',
            onclick: function () { inf.petunjuk++; render(); }
          }, '💡 ' + (inf.petunjuk ? 'Petunjuk berikutnya' : 'Butuh petunjuk?') + ' (' + inf.petunjuk + '/' + t.petunjuk.length + ')') : null);
      }

      const kartuTahap = h('section', { class: 'kartu tahap-kartu', 'aria-labelledby': 'judul-tahap' },
        h('div', { class: 'tahap-label', id: 'judul-tahap' }, t.label + (inf.contoh ? ' · contoh' : '')),
        h('p', { class: 'instruksi' }, t.instruksi),
        t.isian.map(function (is) { return isianEl(is, terkunci); }),
        h('div', { 'aria-live': 'polite', class: 'umpan-wadah' }, umpan),
        petunjukEl);

      const tombol = [];
      if (!latihan && nomorGlobal() > 1) tombol.push(h('button', { type: 'button', class: 'tombol tombol-kedua', onclick: mundur }, 'Sebelumnya'));
      let labelUtama;
      if (!latihan) labelUtama = nomorGlobal() === totalTahap ? 'Selesai' : 'Simpan & lanjut';
      else labelUtama = inf.selesai ? (st.iTahap === s.tahap.length - 1 ? 'Lanjut ke refleksi' : 'Lanjut') : 'Periksa';
      tombol.push(h('button', { type: 'button', class: 'tombol tombol-utama', onclick: aksiUtama }, labelUtama));

      wadah.replaceChildren(
        kepala(),
        h('main', { class: 'isi isi-kerja' },
          kartuSoal(s, st.iTahap === 0 ? true : null),
          h('div', { class: 'gambar', html: LK.gambar.untukSoal(s, t.sorot) }),
          kartuTahap),
        h('div', { class: 'bar-bawah' }, h('div', { class: 'bar-bawah-isi' }, tombol)));
    }

    function renderRefleksi() {
      const s = soal(), r = s.refleksi;
      let dipilih = null;
      const umpan = h('div', { 'aria-live': 'polite', class: 'umpan-wadah' });
      const selesai = h('button', { type: 'button', class: 'tombol tombol-utama', disabled: true, onclick: function () { cfg.onSelesai(st, ringkasan()); } }, 'Selesai');
      const tombol = r.opsi.map(function (o) {
        return h('button', {
          type: 'button', class: 'opsi', role: 'radio', 'aria-checked': 'false', 'data-id': o.id,
          onclick: function () {
            if (dipilih) return;
            dipilih = o.id;
            tombol.forEach(function (b) {
              const id = b.dataset.id;
              b.disabled = true;
              b.classList.toggle('dipilih', id === dipilih);
              b.classList.toggle('opsi-benar', id === r.benar);
              b.setAttribute('aria-checked', id === dipilih ? 'true' : 'false');
            });
            const benar = dipilih === r.benar;
            umpan.replaceChildren(h('div', { class: 'umpan ' + (benar ? 'umpan-benar' : 'umpan-dibantu') }, h('b', null, benar ? '✓ Tepat! ' : 'Jawaban yang tepat sudah ditandai. '), r.penjelasan));
            selesai.disabled = false;
          }
        }, h('span', { class: 'opsi-tanda', 'aria-hidden': 'true' }), h('span', null, o.teks));
      });
      wadah.replaceChildren(
        h('header', { class: 'kepala' }, h('a', { href: cfg.kembali, class: 'tombol-ikon', 'aria-label': 'Kembali' }, '←'), h('h1', null, 'Refleksi')),
        h('main', { class: 'isi isi-kerja' },
          h('section', { class: 'kartu' },
            h('div', { class: 'tahap-label' }, 'Pikirkan sejenak'),
            h('p', { class: 'instruksi' }, r.tanya),
            h('div', { class: 'opsi-grup', role: 'radiogroup' }, tombol),
            umpan)),
        h('div', { class: 'bar-bawah' }, h('div', { class: 'bar-bawah-isi' }, selesai)));
      window.scrollTo(0, 0);
    }

    function ringkasan() {
      const inf = st.info[soal().id];
      const r = { sendiri: 0, petunjuk: 0, dibantu: 0, contoh: 0 };
      soal().tahap.forEach(function (t) {
        const x = inf[t.id] || {};
        if (x.contoh) r.contoh++;
        else if (x.dibantu) r.dibantu++;
        else if (x.petunjuk > 0) r.petunjuk++;
        else r.sendiri++;
      });
      return r;
    }

    // ---------------- aksi ----------------
    function aksiUtama() {
      if (cfg.mode !== 'latihan') {
        if (!terisiSemua() && !peringatanKosong) { peringatanKosong = true; render(); return; }
        maju();
        return;
      }
      const inf = info();
      if (inf.selesai) { maju(); return; }
      if (!terisiSemua()) { inf.umpan = 'kosong'; render(); return; }
      if (P.nilaiTahap(tahap(), jw()).benar) {
        inf.selesai = true; inf.umpan = null;
      } else {
        inf.coba++;
        if (inf.coba >= 3) {
          Object.assign(jw(), P.jawabanBenar(tahap(), jw()));
          inf.selesai = true; inf.dibantu = true; inf.umpan = null;
        } else inf.umpan = 'salah';
      }
      render();
      const u = wadah.querySelector('.umpan');
      if (u && u.scrollIntoView) u.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function maju() {
      peringatanKosong = false;
      const s = soal();
      if (st.iTahap < s.tahap.length - 1) st.iTahap++;
      else if (cfg.mode === 'latihan') { fase = 'refleksi'; render(); return; }
      else if (st.iSoal < cfg.daftarSoal.length - 1) { st.iSoal++; st.iTahap = 0; }
      else { simpan(); cfg.onSelesai(st); return; }
      simpan(); render(); window.scrollTo(0, 0);
    }

    function mundur() {
      peringatanKosong = false;
      if (st.iTahap > 0) st.iTahap--;
      else if (st.iSoal > 0) { st.iSoal--; st.iTahap = soal().tahap.length - 1; }
      simpan(); render(); window.scrollTo(0, 0);
    }

    render();
  }

  LK.runner = { mulai: mulai };
})(typeof window !== 'undefined' ? window : globalThis);
