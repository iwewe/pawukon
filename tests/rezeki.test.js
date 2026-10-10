import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rezeki, wiji, tafsirLahir, weton, HARI, PASARAN, nomorHari, isoDariNomor } from '../src/index.js';
import { MATA_PENCAHARIAN_HARI, WIJI, NAFKAH, SRI_SADANA, ARAH_BERHASIL } from '../src/data/rezeki.js';

const ARAH = ['Utara', 'Selatan', 'Timur', 'Barat', 'Tenggara'];
const SEMUA_WETON = HARI.flatMap(h => PASARAN.map(p => `${h} ${p}`));

function tanggalDengan(nama) {
  const n0 = nomorHari('2000-01-01');
  for (let i = 0; i < 40; i++) {
    const d = isoDariNomor(n0 + i);
    if (weton(d).weton === nama) return d;
  }
  throw new Error(nama);
}

// --- kelengkapan dan konsistensi data ------------------------------------------------------------

test('bab 91: tujuh hari terisi; bab 92: lima wiji lengkap', () => {
  for (const h of HARI) assert.ok(MATA_PENCAHARIAN_HARI[h], h);
  for (let i = 1; i <= 5; i++) {
    const w = WIJI[i];
    assert.ok(w.arah && w.sebutan && w.dewa && w.pekerjaan, `wiji ${i}`);
  }
  assert.deepEqual([1, 2, 3, 4, 5].map(i => WIJI[i].arah), ['Timur', 'Selatan', 'Barat', 'Utara', 'Tengah']);
});

test('bab 159: tiap hari memuat kelima kategori tepat sekali; hari Sri cocok dengan catatan kitab', () => {
  const kategori = ['Suwung', 'Pacak', 'Sri', 'Carik jalan', 'Gigis'];
  for (const h of HARI) assert.deepEqual([...NAFKAH.tabel[h]].sort(), [...kategori].sort(), h);
  const hariSri = HARI.flatMap(h => NAFKAH.pasaran.map((p, i) => (NAFKAH.tabel[h][i] === 'Sri' ? `${h} ${p}` : null))).filter(Boolean);
  assert.deepEqual(hariSri.sort(), [...NAFKAH.hariSri].sort());
  assert.equal(hariSri.length, 7); // tepat satu per hari
});

test('bab 160 dan 161: 35 weton, arah valid; satu arah tidak tercetak untuk enam weton', () => {
  assert.deepEqual(Object.keys(SRI_SADANA.tabel).sort(), [...SEMUA_WETON].sort());
  for (const [k, v] of Object.entries(SRI_SADANA.tabel)) {
    assert.deepEqual(Object.keys(v), ['sri', 'sadana', 'siksa', 'lara', 'pati'], k);
    for (const a of Object.values(v)) assert.ok(ARAH.includes(a), `${k} ${a}`);
  }
  assert.deepEqual(Object.keys(ARAH_BERHASIL.tabel).sort(), [...SEMUA_WETON].sort());
  const satu = Object.entries(ARAH_BERHASIL.tabel).filter(([, v]) => v.length === 1).map(([k]) => k).sort();
  assert.deepEqual(satu, [...ARAH_BERHASIL.tidakTercetak].sort());
  for (const v of Object.values(ARAH_BERHASIL.tabel)) for (const a of v) assert.ok(ARAH.includes(a));
});

// --- contoh dari kitab sendiri -----------------------------------------------------------------------

test('bab 92: Jumat Pon = 13+14+15 = 42, sisa 2 = wiji Selatan (saudagar)', () => {
  const w = wiji(tanggalDengan('Jumat Pon'));
  assert.deepEqual(w.pekan.map(p => p.weton), ['Jumat Pon', 'Jumat Kliwon', 'Jumat Pahing']);
  assert.deepEqual(w.pekan.map(p => p.neptu), [13, 14, 15]);
  assert.equal(w.jumlah, 42);
  assert.equal(w.sisa, 2);
  assert.equal(w.arah, 'Selatan');
  assert.match(w.pekerjaan, /berdagang/i);
});

test('bab 92: Minggu Legi = 10+12+13 = 35, tidak bersisa = wiji Tengah', () => {
  const w = wiji(tanggalDengan('Minggu Legi'));
  assert.deepEqual(w.pekan.map(p => p.weton), ['Minggu Legi', 'Minggu Pon', 'Minggu Kliwon']);
  assert.equal(w.jumlah, 35);
  assert.equal(w.sisa, 0);
  assert.equal(w.nomor, 5);
  assert.equal(w.arah, 'Tengah');
});

test('bab 160: contoh kitab Sabtu Kliwon = Sri Barat, Sadana Selatan; Jumat Legi = serang ke Selatan', () => {
  const a = rezeki(tanggalDengan('Sabtu Kliwon')).arah;
  assert.equal(a.sri, 'Barat');
  assert.equal(a.sadana, 'Selatan');
  assert.equal(rezeki(tanggalDengan('Jumat Legi')).arah.siksa, 'Selatan');
});

// --- perilaku ----------------------------------------------------------------------------------------------

test('rezeki(): weton 26 April 1975 (Sabtu Kliwon)', () => {
  const r = rezeki('1975-04-26');
  assert.equal(r.weton, 'Sabtu Kliwon');
  assert.equal(r.mataPencaharian.hari, 'Menjadi pujangga dan bertani');
  assert.equal(r.wiji.jumlah, 48);
  assert.equal(r.wiji.arah, 'Barat');
  assert.equal(r.nafkah.kategori, 'Pacak');
  assert.equal(r.nafkah.hariSri, false);
  assert.deepEqual(r.arahBerhasil.arah, ['Utara', 'Timur']);
  assert.equal(r.arahBerhasil.keterangan, null);
  assert.ok(r.catatan && r.arah.sumber.bab === 160);
});

test('arah kedua yang tidak tercetak ditandai; hariSri benar untuk Sabtu Legi', () => {
  const r = rezeki(tanggalDengan('Rabu Legi'));
  assert.equal(r.arahBerhasil.arah.length, 1);
  assert.match(r.arahBerhasil.keterangan, /tidak tercetak/);
  assert.equal(rezeki(tanggalDengan('Sabtu Legi')).nafkah.hariSri, true);
});

test('tafsirLahir memuat rezeki; 420 hari berturut-turut lengkap', () => {
  assert.equal(tafsirLahir('1975-04-26').rezeki.wiji.nomor, 3);
  const n0 = nomorHari('2026-01-01');
  for (let i = 0; i < 420; i++) {
    const r = rezeki(isoDariNomor(n0 + i));
    assert.ok(r.mataPencaharian.hari && r.wiji.arah && r.nafkah.kategori && r.arah.sri && r.arahBerhasil.arah.length >= 1);
  }
});
