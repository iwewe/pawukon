import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tinjauHari, weton, kalenderJawa, nomorHari, isoDariNomor, WULAN, HARI } from '../src/index.js';
import {
  BEPERGIAN, TALIWANGKE, SAMPARWANGKE, BULAN_HARI, BULAN_NIKAH_TAHUN, PANTANGAN_BULAN, TANGGAL_SANGAR_BULAN,
  TANGGAL_NABI, TANGGAL_NAAS, TANGGAL_SANGAR_AKAD, BANGAS_PADEWAN, TALIWANGKE_AKAD, BULAN_NIKAH, ANGGARAKASIH
} from '../src/data/hari.js';

const TAUN = ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakir'];

/** Tanggal Masehi pertama sejak `dari` yang memenuhi syarat. */
function cari(syarat, dari = '2026-01-01', maks = 900) {
  const n0 = nomorHari(dari);
  for (let i = 0; i < maks; i++) {
    const iso = isoDariNomor(n0 + i);
    if (syarat(kalenderJawa(iso), iso)) return iso;
  }
  throw new Error('tanggal tidak ketemu');
}

// --- pemeriksaan silang antar tabel kitab (membuktikan transkripsi scan konsisten) --------------------

test('bab 9, 10, 26, 27: empat tabel membagi tujuh hari persis per kelompok bulan', () => {
  const semuaBulan = BULAN_HARI.kelompok.flatMap(g => g.bulan);
  assert.deepEqual([...semuaBulan].sort(), [...WULAN].sort());
  for (const g of BULAN_HARI.kelompok) {
    const semua = [...g.rahayu, ...g.sarju, ...g.tidakBaik, ...g.sangar];
    assert.deepEqual([...semua].sort(), [...HARI].sort(), g.bulan.join('/'));
  }
});

test('bab 14 dan bab 32: hari Taliwangke tiap bulan sama; keenamnya sama dengan bab 5', () => {
  for (const { bulan, weton: w } of TALIWANGKE_AKAD.tabel) {
    for (const b of bulan) assert.equal(TANGGAL_SANGAR_BULAN.tabel[b].weton, w, b);
  }
  const dariBab5 = TALIWANGKE.daftar.map(e => e.weton).sort();
  const dariBab14 = [...new Set(Object.values(TANGGAL_SANGAR_BULAN.tabel).map(e => e.weton))].sort();
  assert.deepEqual(dariBab14, dariBab5);
});

test('bab 5 dan 6: pasaran tiap (wuku, hari) cocok dengan penyelarasan mesin (11 entri independen)', () => {
  const cariWeton = (wuku, hari) => {
    for (let i = 0; i < 210; i++) {
      const w = weton(isoDariNomor(nomorHari('2026-01-01') + i));
      if (w.wuku === wuku && w.hari === hari) return w.weton;
    }
  };
  for (const e of [...TALIWANGKE.daftar, ...SAMPARWANGKE.daftar]) {
    assert.equal(cariWeton(e.wuku, e.weton.split(' ')[0]), e.weton, `${e.wuku} ${e.weton}`);
  }
});

test('bab 11: bulan baik dan tidak baik tidak tumpang tindih, angka 1-12, delapan tahun lengkap', () => {
  assert.deepEqual(Object.keys(BULAN_NIKAH_TAHUN.tabel), TAUN);
  for (const [t, v] of Object.entries(BULAN_NIKAH_TAHUN.tabel)) {
    for (const n of [...v.baik, ...v.tidakBaik]) assert.ok(n >= 1 && n <= 12, `${t} ${n}`);
    assert.deepEqual(v.baik.filter(n => v.tidakBaik.includes(n)), [], t);
  }
});

