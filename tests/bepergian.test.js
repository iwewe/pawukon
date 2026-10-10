import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tinjauBepergian, pindahKediaman, menghadapPejabat, kalenderJawa, nomorHari, isoDariNomor, HARI, PASARAN, WULAN
} from '../src/index.js';
import {
  URUTAN_MINGGU, NAGA_HARI, NAGA_NEPTU, NAGA_BULAN, NAGA_TAHUN, JATINGARANG, NAGA_SATU_TEMPAT, NAGA_BAGIAN,
  RIJALOLAH_TANGGAL, BEPERGIAN_JAUH, NAAS_HARI, BAYANGAN, SAAT_NEPTU, PINDAH_KEDIAMAN, ARAH_PINDAH_DILARANG,
  MENGHADAP_PEJABAT, HIDUP_MATI_HARI, ARAH_NAFKAH_NEPTU, ARAH_WETON
} from '../src/data/bepergian.js';

const NEPTU_RENTANG = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const EMPAT = ['Utara', 'Timur', 'Selatan', 'Barat'];

/** Tanggal Masehi pertama sejak `dari` yang memenuhi syarat. */
function cari(syarat, dari = '2026-01-01', maks = 900) {
  const n0 = nomorHari(dari);
  for (let i = 0; i < maks; i++) {
    const iso = isoDariNomor(n0 + i);
    if (syarat(kalenderJawa(iso), iso)) return iso;
  }
  throw new Error('tanggal tidak ketemu');
}

// --- kelengkapan dan uji silang antar tabel kitab ---------------------------------------------------------------------

test('bab 130: tujuh hari dan lima pasaran lengkap; Minggu dan Kamis naga hari = rijalolah (catatan kitab)', () => {
  assert.deepEqual(Object.keys(NAGA_HARI.naga).sort(), [...URUTAN_MINGGU].sort());
  assert.deepEqual(Object.keys(NAGA_HARI.rijalolah).sort(), [...URUTAN_MINGGU].sort());
  assert.deepEqual(Object.keys(NAGA_HARI.pekan).sort(), [...PASARAN].sort());
  for (const h of ['Minggu', 'Kamis']) assert.ok(NAGA_HARI.rijalolah[h].every(a => NAGA_HARI.naga[h].includes(a)), h);
  // selain itu, naga hari dan rijalolah berbeda tempat
  for (const h of ['Senin', 'Selasa', 'Rabu', 'Jumat', 'Sabtu']) {
    assert.ok(NAGA_HARI.rijalolah[h].every(a => !NAGA_HARI.naga[h].includes(a)), h);
  }
});

test('bab 131: jumlah neptu 7-18 semua terisi dengan arah sah', () => {
  assert.deepEqual(Object.keys(NAGA_NEPTU.tabel).map(Number), NEPTU_RENTANG);
  for (const a of Object.values(NAGA_NEPTU.tabel)) assert.ok(['Timur Laut', 'Barat Laut', 'Barat Daya', 'Tenggara', 'Timur'].includes(a), a);
});

test('bab 132-134: 12 bulan lengkap; empat arah pokok sama banyak (3 bulan per arah)', () => {
  for (const [nama, t] of Object.entries({ NAGA_BULAN, NAGA_TAHUN, JATINGARANG })) {
    assert.deepEqual(Object.keys(t.tabel).sort(), [...WULAN].sort(), nama);
    for (const a of EMPAT) assert.equal(Object.values(t.tabel).filter(x => x === a).length, 3, `${nama} ${a}`);
  }
});

test('bab 135 (uji silang): naga tahun dan jatingarang sama persis pada empat bulan yang disebut kitab', () => {
  const sama = WULAN.filter(b => NAGA_TAHUN.tabel[b] === JATINGARANG.tabel[b]).sort();
  assert.deepEqual(sama, Object.keys(NAGA_SATU_TEMPAT.tabel).sort());
  for (const [b, a] of Object.entries(NAGA_SATU_TEMPAT.tabel)) {
    assert.equal(NAGA_TAHUN.tabel[b], a, b);
    assert.equal(JATINGARANG.tabel[b], a, b);
  }
});

