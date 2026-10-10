import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  siklusHari, saatAgung, saatAgungDi, hariMenurutJam, jamDihindari, saat12, saat12Di, saatBintang, jamSialBaik,
  saatMalaikat, saatPerkara, saatNikah, suhara, akadTigaJenis, kelompokTanggal, jamDesimal,
  kalenderJawa, nomorHari, isoDariNomor
} from '../src/index.js';
import {
  URUTAN_MINGGU, SAAT_AGUNG, JAM_DIHINDARI, SAAT_12, JAM_SIAL_BAIK, SAAT_MALAIKAT, SAAT_BINTANG, SAAT_PERKARA,
  SAAT_PENGADILAN, KELOMPOK_TANGGAL_NAMA, SAAT_NIKAH_PASARAN, SAAT_NIKAH_TANGGAL, SUHARA, AKAD_TIGA_JENIS, jam24
} from '../src/data/jam.js';

/** Tanggal Masehi pertama sejak `dari` yang memenuhi syarat. */
function cari(syarat, dari = '2026-01-01', maks = 900) {
  const n0 = nomorHari(dari);
  for (let i = 0; i < maks; i++) {
    const iso = isoDariNomor(n0 + i);
    if (syarat(kalenderJawa(iso), iso)) return iso;
  }
  throw new Error('tanggal tidak ketemu');
}
const tanggalHari = (hari) => cari(k => k.hari === hari);

// Pasangan [mulai, akhir] tercetak (jam 12-an) -> 24 jam.
const ke24 = ([a, b]) => {
  const s = jam24(a);
  const e = jam24(b);
  return [s, e <= s ? e + 12 : e];
};

// --- siklus 12 jam: tabel bab 147, 148, 149, 164, 165 ditranskripsi terpisah dari scan -------------------------------

test('bab 147: siklus bangkitan cocok persis dengan tabel tercetak (7 hari x 7 saat)', () => {
  for (const hari of URUTAN_MINGGU) {
    const cetak = SAAT_AGUNG.cetak[hari].map(ke24);
    const siklus = siklusHari(hari);
    assert.equal(siklus.length, 7);
    // tabel tercetak disusun menurut Wiji..Pati; siklus menurut waktu dari 06.00
    for (const s of siklus) assert.deepEqual([s.mulai, s.selesai], cetak[s.tipe], `${hari} saat ${s.tipe}`);
    // menutup 12 jam tanpa celah
    assert.equal(siklus[0].mulai, 6);
    assert.equal(siklus[6].selesai, 18);
    siklus.slice(1).forEach((s, i) => assert.equal(s.mulai, siklus[i].selesai));
  }
});

test('bab 148 (ditranskripsi terpisah): jam menurut hari cocok dengan balikan bab 147', () => {
  // [mulai jam 12-an, hari yang dimasuki], per hari, urut seperti tercetak
  const cetak = {
    Minggu: [[6, 'Minggu'], [8, 'Senin'], [10, 'Selasa'], [11, 'Rabu'], [1, 'Kamis'], [3, 'Jumat'], [5, 'Sabtu']],
    Senin: [[6, 'Senin'], [8, 'Selasa'], [9, 'Rabu'], [11, 'Kamis'], [1, 'Jumat'], [3, 'Sabtu'], [4, 'Minggu']],
    Selasa: [[6, 'Selasa'], [7, 'Rabu'], [9, 'Kamis'], [11, 'Jumat'], [1, 'Sabtu'], [2, 'Minggu'], [4, 'Senin']],
    Rabu: [[6, 'Rabu'], [8, 'Kamis'], [10, 'Jumat'], [12, 'Sabtu'], [1, 'Minggu'], [3, 'Senin'], [5, 'Selasa']],
    Kamis: [[6, 'Kamis'], [8, 'Jumat'], [10, 'Sabtu'], [11, 'Minggu'], [1, 'Senin'], [3, 'Selasa'], [4, 'Rabu']],
    Jumat: [[6, 'Jumat'], [8, 'Sabtu'], [9, 'Minggu'], [11, 'Senin'], [1, 'Selasa'], [2, 'Rabu'], [4, 'Kamis']],
    Sabtu: [[6, 'Sabtu'], [7, 'Minggu'], [9, 'Senin'], [11, 'Selasa'], [12, 'Rabu'], [2, 'Kamis'], [4, 'Jumat']]
  };
  let diperiksa = 0;
  for (const [hari, baris] of Object.entries(cetak)) {
    const iso = tanggalHari(hari);
    for (const [mulai, masuk] of baris) {
      assert.equal(hariMenurutJam(iso, jam24(mulai)).masukHari, masuk, `${hari} jam ${mulai}`);
      diperiksa++;
    }
  }
  assert.equal(diperiksa, 49);
  assert.equal(hariMenurutJam(tanggalHari('Sabtu'), 11.5).masukHari, 'Selasa'); // contoh kitab
  assert.equal(hariMenurutJam(tanggalHari('Minggu'), 5).masukHari, null);
});

