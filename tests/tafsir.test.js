import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weton, tafsirLahir, jodoh, HARI, PASARAN, WUKU, nomorHari } from '../src/index.js';
import { NEPTU } from '../src/data/neptu.js';
import { KEDUDUKAN } from '../src/data/kedudukan.js';
import { WATAK_HARI, WATAK_PASARAN, WATAK_WETON, WATAK_SISA_7, WATAK_WUKU } from '../src/data/watak.js';
import { JODOH_SISA_9, JODOH_SISA_4, JODOH_HARI } from '../src/data/jodoh.js';

const ARAH = new Set(['baik', 'buruk', 'netral']);

/** Tanggal pertama sejak 2000-01-01 yang wetonnya `nama`. */
function tanggalDengan(nama) {
  for (let i = 0; i < 40; i++) {
    const d = new Date(Date.UTC(2000, 0, 1 + i)).toISOString().slice(0, 10);
    if (weton(d).weton === nama) return d;
  }
  throw new Error(`tidak ketemu ${nama}`);
}

// --- kelengkapan data -----------------------------------------------------------------

test('35 weton: tiap kombinasi hari x pasaran punya watak', () => {
  const kunci = HARI.flatMap(h => PASARAN.map(p => `${h} ${p}`));
  assert.equal(kunci.length, 35);
  for (const k of kunci) {
    const w = WATAK_WETON[k];
    assert.ok(w, `weton tanpa data: ${k}`);
    assert.ok(w.umum || w.pria || w.wanita, `watak kosong: ${k}`);
  }
  const berlebih = Object.keys(WATAK_WETON).filter(k => k !== 'sumber' && !kunci.includes(k));
  assert.deepEqual(berlebih, []);
});

test('7 hari, 5 pasaran, 7 sisa-7: lengkap', () => {
  for (const h of HARI) {
    assert.ok(WATAK_HARI[h].watak && WATAK_HARI[h].unsur, h);
    assert.ok(KEDUDUKAN.hari[h].warna && KEDUDUKAN.hari[h].letak && KEDUDUKAN.hari[h].pelindung, h);
    assert.ok(NEPTU.hari[h] > 0, h);
  }
  for (const p of PASARAN) {
    assert.ok(WATAK_PASARAN[p].watak && WATAK_PASARAN[p].hewan.length, p);
    assert.ok(KEDUDUKAN.pasaran[p].warna && KEDUDUKAN.pasaran[p].pelindung, p);
    assert.ok(NEPTU.pasaran[p] > 0, p);
  }
  for (let i = 1; i <= 7; i++) assert.ok(WATAK_SISA_7[i].nama && WATAK_SISA_7[i].makna, `sisa ${i}`);
});

test('30 wuku: nomor 1-30 sesuai urutan mesin, atribut terisi', () => {
  assert.equal(WUKU.length, 30);
  WUKU.forEach((nama, i) => {
    const w = WATAK_WUKU[nama];
    assert.ok(w, `wuku tanpa data: ${nama}`);
    assert.equal(w.nomor, i + 1, nama);
    assert.ok(w.dewa && w.watak && w.kala, nama);
  });
});

test('arah Kala per wuku cocok dengan diagram kitab (hlm. 90)', () => {
  const diagram = {
    'Selatan': [26, 6, 16], 'Tenggara': [13, 3, 23], 'Barat Daya': [9, 19, 29], 'Atas': [17, 27, 7],
    'Timur': [30, 10, 20], 'Barat': [22, 2, 12], 'Bawah': [4, 24, 14], 'Timur Laut': [1, 21, 11],
    'Barat Laut': [5, 25, 15], 'Utara': [8, 18, 28]
  };
  let total = 0;
  for (const [arah, nomor] of Object.entries(diagram)) {
    for (const n of nomor) {
      assert.equal(WATAK_WUKU[WUKU[n - 1]].kala, arah, `wuku ${n}`);
      total++;
    }
  }
  assert.equal(total, 30);
});

test('jodoh: 45 pasangan sisa-9, 4 sisa-4, 28 pasangan hari, semua berlabel', () => {
  const kunci9 = [];
  for (let a = 1; a <= 9; a++) for (let b = a; b <= 9; b++) kunci9.push(`${a}&${b}`);
  assert.equal(kunci9.length, 45);
  assert.deepEqual(Object.keys(JODOH_SISA_9.tabel).sort(), [...kunci9].sort());
  assert.deepEqual(Object.keys(JODOH_SISA_4.tabel).map(Number), [1, 2, 3, 4]);
  const u = JODOH_HARI.urutanHari;
  const kunciHari = u.flatMap((a, i) => u.slice(i).map(b => `${a}&${b}`));
  assert.equal(kunciHari.length, 28);
  assert.deepEqual(Object.keys(JODOH_HARI.tabel).sort(), [...kunciHari].sort());
  for (const t of [JODOH_SISA_9.tabel, JODOH_SISA_4.tabel, JODOH_HARI.tabel]) {
    for (const [k, v] of Object.entries(t)) {
      assert.ok(v.makna, k);
      assert.ok(ARAH.has(v.arah), `${k}: arah ${v.arah}`);
    }
  }
});