test('bab 136: tiap kelompok bulan memakai empat arah pokok sekali; tiap bagian naga berputar melewati empat arah', () => {
  const semuaBulan = NAGA_BAGIAN.kelompok.flatMap(g => g.bulan);
  assert.deepEqual([...semuaBulan].sort(), [...WULAN].sort());
  for (const g of NAGA_BAGIAN.kelompok) assert.deepEqual(Object.values(g.arah).sort(), [...EMPAT].sort());
  for (const bagian of ['Kepala', 'Ekor', 'Punggung', 'Perut']) {
    assert.deepEqual(NAGA_BAGIAN.kelompok.map(g => g.arah[bagian]).sort(), [...EMPAT].sort(), bagian);
  }
  assert.deepEqual(NAGA_BAGIAN.makna, { Kepala: 'buruk', Perut: 'buruk', Ekor: 'baik', Punggung: 'baik' });
});

test('bab 140: tanggal 1-30 tercakup tepat sekali; sepuluh kelompok', () => {
  assert.equal(RIJALOLAH_TANGGAL.tabel.length, 10);
  const semua = RIJALOLAH_TANGGAL.tabel.flatMap(t => t.tanggal).sort((a, b) => a - b);
  assert.deepEqual(semua, Array.from({ length: 30 }, (_, i) => i + 1));
  for (const t of RIJALOLAH_TANGGAL.tabel) t.tanggal.forEach(d => assert.equal(d % 10, t.tanggal[0] % 10));
});

test('bab 141: jumlah neptu 7-18 lengkap; contoh kitab 13 = Gajah, 9 = Baya', () => {
  assert.deepEqual(Object.keys(BEPERGIAN_JAUH.arahKala).map(Number), NEPTU_RENTANG);
  for (const c of BEPERGIAN_JAUH.contohKitab) {
    assert.equal(BEPERGIAN_JAUH.nama[c.jumlah % 5 || 5], c.nama);
  }
  assert.deepEqual(BEPERGIAN_JAUH.baik, ['Gajah', 'Ratu']);
});

test('bab 143-145: tujuh hari dan jumlah neptu 7-18 lengkap', () => {
  assert.deepEqual(Object.keys(NAAS_HARI.tabel).sort(), [...URUTAN_MINGGU].sort());
  assert.deepEqual(Object.keys(BAYANGAN.tabel).sort(), [...URUTAN_MINGGU].sort());
  assert.deepEqual(Object.keys(SAAT_NEPTU.tabel).map(Number), NEPTU_RENTANG);
  for (const t of Object.values(SAAT_NEPTU.tabel)) {
    assert.ok(t.nama && t.saat.length >= 1);
    for (const s of t.saat) assert.ok(s.jam === null || (s.jam[0] < s.jam[1]));
  }
});

test('bab 152: 12 jumlah neptu terisi dengan empat arah pokok', () => {
  assert.deepEqual(Object.keys(ARAH_PINDAH_DILARANG.tabel).map(Number), NEPTU_RENTANG);
  for (const a of Object.values(ARAH_PINDAH_DILARANG.tabel)) assert.ok(EMPAT.includes(a), a);
});

test('bab 153: tanggal 1-30 tercakup tepat sekali dengan pola mod 4', () => {
  const semua = MENGHADAP_PEJABAT.tabel.flatMap(t => t.tanggal).sort((a, b) => a - b);
  assert.deepEqual(semua, Array.from({ length: 30 }, (_, i) => i + 1));
  const sisa = { Sri: 1, Sareh: 2, Susah: 3, Duka: 0 };
  for (const t of MENGHADAP_PEJABAT.tabel) t.tanggal.forEach(d => assert.equal(d % 4, sisa[t.nama], `${t.nama} ${d}`));
});

test('bab 154: tiap hari hidup, dilarang, dan mati saling lepas dan menutup empat arah pokok', () => {
  for (const [hari, t] of Object.entries(HIDUP_MATI_HARI.tabel)) {
    const semua = [...t.hidup, ...t.dilarang, ...t.mati];
    assert.deepEqual([...semua].sort(), [...EMPAT].sort(), hari);
  }
  assert.deepEqual(HIDUP_MATI_HARI.tabel.Minggu.hidup, ['Selatan', 'Timur']); // catatan kitab: berdagang di hari Ahad ke selatan/timur
});

