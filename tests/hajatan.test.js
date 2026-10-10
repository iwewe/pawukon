import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hariTarub, tingkeb, cariTingkeb, tambahBulan, jadwalKehamilan, saatBayiLahir, namaBayi, jadwalBayi, aksaraSemua,
  kalenderJawa, weton, nomorHari, isoDariNomor,
  saatAgung, saatAgungDi, hariMenurutJam, jamDihindari, saat12, saat12Di, saatBintang, jamSialBaik, saatMalaikat,
  saatPerkara, saatNikah, suhara, akadTigaJenis, tinjauBepergian, pindahKediaman, menghadapPejabat
} from '../src/index.js';
import {
  TARUB_NEPTU, TARUB_TANGGAL_5, TARUB_TANGGAL_7, BAYI_LAHIR_JAM, KEHAMILAN, JADWAL_BAYI
} from '../src/data/hajatan.js';
import { JAM_MULAI } from '../src/data/rumah.js';

const ARAH = new Set(['baik', 'buruk', 'netral']);

function cari(syarat, dari = '2026-01-01', maks = 900) {
  const n0 = nomorHari(dari);
  for (let i = 0; i < maks; i++) {
    const iso = isoDariNomor(n0 + i);
    if (syarat(kalenderJawa(iso), iso)) return iso;
  }
  throw new Error('tanggal tidak ketemu');
}

// --- data -------------------------------------------------------------------------------------------------------------------