test('neptu di data kitab sama dengan neptu di mesin kalender (35 weton)', () => {
  for (const h of HARI) for (const p of PASARAN) {
    const d = tanggalDengan(`${h} ${p}`);
    const n = weton(d).neptu;
    assert.equal(n.hari, NEPTU.hari[h], `${h} ${p}`);
    assert.equal(n.pasaran, NEPTU.pasaran[p], `${h} ${p}`);
  }
});

// --- contoh hitungan dari kitab sendiri ---------------------------------------------------

test('bab 15: suami Jumat Kliwon (sisa 5) dengan istri Jumat Pahing (sisa 6) = 5&6, murah rezeki', () => {
  const j = jodoh(tanggalDengan('Jumat Kliwon'), tanggalDengan('Jumat Pahing'));
  assert.equal(j.metode.sisa9.sisaA, 5);
  assert.equal(j.metode.sisa9.sisaB, 6);
  assert.equal(j.metode.sisa9.kunci, '5&6');
  assert.equal(j.metode.sisa9.arah, 'baik');
});

test('bab 16: Jumat Pon + Rabu Pahing = 29, sisa 1 = Gonto', () => {
  const j = jodoh(tanggalDengan('Jumat Pon'), tanggalDengan('Rabu Pahing'));
  assert.equal(j.metode.sisa4.jumlah, 29);
  assert.equal(j.metode.sisa4.sisa, 1);
  assert.equal(j.metode.sisa4.nama, 'Gonto');
});

test('bab 104: Minggu Wage (3+5=8, sisa 1) dan Jumat Pon (1+4=5)', () => {
  const a = tafsirLahir(tanggalDengan('Minggu Wage')).watak.sisa7;
  assert.deepEqual([a.jumlah, a.nomor, a.nama], [8, 1, 'Segara wasesa']);
  const b = tafsirLahir(tanggalDengan('Jumat Pon')).watak.sisa7;
  assert.deepEqual([b.jumlah, b.nomor, b.nama], [5, 5, 'Bumi kapetak']);
});

// --- perilaku API -----------------------------------------------------------------------------

test('tafsirLahir: weton 26 April 1975 (Sabtu Kliwon, wuku Kuningan)', () => {
  const t = tafsirLahir('1975-04-26');
  assert.equal(t.weton, 'Sabtu Kliwon');
  assert.equal(t.neptu.total, 17);
  assert.equal(t.kedudukan.hari.letak, 'Selatan');
  assert.equal(t.kedudukan.pasaran.pelindung, 'Guru');
  assert.equal(t.watak.hari.unsur, 'Air');
  assert.equal(t.watak.pasaran.hewan[0], 'Kera');
  assert.equal(t.watak.wuku.nama, 'Kuningan');
  assert.equal(t.watak.wuku.dewa, 'Indra');
  assert.equal(t.watak.wuku.kala, 'Barat');
  assert.deepEqual([t.watak.sisa7.jumlah, t.watak.sisa7.nomor], [3, 3]); // Sabtu 2 + Kliwon 1
  assert.ok(t.watak.weton.umum);
  assert.ok(t.sumber.length >= 6 && t.catatan);
});

test('jodoh: urutan A/B tidak memengaruhi hasil; jumlah ringkasan = 3', () => {
  const pasangan = [['1975-04-26', '1980-01-01'], ['1990-06-15', '1992-11-30'], ['2000-02-29', '1999-12-31']];
  for (const [a, b] of pasangan) {
    const ab = jodoh(a, b), ba = jodoh(b, a);
    assert.deepEqual(ab.metode.sisa9.kunci, ba.metode.sisa9.kunci);
    assert.equal(ab.metode.sisa4.sisa, ba.metode.sisa4.sisa);
    assert.equal(ab.metode.hari.kunci, ba.metode.hari.kunci);
    assert.deepEqual(ab.ringkasan, ba.ringkasan);
    assert.equal(ab.ringkasan.baik + ab.ringkasan.buruk + ab.ringkasan.netral, 3);
  }
});

test('semua hari 400 hari berturut-turut menghasilkan tafsir tanpa data kosong', () => {
  const awal = nomorHari('2026-01-01');
  for (let i = 0; i < 420; i++) {
    const d = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
    const t = tafsirLahir(d);
    assert.ok(t.watak.hari.watak && t.watak.pasaran.watak && t.watak.weton && t.watak.sisa7.nama && t.watak.wuku.dewa, d);
    assert.ok(t.kedudukan.hari.warna && t.kedudukan.pasaran.warna, d);
  }
  assert.ok(awal > 0);
});