test('bab 149: jam yang dihindari = saat Lara dan Pati (uji silang dengan tabel tercetak)', () => {
  for (const hari of URUTAN_MINGGU) {
    const dariSiklus = jamDihindari(tanggalHari(hari)).jam.map(j => [j.mulai, j.selesai]).sort((a, b) => a[0] - b[0]);
    const dariCetak = JAM_DIHINDARI.cetak[hari].map(ke24).sort((a, b) => a[0] - b[0]);
    assert.deepEqual(dariSiklus, dariCetak, hari);
  }
});

test('bab 165: siklus bangkitan cocok dengan tabel tercetak kecuali dua salah cetak yang tercatat', () => {
  const selisih = SAAT_PERKARA.selisihCetak;
  let sama = 0;
  for (const hari of URUTAN_MINGGU) {
    const cetak = SAAT_PERKARA.cetak[hari];
    const siklus = saatPerkara(tanggalHari(hari)).saat;
    assert.equal(cetak.length, 7);
    siklus.forEach((s, i) => {
      const [m, a, nama] = cetak[i];
      assert.equal(nama, s.nama, `${hari} ${i}`);
      const diketahui = selisih.find(x => x.hari === hari && x.urutan === i);
      if (diketahui) {
        assert.deepEqual([m, a], diketahui.cetak);
        assert.deepEqual([s.mulai, s.selesai], diketahui.seharusnya);
      } else {
        assert.deepEqual([m, a], [s.mulai, s.selesai], `${hari} ${nama}`);
        sama++;
      }
    });
  }
  assert.equal(sama, 49 - selisih.length);
});

test('bab 164: sama dengan bab 165 (Tangguh = Cidra), jam penuh; dua salah cetak tercatat', () => {
  const selisih = SAAT_PENGADILAN.selisihCetak;
  for (const hari of URUTAN_MINGGU) {
    const cetak = SAAT_PENGADILAN.cetak[hari];
    const siklus = saatPerkara(tanggalHari(hari)).saat;
    siklus.forEach((s, i) => {
      const [m, a, nama] = cetak[i];
      assert.equal(nama, s.pengadilan.nama, `${hari} ${i}`);
      const diketahui = selisih.find(x => x.hari === hari && x.urutan === i);
      if (diketahui) {
        assert.deepEqual([m, a], diketahui.cetak);
        assert.deepEqual(diketahui.seharusnya, [s.mulai, s.selesai - 1]);
      } else {
        assert.deepEqual([m, a], [s.mulai, s.selesai - 1], `${hari} ${nama}`);
      }
    });
  }
  // kitab: berangkat pada jam yang jatuh Ratu atau Pandita
  const baik = saatPerkara(tanggalHari('Selasa')).saat.filter(s => s.pengadilan.baikUntukBerangkat).map(s => s.nama);
  assert.deepEqual(baik, ['Pandita', 'Ratu']);
});

test('klasifikasi saat agung dan saat perkara mengikuti catatan kitab', () => {
  const baik = SAAT_AGUNG.nama.filter(n => SAAT_AGUNG.arah[n] === 'baik');
  assert.deepEqual(baik, ['Wiji', 'Cahya', 'Rejeki']); // catatan: baik 1, 2, 4
  assert.equal(SAAT_PERKARA.arah.Ratu, 'baik');
  assert.equal(SAAT_PERKARA.arah.Lara, 'buruk');
  assert.equal(SAAT_PERKARA.arah.Pati, 'buruk');
  const r = saatAgungDi('2026-10-10', 8); // Sabtu: Wiji 07-09
  assert.equal(r.saat.nama, 'Wiji');
  assert.equal(saatAgungDi('2026-10-10', 20).saat, null);
});