test('bab 39: jumlah neptu 7-18 lengkap, berulang tiap 6; contoh kitab Jumat Pon = 13 = baik', () => {
  assert.deepEqual(Object.keys(TARUB_NEPTU.tabel).map(Number), [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
  for (let n = 7; n <= 12; n++) assert.deepEqual(TARUB_NEPTU.tabel[n], TARUB_NEPTU.tabel[n + 6]);
  const iso = cari(k => k.weton === 'Jumat Pon');
  const r = hariTarub(iso).metode.bab39;
  assert.deepEqual([r.jumlahNeptu, r.arah], [13, 'baik']);
});

test('bab 40: tanggal 1-30 tepat sekali, kelompok = (tanggal - 1) mod 5; tanggal baik = catatan kitab', () => {
  const semua = TARUB_TANGGAL_5.tabel.flatMap(g => g.tanggal).sort((a, b) => a - b);
  assert.deepEqual(semua, Array.from({ length: 30 }, (_, i) => i + 1));
  TARUB_TANGGAL_5.tabel.forEach((g, i) => g.tanggal.forEach(d => assert.equal((d - 1) % 5, i, `${g.nama} ${d}`)));
  const baik = TARUB_TANGGAL_5.tabel.filter(g => g.arah === 'baik').flatMap(g => g.tanggal);
  assert.deepEqual(baik, TARUB_TANGGAL_5.tanggalBaik);
});

test('bab 41: tanggal 1-30 tepat sekali, kelompok = (tanggal - 1) mod 7; baik hanya dua baris Rahayu', () => {
  const semua = TARUB_TANGGAL_7.tabel.flatMap(g => g.tanggal).sort((a, b) => a - b);
  assert.deepEqual(semua, Array.from({ length: 30 }, (_, i) => i + 1));
  TARUB_TANGGAL_7.tabel.forEach((g, i) => g.tanggal.forEach(d => assert.equal((d - 1) % 7, i, `${g.nama} ${d}`)));
  assert.deepEqual(TARUB_TANGGAL_7.tabel.filter(g => g.arah === 'baik').map(g => g.nama), ['Rahayu, senang', 'Rahayu, tenteram']);
});

test('bab 57 dan bab 173: tabel jam sama, kecuali dua angka ketiga yang tercatat', () => {
  const beda = [];
  for (const [hari, jam] of Object.entries(BAYI_LAHIR_JAM.tabel)) {
    assert.equal(jam.length, 5, hari);
    jam.forEach((h, i) => { if (h !== JAM_MULAI[hari][i]) beda.push([hari, i, h, JAM_MULAI[hari][i]]); });
  }
  assert.deepEqual(beda, [['Rabu', 2, 12, 11], ['Sabtu', 2, 11, 12]]);
  assert.ok(BAYI_LAHIR_JAM.catatanBanding);
});

test('bab 55: sembilan bulan, bulan ganjil mendeking', () => {
  assert.deepEqual(KEHAMILAN.bulan.map(b => b.bulan), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(KEHAMILAN.mendeking, [3, 5, 7, 9]);
});

// --- tarub -------------------------------------------------------------------------------------------------------------------------

test('hariTarub: tanggal Jawa memilih kelompok; ringkasan = 3; bergantung tanggal Jawa', () => {
  const iso = cari(k => k.tanggal.dina === 9); // bab 40: (9-1)%5 = 3 -> Selamat; bab 41: (9-1)%7 = 1 -> Siluman pria
  const r = hariTarub(iso);
  assert.equal(r.metode.bab40.nama, 'Selamat');
  assert.equal(r.metode.bab40.arah, 'baik');
  assert.equal(r.metode.bab41.nama, 'Siluman pria');
  assert.equal(r.metode.bab41.arah, 'buruk');
  assert.equal(r.metode.bab40.bergantungTanggalJawa, true);
  assert.equal(r.ringkasan.baik + r.ringkasan.buruk + r.ringkasan.netral, 3);
  assert.match(r.saat, /saatNikah/);
});

// --- tingkeb dan kehamilan -------------------------------------------------------------------------------------------------------

test('tingkeb: Rabu atau Sabtu dan tanggal Jawa ganjil < 15', () => {
  const sah = cari(k => k.hari === 'Rabu' && k.tanggal.dina === 7);
  assert.equal(tingkeb(sah).memenuhi, true);
  const sabtu = cari(k => k.hari === 'Sabtu' && k.tanggal.dina === 13);
  assert.equal(tingkeb(sabtu).memenuhi, true);
  const genap = cari(k => k.hari === 'Rabu' && k.tanggal.dina === 8);
  assert.deepEqual([tingkeb(genap).hariOk, tingkeb(genap).tanggalOk], [true, false]);
  const lewat = cari(k => k.hari === 'Sabtu' && k.tanggal.dina === 15);
  assert.equal(tingkeb(lewat).tanggalOk, false);
  const senin = cari(k => k.hari === 'Senin' && k.tanggal.dina === 7);
  assert.deepEqual([tingkeb(senin).hariOk, tingkeb(senin).tanggalOk], [false, true]);
});

test('cariTingkeb: setiap hasil memenuhi aturan dan hanya Rabu/Sabtu; ada hasil dalam setahun', () => {
  const hasil = cariTingkeb('2026-01-01', 365);
  assert.ok(hasil.length >= 10);
  for (const iso of hasil) {
    assert.equal(tingkeb(iso).memenuhi, true, iso);
    assert.ok(['Rabu', 'Sabtu'].includes(weton(iso).hari), iso);
  }
  assert.deepEqual(cariTingkeb('2026-01-01', 0), []);
});

test('tambahBulan: pemangkasan akhir bulan, tahun kabisat, lintas tahun', () => {
  assert.equal(tambahBulan('2026-01-31', 1), '2026-02-28');
  assert.equal(tambahBulan('2024-01-31', 1), '2024-02-29');
  assert.equal(tambahBulan('2026-10-10', 3), '2027-01-10');
  assert.equal(tambahBulan('2026-10-10', 12), '2027-10-10');
  assert.equal(tambahBulan('2024-02-29', 12), '2025-02-28');
  assert.equal(tambahBulan('2026-10-10', 0), '2026-10-10');
});

test('jadwalKehamilan: 9 bulan, mendeking pada ganjil, kandidat tingkeb semuanya memenuhi', () => {
  const r = jadwalKehamilan('2026-01-15');
  assert.equal(r.bulan.length, 9);
  assert.deepEqual(r.bulan.filter(b => b.mendeking).map(b => b.bulan), [3, 5, 7, 9]);
  assert.equal(r.bulan[6].masehi, '2026-08-15');
  assert.equal(r.tingkeb.tanggalBulanKe7, '2026-08-15');
  for (const iso of r.tingkeb.kandidat) assert.equal(tingkeb(iso).memenuhi, true);
  assert.ok(r.asumsi && r.makna);
});

// --- bayi ---------------------------------------------------------------------------------------------------------------------------

test('saatBayiLahir: jam 12-an berlaku siang dan malam', () => {
  const minggu = cari(k => k.hari === 'Minggu');
  const r = saatBayiLahir(minggu);
  assert.deepEqual(r.jam12, [6, 7, 11, 1, 5]);
  assert.deepEqual(r.jam24, [1, 5, 6, 7, 11, 13, 17, 18, 19, 23]);
  assert.equal(saatBayiLahir(minggu, 6.5).baik, true);
  assert.equal(saatBayiLahir(minggu, 18.2).baik, true);
  assert.equal(saatBayiLahir(minggu, 8).baik, false);
  const selasa = cari(k => k.hari === 'Selasa'); // jam 12 = 00 dan 12
  assert.deepEqual(saatBayiLahir(selasa, 0.5).baik, true);
  assert.deepEqual(saatBayiLahir(selasa, 12).baik, true);
  assert.throws(() => saatBayiLahir(minggu, 24), RangeError);
});

test('aksaraSemua: contoh kitab Sukirna = sa ka na; kaidah sandhangan', () => {
  assert.deepEqual(aksaraSemua('Sukirna'), ['sa', 'ka', 'na']);   // layar (r) tidak dihitung
  assert.deepEqual(aksaraSemua('Surya'), ['sa', 'ya']);
  assert.deepEqual(aksaraSemua('Mahesa'), ['ma', 'ha', 'sa']);     // h antarvokal = aksara ha
  assert.deepEqual(aksaraSemua('Karangnangka'), ['ka', 'ra', 'na', 'ka']); // cecak (ng) tidak dihitung
  assert.deepEqual(aksaraSemua('Kenanga'), ['ka', 'na', 'nga']);
  assert.deepEqual(aksaraSemua('Aisyah'), ['ha', 'ha', 'sa']);
  assert.deepEqual(aksaraSemua('Budi Santoso'), ['ba', 'da', 'sa', 'na', 'ta', 'sa']);
  assert.deepEqual(aksaraSemua(['ha', 'na']), ['ha', 'na']);
  assert.throws(() => aksaraSemua(['xx']), RangeError);
  assert.throws(() => aksaraSemua('  '), RangeError);
});

test('namaBayi: contoh kitab Kamis Pon + Sukirna = 15 + 15 = 30, tanpa sisa', () => {
  const iso = cari(k => k.weton === 'Kamis Pon');
  const r = namaBayi(iso, 'Sukirna');
  assert.deepEqual([r.neptuWeton, r.neptuHuruf, r.jumlah, r.sisa], [15, 15, 30, 0]);
  assert.equal(r.cocok, true);
  assert.equal(r.arah, 'baik');
  const lain = namaBayi(iso, 'Sukirno'); // sa ka na + ... tetap sa ka na; ganti satu huruf
  assert.equal(lain.cocok, true);
  const tak = namaBayi(iso, 'Budi'); // ba 18 + da 6 = 24 + 15 = 39
  assert.deepEqual([tak.jumlah, tak.sisa, tak.cocok, tak.arah], [39, 4, false, 'netral']);
  assert.equal(namaBayi(iso, ['sa', 'ka', 'na']).cocok, true);
});

test('jadwalBayi: tahap menurut hari, weton selapan = weton lahir, sepasar = pasaran lahir', () => {
  const r = jadwalBayi('2026-10-10');
  assert.deepEqual(r.tahap.map(t => t.hariKe), [5, 35, 70, 105, 140, 175, 210, 245]);
  assert.deepEqual(r.tahap.map(t => t.hariKe), JADWAL_BAYI.hari.map(h => h.hari));
  assert.equal(r.lahir.weton, 'Sabtu Kliwon');
  assert.equal(r.tahap[0].masehi, '2026-10-15');
  assert.equal(r.tahap[0].weton, 'Kamis Kliwon'); // pasaran sama
  for (const t of r.tahap.slice(1)) assert.equal(t.weton, r.lahir.weton, `hari ke-${t.hariKe}`);
  assert.equal(r.tahap[7].masehi, isoDariNomor(nomorHari('2026-10-10') + 245));
  assert.equal(r.rentang.length, 3);
  for (const g of r.rentang) { assert.ok(g.dari < g.sampai); assert.ok(g.dari > '2026-10-10'); }
  assert.equal(r.rentang[0].dari, '2028-04-10'); // 18 bulan
  assert.equal(r.rentang[0].sampai, '2028-10-10'); // 24 bulan
  assert.equal(r.rentang[2].dari, '2039-10-10'); // 13 tahun
});

// --- perilaku umum --------------------------------------------------------------------------------------------------------------------

test('semua fungsi per-tanggal memuat masehi baku (regresi: weton() tidak memuatnya)', () => {
  const iso = '2026-10-10';
  const fungsi = {
    saatAgung, saat12, saatBintang, jamSialBaik, saatMalaikat, saatPerkara, saatNikah, suhara, akadTigaJenis,
    jamDihindari, tinjauBepergian, pindahKediaman, menghadapPejabat, hariTarub, tingkeb, saatBayiLahir,
    namaBayi: (x) => namaBayi(x, 'Sukirna')
  };
  for (const [nama, f] of Object.entries(fungsi)) assert.equal(f(iso).masehi, iso, nama);
  assert.equal(saatAgungDi(iso, 8).masehi, iso);
  assert.equal(hariMenurutJam(iso, 8).masehi, iso);
  assert.equal(saat12Di(iso, 8).masehi, iso);
  // masukan non-baku tetap dinormalisasi
  assert.equal(saatAgung('2026-10-10').masehi, '2026-10-10');
});

test('600 hari berturut-turut: fungsi hajatan tanpa galat', () => {
  const n0 = nomorHari('2025-01-01');
  for (let i = 0; i < 600; i++) {
    const iso = isoDariNomor(n0 + i);
    const t = hariTarub(iso);
    for (const m of Object.values(t.metode)) { assert.ok(ARAH.has(m.arah), iso); assert.ok(m.sumber.bab); }
    assert.equal(typeof tingkeb(iso).memenuhi, 'boolean');
    assert.equal(saatBayiLahir(iso).jam24.length, 10);
    assert.ok(namaBayi(iso, 'Ayu Lestari').sisa >= 0);
  }
});
