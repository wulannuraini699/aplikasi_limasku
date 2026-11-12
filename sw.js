/*
 * sw.js — service worker agar aplikasi tetap bisa dibuka tanpa internet.
 * Strategi "jaringan dulu": saat online selalu memuat versi terbaru,
 * saat offline memakai salinan terakhir yang tersimpan.
 * Naikkan VERSI bila daftar file berubah.
 */
var VERSI = 'limasku-v1';
var FILE = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/kompat.js', 'js/util.js', 'js/penilaian.js', 'js/limas-svg.js', 'js/data/materi.js', 'js/data/soal.js',
  'js/storage.js', 'js/kalkulator.js', 'js/unduh.js', 'js/runner.js', 'js/app.js',
  'ikon/ikon.svg', 'ikon/ikon-192.png', 'ikon/ikon-512.png', 'ikon/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(FILE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (kunci) {
    return Promise.all(kunci.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.ok) {
        var salinan = res.clone();
        caches.open(VERSI).then(function (c) { c.put(e.request, salinan); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
    })
  );
});
