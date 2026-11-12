// Jalankan: node tests/jalankan-node.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const akar = path.join(__dirname, '..');
const konteks = vm.createContext({ console: console });
['js/util.js', 'js/penilaian.js', 'js/data/soal.js', 'js/kalkulator.js', 'tests/penilaian.test.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(akar, f), 'utf8'), konteks, { filename: f });
});

const hasil = konteks.jalankanTes(konteks.LK);
let gagal = 0;
hasil.forEach(function (h) {
  console.log((h.lulus ? 'LULUS ' : 'GAGAL ') + h.nama + (h.pesan ? '\n       ' + h.pesan : ''));
  if (!h.lulus) gagal++;
});
console.log('\n' + (hasil.length - gagal) + '/' + hasil.length + ' uji lulus');
process.exit(gagal ? 1 : 0);
