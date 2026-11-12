/*
 * app.js — router hash & layar-layar aplikasi.
 * Rute: #/  #/profil  #/belajar/:n  #/latihan  #/latihan/:no/:level  #/uji  #/uji/kerja
 *       #/uji/pembahasan/:id  #/hasil  #/alat
 */
(function (G) {
  'use strict';
  const LK = G.LK, h = LK.util.h, S = LK.simpan, P = LK.penilaian, fmt = LK.util.fmt;
  const app = document.getElementById('app');

  // ---------------- bantu umum ----------------
  const profil = function () { return S.baca('profil', null); };
  function tampil() { app.replaceChildren.apply(app, Array.prototype.slice.call(arguments)); }
  function kepala(judul, kembali, kanan) {
    return h('header', { class: 'kepala' },
      kembali ? h('a', { href: kembali, class: 'tombol-ikon', 'aria-label': 'Kembali' }, '←') : h('span', { class: 'logo', 'aria-hidden': 'true' }, '◭'),
      h('h1', null, judul), kanan || null);
  }
  function barBawah() {
    return h('div', { class: 'bar-bawah' }, h('div', { class: 'bar-bawah-isi' }, Array.prototype.slice.call(arguments)));
  }
  function tautanTombol(href, teks, kelas) { return h('a', { href: href, class: 'tombol ' + (kelas || 'tombol-utama') }, teks); }
  function pergi(hash) { if (location.hash === hash) rute(); else location.hash = hash; }
  function judulHalaman(t) { document.title = t ? t + ' · LimasKu' : 'LimasKu — Belajar Limas'; }

  function progres() {
    const belajar = Object.keys(S.baca('belajar', {})).length;
    const lat = S.baca('latihan', {});
    let latihan = 0;
    Object.keys(lat).forEach(function (no) { Object.keys(lat[no]).forEach(function () { latihan++; }); });
    const riw = S.baca('riwayatUji', []);
    const berjalan = S.baca('ujiBerjalan', null);
    const uji = berjalan ? 'Sedang dikerjakan' : (riw.length ? 'Skor terakhir: ' + riw[riw.length - 1].total + '/30' : 'Belum dikerjakan');
    return { belajar: belajar, latihan: latihan, uji: uji };
  }

  // ---------------- profil ----------------
  function formProfil(kembaliKe) {
    judulHalaman('Nama');
    const p = profil();
    const nama = h('input', { id: 'nama', type: 'text', maxlength: '30', autocomplete: 'nickname', value: p ? p.nama : '', required: true });
    const kelas = h('input', { id: 'kelas', type: 'text', maxlength: '12', value: p ? p.kelas : '', placeholder: 'mis. 8B' });
    const pesan = h('p', { class: 'pesan-salah', 'aria-live': 'polite' });
    const form = h('form', {
      class: 'kartu form', novalidate: true,
      onsubmit: function (e) {
        e.preventDefault();
        const n = nama.value.trim();
        if (!n) { pesan.textContent = 'Nama panggilan belum diisi.'; nama.focus(); return; }
        S.tulis('profil', { nama: n, kelas: kelas.value.trim() });
        pergi(kembaliKe || '#/');
      }
    },
      h('label', { for: 'nama' }, 'Nama panggilan'), nama,
      h('label', { for: 'kelas' }, 'Kelas (boleh dikosongkan)'), kelas,
      pesan,
      h('button', { type: 'submit', class: 'tombol tombol-utama' }, 'Simpan'));
    tampil(
      kepala(p ? 'Ganti nama' : 'Selamat datang', p ? '#/' : null),
      h('main', { class: 'isi' },
        h('p', null, 'LimasKu membantumu belajar limas langkah demi langkah: dari konsep, contoh, sampai soal cerita.'),
        h('p', { class: 'redup kecil' }, 'Nama hanya disimpan di perangkat ini dan dipakai pada file hasil yang kamu unduh.'),
        form));
    if (!p) nama.focus();
  }

  // ---------------- beranda ----------------
  function kartuMenu(href, nomor, judul, ket, status) {
    return h('a', { href: href, class: 'kartu kartu-menu' },
      h('span', { class: 'menu-nomor', 'aria-hidden': 'true' }, nomor),
      h('span', { class: 'menu-teks' }, h('span', { class: 'menu-judul' }, judul), h('span', { class: 'menu-ket' }, ket),
        status ? h('span', { class: 'menu-status' }, status) : null),
      h('span', { class: 'menu-panah', 'aria-hidden': 'true' }, '›'));
  }
  function beranda() {
    const p = profil();
    if (!p) return formProfil('#/');
    judulHalaman('');
    const pr = progres();
    tampil(
      kepala('LimasKu', null, h('a', { href: '#/profil', class: 'tombol-teks' }, 'Ganti nama')),
      h('main', { class: 'isi' },
        h('p', { class: 'sapa' }, 'Halo, ', h('b', null, p.nama), '! Ikuti urutan 1 → 3, atau langsung pilih yang kamu butuhkan.'),
        h('nav', { class: 'menu', 'aria-label': 'Menu utama' },
          kartuMenu('#/belajar/1', '1', 'Belajar', 'Kartu singkat: unsur limas, volume, dua jenis tinggi, Pythagoras, selimut.', pr.belajar + '/5 kartu'),
          kartuMenu('#/latihan', '2', 'Latihan', '5 soal cerita, masing-masing 3 level: Contoh → Lengkapi → Mandiri.', pr.latihan + '/15 level'),
          kartuMenu('#/uji', '3', 'Uji Kemampuan', '5 soal tanpa petunjuk. Skor maksimum 30.', pr.uji)),
        h('h2', { class: 'subjudul' }, 'Alat'),
        h('nav', { class: 'menu', 'aria-label': 'Alat' },
          kartuMenu('#/alat', '⌗', 'Alat Hitung', 'Hitung volume, tinggi sisi tegak, dan luas — lengkap dengan langkahnya.'),
          kartuMenu('#/hasil', '✓', 'Hasil', 'Lihat pembahasan dan unduh hasil Uji Kemampuan.'))));
  }

  // ---------------- belajar ----------------
  function belajar(n) {
    const total = LK.materi.length;
    if (!(n >= 1 && n <= total)) n = 1;
    const m = LK.materi[n - 1];
    judulHalaman('Belajar ' + n);
    const umpan = h('div', { class: 'umpan-wadah', 'aria-live': 'polite' });
    let dijawab = false;
    const tombol = m.cek.opsi.map(function (o) {
      return h('button', {
        type: 'button', class: 'opsi', role: 'radio', 'aria-checked': 'false', 'data-id': o.id,
        onclick: function () {
          if (dijawab) return;
          dijawab = true;
          tombol.forEach(function (b) {
            b.disabled = true;
            b.classList.toggle('dipilih', b.dataset.id === o.id);
            b.classList.toggle('opsi-benar', b.dataset.id === m.cek.benar);
            b.setAttribute('aria-checked', b.dataset.id === o.id ? 'true' : 'false');
          });
          const benar = o.id === m.cek.benar;
          umpan.replaceChildren(h('div', { class: 'umpan ' + (benar ? 'umpan-benar' : 'umpan-dibantu') },
            h('b', null, benar ? '✓ Benar! ' : 'Jawaban yang benar sudah ditandai. '), m.cek.penjelasan));
          const d = S.baca('belajar', {}); d[n] = true; S.tulis('belajar', d);
        }
      }, h('span', { class: 'opsi-tanda', 'aria-hidden': 'true' }), h('span', null, o.teks));
    });
    const titik = h('div', { class: 'titik-titik', 'aria-label': 'Kartu ' + n + ' dari ' + total },
      LK.materi.map(function (_, i) { return h('span', { class: 'titik' + (i + 1 === n ? ' aktif' : '') }); }));
    tampil(
      kepala('Belajar · ' + n + '/' + total, '#/'),
      h('main', { class: 'isi isi-kerja' },
        titik,
        h('h2', { class: 'judul-kartu' }, m.judul),
        h('div', { class: 'gambar', html: LK.gambar.limas(m.gambar) }),
        h('section', { class: 'kartu' }, m.teks.map(function (p) { return h('p', null, LK.util.teksBerwarna(p)); })),
        h('section', { class: 'kartu' },
          h('div', { class: 'tahap-label' }, 'Cek cepat'),
          h('p', { class: 'instruksi' }, m.cek.tanya),
          h('div', { class: 'opsi-grup', role: 'radiogroup' }, tombol),
          umpan)),
      barBawah(
        n > 1 ? tautanTombol('#/belajar/' + (n - 1), 'Sebelumnya', 'tombol-kedua') : null,
        n < total ? tautanTombol('#/belajar/' + (n + 1), 'Berikutnya') : tautanTombol('#/latihan', 'Mulai latihan')));
  }

  // ---------------- latihan ----------------
  function latihanDaftar() {
    judulHalaman('Latihan');
    const prog = S.baca('latihan', {});
    const kartu = [1, 2, 3, 4, 5].map(function (no) {
      const s0 = LK.soal.latihan[no][0];
      const p = prog[no] || {};
      let saran = 0;
      for (let lv = 1; lv <= 3; lv++) if (!p[lv]) { saran = lv; break; }
      return h('section', { class: 'kartu' },
        h('h2', { class: 'judul-soal' }, 'Soal ' + no + ': ' + s0.judul),
        h('p', { class: 'kecil redup' }, s0.indikator),
        h('div', { class: 'level-baris' }, LK.soal.level.map(function (L) {
          const selesai = !!p[L.no];
          return h('a', {
            href: '#/latihan/' + no + '/' + L.no,
            class: 'level' + (selesai ? ' selesai' : '') + (saran === L.no ? ' saran' : ''),
            'aria-label': 'Level ' + L.no + ' ' + L.nama + (selesai ? ', selesai' : '') + (saran === L.no ? ', disarankan' : '')
          }, h('span', { class: 'level-no' }, selesai ? '✓' : String(L.no)), h('span', null, L.nama));
        })));
    });
    tampil(
      kepala('Latihan', '#/'),
      h('main', { class: 'isi' },
        h('section', { class: 'kartu kartu-info' },
          h('p', null, h('b', null, 'Tiga level untuk setiap soal:')),
          h('ol', { class: 'daftar-level' }, LK.soal.level.map(function (L) { return h('li', null, h('b', null, L.nama + ' — '), L.ket); })),
          h('p', { class: 'kecil redup' }, 'Angka di latihan berbeda dengan Uji Kemampuan. Belum yakin dengan konsepnya? ', h('a', { href: '#/belajar/1' }, 'Baca kartu Belajar dulu'), '.')),
        kartu));
  }

  function latihanKerja(no, lv) {
    const daftar = LK.soal.latihan[no];
    if (!daftar || !(lv >= 1 && lv <= 3)) return latihanDaftar();
    const L = LK.soal.level[lv - 1];
    judulHalaman('Latihan ' + no + ' · ' + L.nama);
    LK.runner.mulai(app, {
      daftarSoal: [daftar[lv - 1]], mode: 'latihan', level: lv,
      judul: 'Latihan ' + no + ' · Level ' + lv + ' ' + L.nama, kembali: '#/latihan',
      onSelesai: function (st, r) {
        const prog = S.baca('latihan', {});
        prog[no] = prog[no] || {};
        prog[no][lv] = { selesai: true, dibantu: r.dibantu, waktu: new Date().toISOString() };
        S.tulis('latihan', prog);
        ringkasanLatihan(no, lv, r);
      }
    });
  }

  function ringkasanLatihan(no, lv, r) {
    const baris = [];
    if (r.contoh) baris.push(h('li', null, r.contoh + ' langkah contoh dipelajari'));
    if (r.sendiri) baris.push(h('li', null, r.sendiri + ' langkah benar tanpa bantuan'));
    if (r.petunjuk) baris.push(h('li', null, r.petunjuk + ' langkah benar dengan petunjuk'));
    if (r.dibantu) baris.push(h('li', null, r.dibantu + ' langkah ditunjukkan jawabannya'));
    let lanjut;
    if (lv < 3) lanjut = tautanTombol('#/latihan/' + no + '/' + (lv + 1), 'Lanjut ke Level ' + (lv + 1));
    else if (no < 5) lanjut = tautanTombol('#/latihan/' + (no + 1) + '/1', 'Soal ' + (no + 1));
    else lanjut = tautanTombol('#/uji', 'Coba Uji Kemampuan');
    tampil(
      kepala('Level selesai', '#/latihan'),
      h('main', { class: 'isi' },
        h('section', { class: 'kartu kartu-selesai' },
          h('div', { class: 'besar', 'aria-hidden': 'true' }, '✓'),
          h('h2', null, 'Soal ' + no + ' · Level ' + lv + ' selesai'),
          h('ul', { class: 'daftar-ringkas' }, baris),
          r.dibantu ? h('p', { class: 'kecil' }, 'Ada langkah yang masih dibantu. Ulangi level ini nanti supaya makin lancar.') : null)),
      barBawah(tautanTombol('#/latihan', 'Daftar latihan', 'tombol-kedua'), lanjut));
    window.scrollTo(0, 0);
  }

  // ---------------- uji kemampuan ----------------
  function ujiAwal() {
    if (!profil()) return formProfil('#/uji');
    judulHalaman('Uji Kemampuan');
    const berjalan = S.baca('ujiBerjalan', null);
    let yakin = false;
    const tombolBaru = h('button', {
      type: 'button', class: 'tombol ' + (berjalan ? 'tombol-kedua' : 'tombol-utama'),
      onclick: function () {
        if (berjalan && !yakin) { yakin = true; tombolBaru.textContent = 'Yakin? Jawaban lama dihapus'; return; }
        S.hapus('ujiBerjalan');
        pergi('#/uji/kerja');
      }
    }, berjalan ? 'Mulai dari awal' : 'Mulai');
    tampil(
      kepala('Uji Kemampuan', '#/'),
      h('main', { class: 'isi' },
        h('section', { class: 'kartu kartu-info' },
          h('ul', { class: 'daftar-ringkas' },
            h('li', null, '5 soal cerita tentang limas, skor maksimum 30.'),
            h('li', null, 'Dikerjakan langkah demi langkah. Setiap langkah yang benar mendapat skor.'),
            h('li', null, 'Salah hitung di awal? Langkah berikutnya tetap dinilai kalau caranya benar.'),
            h('li', null, 'Tidak ada petunjuk. Pembahasan muncul setelah selesai.'),
            h('li', null, 'Kalkulator boleh dipakai (tombol 🧮).'),
            h('li', null, 'Boleh ditinggal; jawabanmu tersimpan dan bisa dilanjutkan.'))),
        berjalan ? h('p', { class: 'kecil' }, 'Kamu punya pengerjaan yang belum selesai (Soal ' + LK.soal.uji[berjalan.iSoal || 0].nomor + ').') : null),
      barBawah(tombolBaru, berjalan ? tautanTombol('#/uji/kerja', 'Lanjutkan') : null));
  }

  function ujiKerja() {
    if (!profil()) return formProfil('#/uji');
    judulHalaman('Uji Kemampuan');
    LK.runner.mulai(app, {
      daftarSoal: LK.soal.uji, mode: 'uji', judul: 'Uji Kemampuan', kembali: '#/uji',
      awal: S.baca('ujiBerjalan', null),
      onSimpan: function (st) { S.tulis('ujiBerjalan', st); },
      onSelesai: function (st) {
        const p = profil();
        const perSoal = LK.soal.uji.map(function (s) {
          const n = P.nilaiSoal(s, st.jawaban[s.id] || {});
          return { id: s.id, nomor: s.nomor, indikator: s.indikator, skor: n.skor, maks: n.maks };
        });
        const entri = {
          id: Date.now().toString(36), waktu: new Date().toISOString(), nama: p.nama, kelas: p.kelas,
          jawaban: st.jawaban, perSoal: perSoal, total: perSoal.reduce(function (a, b) { return a + b.skor; }, 0)
        };
        const riw = S.baca('riwayatUji', []);
        riw.push(entri);
        S.tulis('riwayatUji', riw.slice(-20));
        S.hapus('ujiBerjalan');
        pergi('#/hasil');
      }
    });
  }

  // ---------------- hasil & pembahasan ----------------
  function hasil() {
    judulHalaman('Hasil');
    const riw = S.baca('riwayatUji', []);
    if (!riw.length) {
      return tampil(kepala('Hasil', '#/'), h('main', { class: 'isi' },
        h('section', { class: 'kartu' }, h('p', null, 'Belum ada hasil. Kerjakan Uji Kemampuan dulu, ya.')),
        tautanTombol('#/uji', 'Ke Uji Kemampuan')));
    }
    const e = riw[riw.length - 1];
    const status = h('p', { class: 'kecil', 'aria-live': 'polite' });

    const batang = e.perSoal.map(function (s) {
      return h('li', { class: 'batang-baris' },
        h('div', { class: 'batang-label' }, h('span', { class: 'tebal' }, 'Soal ' + s.nomor), h('span', { class: 'kecil redup' }, ' · ' + s.indikator)),
        h('div', { class: 'batang-wadah' },
          h('div', { class: 'batang' }, h('div', { class: 'batang-isi', style: 'width:' + (s.skor / s.maks * 100) + '%' })),
          h('span', { class: 'batang-nilai' }, s.skor + '/' + s.maks)));
    });

    const ulang = [];
    LK.soal.uji.forEach(function (s) {
      const n = P.nilaiSoal(s, e.jawaban[s.id] || {});
      const salah = n.perTahap.filter(function (t) { return !t.benar; }).map(function (t) { return t.label; });
      if (salah.length) {
        ulang.push(h('li', null, h('b', null, 'Soal ' + s.nomor + ' (' + s.judul + '): '), salah.join(', ') + ' ',
          h('a', { href: '#/latihan/' + s.nomor + '/' + (n.skor >= 4 ? 3 : 1) }, '→ latihan')));
      }
    });

    tampil(
      kepala('Hasil', '#/'),
      h('main', { class: 'isi' },
        h('section', { class: 'kartu kartu-skor' },
          h('div', { class: 'kecil redup' }, e.nama + (e.kelas ? ' · ' + e.kelas : '') + ' · ' + LK.util.tanggalIndo(e.waktu)),
          h('div', { class: 'skor-besar' }, h('span', null, String(e.total)), h('span', { class: 'skor-maks' }, ' / 30')),
          h('ul', { class: 'batang-daftar' }, batang)),
        ulang.length ? h('section', { class: 'kartu' }, h('h2', { class: 'subjudul' }, 'Langkah yang perlu diulang'), h('ul', { class: 'daftar-ringkas' }, ulang))
          : h('section', { class: 'kartu umpan-benar' }, h('p', null, h('b', null, 'Sempurna! '), 'Semua langkah benar.')),
        h('section', { class: 'kartu' },
          h('h2', { class: 'subjudul' }, 'Kirim ke guru'),
          h('p', { class: 'kecil' }, 'Unduh file hasil (bisa dibuka di Excel), atau salin ringkasannya lalu tempel di chat guru.'),
          h('div', { class: 'tombol-baris' },
            h('button', { type: 'button', class: 'tombol tombol-utama', onclick: function () {
              status.textContent = LK.unduh.unduhCSV(e) ? 'File ' + LK.unduh.namaFile(e) + ' sedang diunduh.' : 'Unduhan gagal. Pakai tombol "Salin hasil".';
            } }, 'Unduh hasil (CSV)'),
            h('button', { type: 'button', class: 'tombol tombol-kedua', onclick: function () {
              LK.unduh.salinTeks(LK.unduh.buatTeks(e)).then(function (ok) {
                status.textContent = ok ? 'Ringkasan disalin. Tempel di chat guru.' : 'Gagal menyalin. Coba buka aplikasi di Chrome.';
              });
            } }, 'Salin hasil')),
          status,
          h('p', { class: 'kecil redup' }, 'Kalau tombol unduh tidak berfungsi (misalnya link dibuka dari dalam WhatsApp), buka aplikasi di Chrome atau pakai "Salin hasil".')),
        riw.length > 1 ? h('section', { class: 'kartu' },
          h('h2', { class: 'subjudul' }, 'Riwayat'),
          h('ul', { class: 'daftar-ringkas' }, riw.slice(0, -1).reverse().map(function (x) {
            return h('li', null, LK.util.tanggalIndo(x.waktu) + ' — ' + x.total + '/30 ', h('a', { href: '#/uji/pembahasan/' + x.id }, 'pembahasan'));
          }))) : null),
      barBawah(tautanTombol('#/uji', 'Kerjakan lagi', 'tombol-kedua'), tautanTombol('#/uji/pembahasan/' + e.id, 'Lihat pembahasan')));
  }

  function pembahasan(id) {
    judulHalaman('Pembahasan');
    const riw = S.baca('riwayatUji', []);
    const e = riw.filter(function (x) { return x.id === id; })[0] || riw[riw.length - 1];
    if (!e) return pergi('#/hasil');
    const kartu = LK.soal.uji.map(function (s) {
      const j = e.jawaban[s.id] || {};
      const n = P.nilaiSoal(s, j);
      return h('section', { class: 'kartu' },
        h('h2', { class: 'judul-soal' }, 'Soal ' + s.nomor + ': ' + s.judul + ' — ' + n.skor + '/' + n.maks),
        h('p', null, LK.util.teksBerwarna(s.teks)),
        h('p', { class: 'tebal' }, s.pertanyaan),
        h('div', { class: 'gambar gambar-kecil', html: LK.gambar.untukSoal(s, []) }),
        h('ol', { class: 'daftar-bahas' }, s.tahap.map(function (t, i) {
          const nt = n.perTahap[i];
          return h('li', { class: nt.benar ? 'bahas-benar' : 'bahas-salah' },
            h('div', { class: 'bahas-kepala' },
              h('span', { class: 'bahas-ikon', 'aria-hidden': 'true' }, nt.benar ? '✓' : '✗'),
              h('span', { class: 'tebal' }, t.label), h('span', { class: 'kecil redup' }, ' · ' + nt.skor + '/' + nt.maks + (nt.benar ? ' benar' : ' belum tepat'))),
            h('div', { class: 'kecil' }, t.instruksi),
            h('div', null, h('span', { class: 'redup' }, 'Jawabanmu: '), t.isian.map(function (is) { return P.teksJawaban(is, j[is.id], j); }).join(' | ')),
            h('div', null, h('span', { class: 'redup' }, 'Pembahasan: '), t.penjelasan));
        })));
    });
    tampil(kepala('Pembahasan', '#/hasil'), h('main', { class: 'isi' },
      h('p', { class: 'kecil redup' }, LK.util.tanggalIndo(e.waktu) + ' · Total ' + e.total + '/30'), kartu));
  }

  // ---------------- alat hitung ----------------
  function alat() {
    judulHalaman('Alat Hitung');
    let satuan = 'cm';
    const sel = h('select', { id: 'satuan', onchange: function () { satuan = sel.value; } },
      h('option', { value: 'cm' }, 'cm'), h('option', { value: 'm' }, 'm'));

    function medan(id, label, contoh) {
      const inp = h('input', { id: id, type: 'text', inputmode: 'decimal', autocomplete: 'off', placeholder: contoh || '' });
      return { el: h('div', { class: 'isian' }, h('label', { class: 'isian-label', for: id }, label), inp), inp: inp, nilai: function () { return P.parseAngka(inp.value); } };
    }
    function pilihan(nama, opsi, berubah) {
      let nilai = opsi[0].id;
      const btn = opsi.map(function (o, i) {
        return h('button', { type: 'button', class: 'segmen' + (i === 0 ? ' dipilih' : ''), 'aria-pressed': i === 0 ? 'true' : 'false',
          onclick: function () {
            nilai = o.id;
            btn.forEach(function (b, k) { b.classList.toggle('dipilih', opsi[k].id === nilai); b.setAttribute('aria-pressed', opsi[k].id === nilai ? 'true' : 'false'); });
            berubah(nilai);
          } }, o.teks);
      });
      return { el: h('div', { class: 'segmen-grup', role: 'group', 'aria-label': nama }, btn), nilai: function () { return nilai; } };
    }
    function hasilLangkah(wadah, langkah, gambar) {
      const daftar = h('ol', { class: 'langkah' }, langkah.map(function (l) { return h('li', null, l); }));
      if (gambar) wadah.replaceChildren(h('div', { class: 'gambar gambar-kecil', html: gambar }), daftar);
      else wadah.replaceChildren(daftar);
    }
    function salah(wadah, pesan) { wadah.replaceChildren(h('div', { class: 'umpan umpan-info' }, pesan)); }
    const positif = function () { return Array.prototype.every.call(arguments, function (v) { return v !== null && v > 0; }); };
    const akar = function (x) { const r = Math.sqrt(x); return Math.abs(r - Math.round(r)) < 1e-9 ? fmt(r) : '≈ ' + fmt(r); };

    // 1. Volume
    const vS = medan('v-s', 'Sisi alas (s)', 'mis. 6'), vLa = medan('v-la', 'Luas alas', 'mis. 36'), vT = medan('v-t', 'Tinggi limas (t)', 'mis. 12');
    vLa.el.hidden = true;
    const vMode = pilihan('Yang diketahui', [{ id: 's', teks: 'Sisi alas' }, { id: 'la', teks: 'Luas alas' }], function (m) { vS.el.hidden = m !== 's'; vLa.el.hidden = m !== 'la'; });
    const vOut = h('div', { 'aria-live': 'polite' });
    const kartuVolume = h('section', { class: 'kartu' },
      h('h2', { class: 'subjudul' }, 'Volume limas'), h('p', { class: 'kecil redup' }, 'V = ⅓ × luas alas × tinggi'),
      vMode.el, vS.el, vLa.el, vT.el,
      h('button', { type: 'button', class: 'tombol tombol-utama', onclick: function () {
        const u = satuan, t = vT.nilai();
        let la, langkah = [];
        if (vMode.nilai() === 's') {
          const s = vS.nilai();
          if (!positif(s, t)) return salah(vOut, 'Isi sisi alas dan tinggi dengan angka lebih dari 0.');
          la = s * s;
          langkah.push('Luas alas = s × s = ' + fmt(s) + ' × ' + fmt(s) + ' = ' + fmt(la) + ' ' + u + '²');
        } else {
          la = vLa.nilai();
          if (!positif(la, t)) return salah(vOut, 'Isi luas alas dan tinggi dengan angka lebih dari 0.');
          langkah.push('Luas alas = ' + fmt(la) + ' ' + u + '²');
        }
        const v = la * t / 3;
        langkah.push('V = ⅓ × luas alas × tinggi');
        langkah.push('V = ⅓ × ' + fmt(la) + ' × ' + fmt(t));
        langkah.push('V = ' + fmt(la / 3) + ' × ' + fmt(t) + ' (bagi 3 dulu supaya angkanya kecil)');
        langkah.push(h('b', null, 'V = ' + fmt(v) + ' ' + u + '³'));
        hasilLangkah(vOut, langkah);
      } }, 'Hitung'), vOut);

    // 2. Tinggi sisi tegak
    const tT = medan('ts-t', 'Tinggi limas (t)', 'mis. 12'), tS = medan('ts-s', 'Sisi alas (s)', 'mis. 10');
    const tOut = h('div', { 'aria-live': 'polite' });
    const kartuTs = h('section', { class: 'kartu' },
      h('h2', { class: 'subjudul' }, 'Tinggi sisi tegak (tₛ)'), h('p', { class: 'kecil redup' }, 'tₛ² = t² + (½ s)²'),
      tT.el, tS.el,
      h('button', { type: 'button', class: 'tombol tombol-utama', onclick: function () {
        const u = satuan, t = tT.nilai(), s = tS.nilai();
        if (!positif(t, s)) return salah(tOut, 'Isi tinggi limas dan sisi alas dengan angka lebih dari 0.');
        const hs = s / 2, k = t * t + hs * hs, ts = Math.sqrt(k);
        hasilLangkah(tOut, [
          '½ s = ½ × ' + fmt(s) + ' = ' + fmt(hs) + ' ' + u,
          'tₛ² = t² + (½ s)² = ' + fmt(t) + '² + ' + fmt(hs) + '²',
          'tₛ² = ' + fmt(t * t) + ' + ' + fmt(hs * hs) + ' = ' + fmt(k),
          h('b', null, 'tₛ = √' + fmt(k) + ' ' + akar(k).replace(/^(?!≈)/, '= ') + ' ' + u)
        ], LK.gambar.limas({ s: s, t: t, sorot: ['pythagoras'], label: { t: fmt(t) + ' ' + u, h: fmt(hs) + ' ' + u, ts: fmt(ts) + ' ' + u } }));
      } }, 'Hitung'), tOut);

    // 3. Luas selimut & permukaan
    const lS = medan('l-s', 'Sisi alas (s)', 'mis. 10'), lTs = medan('l-ts', 'Tinggi sisi tegak (tₛ)', 'mis. 13'), lT = medan('l-t', 'Tinggi limas (t)', 'mis. 12');
    lT.el.hidden = true;
    const lMode = pilihan('Yang diketahui', [{ id: 'ts', teks: 'Tinggi sisi tegak (tₛ)' }, { id: 't', teks: 'Tinggi limas (t)' }], function (m) { lTs.el.hidden = m !== 'ts'; lT.el.hidden = m !== 't'; });
    const lOut = h('div', { 'aria-live': 'polite' });
    const kartuLuas = h('section', { class: 'kartu' },
      h('h2', { class: 'subjudul' }, 'Luas selimut & permukaan'), h('p', { class: 'kecil redup' }, 'Selimut = 4 × ½ × s × tₛ · Permukaan = luas alas + selimut'),
      lMode.el, lS.el, lTs.el, lT.el,
      h('button', { type: 'button', class: 'tombol tombol-utama', onclick: function () {
        const u = satuan, s = lS.nilai(), langkah = [];
        let ts;
        if (lMode.nilai() === 'ts') {
          ts = lTs.nilai();
          if (!positif(s, ts)) return salah(lOut, 'Isi sisi alas dan tinggi sisi tegak dengan angka lebih dari 0.');
        } else {
          const t = lT.nilai();
          if (!positif(s, t)) return salah(lOut, 'Isi sisi alas dan tinggi limas dengan angka lebih dari 0.');
          const k = t * t + (s / 2) * (s / 2);
          ts = Math.sqrt(k);
          langkah.push('tₛ = √(t² + (½ s)²) = √(' + fmt(t) + '² + ' + fmt(s / 2) + '²) = √' + fmt(k) + ' ' + akar(k).replace(/^(?!≈)/, '= ') + ' ' + u);
        }
        const la = s * s, satu = s * ts / 2, ls = 4 * satu;
        langkah.push('Luas satu sisi tegak = ½ × ' + fmt(s) + ' × ' + fmt(ts) + ' = ' + fmt(satu) + ' ' + u + '²');
        langkah.push(h('b', null, 'Luas selimut = 4 × ' + fmt(satu) + ' = ' + fmt(ls) + ' ' + u + '²'));
        langkah.push('Luas alas = ' + fmt(s) + ' × ' + fmt(s) + ' = ' + fmt(la) + ' ' + u + '²');
        langkah.push(h('b', null, 'Luas permukaan = ' + fmt(la) + ' + ' + fmt(ls) + ' = ' + fmt(la + ls) + ' ' + u + '²'));
        langkah.push(h('span', { class: 'kecil redup' }, 'Ingat: atap atau tenda tanpa lantai hanya memakai luas selimut.'));
        hasilLangkah(lOut, langkah);
      } }, 'Hitung'), lOut);

    tampil(
      kepala('Alat Hitung', '#/', h('button', { type: 'button', class: 'tombol-ikon', 'aria-label': 'Buka kalkulator', onclick: LK.kalkulator.buka }, '🧮')),
      h('main', { class: 'isi' },
        h('p', { class: 'kecil' }, 'Alat ini menunjukkan langkah-langkahnya, bukan hanya hasil. Pakai untuk memeriksa pekerjaanmu.'),
        h('div', { class: 'isian isian-baris' }, h('label', { class: 'isian-label', for: 'satuan' }, 'Satuan panjang'), sel),
        kartuVolume, kartuTs, kartuLuas));
  }

  // ---------------- router ----------------
  function rute() {
    LK.sheet.tutup();
    const bag = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const r = bag[0] || '';
    window.scrollTo(0, 0);
    if (r !== '' && r !== 'profil' && !profil()) return formProfil(location.hash);
    switch (r) {
      case '': return beranda();
      case 'profil': return formProfil('#/');
      case 'belajar': return belajar(parseInt(bag[1] || '1', 10));
      case 'latihan': return bag[1] ? latihanKerja(parseInt(bag[1], 10), parseInt(bag[2] || '1', 10)) : latihanDaftar();
      case 'uji':
        if (bag[1] === 'kerja') return ujiKerja();
        if (bag[1] === 'pembahasan') return pembahasan(bag[2]);
        return ujiAwal();
      case 'hasil': return hasil();
      case 'alat': return alat();
      default: return beranda();
    }
  }

  G.addEventListener('hashchange', rute);
  rute();

  // Mode offline (PWA): hanya bila dibuka lewat http/https, bukan dari file langsung.
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    G.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* abaikan */ }); });
  }
})(window);
