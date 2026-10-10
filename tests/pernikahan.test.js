import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aksaraNama, jodohNama, jodohWeton, desaTinggal, nomorHari, isoDariNomor } from '../src/index.js';
import {
  HANACARAKA, NEPTU_AKSARA, JODOH_NAMA_SISA_9, JODOH_NAMA_SISA_7, JODOH_NAMA_SISA_5, KRATON_MULYO,
  JODOH_WETON_SISA_7, JODOH_WETON_SISA_5, JODOH_TANGGAL_SISA_9, JODOH_TANGGAL_SISA_3, TEMPAT_TINGGAL_HURUF
} from '../src/data/pernikahan.js';

const ARAH = new Set(['baik', 'buruk', 'netral']);

// --- data -------------------------------------------------------------------------------------------------------------

test('tiga skema neptu aksara: 20 aksara masing-masing; skema urut = 1..20; nilai positif', () => {
  assert.equal(HANACARAKA.length, 20);
  for (const [skema, d] of Object.entries(NEPTU_AKSARA)) {
    assert.deepEqual(Object.keys(d.nilai), HANACARAKA, skema);
    for (const v of Object.values(d.nilai)) assert.ok(Number.isInteger(v) && v >= 1 && v <= 20, skema);
  }
  assert.deepEqual(Object.values(NEPTU_AKSARA.urut.nilai), Array.from({ length: 20 }, (_, i) => i + 1));
});

test('uji silang neptu aksara dengan contoh hitungan kitab (bab 18 dan 19)', () => {
  const n18 = NEPTU_AKSARA.bab18.nilai;
  assert.deepEqual([n18.sa, n18.ga, n18.ma], [9, 2, 4]); // Sudargo, Satimah
  const n19 = NEPTU_AKSARA.bab19.nilai;
  assert.deepEqual([n19.sa, n19.na, n19.ma, n19.ya], [3, 3, 5, 8]); // Surono, Martiyah
});

test('bab 18: 45 pasangan sisa 1-9 lengkap, arah sah', () => {
  const kunci = [];
  for (let a = 1; a <= 9; a++) for (let b = a; b <= 9; b++) kunci.push(`${a}&${b}`);
  assert.equal(kunci.length, 45);
  assert.deepEqual(Object.keys(JODOH_NAMA_SISA_9.tabel).sort(), [...kunci].sort());
  for (const v of Object.values(JODOH_NAMA_SISA_9.tabel)) { assert.ok(v.makna); assert.ok(ARAH.has(v.arah)); }
});

