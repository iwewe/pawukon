import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  arahRumah, rumahHari, ukuranRumah, pintuHalaman, letakSumur, halaman, mangsaDari, weton, WULAN, HARI, nomorHari, isoDariNomor
} from '../src/index.js';
import {
  ARAH_RUMAH, JAM_MULAI, HARI_BAGIAN, HARI_PINTU, BULAN_RUMAH, MANGSA_RUMAH, MANGSA_AWAL, NEPTU_BAB_176, SIKLUS_NEPTU,
  UKURAN, PINTU_HALAMAN, LETAK_SUMUR, HALAMAN
} from '../src/data/rumah.js';

const ARAH = new Set(['baik', 'buruk', 'netral']);
const MANGSA = ['Kasa', 'Karo', 'Katelu', 'Kapat', 'Kalima', 'Kanem', 'Kapitu', 'Kawolu', 'Kasanga', 'Kasadasa', 'Dhesta', 'Sada'];

function tanggalDengan(nama) {
  const n0 = nomorHari('2000-01-01');
  for (let i = 0; i < 40; i++) {
    const d = isoDariNomor(n0 + i);
    if (weton(d).weton === nama) return d;
  }
  throw new Error(nama);
}

// --- kelengkapan data -------------------------------------------------------------------------------------

test('bab 174 dan 175: 12 bulan dan 12 mangsa, tiga kegiatan, arah valid', () => {
  assert.deepEqual(Object.keys(BULAN_RUMAH).filter(k => k !== 'sumber').sort(), [...WULAN].sort());
  assert.deepEqual(Object.keys(MANGSA_RUMAH).filter(k => k !== 'sumber').sort(), [...MANGSA].sort());
  for (const [t, d] of [[BULAN_RUMAH, 'bulan'], [MANGSA_RUMAH, 'mangsa']]) {
    for (const [nama, v] of Object.entries(t)) {
      if (nama === 'sumber') continue;
      for (const j of ['mendirikan', 'genteng', 'pindah']) {
        if (v[j] === null) { assert.equal(`${d} ${nama}`, 'bulan Mulud', 'hanya Mulud tanpa data pindah'); continue; }
        assert.ok(v[j].makna && ARAH.has(v[j].arah), `${d} ${nama} ${j}`);
      }
    }
  }
});

test('bab 172: neptu 7-18 lengkap; jam mulai; hari bagian bangunan dan pintu', () => {
  for (let n = 7; n <= 18; n++) assert.ok(ARAH_RUMAH.tabel[n].length >= 1, `neptu ${n}`);
  for (const h of HARI) {
    assert.equal(JAM_MULAI[h].length, 5, h);
    for (const j of JAM_MULAI[h]) assert.ok(j >= 1 && j <= 12);
    assert.ok(HARI_BAGIAN[h], h);
  }
  assert.deepEqual(Object.keys(HARI_PINTU).filter(k => k !== 'sumber').sort(), ['Jumat', 'Kamis', 'Rabu', 'Sabtu']);
});

test('bab 176-180: panjang deretan nama; neptu bab 176 berbeda dari bab 2 pada empat hari', () => {
  const panjang = { b176: 4, b177: 5, b178: 6, b179: 4, b180: 6 };
  for (const [k, n] of Object.entries(panjang)) assert.equal(SIKLUS_NEPTU[k].nama.length, n, k);
  const beda = HARI.filter(h => NEPTU_BAB_176[h] !== { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 }[h]);
  assert.deepEqual(beda.sort(), ['Jumat', 'Kamis', 'Minggu', 'Rabu', 'Sabtu']);
});

test('hitungan ukuran: banyak nama sesuai kitab', () => {
  const panjang = { usukAkhir: 5, usukBangunan: 5, rangka: 5, tangga1: 3, tangga2: 3, balai: 3, sumur: 5 };
  for (const [k, n] of Object.entries(panjang)) assert.equal(UKURAN[k].nama.length, n, k);
});

test('bab 195 dan 196: sembilan makna tiap sisi; bab 194 lima makna', () => {
  assert.equal(PINTU_HALAMAN.b194.makna.length, 5);
  for (const s of ['Utara', 'Timur', 'Selatan', 'Barat']) assert.equal(PINTU_HALAMAN.b195.makna[s].length, 9, s);
  assert.equal(PINTU_HALAMAN.b196.makna.length, 9);
});

