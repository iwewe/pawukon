import { test } from 'node:test';
import assert from 'node:assert/strict';
import { andengAndeng, toh, ciriAnggota, tandaGabungan, cariCiri, PERINGATAN_CIRI } from '../src/index.js';
import { ANDENG_ANDENG, TOH, UKURAN_ANGGOTA, TANDA_GABUNGAN } from '../src/data/ciriTubuh.js';

const ARAH = new Set(['baik', 'buruk', 'netral']);

// --- kelengkapan data -----------------------------------------------------------------------------------------------------------

test('bab 112: 57 butir berurutan; arah sah; keganjilan cetakan tercatat dan sesuai data', () => {
  const t = ANDENG_ANDENG.tabel;
  assert.deepEqual(t.map(x => x.no), Array.from({ length: 57 }, (_, i) => i + 1));
  for (const x of t) { assert.ok(x.lokasi && x.makna, `butir ${x.no}`); assert.ok(ARAH.has(x.arah), `butir ${x.no}`); }
  // butir 57 tanpa nama; Tujusih (17, 18) dan Gunasakti (9, 21) ganda
  assert.equal(t[56].nama, null);
  const hitung = {};
  for (const x of t) if (x.nama) hitung[x.nama] = (hitung[x.nama] ?? []).concat(x.no);
  const ganda = Object.entries(hitung).filter(([, n]) => n.length > 1);
  assert.deepEqual(ganda, [['Gunasakti', [9, 21]], ['Tujusih', [17, 18]]]);
  assert.equal(Object.keys(hitung).length, 54);
  assert.match(ANDENG_ANDENG.catatanCetak, /Tujusih/);
  assert.match(ANDENG_ANDENG.catatanCetak, /Gunasakti/);
  // butir 36 dan 37: letak tercetak sama, nama beda
  assert.deepEqual([t[35].nama, t[36].nama], ['Buditama', 'Weda']);
});

test('bab 113 dan bab 112 konsisten: toh pantat Basunya = andeng-andeng pantat Basu (miskin)', () => {
  assert.equal(TOH.tabel.length, 5);
  assert.deepEqual(TOH.tabel.map(x => x.no), [1, 2, 3, 4, 5]);
  for (const x of TOH.tabel) { assert.ok(x.nama && x.makna); assert.ok(ARAH.has(x.arah)); }
  const basu = ANDENG_ANDENG.tabel.find(x => x.nama === 'Basu');
  const basunya = TOH.tabel.find(x => x.nama === 'Basunya');
  assert.equal(basu.arah, 'buruk');
  assert.equal(basunya.arah, 'buruk');
  assert.match(basu.lokasi, /pantat/);
  assert.match(basunya.lokasi, /pantat/);
});

test('bab 119 butir 1-21: 21 anggota badan, semua butir 1-21 tercakup, varian tak ganda', () => {
  const bagian = UKURAN_ANGGOTA.bagian;
  assert.equal(Object.keys(bagian).length, 21);
  const butir = new Set();
  for (const [nama, daftar] of Object.entries(bagian)) {
    const varian = daftar.map(x => x.varian);
    assert.equal(new Set(varian).size, varian.length, nama);
    for (const x of daftar) { assert.ok(x.makna); assert.ok(ARAH.has(x.arah), `${nama} ${x.varian}`); butir.add(x.no); }
  }
  assert.deepEqual([...butir].sort((a, b) => a - b), Array.from({ length: 21 }, (_, i) => i + 1));
});

test('bab 119 butir 22-80: semua butir tercakup; nomor entri unik; bagian terisi', () => {
  const t = TANDA_GABUNGAN.tabel;
  assert.equal(new Set(t.map(x => String(x.no))).size, t.length);
  const butir = new Set(t.map(x => parseInt(x.no, 10)));
  assert.deepEqual([...butir].sort((a, b) => a - b), Array.from({ length: 59 }, (_, i) => i + 22));
  for (const x of t) {
    assert.ok(x.tanda && x.makna && x.bagian.length >= 1, String(x.no));
    assert.ok(ARAH.has(x.arah), String(x.no));
  }
  assert.ok(TANDA_GABUNGAN.catatan);
});

