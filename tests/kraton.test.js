import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kalenderJawa, nomorHari, isoDariNomor, WULAN, TAUN, HARI, PASARAN } from '../src/index.js';
import { ABOGE, ASAPON } from './data-kraton.js';

// Awal tiap bulan menurut Karaton Yogyakarta (tesis Marhamah 2022, mengutip KRT Rintaiswara 2015). Lihat data-kraton.js.

const KURUP = { Aboge: ABOGE, Asapon: ASAPON };

/** Semua tanggal 1 bulan Jawa (tanggal Masehi) pada kurup tertentu dalam rentang Masehi. */
function awalBulan(kurup, dari, sampai) {
  const hasil = [];
  for (let n = nomorHari(dari); n <= nomorHari(sampai); n++) {
    const iso = isoDariNomor(n);
    const k = kalenderJawa(iso);
    if (k.tanggal.dina === 1 && k.tanggal.kurupPendek === kurup) hasil.push({ iso, k });
  }
  return hasil;
}

test('tabel Karaton dalam repo: 8 tahun x 12 bulan, nama sah', () => {
  for (const t of Object.values(KURUP)) {
    assert.deepEqual(Object.keys(t), TAUN);
    for (const bulan of Object.values(t)) {
      assert.deepEqual(Object.keys(bulan), WULAN);
      for (const w of Object.values(bulan)) {
        const [h, p] = w.split(' ');
        assert.ok(HARI.includes(h) && PASARAN.includes(p), w);
      }
    }
  }
});

test('tabel Karaton konsisten sendiri: selisih awal bulan 30 dan 29 hari bergantian; Besar 29 atau 30', () => {
  const urutHari = (w) => HARI.indexOf(w.split(' ')[0]);
  const urutPasaran = (w) => PASARAN.indexOf(w.split(' ')[1]);
  const selisih = (a, b) => [29, 30, 354, 355].find(d => (urutHari(a) + d) % 7 === urutHari(b) && (urutPasaran(a) + d) % 5 === urutPasaran(b));
  for (const [nama, t] of Object.entries(KURUP)) {
    TAUN.forEach((taun, i) => {
      const urut = WULAN.map(b => t[taun][b]).concat([t[TAUN[(i + 1) % 8]].Sura]);
      for (let b = 0; b < 11; b++) assert.equal(selisih(urut[b], urut[b + 1]), b % 2 === 0 ? 30 : 29, `${nama} ${taun} ${WULAN[b]}`);
      assert.ok([29, 30].includes(selisih(urut[11], urut[12])), `${nama} ${taun} Besar`);
    });
  }
});

test('panjang tahun menurut Karaton: Ehe, Dal, Jimakir 355 hari; yang lain 354 (kedua kurup)', () => {
  const urutHari = (w) => HARI.indexOf(w.split(' ')[0]);
  const urutPasaran = (w) => PASARAN.indexOf(w.split(' ')[1]);
  for (const [nama, t] of Object.entries(KURUP)) {
    TAUN.forEach((taun, i) => {
      const a = t[taun].Sura, b = t[TAUN[(i + 1) % 8]].Sura;
      const d = [354, 355].find(x => (urutHari(a) + x) % 7 === urutHari(b) && (urutPasaran(a) + x) % 5 === urutPasaran(b));
      assert.equal(d, ['Ehe', 'Dal', 'Jimakir'].includes(taun) ? 355 : 354, `${nama} ${taun}`);
    });
  }
});

test('mesin cocok dengan Karaton pada SELURUH awal bulan kurup Asapon (1936-2052): 1440 bulan', () => {
  const hasil = awalBulan('Asapon', '1936-03-01', '2052-08-25');
  assert.equal(hasil.length, 1440);
  for (const { iso, k } of hasil) {
    assert.equal(k.weton, ASAPON[k.tanggal.taun][k.tanggal.wulan], `${iso}: 1 ${k.tanggal.wulan} ${k.tanggal.tahun} ${k.tanggal.taun}`);
  }
});

test('mesin cocok dengan Karaton pada seluruh awal bulan kurup Aboge (AJ 1747-1866, 1819-1936): 1440 bulan', () => {
  const hasil = awalBulan('Aboge', '1819-01-01', '1936-03-31');
  assert.equal(hasil.length, 1440);
  for (const { iso, k } of hasil) {
    assert.equal(k.weton, ABOGE[k.tanggal.taun][k.tanggal.wulan], `${iso}: 1 ${k.tanggal.wulan} ${k.tanggal.tahun} ${k.tanggal.taun}`);
  }
});

