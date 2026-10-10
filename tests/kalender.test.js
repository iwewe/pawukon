import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { kalenderJawa, weton, wuku, selapan, nomorHari, isoDariNomor } from '../src/index.js';

const golden = JSON.parse(readFileSync(new URL('./golden.json', import.meta.url)));

// --- patokan yang diketahui -------------------------------------------------------

test('weton pemilik proyek: 26 April 1975 = Sabtu Kliwon', () => {
  const w = weton('1975-04-26');
  assert.equal(w.weton, 'Sabtu Kliwon');
  assert.equal(w.wuku, 'Kuningan');
  assert.deepEqual(w.neptu, { hari: 9, pasaran: 8, total: 17 });
});

test('titik awal kalender: 8 Juli 1633 = Jumat Legi, 1 Sura Alip 1555', () => {
  const k = kalenderJawa('1633-07-08');
  assert.equal(k.weton, 'Jumat Legi');
  assert.equal(k.wuku, 'Kulawu');
  assert.equal(k.tanggal.dina, 1);
  assert.equal(k.tanggal.wulan, 'Sura');
  assert.equal(k.tanggal.tahun, 1555);
  assert.equal(k.tanggal.taun, 'Alip');
  assert.equal(k.tanggal.windu, 'Kuntara');
  assert.equal(k.tanggal.lambang, 'Kulawu');
  assert.equal(k.tanggal.kurup, 'Jamingiyah');
  assert.equal(k.neptu.total, 11);
  assert.deepEqual(k.hariMulia, ['Siji Sura', 'Dina Purnama']); // Jumat Legi juga Dina Purnama
});

test('1 Januari 1970 = Kamis Wage', () => {
  assert.equal(weton('1970-01-01').weton, 'Kamis Wage');
});

test('1 Januari 2000 = Sabtu Legi (kasus yang salah di weton.c)', () => {
  assert.equal(weton('2000-01-01').weton, 'Sabtu Legi');
  assert.equal(weton('2000-02-29').weton, 'Selasa Kliwon');
});

test('contoh terbit di weton.md dan artikel', () => {
  const cases = [
    ['1968-12-03', 'Selasa Kliwon Julungwangi 13 Pasa 1900 AJ Ehe Adi Langkir Salasiyah (Asapon)'],
    ['2020-10-01', 'Kemis Kliwon Langkir 13 Sapar 1954 AJ Jimakir Sengara Langkir Salasiyah (Asapon)'],
    ['2020-10-31', 'Setu Kliwon Kuruwelut 14 Mulud 1954 AJ Jimakir Sengara Langkir Salasiyah (Asapon)'],
    ['2021-08-10', 'Selasa Pon Kulawu 1 Sura 1955 AJ Alip Sengara Langkir Salasiyah (Asapon) [Siji Sura]']
  ];
  for (const [tgl, harapan] of cases) {
    assert.equal(kalenderJawa(tgl).teks, harapan, tgl);
  }
});

test('Galungan: Rabu Kliwon wuku Galungan berulang tepat tiap 210 hari', () => {
  const tanggal = ['2024-02-28', '2024-09-25', '2025-04-23', '2025-11-19', '2026-06-17'];
  for (const t of tanggal) {
    const w = weton(t);
    assert.equal(w.weton, 'Rabu Kliwon', t);
    assert.equal(w.wuku, 'Galungan', t);
  }
  const hari = tanggal.map(nomorHari);
  hari.slice(1).forEach((h, i) => assert.equal(h - hari[i], 210));
  // Kuningan = sepuluh hari sesudah Galungan, Sabtu Kliwon
  assert.deepEqual(kalenderJawa('2024-03-09').hariMulia, ['Kuningan']);
});

// --- sifat siklus --------------------------------------------------------------------

test('siklus: weton 35 hari, wuku 210 hari, windu 2835 hari', () => {
  const a = weton('2026-10-10');
  const b = weton(selapan('2026-10-10', 1)[1]);
  assert.equal(b.weton, a.weton);
  assert.notEqual(b.wuku, a.wuku); // 35 hari = 5 wuku
  assert.equal(nomorHari('2026-10-10') + 210 - nomorHari('2027-05-08'), 0);
  assert.equal(weton('2027-05-08').wuku, a.wuku);
});

test('selapan: 35 hari, weton sama', () => {
  const daftar = selapan('1975-04-26', 5);
  assert.equal(daftar.length, 6);
  assert.equal(daftar[1], '1975-05-31');
  for (const t of daftar) assert.equal(weton(t).weton, 'Sabtu Kliwon');
});

test('hari mulia: Hanggara Asih, Dina Mulya, Dina Purnama', () => {
  const ketemu = new Set();
  for (let i = 0; i < 210 * 2; i++) {
    const t = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
    kalenderJawa(t).hariMulia.forEach(n => ketemu.add(n));
  }
  for (const n of ['Hanggara Asih', 'Dina Mulya', 'Dina Purnama', 'Kuningan']) assert.ok(ketemu.has(n), n);
});