test('tabel tanggal: 12 bulan lengkap, nama valid, tanggal 1-30', () => {
  const tabelBulan = { TANGGAL_SANGAR_BULAN, TANGGAL_NAAS, TANGGAL_SANGAR_AKAD, BANGAS_PADEWAN, BULAN_NIKAH };
  for (const [nama, d] of Object.entries(tabelBulan)) {
    assert.deepEqual(Object.keys(d.tabel).sort(), [...WULAN].sort(), nama);
  }
  for (const [nama, d] of Object.entries({ TANGGAL_NAAS, TANGGAL_SANGAR_AKAD, BANGAS_PADEWAN })) {
    for (const [b, tgl] of Object.entries(d.tabel)) for (const n of tgl) assert.ok(n >= 1 && n <= 30, `${nama} ${b} ${n}`);
  }
  for (const [b, e] of Object.entries(TANGGAL_SANGAR_BULAN.tabel)) for (const n of e.tanggal) assert.ok(n >= 1 && n <= 30, b);
  for (const [t, v] of Object.entries(PANTANGAN_BULAN.tabel)) for (const b of v.bulan) assert.ok(WULAN.includes(b), `${t} ${b}`);
  for (const [t, bln] of Object.entries(ANGGARAKASIH.tabelKitabAboge)) for (const b of bln) assert.ok(WULAN.includes(b), `${t} ${b}`);
  assert.equal(Object.keys(TANGGAL_NABI.tabel).length, 7); // hanya 7 bulan memuat peristiwa nabi
  for (const b of Object.keys(TANGGAL_NABI.tabel)) assert.ok(WULAN.includes(b), b);
  assert.deepEqual(BANGAS_PADEWAN.tabel.Pasa, [7, 9, 20]);
  assert.deepEqual(TANGGAL_NABI.tabel.Pasa.tanggal, [12, 21]);
});

// --- perilaku -------------------------------------------------------------------------------

test('bepergian: sangat jelek didahulukan dari kurang baik (Minggu Pahing ada di kedua daftar)', () => {
  const mp = cari(k => k.weton === 'Minggu Pahing');
  const r = tinjauHari(mp, { untuk: 'bepergian' });
  assert.equal(r.temuan.length, 1);
  assert.match(r.temuan[0].topik, /sangat jelek/);
  const sl = cari(k => k.weton === 'Senin Legi');
  assert.match(tinjauHari(sl, { untuk: 'bepergian' }).temuan[0].topik, /kurang baik/);
  const aman = cari(k => !BEPERGIAN.tidakBaik.weton.includes(k.weton) && !BEPERGIAN.sangatJelek.weton.includes(k.weton));
  assert.equal(tinjauHari(aman, { untuk: 'bepergian' }).temuan.length, 0);
});

test('Taliwangke dan Samparwangke terdeteksi dari wuku + weton', () => {
  const t = cari(k => k.wuku === 'Wuye' && k.weton === 'Senin Kliwon');
  assert.ok(tinjauHari(t).temuan.some(x => x.topik === 'Taliwangke Somaye' && !x.bergantungTanggalJawa));
  const s = cari(k => k.wuku === 'Tambir' && k.weton === 'Senin Wage');
  assert.ok(tinjauHari(s).temuan.some(x => x.topik === 'Samparwangke' && !x.bergantungTanggalJawa));
});

test('Sangarwarsa: 3 Sura; Kunarpawarsa: hari terakhir tahun Jawa', () => {
  const sang = cari(k => k.tanggal.wulan === 'Sura' && k.tanggal.dina === 3);
  assert.ok(tinjauHari(sang, { untuk: 'nikah' }).temuan.some(x => x.topik.startsWith('Sangarwarsa')));
  const akhir = cari((k, iso) => k.tanggal.wulan === 'Besar' && kalenderJawa(isoDariNomor(nomorHari(iso) + 1)).tanggal.wulan === 'Sura');
  assert.ok(tinjauHari(akhir, { untuk: 'nikah' }).temuan.some(x => x.topik.startsWith('Kunarpawarsa')));
  const tengah = cari(k => k.tanggal.wulan === 'Besar' && k.tanggal.dina === 10);
  assert.ok(!tinjauHari(tengah, { untuk: 'nikah' }).temuan.some(x => x.topik.startsWith('Kunarpawarsa')));
});

