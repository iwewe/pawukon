import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { kesehatanLahir, kesehatanSakit, arahBerobat, tafsirLahir, weton, HARI, PASARAN, nomorHari, isoDariNomor } from '../src/index.js';
import * as D from '../src/data/kesehatan.js';

function tanggalDengan(nama) {
  const n0 = nomorHari('2000-01-01');
  for (let i = 0; i < 40; i++) {
    const d = isoDariNomor(n0 + i);
    if (weton(d).weton === nama) return d;
  }
  throw new Error(nama);
}

test('kelengkapan: tujuh hari, lima pasaran, lima golongan sebab, enam sumber sakit', () => {
  for (const h of HARI) {
    assert.ok(D.TUBUH_HARI_LAHIR[h].rawan.length === 2, h);
    assert.ok(D.LETAK_SAKIT_HARI[h] && D.AWAL_SAKIT_HARI[h].sebab, h);
    assert.deepEqual(Object.keys(D.ARAH_BEROBAT[h]).sort(), ['Barat', 'Selatan', 'Timur', 'Utara'], h);
  }
  for (const p of PASARAN) assert.ok(D.SAKIT_PASARAN_LAHIR[p], p);
  assert.deepEqual([1, 2, 3, 4, 5].map(i => D.SEBAB_NEPTU_5[i].nama), ['Sabda', 'Guna', 'Tirta', 'Wana', 'Lepas']);
  for (let i = 7; i <= 12; i++) assert.ok(D.SUMBER_SAKIT_NEPTU[i].sumber && D.SUMBER_SAKIT_NEPTU[i].penyembuh, `neptu ${i}`);
});

test('bab 320: tiap hari punya arah waras; Sabtu dua; arah lain Sunya/Lara/Pati tanpa ulangan', () => {
  for (const h of HARI) {
    const nilai = Object.values(D.ARAH_BEROBAT[h]);
    const waras = nilai.filter(n => n === 'Waras').length;
    assert.equal(waras, h === 'Sabtu' ? 2 : 1, h);
    if (h !== 'Sabtu') assert.deepEqual([...nilai].sort(), ['Lara', 'Pati', 'Sunya', 'Waras'], h);
  }
});

test('bab 325: semua jumlah neptu yang mungkin (7-18) punya sumber sakit', () => {
  const totals = new Set();
  for (const h of HARI) for (const p of PASARAN) totals.add(weton(tanggalDengan(`${h} ${p}`)).neptu.total);
  const sorted = [...totals].sort((a, b) => a - b);
  assert.ok(sorted[0] >= 7 && sorted.at(-1) <= 18, sorted.join(','));
  for (const t of sorted) {
    const w = HARI.flatMap(h => PASARAN.map(p => `${h} ${p}`)).find(k => weton(tanggalDengan(k)).neptu.total === t);
    const r = kesehatanSakit(tanggalDengan(w));
    assert.ok(r.sumberSakit.sumber, `jumlah ${t}`);
  }
});

test('contoh kitab: Minggu menuju Timur (waras); Sabtu Kliwon -> bab 325 jumlah 17 = jalan', () => {
  assert.deepEqual(arahBerobat(tanggalDengan('Minggu Legi')).dianjurkan, ['Timur']);
  const r = kesehatanSakit('2026-10-10'); // Sabtu Kliwon: 9 + 8 = 17
  assert.equal(r.neptu, 17);
  assert.equal(r.sumberSakit.sumber, 'Jalan');
  assert.equal(r.sebabNeptu.nama, 'Guna'); // 17 mod 5 = 2
  assert.equal(r.letakSakit.letak, 'Muka');
  assert.ok(r.sebabNeptu.asumsi);
});

test('kesehatanLahir: weton 26 April 1975; peringatan medis selalu ada', () => {
  const k = kesehatanLahir('1975-04-26');
  assert.deepEqual(k.tubuhRawan.rawan, ['Marlesu', 'Lambung']);
  assert.equal(k.sakitMenurutPasaran.sakit, 'Ngrayung');
  assert.match(k.peringatan, /bukan nasihat medis/);
  assert.match(kesehatanSakit('2026-01-01').peringatan, /tenaga kesehatan/);
  assert.match(arahBerobat('2026-01-01').peringatan, /tenaga kesehatan/);
  assert.ok(tafsirLahir('1975-04-26').kesehatan.peringatan);
});

test('ramuan dan doa tidak ikut masuk ke data kesehatan', () => {
  const src = readFileSync(new URL('../src/data/kesehatan.js', import.meta.url), 'utf8');
  const isi = src.split('\n').filter(l => !l.trim().startsWith('*') && !l.trim().startsWith('//') && !l.trim().startsWith('/**')).join('\n');
  assert.doesNotMatch(isi, /dipipis|diminum|dibedak|borehkan|mrica|kunir|kencur|temulawak|manggar|sawitan|delima|laba-laba|rumah rayap/i);
  assert.doesNotMatch(isi, /Ashadu|mutahar/i);
});
