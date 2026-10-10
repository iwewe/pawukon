import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { kalenderJawa, weton, nomorHari, isoDariNomor, WULAN } from '../src/index.js';

// Menjaga docs/spesifikasi/RUMUSAN_PERHITUNGAN.md, spec/vektor_uji.json, dan mesin JS tetap sama.
// Implementasi acuan lain: spec/referensi.py (python3 -I spec/referensi.py).

const doc = readFileSync(new URL('../docs/spesifikasi/RUMUSAN_PERHITUNGAN.md', import.meta.url), 'utf8');
const vektor = JSON.parse(readFileSync(new URL('../spec/vektor_uji.json', import.meta.url), 'utf8'));
const N0 = nomorHari('1633-07-08');
const AKHIR_TABEL = 238133; // 2285-07-03: akhir AJ 2226, batas tabel mesin

function checksum(n) {
  const h = createHash('sha256');
  for (let d = 0; d <= n; d++) {
    const t = kalenderJawa(isoDariNomor(N0 + d)).tanggal;
    h.update(`${d}|${t.dina}|${WULAN.indexOf(t.wulan)}|${t.tahun}\n`);
  }
  return h.digest('hex');
}

test('checksum seluruh rentang: mesin = dokumen = vektor_uji.json', () => {
  assert.equal(vektor.akhirTerdefinisi.d, 153085);
  assert.equal(isoDariNomor(N0 + 153085), '2052-08-25');
  assert.equal(isoDariNomor(N0 + AKHIR_TABEL), '2285-07-03');
  for (const n of [153085, AKHIR_TABEL]) {
    const dariMesin = checksum(n);
    assert.equal(vektor.checksum[`N=${n}`], dariMesin, `vektor_uji.json N=${n}`);
    assert.ok(doc.includes(dariMesin), `RUMUSAN_PERHITUNGAN.md memuat checksum N=${n}`);
  }
});

test('awal tahun (rumus tertutup bagian 5.2): 1 Sura, weton, dan panjang tahun cocok dengan mesin', () => {
  const { baris } = vektor.awalTahun;
  assert.equal(baris.length, 2227 - 1555 + 1);
  for (const [tahun, d, iso, wetonNama, panjang] of baris) {
    assert.equal(isoDariNomor(N0 + d), iso);
    if (tahun > 2226) continue; // di luar tabel mesin (lihat dokumen bagian 11); hanya baris awal untuk panjang tahun 2226
    const k = kalenderJawa(iso);
    assert.deepEqual([k.tanggal.dina, k.tanggal.wulan, k.tanggal.tahun, k.weton], [1, 'Sura', tahun, wetonNama]);
    if (panjang !== null) {
      const berikut = baris.find(b => b[0] === tahun + 1);
      assert.equal(berikut[1] - d, panjang);
    }
  }
});

test('vektor tanggal (vektor_uji.json) cocok dengan mesin', () => {
  for (const v of vektor.tanggal) {
    assert.equal(nomorHari(v.masehi) - N0, v.d);
    if (v.d < 0) {
      const w = weton(v.masehi);
      assert.deepEqual([w.weton, w.neptu.total, w.wuku], [v.weton, v.neptu, v.wuku]);
      assert.equal(v.dina, undefined);
      continue;
    }
    const k = kalenderJawa(v.masehi);
    assert.deepEqual(
      [k.weton, k.neptu.total, k.wuku, k.tanggal.dina, k.tanggal.wulan, k.tanggal.tahun, k.tanggal.taun, k.tanggal.windu, k.tanggal.lambang, k.tanggal.kurup, k.hariMulia, k.spekulatif],
      [v.weton, v.neptu, v.wuku, v.dina, v.wulan, v.tahun, v.taun, v.windu, v.lambang, v.kurup, v.hariMulia, v.spekulatif],
      v.masehi
    );
  }
});

test('tabel titik tambat di dokumen (bagian 10.1) cocok dengan mesin', () => {
  const baris = [...doc.matchAll(/^\| (\d{4}-\d{2}-\d{2}) \| (-?\d+) \| ([A-Za-z]+ [A-Za-z]+) \| (\d+) \| ([A-Za-z]+) \|/gm)];
  assert.ok(baris.length >= 12, 'tabel 10.1 terbaca');
  for (const [, iso, d, wetonNama, neptu, wuku] of baris) {
    assert.equal(nomorHari(iso) - N0, Number(d), iso);
    const w = weton(iso);
    assert.deepEqual([w.weton, w.neptu.total, w.wuku], [wetonNama, Number(neptu), wuku], iso);
  }
});

test('contoh hitung tangan (bagian 9): 27 Juni 2025', () => {
  const d = nomorHari('2025-06-27') - N0;
  assert.equal(d, 143164);
  assert.equal(((d + 4) % 7 + 7) % 7, 4);
  assert.equal(d % 5, 4);
  assert.equal(((d + 194) % 210), 138);
  assert.equal(Math.floor(138 / 7), 19);
  assert.equal(Math.floor((8 * d) / 2835), 403);
  assert.equal(50 * 2835 + 1417 - 3, d);
});

test('rumus siklus (RUMUSAN bagian 4) sama dengan mesin: setiap hari 1633-07-08 .. 2285-07-03 dan 50.000 hari sebelum epoch', () => {
  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const NEPTU_HARI = [4, 3, 7, 8, 6, 9, 5];
  const NEPTU_PASARAN = [5, 9, 7, 4, 8];
  const mod = (a, b) => ((a % b) + b) % b;
  let salah = 0;
  let diperiksa = 0;
  for (let d = -50000; d <= AKHIR_TABEL; d++) {
    const w = weton(isoDariNomor(N0 + d));
    const ih = mod(d + 4, 7);
    const ip = mod(d, 5);
    const iw = Math.floor(mod(d + 194, 210) / 7);
    diperiksa++;
    if (w.weton !== `${HARI[ih]} ${PASARAN[ip]}` || w.neptu.total !== NEPTU_HARI[ih] + NEPTU_PASARAN[ip] || w.nomorWuku !== iw + 1) salah++;
  }
  assert.equal(diperiksa, 288134); // 50.000 sebelum epoch + 238.134 hari
  assert.equal(salah, 0);
});
