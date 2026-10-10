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

test('contoh terbit di weton.md dan artikel (tiga dari empat; yang keempat sengaja berbeda, lihat berikutnya; ejaan windu Sangara menurut Keraton, weton.md: Sêngara)', () => {
  const cases = [
    ['1968-12-03', 'Selasa Kliwon Julungwangi 13 Pasa 1900 AJ Ehe Adi Langkir Salasiyah (Asapon)'],
    ['2020-10-01', 'Kemis Kliwon Langkir 13 Sapar 1954 AJ Jimakir Sangara Langkir Salasiyah (Asapon)'],
    ['2020-10-31', 'Setu Kliwon Kuruwelut 14 Mulud 1954 AJ Jimakir Sangara Langkir Salasiyah (Asapon)'],
  ];
  for (const [tgl, harapan] of cases) {
    assert.equal(kalenderJawa(tgl).teks, harapan, tgl);
  }
});

test('penyimpangan sengaja dari weton.md: windu = blok 8 tahun Jawa, bukan blok 2835 hari', () => {
  // weton.md menerbitkan "Slasa Pon Kulawu 1 Sura 1955 AJ Alip Sêngara Langkir ..." untuk 10 Agustus 2021 karena weton.m menghitung
  // windu dari blok 2835 hari sejak epoch. Di sini windu mengikuti tahun (Alip membuka windu baru), seperti tesis Marhamah (2022),
  // research-system-javanese-profile, dan komentar weton.m sendiri ("WINDU = 8 lunar years"): 53 dari 153.086 hari berbeda.
  assert.equal(kalenderJawa('2021-08-10').teks, 'Selasa Pon Kulawu 1 Sura 1955 AJ Alip Sancaya Kulawu Salasiyah (Asapon) [Siji Sura]');
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

// --- windu dan lambang mengikuti blok 8 tahun Jawa (temuan audit paparan_ilmiah_pawukon.md, bab 8) ---------------------------------------
test('windu dan lambang berganti tepat pada 1 Sura tahun Alip (bukan blok 2835 hari)', () => {
  const NAMA = ['Kuntara', 'Sangara', 'Sancaya', 'Adi'];
  const LAMBANG_ = ['Kulawu', 'Langkir'];
  const kal = (iso) => kalenderJawa(iso).tanggal;
  // contoh audit: 1-2 Sura Alip 1955 sudah Sancaya-Kulawu (sebelumnya masih Sangara-Langkir sampai 3 Sura)
  for (const [iso, windu, lambang] of [['2021-08-09', 'Sangara', 'Langkir'], ['2021-08-10', 'Sancaya', 'Kulawu'], ['2021-08-11', 'Sancaya', 'Kulawu'], ['2021-08-12', 'Sancaya', 'Kulawu']]) {
    assert.deepEqual([kal(iso).windu, kal(iso).lambang], [windu, lambang], iso);
  }
  // batas awal: 30 Besar Jimakir 1562 masih Kuntara-Kulawu; 1 Sura Alip 1563 mulai Sangara-Langkir
  assert.deepEqual([kal('1641-04-11').dina, kal('1641-04-11').windu, kal('1641-04-11').lambang], [30, 'Kuntara', 'Kulawu']);
  assert.deepEqual([kal('1641-04-12').dina, kal('1641-04-12').windu, kal('1641-04-12').lambang], [1, 'Sangara', 'Langkir']);
  // seluruh 153.086 hari: label = blok 8 tahun Jawa; urutan Kuntara-Kulawu, Sangara-Langkir, Sancaya-Kulawu, Adi-Langkir
  let hari = 0;
  for (let n = nomorHari('1633-07-08'); n <= nomorHari('2052-08-25'); n++) {
    const t = kalenderJawa(isoDariNomor(n)).tanggal;
    const w = Math.floor((t.tahun - 1555) / 8);
    assert.deepEqual([t.windu, t.lambang], [NAMA[w % 4], LAMBANG_[w % 2]], isoDariNomor(n));
    hari++;
  }
  assert.equal(hari, 153086);
});