// --- bab 146: saat 12 ----------------------------------------------------------------------------------------------

test('bab 146: 12 baris x 5 kolom, nama sah; siang dan malam hanya beda di neptu 9 kolom terakhir', () => {
  const sah = new Set(Object.keys(SAAT_12.arah));
  assert.deepEqual(Object.keys(SAAT_12.siang.tabel).map(Number), [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
  const beda = [];
  for (let n = 7; n <= 18; n++) {
    const s = SAAT_12.siang.tabel[n];
    const m = SAAT_12.malam.tabel[n];
    assert.equal(s.length, 5);
    assert.equal(m.length, 5);
    for (const x of [...s, ...m]) assert.ok(sah.has(x), `${n} ${x}`);
    m.slice().reverse().forEach((x, i) => { if (x !== s[i]) beda.push([n, i, s[i], x]); });
  }
  assert.deepEqual(beda, [[9, 4, 'Srigumelar', 'Srilungguh']]);
});

test('bab 146: 5 kolom siang menutup 06-18 dan 5 kolom malam menutup 18-30 tanpa celah', () => {
  const rangkai = (kolom, awal, akhir) => {
    let t = awal;
    for (const k of kolom) { assert.equal(k.jam[0], t); t = k.jam[1]; }
    assert.equal(t, akhir);
  };
  rangkai(SAAT_12.siang.kolom, 6, 18);
  rangkai(SAAT_12.malam.kolom, 18, 30);
});

test('saat12 dan saat12Di: Sabtu Kliwon (neptu 17)', () => {
  const r = saat12('2026-10-10');
  assert.equal(r.jumlahNeptu, 17);
  assert.deepEqual(r.siang.map(x => x.saat), ['Ayu', 'Sampar', 'Kala penganten', 'Srigumelar', 'Srigumelar']);
  assert.equal(saat12Di('2026-10-10', 9).saat.saat, 'Sampar'); // Wisang garu
  assert.equal(saat12Di('2026-10-10', 2).saat.nama, 'Lingsir malam'); // dini hari malam sebelumnya
  assert.equal(saat12Di('2026-10-10', 23.5).saat.nama, 'Tengah malam');
});

// --- bab 157, 158, 162 ---------------------------------------------------------------------------------------------

test('bab 157: angka baik = satu jam setelah pasangan sial, kecuali satu anomali tercetak (Selasa)', () => {
  const lanjut = (n) => (n % 12) + 1;
  const menyimpang = [];
  for (const [hari, t] of Object.entries(JAM_SIAL_BAIK.tabel)) {
    t.sial.forEach((p, i) => {
      assert.equal(p[1], lanjut(p[0]), `${hari} pasangan ${p}`);
      if (t.baik[i] !== lanjut(p[1])) menyimpang.push([hari, i]);
    });
  }
  assert.deepEqual(menyimpang, [['Selasa', 1]]);
  assert.ok(JAM_SIAL_BAIK.anomali);
  assert.deepEqual(jamSialBaik(tanggalHari('Minggu')).sial, [6, 7, 12, 13]);
  assert.deepEqual(jamSialBaik(tanggalHari('Minggu')).baik, [8, 14]);
});

test('bab 158: tiap hari lima saat menutup jam 1-12 tepat sekali', () => {
  for (const [hari, t] of Object.entries(SAAT_MALAIKAT.tabel)) {
    const semua = Object.values(t).flat().sort((a, b) => a - b);
    assert.deepEqual(semua, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], hari);
  }
  const r = saatMalaikat(tanggalHari('Minggu'));
  assert.equal(r.saat.length, 5);
  assert.deepEqual(r.saat.find(s => s.nama === 'Ibrahim').jam, [13, 14, 15]);
});

test('bab 162: 7 hari x 12 jam, kode sah; contoh kitab', () => {
  for (const [hari, kode] of Object.entries(SAAT_BINTANG.tabel)) {
    assert.equal(kode.length, 12, hari);
    for (const k of kode) assert.ok(SAAT_BINTANG.kode[k], `${hari} ${k}`);
  }
  // Minggu jam 5 = p; Senin jam 4 = rh; Selasa jam 8 = s (jam 12-an; 5 -> 17, 4 -> 16)
  assert.equal(saatBintang(tanggalHari('Minggu'), 17).saat.kode, 'p');
  assert.equal(saatBintang(tanggalHari('Senin'), 16).saat.kode, 'rh');
  assert.equal(saatBintang(tanggalHari('Selasa'), 8).saat.kode, 's');
  assert.equal(saatBintang(tanggalHari('Selasa')).saat.length, 12);
  assert.equal(saatBintang(tanggalHari('Selasa'), 20).saat, null);
});

// --- bab 35, 36, 166, 37, 34 -----------------------------------------------------------------------------------------

test('bab 35: contoh kitab Rabu Pon, tanggal 1/6/11/16/21/26', () => {
  const iso = cari(k => k.weton === 'Rabu Pon' && [1, 6, 11, 16, 21, 26].includes(k.tanggal.dina));
  const r = saatNikah(iso);
  assert.equal(r.kelompokTanggal, 1);
  const gabung = r.saat.map(s => `${s.penjaga} ${s.menurutPasaran.nama}`);
  assert.deepEqual(gabung, SAAT_NIKAH_PASARAN.contohKitab.hasil);
  assert.equal(r.saat[0].menurutPasaran.arah, 'baik'); // Ahmad Slamet, 06.00-08.23
  assert.equal(r.saat[4].menurutPasaran.arah, 'netral'); // Israil Rejeki, cukupan
  assert.equal(r.saat[0].mulai, '06:00');
  assert.equal(r.saat[4].selesai, '18:00');
});

test('bab 35 dan 36 dan 166 konsisten: penjaga sama, baris pasaran dan tanggal berotasi', () => {
  for (let g = 1; g <= 5; g++) {
    for (let s = 0; s < 5; s++) {
      assert.equal(SAAT_NIKAH_TANGGAL.cetak[g][s][0], KELOMPOK_TANGGAL_NAMA[(g - 1 + s) % 5], `penjaga ${g}/${s}`);
      assert.equal(SAAT_NIKAH_TANGGAL.cetak[g][s][1], SAAT_NIKAH_TANGGAL.nama[(((s - (g - 1)) % 5) + 5) % 5], `tanggal ${g}/${s}`);
    }
  }
  const dasar = SAAT_NIKAH_PASARAN.nama;
  Object.values(SAAT_NIKAH_PASARAN.baris).forEach((b, i) => {
    assert.deepEqual(b, [...dasar.slice(i), ...dasar.slice(0, i)]);
  });
  // batas lima saat 144 menit
  const r = saatNikah('2026-10-10');
  assert.deepEqual(r.saat.map(s => s.mulai), ['06:00', '08:24', '10:48', '13:12', '15:36']);
});

test('bab 36: contoh kitab tanggal kelompok 5 (10/15/20/25/30): baik 10.48 Jibrail Slamet, cukupan 13.12 Ibrahim Rejeki', () => {
  const iso = cari(k => [5, 10, 15, 20, 25, 30].includes(k.tanggal.dina));
  const r = saatNikah(iso);
  assert.equal(r.kelompokTanggal, 5);
  const baik = r.saat.find(s => s.menurutTanggal.arah === 'baik');
  const cukup = r.saat.find(s => s.menurutTanggal.arah === 'netral');
  assert.deepEqual([baik.mulai, baik.penjaga, baik.menurutTanggal.nama], ['10:48', 'Jibrail', 'Slamet']);
  assert.deepEqual([cukup.mulai, cukup.penjaga, cukup.menurutTanggal.nama], ['13:12', 'Ibrahim', 'Rejeki']);
  assert.equal(kelompokTanggal(30), 5);
  assert.equal(kelompokTanggal(1), 1);
  assert.equal(kelompokTanggal(26), 1);
  assert.equal(r.bergantungTanggalJawa, true);
});

test('bab 37 Suhara: tujuh hari lengkap; pasangan jam berselisih 7, kecuali Sabtu siang (tercatat)', () => {
  assert.deepEqual(Object.keys(SUHARA.tabel).sort(), [...URUTAN_MINGGU].sort());
  for (const [hari, t] of Object.entries(SUHARA.tabel)) {
    for (const bagian of ['siang', 'malam']) {
      const v = t[bagian];
      assert.ok(v.length === 1 || v.length === 2, `${hari} ${bagian}`);
      if (v.length === 2) assert.equal(v[1] - v[0], hari === 'Sabtu' && bagian === 'siang' ? 8 : 7, `${hari} ${bagian}`);
    }
  }
  assert.ok(suhara(tanggalHari('Sabtu')).catatanCetak);
  assert.equal(suhara(tanggalHari('Senin')).catatanCetak, undefined);
});

test('bab 34: 3 jenis x 7 hari x 5 kolom, "Idem" teratasi, semua istilah terklasifikasi', () => {
  const kelas = new Set(Object.values(AKAD_TIGA_JENIS.arah).flat());
  for (const j of ['I', 'II', 'III']) {
    assert.equal(AKAD_TIGA_JENIS.tabel[j].length, 7);
    for (const baris of AKAD_TIGA_JENIS.tabel[j]) {
      assert.equal(baris.length, 5);
      for (const x of baris) { assert.notEqual(x, 'Idem'); assert.ok(kelas.has(x), x); }
    }
  }
  // tiap istilah yang diklasifikasikan memang dipakai
  const dipakai = new Set(['I', 'II', 'III'].flatMap(j => AKAD_TIGA_JENIS.tabel[j].flat()));
  for (const x of kelas) assert.ok(dipakai.has(x), `istilah tak terpakai: ${x}`);
});

test('bab 34: contoh kitab - Selasa ke-4 jatuh pada Harja di ketiga jenis; urutan hari dalam bulan', () => {
  const iso = cari(k => k.hari === 'Selasa' && k.tanggal.dina >= 22 && k.tanggal.dina <= 28);
  const r = akadTigaJenis(iso);
  assert.equal(r.urutanHariDalamBulan, 4);
  assert.equal(r.semuaHarja, true);
  for (const [dina, urutan] of [[1, 1], [7, 1], [8, 2], [15, 3], [22, 4], [29, 5], [30, 5]]) {
    const d = cari(k => k.tanggal.dina === dina);
    assert.equal(akadTigaJenis(d).urutanHariDalamBulan, urutan, `tanggal ${dina}`);
  }
  // hari yang bukan Harja di ketiganya tidak ditandai
  const bukan = cari(k => k.hari === 'Jumat' && k.tanggal.dina >= 8 && k.tanggal.dina <= 14); // Jumat ke-2: Musuh Allah
  assert.equal(akadTigaJenis(bukan).semuaHarja, false);
  assert.equal(akadTigaJenis(bukan).jenis.I.istilah, 'Musuh Allah');
});

// --- perilaku ----------------------------------------------------------------------------------------------------------

test('jamDesimal menerima angka dan "HH:MM", menolak yang lain', () => {
  assert.equal(jamDesimal(8), 8);
  assert.equal(jamDesimal('10:48'), 10.8);
  assert.equal(jamDesimal('00:30'), 0.5);
  for (const buruk of [24, -1, '25:00', '9', 'pagi', NaN, undefined]) assert.throws(() => jamDesimal(buruk), RangeError);
});

test('600 hari berturut-turut: semua fungsi jam jalan, saat agung menutup 12 jam, tiap saat bersumber', () => {
  const n0 = nomorHari('2025-01-01');
  for (let i = 0; i < 600; i++) {
    const iso = isoDariNomor(n0 + i);
    const a = saatAgung(iso);
    assert.equal(a.saat.reduce((t, s) => t + (s.selesai - s.mulai), 0), 12, iso);
    assert.ok(a.sumber.bab);
    assert.equal(saat12(iso).siang.length, 5);
    assert.equal(saatBintang(iso).saat.length, 12);
    assert.equal(saatMalaikat(iso).saat.length, 5);
    assert.equal(saatNikah(iso).saat.length, 5);
    assert.ok(akadTigaJenis(iso).jenis.I.istilah);
    assert.ok(suhara(iso).sumber.bab);
    assert.equal(jamSialBaik(iso).sial.length, 4);
  }
});
