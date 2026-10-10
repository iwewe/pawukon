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

test('mesin cocok dengan Karaton pada seluruh awal bulan kurup Aboge yang dipakai mesin (1821-1935): 1416 bulan', () => {
  const hasil = awalBulan('Aboge', '1819-01-01', '1936-03-31');
  assert.equal(hasil.length, 1416);
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

test('kasus terbuka (batas kurup): Karaton menyebut Aboge mulai AJ 1747, mesin mulai AJ 1749', () => {
  // Mesin memakai batas kurup weton.m (Arbangiyah mulai 1749). Tesis Marhamah menyebut Aboge mulai 1747 J (1819 M).
  // Pada AJ 1746-1748 (1819-1821 M) mesin tidak cocok dengan tabel Aboge; belum diselesaikan.
  const k = kalenderJawa('1820-06-01');
  assert.equal(k.tanggal.kurupPendek, 'Amiswon');
  const dalamAboge = awalBulan('Amiswon', '1819-01-01', '1821-06-01');
  const cocok = dalamAboge.filter(({ k: x }) => x.weton === ABOGE[x.tanggal.taun][x.tanggal.wulan]).length;
  assert.equal(cocok < dalamAboge.length, true);
});

test('12 titik data dari Almanak Jawa dan kalender Karaton (tesis Marhamah 2022, hlm. 116-125) cocok', () => {
  // [tanggal Masehi, tanggal Jawa, bulan, tahun AJ]; 1 Poso 1953 tercetak "24 Mei 2020" di teks tetapi 24 April 2020 di tabel
  // dan pada 1 Ramadhan 1441 H (Jumat Kliwon); yang dipakai 24 April.
  const titik = [
    ['1929-02-11', 1, 'Pasa', 1859], ['1929-03-13', 1, 'Sawal', 1859], ['1934-01-18', 1, 'Sawal', 1864],
    ['1937-11-04', 1, 'Pasa', 1868], ['1937-12-04', 1, 'Sawal', 1868], ['1939-10-14', 1, 'Pasa', 1870],
    ['2012-07-20', 1, 'Pasa', 1945], ['2012-08-19', 1, 'Sawal', 1945], ['2020-04-24', 1, 'Pasa', 1953],
    ['2020-05-24', 1, 'Sawal', 1953], ['2022-04-03', 1, 'Pasa', 1955], ['2022-05-03', 1, 'Sawal', 1955]
  ];
  for (const [iso, dina, wulan, tahun] of titik) {
    const k = kalenderJawa(iso).tanggal;
    assert.deepEqual([k.dina, k.wulan, k.tahun], [dina, wulan, tahun], iso);
  }
  // hari yang disebut tesis: 1 Poso 1945 = Jumat Kliwon, 1 Sawal 1945 = Ahad Kliwon, 1 Poso 1955 = Ahad Wage, 1 Sawal 1955 = Selasa Wage
  assert.equal(kalenderJawa('2012-07-20').weton, 'Jumat Kliwon');
  assert.equal(kalenderJawa('2012-08-19').weton, 'Minggu Kliwon');
  assert.equal(kalenderJawa('2022-04-03').weton, 'Minggu Wage');
  assert.equal(kalenderJawa('2022-05-03').weton, 'Selasa Wage');
});