test('bab 155: tiap baris berisi Mati/Sakit/Hidup/Selamat sekali, berulang tiap 4 jumlah; contoh kitab', () => {
  const t = ARAH_NAFKAH_NEPTU.tabel;
  for (const n of NEPTU_RENTANG) {
    assert.deepEqual(Object.values(t[n]).sort(), ['Hidup', 'Mati', 'Sakit', 'Selamat'], `baris ${n}`);
    if (n + 4 <= 18) assert.deepEqual(t[n + 4], t[n], `siklus ${n}`);
  }
  for (const a of EMPAT) assert.deepEqual([7, 8, 9, 10].map(n => t[n][a]).sort(), ['Hidup', 'Mati', 'Sakit', 'Selamat'], a);
  const c = ARAH_NAFKAH_NEPTU.contohKitab;
  assert.equal(t[c.jumlah][c.arah], 'Hidup');
  // sa'at Sabtu Pahing (9 + 9 = 18) -> Utara hidup
  const iso = cari(k => k.weton === 'Sabtu Pahing');
  const r = tinjauBepergian(iso, { tujuan: 'Utara' });
  assert.ok(r.penilaianTujuan.baik.some(x => x.jenis === 'nafkah menurut neptu: hidup'));
});

test('bab 156: 33 weton tepat sekali; anomali kitab (Rabu Kliwon dua kali, Rabu Legi tidak ada) tercatat', () => {
  const hitung = {};
  for (const daftar of Object.values(ARAH_WETON.tabel)) for (const w of daftar) hitung[w] = (hitung[w] ?? 0) + 1;
  const semua = HARI.flatMap(h => PASARAN.map(p => `${h} ${p}`));
  assert.equal(semua.length, 35);
  for (const w of Object.keys(hitung)) assert.ok(semua.includes(w), `weton tak dikenal: ${w}`);
  const bukanSatu = semua.filter(w => hitung[w] !== 1);
  assert.deepEqual(bukanSatu.sort(), ['Rabu Kliwon', 'Rabu Legi']);
  assert.equal(hitung['Rabu Kliwon'], 2);
  assert.equal(hitung['Rabu Legi'] ?? 0, 0);
  assert.ok(ARAH_WETON.anomali);
  assert.deepEqual(Object.values(ARAH_WETON.tabel).map(d => d.length), [11, 6, 6, 12]);
});

test('bab 151: urutan enam nama lengkap; arah baik/buruk terisi', () => {
  assert.deepEqual(Object.keys(PINDAH_KEDIAMAN.nama).map(Number), [1, 2, 3, 4, 5, 6]);
  for (const n of Object.values(PINDAH_KEDIAMAN.nama)) assert.ok(['baik', 'buruk'].includes(n.arah));
});

// --- perilaku ------------------------------------------------------------------------------------------------------------

test('tinjauBepergian untuk 10 Oktober 2026 (Sabtu Kliwon, neptu 17, Bakdamulud)', () => {
  const r = tinjauBepergian('2026-10-10', { tujuan: 'Tenggara' });
  assert.equal(r.weton, 'Sabtu Kliwon');
  assert.equal(r.jumlahNeptu, 17);
  assert.equal(r.tanggalJawa.wulan, 'Bakdamulud');
  const jenis = (j) => r.arah.filter(x => x.jenis === j).map(x => x.arah);
  assert.deepEqual(jenis('naga hari'), ['Tenggara']); // Sabtu
  assert.deepEqual(jenis('rijalolah hari'), ['Barat Daya']);
  assert.deepEqual(jenis('naga pekan'), ['Tengah']); // Kliwon
  assert.deepEqual(jenis('naga neptu'), ['Timur Laut']); // 17
  assert.deepEqual(jenis('naga bulan'), ['Utara']);
  assert.deepEqual(jenis('naga tahun'), ['Timur']);
  assert.deepEqual(jenis('jatingarang'), ['Selatan']);
  assert.deepEqual(jenis('kala'), ['Tenggara']); // 17
  assert.deepEqual(jenis('dilarang untuk pindah'), ['Barat']); // 17
  assert.deepEqual(jenis('hari hidup'), ['Barat']); // Sabtu
  assert.equal(r.waktu.kalaBaya.nama, 'Watu'); // 17 mod 5 = 2
  assert.equal(r.waktu.kalaBaya.baik, false);
  assert.equal(r.waktu.saat.nama, 'Bumi');
  assert.equal(r.waktu.bayanganKaki.panjang, 12);
  // tujuan Tenggara: naga hari + kala = dua larangan, tanpa yang baik
  assert.equal(r.penilaianTujuan.ringkasan.buruk, 2);
  assert.equal(r.penilaianTujuan.ringkasan.baik, 0);
  assert.equal(r.waktu.anomaliCetak, undefined);
});