test('1 Sura menurut Karaton untuk tahun-tahun terkini (AJ 1956-1960)', () => {
  const awal = (tahun, dari) => {
    for (let n = nomorHari(dari); n < nomorHari(dari) + 400; n++) {
      const k = kalenderJawa(isoDariNomor(n));
      if (k.tanggal.dina === 1 && k.tanggal.wulan === 'Sura' && k.tanggal.tahun === tahun) return { iso: isoDariNomor(n), weton: k.weton };
    }
  };
  assert.deepEqual(awal(1956, '2022-06-01'), { iso: '2022-07-30', weton: 'Sabtu Pahing' });   // Ehe
  assert.deepEqual(awal(1957, '2023-06-01'), { iso: '2023-07-20', weton: 'Kamis Pahing' });   // Jimawal
  assert.deepEqual(awal(1958, '2024-06-01'), { iso: '2024-07-08', weton: 'Senin Legi' });     // Je
  assert.deepEqual(awal(1959, '2025-06-01'), { iso: '2025-06-27', weton: 'Jumat Kliwon' });   // Dal (sebelum koreksi: 28 Juni)
  assert.deepEqual(awal(1960, '2026-06-01'), { iso: '2026-06-17', weton: 'Rabu Kliwon' });    // Be
});

test('batas kurup menurut Karaton: 1 Sura tahun Alip pertama tiap kurup, mundur satu hari dan satu pasaran', () => {
  const awalAlip = { "A'ahgi": ['1633-07-08', 'Jumat Legi', 1555], Amiswon: ['1703-05-17', 'Kamis Kliwon', 1627], Aboge: ['1819-10-20', 'Rabu Wage', 1747], Asapon: ['1936-03-24', 'Selasa Pon', 1867] };
  for (const [kurup, [iso, weton, tahun]] of Object.entries(awalAlip)) {
    const k = kalenderJawa(iso);
    assert.deepEqual([k.tanggal.dina, k.tanggal.wulan, k.tanggal.tahun, k.tanggal.taun, k.tanggal.kurupPendek, k.weton], [1, 'Sura', tahun, 'Alip', kurup, weton], kurup);
    // sehari sebelumnya masih kurup sebelumnya (kecuali awal kalender)
  }
  assert.equal(kalenderJawa('1703-05-16').tanggal.kurupPendek, "A'ahgi");
  assert.equal(kalenderJawa('1819-10-19').tanggal.kurupPendek, 'Amiswon');
  assert.equal(kalenderJawa('1936-03-23').tanggal.kurupPendek, 'Aboge');
  assert.equal(kalenderJawa('1936-03-23').tanggal.dina, 29); // kurup berakhir sehari lebih cepat: Besar tahun terakhir 29 hari
});

test('1 Sura tahun Alip selalu jatuh pada hari-pasaran kurupnya, di SEMUA tahun Alip (1555-1986 AJ)', () => {
  const anchor = { "A'ahgi": 'Jumat Legi', Amiswon: 'Kamis Kliwon', Aboge: 'Rabu Wage', Asapon: 'Selasa Pon' };
  const hitung = {};
  for (let n = nomorHari('1633-07-08'); n <= nomorHari('2052-08-25'); n++) {
    const k = kalenderJawa(isoDariNomor(n));
    if (k.tanggal.dina !== 1 || k.tanggal.wulan !== 'Sura' || k.tanggal.taun !== 'Alip') continue;
    hitung[k.tanggal.kurupPendek] = (hitung[k.tanggal.kurupPendek] ?? 0) + 1;
    assert.equal(k.weton, anchor[k.tanggal.kurupPendek], `1 Sura Alip ${k.tanggal.tahun}`);
  }
  assert.deepEqual(hitung, { "A'ahgi": 9, Amiswon: 15, Aboge: 15, Asapon: 15 });
});

test('opsi jogja tidak ada lagi: kalenderJawa hanya mengenal kalender Karaton Yogyakarta', () => {
  assert.equal(kalenderJawa('1850-01-01').teks, kalenderJawa('1850-01-01', { jogja: true }).teks); // argumen kedua diabaikan
  assert.equal(kalenderJawa.length, 1);
});