test('tabel bab 19, 20, 22, 23, 24, 25, 167: nomor lengkap dan arah sah', () => {
  const cek = (tabel, nomor) => {
    assert.deepEqual(Object.keys(tabel).map(Number), nomor);
    for (const v of Object.values(tabel)) { assert.ok(v.nama); assert.ok(ARAH.has(v.arah)); }
  };
  cek(JODOH_NAMA_SISA_7.tabel, [1, 2, 3, 4, 5, 6, 7]);
  cek(JODOH_NAMA_SISA_5.tabel, [1, 2, 3, 4, 5]);
  cek(JODOH_WETON_SISA_7.tabel, [1, 2, 3, 4, 5, 6, 7]);
  cek(JODOH_WETON_SISA_5.tabel, [1, 2, 3, 4, 5]);
  cek(JODOH_TANGGAL_SISA_9.tabel, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  cek(JODOH_TANGGAL_SISA_3.tabel, [1, 2, 3]);
  cek(TEMPAT_TINGGAL_HURUF.tabel, [1, 2, 3, 4, 5]);
  // bab 24: 1,4,7 Wali; 2,5,8 Penghulu; 3,6,9 Pengantin
  for (let n = 1; n <= 9; n++) assert.equal(JODOH_TANGGAL_SISA_9.tabel[n].nama, ['Wali', 'Penghulu', 'Pengantin'][(n - 1) % 3]);
});

test('bab 21: empat garis memuat 20 aksara tepat sekali; aturan kalah berputar', () => {
  const semua = Object.values(KRATON_MULYO.garis).flat().sort();
  assert.deepEqual(semua, [...HANACARAKA].sort());
  for (const g of Object.values(KRATON_MULYO.garis)) assert.equal(g.length, 5);
  assert.deepEqual(Object.keys(KRATON_MULYO.kalahOleh).sort(), ['I', 'II', 'III', 'IV']);
  // satu putaran: I -> IV -> III -> II -> I
  let g = 'I';
  const urut = [];
  for (let i = 0; i < 4; i++) { urut.push(g); g = KRATON_MULYO.kalahOleh[g]; }
  assert.deepEqual(urut, ['I', 'IV', 'III', 'II']);
  assert.equal(g, 'I');
});

// --- alih huruf --------------------------------------------------------------------------------------------------------------

test('aksaraNama: nama contoh kitab dan kaidah umum', () => {
  const ak = (n) => { const r = aksaraNama(n); return [r.depan, r.belakang]; };
  assert.deepEqual(ak('Sudargo'), ['sa', 'ga']);
  assert.deepEqual(ak('Satimah'), ['sa', 'ma']);   // wignyan h diabaikan
  assert.deepEqual(ak('Surono'), ['sa', 'na']);
  assert.deepEqual(ak('Martiyah'), ['ma', 'ya']);
  assert.deepEqual(ak('Marno'), ['ma', 'na']);
  assert.deepEqual(ak('Surajaya'), ['sa', 'ya']);
  assert.deepEqual(ak('Karangnangka'), ['ka', 'ka']);
  assert.deepEqual(ak('Kenang'), ['ka', 'na']);    // cecak (ng) diabaikan
  assert.deepEqual(ak('Agung'), ['ha', 'ga']);     // vokal awal = ha
  assert.deepEqual(ak('Umar'), ['ha', 'ma']);      // layar (r) diabaikan
  assert.deepEqual(ak('Kenanga'), ['ka', 'nga']);  // ng sebagai aksara bila diikuti vokal
  assert.deepEqual(ak('Ngadiman'), ['nga', 'na']);
  assert.deepEqual(ak('Nyoman'), ['nya', 'na']);
  assert.deepEqual(ak('Thomas'), ['tha', 'sa']);
  assert.deepEqual(ak('Djoko Tjipto'), ['ja', 'ta']);
  assert.deepEqual(ak('  budi   santoso '), ['ba', 'sa']);
  assert.deepEqual(ak('Éka'), ['ha', 'ka']);
});

test('aksaraNama: aksara langsung diterima; masukan tak sah ditolak', () => {
  assert.deepEqual(aksaraNama({ depan: 'ha', belakang: 'nya' }).depan, 'ha');
  assert.throws(() => aksaraNama({ depan: 'xa', belakang: 'ha' }), RangeError);
  assert.throws(() => aksaraNama('   '), RangeError);
  assert.throws(() => aksaraNama('123'), RangeError);
});

// --- contoh hitungan kitab ------------------------------------------------------------------------------------------------------

test('bab 18: Sudargo dan Satimah = 2 dan 4 = baik', () => {
  const r = jodohNama('Sudargo', 'Satimah').metode.bab18;
  assert.deepEqual([r.jumlahPria, r.jumlahWanita, r.sisaPria, r.sisaWanita], [11, 13, 2, 4]);
  assert.equal(r.kunci, '2&4');
  assert.equal(r.arah, 'baik');
});

test('bab 19: Surono dan Martiyah = 19, sisa 5 = Pedaringan kebak', () => {
  const r = jodohNama('Surono', 'Martiyah').metode.bab19;
  assert.deepEqual([r.jumlah, r.sisa, r.nama], [19, 5, 'Pedaringan kebak']);
});

test('bab 20: Marno (16) dan Dini (6) = 22, sisa 2 = Lungguh', () => {
  const r = jodohNama('Marno', 'Dini').metode.bab20;
  assert.deepEqual([r.jumlah, r.sisa, r.nama], [22, 2, 'Lungguh']);
});

test('bab 21: segaris = Nunggal Kraton mulyo; tidak segaris menunjuk pihak yang kalah', () => {
  const dua = (a, b) => jodohNama({ depan: a, belakang: a }, { depan: b, belakang: b }).metode.bab21;
  const sama = dua('ha', 'ra'); // contoh kitab, garis I
  assert.equal(sama.arah, 'baik');
  assert.equal(sama.nama, 'Nunggal Kraton mulyo');
  assert.equal(dua('ha', 'ma').kalah, 'pria');     // I kalah oleh IV
  assert.equal(dua('ma', 'ha').kalah, 'wanita');
  assert.equal(dua('ma', 'pa').kalah, 'pria');     // IV kalah oleh III
  assert.equal(dua('da', 'pa').kalah, 'wanita');   // III kalah oleh II
  assert.equal(dua('ha', 'da').kalah, 'wanita');   // II kalah oleh I? pria I, wanita II: II kalah oleh I -> wanita
  assert.equal(dua('ha', 'pa').kalah, null);       // I dan III berhadapan: tidak ditentukan kitab
  assert.ok(dua('ha', 'pa').asumsi);
  assert.equal(dua('ha', 'pa').arah, 'buruk');
});

test('bab 22: contoh kitab jumlah 28 jatuh pada 7 (Lebu katiup angin)', () => {
  const lahir = { hari: 'Sabtu', pasaran: 'Legi', wulan: 'Sura', taun: 'Alip', tanggal: 1 }; // 9 + 5 = 14
  const r = jodohWeton(lahir, lahir).metode.bab22;
  assert.equal(r.jumlah, 28);
  assert.deepEqual(r.kandidat, { bagi10: 8, bagi7: 7 });
  assert.deepEqual([r.pembagi, r.nomor, r.nama], [7, 7, 'Lebu katiup angin']);
  // jumlah kecil: 10 dipakai bila sisa 1-7 (asumsi tercatat)
  const kecil = jodohWeton({ ...lahir, hari: 'Selasa', pasaran: 'Wage' }, { ...lahir, hari: 'Selasa', pasaran: 'Wage' }).metode.bab22; // 7 + 7 = 14
  assert.equal(kecil.jumlah, 14);
  assert.deepEqual([kecil.pembagi, kecil.nomor], [10, 4]);
});

test('bab 23: Minggu Wage + Selasa Legi = 17, sisa 2 = Dana', () => {
  const k = { wulan: 'Sura', taun: 'Alip', tanggal: 1 };
  const r = jodohWeton({ hari: 'Minggu', pasaran: 'Wage', ...k }, { hari: 'Selasa', pasaran: 'Legi', ...k }).metode.bab23;
  assert.deepEqual([r.jumlah, r.sisa, r.nama, r.arah], [17, 2, 'Dana', 'baik']);
});

test('bab 24 dan 25: contoh kitab, jumlah 78: sisa 6 = Pengantin; bagi 3 = Pati', () => {
  const pria = { hari: 'Rabu', pasaran: 'Kliwon', wulan: 'Sura', taun: 'Alip', tanggal: 20 };
  const wanita = { hari: 'Jumat', pasaran: 'Pon', wulan: 'Sapar', taun: 'Wawu', tanggal: 14 };
  const r = jodohWeton(pria, wanita);
  assert.equal(r.metode.bab24.jumlah, 78);
  assert.deepEqual([r.metode.bab24.sisa, r.metode.bab24.nama, r.metode.bab24.arah], [6, 'Pengantin', 'baik']);
  assert.deepEqual([r.metode.bab25.sisa, r.metode.bab25.nama, r.metode.bab25.arah], [3, 'Pati', 'buruk']);
  assert.equal(r.metode.bab24.bergantungTanggalJawa, true);
});

test('bab 167: Surajaya di Karangnangka: depan 13 = Donya, belakang 19 = Pandita', () => {
  const r = desaTinggal('Surajaya', 'Karangnangka');
  assert.deepEqual([r.depan.jumlah, r.depan.sisa, r.depan.nama], [13, 3, 'Donya']);
  assert.deepEqual([r.belakang.jumlah, r.belakang.sisa, r.belakang.nama], [19, 4, 'Pandita']);
  assert.deepEqual(r.ringkasan, { baik: 2, buruk: 0, netral: 0 });
});

// --- perilaku ------------------------------------------------------------------------------------------------------------------

test('jodohWeton dari tanggal Masehi: bentuk hasil dan ringkasan = 4', () => {
  const r = jodohWeton('1975-04-26', '1980-01-01');
  assert.equal(r.suami.weton, 'Sabtu Kliwon');
  assert.ok(r.suami.tanggalJawa >= 1 && r.suami.tanggalJawa <= 30);
  assert.equal(r.ringkasan.baik + r.ringkasan.buruk + r.ringkasan.netral, 4);
  assert.equal(r.spekulatif, false);
  for (const m of Object.values(r.metode)) { assert.ok(ARAH.has(m.arah)); assert.ok(m.sumber.bab); }
});

test('jodohNama: bab 18 simetris; ringkasan = 4; tiap hasil bersumber', () => {
  for (const [a, b] of [['Sudargo', 'Satimah'], ['Agus', 'Siti'], ['Bambang', 'Ayu Wulandari'], ['Eko', 'Nyoman']]) {
    const ab = jodohNama(a, b);
    const ba = jodohNama(b, a);
    assert.equal(ab.metode.bab18.kunci, ba.metode.bab18.kunci);
    assert.equal(ab.ringkasan.baik + ab.ringkasan.buruk + ab.ringkasan.netral, 4);
    for (const m of Object.values(ab.metode)) assert.ok(m.sumber.bab);
  }
});

test('500 hari berturut-turut: jodohWeton tanpa galat, semua sisa dalam rentang', () => {
  const n0 = nomorHari('2025-01-01');
  for (let i = 0; i < 500; i++) {
    const r = jodohWeton(isoDariNomor(n0 + i), isoDariNomor(n0 + 3 * i + 7));
    const { bab22, bab23, bab24, bab25 } = r.metode;
    assert.ok(bab22.nomor >= 1 && bab22.nomor <= 7);
    assert.ok(bab23.sisa >= 1 && bab23.sisa <= 5);
    assert.ok(bab24.sisa >= 1 && bab24.sisa <= 9);
    assert.ok(bab25.sisa >= 1 && bab25.sisa <= 3);
  }
});