test('bab 198: delapan posisi berurutan berlawanan arah jarum jam; 1 dan 8 baik', () => {
  const cincin = ['Barat_Daya', 'Selatan', 'Tenggara', 'Timur', 'Timur_Laut', 'Utara', 'Barat_Laut', 'Barat'];
  for (const [hadap, peta] of Object.entries(LETAK_SUMUR.nomor)) {
    assert.deepEqual(Object.values(peta).sort(), [1, 2, 3, 4, 5, 6, 7, 8], hadap);
    const posisi = Object.fromEntries(Object.entries(peta).map(([a, n]) => [n, cincin.indexOf(a)]));
    for (let n = 1; n <= 8; n++) {
      assert.equal(posisi[n === 8 ? 1 : n + 1], (posisi[n] + 1) % 8, `${hadap}: ${n} ke ${n + 1}`);
    }
  }
  assert.deepEqual(Object.entries(LETAK_SUMUR.makna).filter(([, v]) => v.arah === 'baik').map(([n]) => Number(n)), [1, 8]);
});

test('bab 168: 26 keadaan lahan, arah valid', () => {
  assert.equal(HALAMAN.daftar.length, 26);
  for (const h of HALAMAN.daftar) assert.ok(h.kondisi && h.makna && ARAH.has(h.arah), h.kondisi);
});

// --- mangsa -----------------------------------------------------------------------------------------------------

test('mangsa baku: panjang tiap mangsa 41,23,24,25,27,43,43,26(27 kabisat),25,24,23,41', () => {
  const hitung = (tahunMulai) => {
    const h = {};
    const n0 = nomorHari(`${tahunMulai}-06-22`);
    for (let i = 0; i < 365 + (tahunMulai === 2027 ? 1 : 0); i++) {
      const m = mangsaDari(isoDariNomor(n0 + i));
      h[m] = (h[m] || 0) + 1;
    }
    return MANGSA.map(m => h[m]);
  };
  assert.deepEqual(hitung(2025), [41, 23, 24, 25, 27, 43, 43, 26, 25, 24, 23, 41]); // 22 Jun 2025 - 21 Jun 2026
  assert.deepEqual(hitung(2027), [41, 23, 24, 25, 27, 43, 43, 27, 25, 24, 23, 41]); // sampai 2028 (kabisat)
  assert.equal(MANGSA_AWAL.urut.length, 12);
});

// --- contoh kitab ----------------------------------------------------------------------------------------------------

test('bab 172: Sabtu Pahing = 9 + 9 = 18, rumah menghadap Utara atau Timur', () => {
  const r = arahRumah(tanggalDengan('Sabtu Pahing'));
  assert.equal(r.jumlahNeptu, 18);
  assert.deepEqual(r.arahBaik, ['Utara', 'Timur']);
});

test('bab 188: 18, 23, 28 usuk = Naga (dapur); bab 197: 19, 24, 29 depa = suwarga (baik)', () => {
  for (const n of [18, 23, 28]) {
    const u = ukuranRumah('usukBangunan', n);
    assert.equal(u.nama, 'Naga');
    assert.match(u.makna, /dapur/);
  }
  for (const n of [19, 24, 29]) {
    const u = ukuranRumah('sumur', n);
    assert.equal(u.nama, 'Suwarga');
    assert.equal(u.arah, 'baik');
  }
  assert.equal(ukuranRumah('usukBangunan', 5).nama, 'Perak'); // sisa 0 = nama terakhir
  assert.equal(ukuranRumah('tangga1', 7).nama, 'Anda');
  assert.throws(() => ukuranRumah('usukAkhir', 0), RangeError);
  assert.throws(() => ukuranRumah('tidakada', 3), RangeError);
});

// --- perilaku ------------------------------------------------------------------------------------------------------------