test('hari ini (Sabtu Kliwon, Bakdamulud 1960): Taliwangke untuk akad (bab 32)', () => {
  const r = tinjauHari('2026-10-10', { untuk: 'nikah' });
  assert.equal(r.weton, 'Sabtu Kliwon');
  assert.ok(r.temuan.some(x => x.topik === 'Taliwangke untuk akad' && x.arah === 'buruk'));
});

test('tanggal na\'as, bangas, sangar akad, peristiwa nabi terdeteksi menurut bulan dan tanggal', () => {
  const cek = (wulan, dina, topik) => {
    const iso = cari(k => k.tanggal.wulan === wulan && k.tanggal.dina === dina);
    assert.ok(tinjauHari(iso, { untuk: 'nikah' }).temuan.some(x => x.topik === topik), `${dina} ${wulan}: ${topik}`);
  };
  cek('Sura', 13, 'Peristiwa nabi');
  cek('Pasa', 12, 'Peristiwa nabi');
  cek('Sapar', 1, "Tanggal na'as");
  cek('Sura', 18, 'Tanggal sangar untuk akad');
  cek('Pasa', 9, 'Bangas Padewan');
  const besar = cari(k => k.tanggal.wulan === 'Besar' && k.tanggal.dina === 5);
  assert.ok(!tinjauHari(besar, { untuk: 'nikah' }).temuan.some(x => x.topik === 'Tanggal sangar untuk akad'));
});

test('bulan nikah (bab 33) dan syarat Selasa Kliwon untuk Jumadilakir/Rejeb/Ruwah/Besar', () => {
  const r = tinjauHari(cari(k => k.tanggal.wulan === 'Pasa' && k.tanggal.dina === 15), { untuk: 'nikah' });
  assert.ok(r.temuan.some(x => x.topik === 'Bulan Pasa untuk hajat nikah' && x.arah === 'buruk'));
  // bulan syarat: hasilnya salah satu: punya Anggarakasih (baik) atau tidak (buruk), tidak pernah keduanya
  for (const w of ['Jumadilakir', 'Rejeb', 'Ruwah', 'Besar']) {
    const t = tinjauHari(cari(k => k.tanggal.wulan === w && k.tanggal.dina === 8), { untuk: 'nikah' }).temuan;
    const punya = t.some(x => x.topik === `Bulan ${w} memiliki Anggarakasih`);
    const tidak = t.some(x => x.topik === 'Bulan tanpa Anggarakasih');
    assert.notEqual(punya, tidak, w);
  }
});

test('filter untuk dan ringkasan konsisten', () => {
  const semua = tinjauHari('2026-10-10');
  const nikah = tinjauHari('2026-10-10', { untuk: 'nikah' });
  assert.ok(nikah.temuan.length <= semua.temuan.length);
  for (const t of nikah.temuan) assert.equal(t.untuk, 'nikah');
  const total = semua.ringkasan.baik + semua.ringkasan.buruk + semua.ringkasan.netral;
  assert.equal(total, semua.temuan.length);
  assert.ok(semua.catatan);
});

test('setiap temuan berisi rujukan bab dan halaman; 600 hari berturut-turut tanpa galat', () => {
  const n0 = nomorHari('2025-01-01');
  for (let i = 0; i < 600; i++) {
    const r = tinjauHari(isoDariNomor(n0 + i));
    for (const t of r.temuan) {
      assert.ok(t.sumber.bab && t.sumber.halaman.length, `${r.masehi} ${t.topik}`);
      assert.ok(['baik', 'buruk', 'netral'].includes(t.arah));
      assert.ok(['nikah', 'umum', 'bepergian'].includes(t.untuk));
    }
  }
});
