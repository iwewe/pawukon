import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kalenderJawa, TAUN } from '../src/index.js';
import { TITIK_ALMANAK } from './data-almanak.js';

// Tanggal Jawa yang tercetak pada tabel tesis Marhamah (2022): lihat data-almanak.js untuk sumber dan koreksinya.

test('almanak: 15 titik, 10 awal bulan Pasa/Sawal pada 6 tahun Jawa, tanpa tahun Dal', () => {
  assert.equal(TITIK_ALMANAK.length, 15);
  const awalBulan = TITIK_ALMANAK.filter(t => t.dina === 1);
  assert.equal(awalBulan.length, 10);
  const tahun = [...new Set(TITIK_ALMANAK.map(t => t.tahun))];
  assert.deepEqual(tahun, [1859, 1864, 1868, 1870, 1945, 1953]);
  const nama = tahun.map(t => TAUN[(t - 1555) % 8]);
  assert.deepEqual(nama, ['Alip', 'Be', 'Ehe', 'Je', 'Wawu', 'Wawu']);
  assert.ok(!nama.includes('Dal'), 'tidak ada titik tahun Dal: titik ini tidak membedakan pola Dal lama dan baru');
});

test('almanak: mesin cocok dengan seluruh 15 tanggal Jawa yang tercetak (Almanak Jawa 1929-1939, kalender Keraton 2012 dan 2020)', () => {
  for (const t of TITIK_ALMANAK) {
    const k = kalenderJawa(t.masehi);
    assert.deepEqual(
      [k.tanggal.dina, k.tanggal.wulan, k.tanggal.tahun],
      [t.dina, t.wulan, t.tahun],
      `Tabel ${t.tabel}, ${t.masehi}`
    );
    if (t.weton) assert.equal(k.weton, t.weton, `weton Tabel ${t.tabel}, ${t.masehi}`);
  }
});

test('almanak: dua koreksi salah ketik tesis dicatat dan masuk akal secara aritmetika', () => {
  const dikoreksi = TITIK_ALMANAK.filter(t => t.koreksi);
  assert.equal(dikoreksi.length, 2);
  // Hari sebelum 1 Sawal adalah hari terakhir bulan Pasa (bukan Ruwah).
  const sebelum = kalenderJawa('1934-01-17').tanggal;
  const sawal = kalenderJawa('1934-01-18').tanggal;
  assert.equal(sawal.wulan, 'Sawal');
  assert.equal(sebelum.wulan, 'Pasa');
  assert.equal(sebelum.dina, 30);
  // 24 Mei 2020 adalah Minggu Kliwon (1 Sawal), 24 April 2020 Jumat Kliwon (1 Pasa): selisih 30 hari, umur bulan Pasa 1953.
  assert.equal(kalenderJawa('2020-04-24').weton, 'Jumat Kliwon');
  assert.equal(kalenderJawa('2020-05-24').weton, 'Minggu Kliwon');
});