// --- fungsi ------------------------------------------------------------------------------------------------------------------------

test('andengAndeng: menurut kata kunci, nomor butir, dan tanpa argumen', () => {
  assert.equal(andengAndeng().jumlah, 57);
  assert.deepEqual(andengAndeng('pipi').hasil.map(x => x.no), [16, 17]);
  assert.equal(andengAndeng(47).hasil[0].nama, 'Basu');
  assert.deepEqual(andengAndeng('Manikharda').hasil.map(x => x.no), [1]);
  assert.deepEqual(andengAndeng('tujusih').hasil.map(x => x.no), [17, 18]);
  assert.equal(andengAndeng('kepala kanan').jumlah, 1);
  assert.equal(andengAndeng('tidak ada letak ini').jumlah, 0);
  assert.equal(andengAndeng(99).jumlah, 0);
  assert.ok(andengAndeng().peringatan);
});

test('toh: menurut kata kunci dan nomor', () => {
  assert.equal(toh().jumlah, 5);
  assert.equal(toh('wajah').hasil[0].nama, 'Wisadesti');
  assert.equal(toh(2).hasil[0].nama, 'Basunya');
  assert.equal(toh('pantat').jumlah, 3);
});

test('ciriAnggota: daftar bagian, huruf besar dan kecil sama, bagian tak dikenal ditolak', () => {
  assert.equal(ciriAnggota().bagian.length, 21);
  const m = ciriAnggota('Mata');
  assert.equal(m.bagian, 'mata');
  assert.ok(m.jumlah >= 15);
  assert.ok(m.hasil.every(x => x.butir === 6));
  assert.ok(ciriAnggota('dagu').hasil.some(x => x.varian === 'sedang' && x.arah === 'baik'));
  assert.throws(() => ciriAnggota('jempol'), RangeError);
});

test('tandaGabungan: tanpa argumen, nomor butir, dan kata kunci', () => {
  assert.equal(tandaGabungan().jumlah, TANDA_GABUNGAN.tabel.length);
  assert.equal(tandaGabungan(22).jumlah, 3);
  assert.equal(tandaGabungan(64).hasil[0].arah, 'baik'); // berjalan lurus
  assert.ok(tandaGabungan('berjalan').jumlah >= 4);
  assert.equal(tandaGabungan('pepasu').hasil.every(x => x.bagian.includes('pepasu')), true);
  assert.equal(tandaGabungan(1).jumlah, 0); // butir 1-21 ada di ciriAnggota
});

test('cariCiri: semua kata harus ada; diakritik diabaikan; kata kosong ditolak', () => {
  const r = cariCiri('hidung betet');
  assert.deepEqual(r.tanda.map(x => x.no), ['34b', '38b', '58a']);
  assert.equal(r.andengAndeng.length, 0);
  assert.equal(r.total, 3);
  assert.equal(cariCiri('HÍDUNG betet').total, 3);
  const pipi = cariCiri('pipi');
  assert.ok(pipi.andengAndeng.length >= 2 && pipi.anggota.length >= 1 && pipi.tanda.length >= 1);
  assert.equal(cariCiri('zzzzz').total, 0);
  assert.throws(() => cariCiri('  '), RangeError);
  assert.throws(() => cariCiri('!!!'), RangeError);
});

test('semua hasil memuat peringatan fisiognomi dan sumber bab', () => {
  assert.match(PERINGATAN_CIRI, /dasar ilmiah/);
  for (const r of [andengAndeng(), toh(), ciriAnggota('mata'), tandaGabungan(), cariCiri('mata')]) {
    assert.equal(r.peringatan, PERINGATAN_CIRI);
    assert.ok(r.sumber);
  }
  assert.equal(andengAndeng().sumber.bab, 112);
  assert.equal(toh().sumber.bab, 113);
  assert.equal(ciriAnggota('mata').sumber.bab, 119);
});