// --- cocok dengan port weton.m ------------------------------------------------------------

test(`regresi: ${golden.umum.length} tanggal cocok dengan port weton.m`, () => {
  for (const g of golden.umum) {
    const k = kalenderJawa(g.iso);
    const got = {
      dinapitu: k.dinapitu, pasaran: k.pasaran, wuku: k.wuku, dina: k.tanggal.dina,
      wulan: k.tanggal.wulan, aj: k.tanggal.tahun, taun: k.tanggal.taun,
      windu: k.tanggal.windu, lambang: k.tanggal.lambang, kurup: k.tanggal.kurup
    };
    const { iso, ...harapan } = g;
    assert.deepEqual(got, harapan, iso);
  }
});

test(`regresi Yogyakarta: ${golden.jogja.length} tanggal`, () => {
  for (const g of golden.jogja) {
    const k = kalenderJawa(g.iso, { jogja: true });
    assert.deepEqual(
      { dina: k.tanggal.dina, wulan: k.tanggal.wulan, aj: k.tanggal.tahun, taun: k.tanggal.taun, kurup: k.tanggal.kurup },
      { dina: g.dina, wulan: g.wulan, aj: g.aj, taun: g.taun, kurup: g.kurup }, g.iso);
  }
});

// --- batas dan masukan -------------------------------------------------------------------

test('sebelum 8 Juli 1633: kalender Jawa menolak, weton/wuku tetap dihitung', () => {
  assert.throws(() => kalenderJawa('1633-07-07'), RangeError);
  assert.equal(weton('1633-07-07').weton, 'Kamis Kliwon'); // sehari sebelum Jumat Legi
});

test('sesudah 25 Agustus 2052: ditandai spekulatif', () => {
  assert.equal(kalenderJawa('2052-08-25').spekulatif, false);
  assert.equal(kalenderJawa('2052-08-26').spekulatif, true);
});

test('bentuk masukan: string, Date lokal, array, objek', () => {
  const rujukan = weton('1975-04-26').weton;
  assert.equal(weton(new Date(1975, 3, 26)).weton, rujukan);
  assert.equal(weton([1975, 4, 26]).weton, rujukan);
  assert.equal(weton({ tahun: 1975, bulan: 4, hari: 26 }).weton, rujukan);
  assert.equal(weton({ year: 1975, month: 4, day: 26 }).weton, rujukan);
});

test('masukan tidak valid ditolak', () => {
  assert.throws(() => weton('26-04-1975'), TypeError);
  assert.throws(() => weton('2021-02-30'), RangeError);
  assert.throws(() => weton('2021-13-01'), RangeError);
  assert.throws(() => weton(new Date('x')), TypeError);
  assert.throws(() => weton(null), TypeError);
  assert.equal(weton('2000-02-29').weton, 'Selasa Kliwon');
  assert.throws(() => weton('1900-02-29'), RangeError); // 1900 bukan tahun kabisat
});

test('wuku(): nomor 1–30', () => {
  assert.deepEqual(wuku('1975-04-26'), { wuku: 'Kuningan', nomorWuku: 12 });
});

// --- kasus terbuka: selisih satu hari dengan research-system-javanese-profile (lihat README, "Selisih satu hari") ----------------------
// Tes ini MENGUNCI keluaran mesin saat ini supaya mudah dikoreksi setelah kalender Kraton tersedia. Bila koreksi dilakukan,
// ubah nilai `mesin` menjadi nilai Kraton dan hapus catatan kasus terbuka di README.
test('kasus terbuka: 1 Sura 1956-1960 menurut mesin (rsjp: 1957 = 2023-07-19, 1959 = 2025-06-27)', () => {
  const awal = (tahun, dari) => {
    for (let n = nomorHari(dari); n < nomorHari(dari) + 400; n++) {
      const k = kalenderJawa(isoDariNomor(n));
      if (k.tanggal.dina === 1 && k.tanggal.wulan === 'Sura' && k.tanggal.tahun === tahun) return isoDariNomor(n);
    }
  };
  const mesin = { 1956: '2022-07-30', 1957: '2023-07-20', 1958: '2024-07-08', 1959: '2025-06-28', 1960: '2026-06-17' };
  const dari = { 1956: '2022-06-01', 1957: '2023-06-01', 1958: '2024-06-01', 1959: '2025-06-01', 1960: '2026-06-01' };
  for (const [t, iso] of Object.entries(mesin)) assert.equal(awal(+t, dari[t]), iso, `1 Sura ${t}`);
  // weton tetap sama dengan pembanding pada 1 Sura versi rsjp (19 Juli 2023 = Rabu Legi, 27 Juni 2025 = Jumat Kliwon)
  assert.equal(weton('2023-07-19').weton, 'Rabu Legi');
  assert.equal(weton('2025-06-27').weton, 'Jumat Kliwon');
});