test('rumahHari: Sabtu Kliwon, mangsa Kapat; siklus neptu sesuai hitungan manual', () => {
  const r = rumahHari('2026-10-10');
  assert.equal(r.weton, 'Sabtu Kliwon');
  assert.equal(r.mangsa, 'Kapat');
  // bab 176: Sabtu 8 + Kliwon 8 = 16 mod 4 = 0 -> Sempoyong; bab 2: 17
  assert.deepEqual([r.siklus.b176.jumlah, r.siklus.b176.nama], [16, 'Sempoyong']);
  assert.equal(r.siklus.b177.nama, 'Yasa');       // 17 mod 5 = 2
  assert.equal(r.siklus.b178.nama, 'Rogoh');      // 17 mod 6 = 5
  assert.equal(r.siklus.b179.nama, 'Kerta');      // 17 mod 4 = 1
  assert.equal(r.siklus.b180.nama, 'Macan ketawang'); // 17 mod 6 = 5
  assert.equal(r.bagianBangunan.bagian, 'Pringgitan');
  assert.equal(r.pasangPintu.pintu, 'Pintu samping (belakang)');
  assert.deepEqual(r.jamMulai.jam.map(j => j.jam24), [7, 9, 12, 14, 16]);
  assert.equal(r.kegiatan.mendirikan.menurutBulan.bergantungTanggalJawa, true);
  assert.equal(r.kegiatan.mendirikan.menurutMangsa.asumsiKalenderMangsa, true);
});

test('pintu halaman: nomor bagian, sudut awal, dan batas', () => {
  const a = pintuHalaman({ metode: 194, menghadap: 'utara', panjang: 10, posisi: 1 });
  assert.equal(a.nomor, 1);
  assert.equal(a.mulaiDari, 'Barat');
  assert.equal(pintuHalaman({ metode: 194, menghadap: 'Utara', panjang: 10, posisi: 10 }).nomor, 5);
  assert.equal(pintuHalaman({ metode: 194, menghadap: 'Utara', panjang: 10, posisi: 0 }).nomor, 1);
  assert.equal(pintuHalaman({ metode: 196, menghadap: 'Timur', panjang: 9, posisi: 4.5 }).mulaiDari, 'Selatan');
  assert.equal(pintuHalaman({ metode: 194, menghadap: 'Timur', panjang: 9, posisi: 4.5 }).mulaiDari, 'Utara');
  assert.equal(pintuHalaman({ metode: 196, menghadap: 'Selatan', panjang: 9, posisi: 2.5 }).nama, 'Kala'); // bagian 3
  assert.equal(pintuHalaman({ metode: 195, menghadap: 'Selatan', panjang: 9, posisi: 7.5 }).makna, 'Mendapat berkah batin'); // bagian 8
  assert.throws(() => pintuHalaman({ metode: 194, menghadap: 'Atas', panjang: 10, posisi: 1 }), RangeError);
  assert.throws(() => pintuHalaman({ metode: 194, menghadap: 'Utara', panjang: 10, posisi: 11 }), RangeError);
  assert.throws(() => pintuHalaman({ metode: 100, menghadap: 'Utara', panjang: 10, posisi: 1 }), RangeError);
});

test('letak sumur: contoh dari diagram dan penulisan arah', () => {
  assert.equal(letakSumur({ rumahMenghadap: 'Selatan', sumurDi: 'Barat Daya' }).nomor, 1);
  assert.equal(letakSumur({ rumahMenghadap: 'selatan', sumurDi: 'barat' }).nomor, 8);
  assert.equal(letakSumur({ rumahMenghadap: 'Utara', sumurDi: 'Timur Laut' }).arah, 'baik');
  assert.equal(letakSumur({ rumahMenghadap: 'Timur', sumurDi: 'Utara' }).nomor, 4);
  assert.throws(() => letakSumur({ rumahMenghadap: 'Utara', sumurDi: 'Tengah' }), RangeError);
});

test('halaman(); rumahHari 500 hari berturut-turut tanpa galat dan lengkap', () => {
  assert.equal(halaman().daftar.length, 26);
  const n0 = nomorHari('2025-06-01');
  for (let i = 0; i < 500; i++) {
    const r = rumahHari(isoDariNomor(n0 + i));
    assert.ok(MANGSA.includes(r.mangsa));
    for (const j of ['mendirikan', 'genteng', 'pindah']) assert.ok(r.kegiatan[j].menurutMangsa.makna);
    for (const v of Object.values(r.siklus)) assert.ok(v.nama && ARAH.has(v.arah));
    assert.equal(r.jamMulai.jam.length, 5);
  }
});