test('tinjauBepergian: temuan bergantung bulan ditandai; temuan hari/neptu tidak', () => {
  const r = tinjauBepergian('2026-10-10');
  for (const x of r.arah) {
    const bulan = /naga (bulan|tahun)|jatingarang|bagian naga|rijalolah tanggal|sekaligus/.test(x.jenis);
    assert.equal(x.bergantungTanggalJawa, bulan, x.jenis);
  }
  assert.equal(r.penilaianTujuan, undefined);
});

test('anomali cetak bab 156 muncul untuk Rabu Kliwon dan Rabu Legi saja', () => {
  const rk = cari(k => k.weton === 'Rabu Kliwon');
  const rl = cari(k => k.weton === 'Rabu Legi');
  const lain = cari(k => k.weton === 'Rabu Pon');
  assert.ok(tinjauBepergian(rk).waktu.anomaliCetak);
  assert.ok(tinjauBepergian(rl).waktu.anomaliCetak);
  assert.equal(tinjauBepergian(lain).waktu.anomaliCetak, undefined);
  // Rabu Kliwon dianjurkan ke dua arah menurut cetakan (Barat dan Selatan); Rabu Legi tidak punya arah dari bab 156
  const arahRk = tinjauBepergian(rk).arah.filter(x => x.jenis === 'arah berjualan menurut weton').map(x => x.arah).sort();
  assert.deepEqual(arahRk, ['Barat', 'Selatan']);
  assert.equal(tinjauBepergian(rl).arah.filter(x => x.jenis === 'arah berjualan menurut weton').length, 0);
});

test('pindahKediaman: Sabtu Kliwon = 2 + 1 = 3 = Satryapinayungan', () => {
  const r = pindahKediaman('2026-10-10');
  assert.equal(r.jumlah, 3);
  assert.equal(r.nomor, 3);
  assert.equal(r.nama, 'Satryapinayungan');
  assert.equal(r.arah, 'baik');
  // jumlah terbesar: Kamis 7 + Wage 5 = 12 -> 12 mod 6 = 0 -> 6
  const kw = cari(k => k.weton === 'Kamis Wage');
  assert.equal(pindahKediaman(kw).jumlah, 12);
  assert.equal(pindahKediaman(kw).nomor, 6);
});

test('menghadapPejabat: tanggal 27 = Susah; tanggal 1 = Sri; tanggal 30 = Sareh', () => {
  const d = (n) => menghadapPejabat(cari(k => k.tanggal.dina === n));
  assert.equal(d(27).nama, 'Susah');
  assert.equal(d(27).arah, 'buruk');
  assert.equal(d(1).nama, 'Sri');
  assert.equal(d(30).nama, 'Sareh');
  assert.equal(d(28).nama, 'Duka');
  assert.equal(d(1).bergantungTanggalJawa, true);
});

test('600 hari berturut-turut: tinjauBepergian tanpa galat, tiap temuan bersumber dan bernilai sah', () => {
  const n0 = nomorHari('2025-01-01');
  for (let i = 0; i < 600; i++) {
    const iso = isoDariNomor(n0 + i);
    const r = tinjauBepergian(iso);
    assert.ok(r.arah.length >= 20, iso);
    for (const x of r.arah) {
      assert.ok(x.sumber.bab && x.sumber.halaman.length, `${iso} ${x.jenis}`);
      assert.ok(['baik', 'buruk', 'netral'].includes(x.nilai), `${iso} ${x.jenis}`);
      assert.ok(x.arah, `${iso} ${x.jenis}`);
    }
    assert.ok(pindahKediaman(iso).nama);
    assert.ok(menghadapPejabat(iso).nama);
  }
});
