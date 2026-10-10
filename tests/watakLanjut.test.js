import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  watakTanggal, watakBulan, watakMangsa, watakNeptu, bintangHari, watakNama, tinjauNama, watakLanjut,
  kalenderJawa, nomorHari, isoDariNomor, WULAN
} from '../src/index.js';
import { MANGSA_AWAL } from '../src/data/rumah.js';
import {
  WATAK_TANGGAL, WATAK_BULAN, WATAK_MANGSA, WATAK_NEPTU, WATAK_SISA_9, WATAK_SISA_8, HARI_BINATANG, NASIB_BULAN,
  WATAK_NAMA_HURUF, NAMA_BAIK_BURUK, RAMALAN_NABI, PERBINTANGAN
} from '../src/data/watakLanjut.js';
import { HANACARAKA } from '../src/data/pernikahan.js';
import { JAM_DIHINDARI } from '../src/data/jam.js';

const ARAH = new Set(['baik', 'buruk', 'netral']);
const NEPTU_RENTANG = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const tigaPuluh = Array.from({ length: 30 }, (_, i) => i + 1);

function cari(syarat, dari = '2026-01-01', maks = 900) {
  const n0 = nomorHari(dari);
  for (let i = 0; i < maks; i++) {
    const iso = isoDariNomor(n0 + i);
    if (syarat(kalenderJawa(iso), iso)) return iso;
  }
  throw new Error('tanggal tidak ketemu');
}

// --- kelengkapan data ----------------------------------------------------------------------------------------------------------------------------

test('bab 101 dan 108: tanggal 1-30 lengkap, arah sah, 30 hewan berbeda', () => {
  assert.deepEqual(Object.keys(WATAK_TANGGAL.tabel).map(Number), tigaPuluh);
  assert.deepEqual(Object.keys(HARI_BINATANG.tabel).map(Number), tigaPuluh);
  for (const v of Object.values(WATAK_TANGGAL.tabel)) { assert.ok(v.makna); assert.ok(ARAH.has(v.arah)); }
  assert.equal(new Set(Object.values(HARI_BINATANG.tabel).map(h => h.hewan)).size, 30);
});

test('bab 108: struktur entri sah; mutu konsisten dengan watak anak', () => {
  const berita = new Set(['baik-benar', 'buruk-benar', 'semua-benar', 'tidak-dipercaya', null]);
  for (const [d, h] of Object.entries(HARI_BINATANG.tabel)) {
    assert.ok(h.hewan && h.anak.makna && ARAH.has(h.anak.arah), `tanggal ${d}`);
    assert.ok(h.kegiatan.length >= 1, `tanggal ${d}`);
    for (const k of h.kegiatan) { assert.ok(k.untuk); assert.ok(ARAH.has(k.nilai), `tanggal ${d} ${k.untuk}`); }
    assert.ok(berita.has(h.berita), `tanggal ${d}`);
    if (h.mutu) {
      const jelek = /jelek/.test(h.mutu);
      assert.equal(h.anak.arah, jelek ? 'buruk' : 'baik', `tanggal ${d} (${h.mutu})`);
    }
  }
  const sangatJelek = Object.entries(HARI_BINATANG.tabel).filter(([, h]) => h.mutu === 'sangat jelek').map(([d]) => +d);
  assert.deepEqual(sangatJelek, [3, 9, 16, 24, 30]);
  const baik = Object.entries(HARI_BINATANG.tabel).filter(([, h]) => h.mutu && !/jelek/.test(h.mutu)).map(([d]) => +d);
  assert.deepEqual(baik, [1, 6, 14, 15, 22, 27, 28]);
});

test('bab 102, 111: 12 bulan Jawa (nama mesin); bab 103: 12 mangsa sama dengan data mangsa rumah', () => {
  assert.deepEqual(Object.keys(WATAK_BULAN.tabel).sort(), [...WULAN].sort());
  assert.deepEqual(Object.keys(NASIB_BULAN.tabel).sort(), [...WULAN].sort());
  assert.deepEqual(Object.keys(WATAK_MANGSA.tabel).sort(), MANGSA_AWAL.urut.map(m => m[0]).sort());
  for (const t of [WATAK_BULAN, NASIB_BULAN, WATAK_MANGSA]) for (const v of Object.values(t.tabel)) { assert.ok(v.makna); assert.ok(ARAH.has(v.arah)); }
});

test('bab 105, 116, 117: jumlah neptu 7-18 lengkap', () => {
  for (const t of [WATAK_NEPTU, RAMALAN_NABI, PERBINTANGAN]) assert.deepEqual(Object.keys(t.tabel).map(Number), NEPTU_RENTANG);
  for (const v of Object.values(WATAK_NEPTU.tabel)) { assert.ok(v.makna); assert.ok(ARAH.has(v.arah)); }
  for (const v of Object.values(RAMALAN_NABI.tabel)) { assert.ok(v.nabi && v.makna); assert.ok(ARAH.has(v.arah)); }
  assert.equal(new Set(Object.values(RAMALAN_NABI.tabel).map(v => v.nabi)).size, 12);
});

test('bab 117 (uji silang): 12 bintang berbeda; sekutu dan musuh selalu bintang lain dalam daftar; hari dan bulan sah', () => {
  const nama = Object.values(PERBINTANGAN.tabel).map(b => b.nama);
  assert.equal(new Set(nama).size, 12);
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  for (const [n, b] of Object.entries(PERBINTANGAN.tabel)) {
    assert.ok(nama.includes(b.sekutu) && nama.includes(b.musuh), `neptu ${n}`);
    assert.notEqual(b.sekutu, b.nama);
    assert.notEqual(b.musuh, b.nama);
    assert.notEqual(b.sekutu, b.musuh);
    for (const [h, bln] of [b.jaya, b.malang]) { assert.ok(hari.includes(h), `neptu ${n}`); assert.ok(WULAN.includes(bln), `neptu ${n} ${bln}`); }
    assert.notDeepEqual(b.jaya, b.malang);
    assert.ok(Array.isArray(b.penyakit) && b.sifat);
  }
  assert.ok(PERBINTANGAN.peringatan);
});

test('bab 106 dan 107: sisa 1-9 dan 1-8 lengkap; contoh kitab bab 107', () => {
  assert.deepEqual(Object.keys(WATAK_SISA_9.tabel).map(Number), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(Object.keys(WATAK_SISA_8.tabel).map(Number), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const c of WATAK_SISA_8.contohKitab) {
    const iso = cari(k => k.weton === c.weton);
    const r = watakNeptu(iso);
    assert.equal(r.jumlahNeptu, c.jumlah);
    assert.equal(r.bab107.sisa, c.nomor, c.weton);
  }
});

test('bab 114: neptu + jem = jumlah tercetak untuk 20 aksara; hasil berulang tiap 21 entri', () => {
  assert.deepEqual(Object.keys(WATAK_NAMA_HURUF.neptu), HANACARAKA);
  HANACARAKA.forEach((a, i) => {
    assert.equal(WATAK_NAMA_HURUF.neptu[a] + (i + 1), WATAK_NAMA_HURUF.jumlahAksara[a], a);
  });
  assert.deepEqual(Object.keys(WATAK_NAMA_HURUF.tabel).map(Number), Array.from({ length: 21 }, (_, i) => i + 5));
  for (const v of Object.values(WATAK_NAMA_HURUF.tabel)) { assert.ok(v.nama && v.makna); assert.ok(ARAH.has(v.arah)); }
});

test('bab 115: empat tingkat, 4 + 19 + 3 + 8 nama; tak ada nama ganda antar tingkat', () => {
  const t = NAMA_BAIK_BURUK.tingkat;
  assert.deepEqual([t.baik.length, t.sedang.length, t.kurangBaik.length, t.tidakBaik.length], [4, 19, 3, 8]);
  const semua = Object.values(t).flat();
  assert.equal(new Set(semua.map(n => n.toLowerCase())).size, semua.length);
});

// --- contoh kitab ------------------------------------------------------------------------------------------------------------------------------------

test('bab 114: contoh kitab sa (3 + 8 = 11) dan ya (4 + 14 = 18) = 29 = Naga ber nalare', () => {
  const r = watakNama({ depan: 'sa', belakang: 'ya' });
  assert.deepEqual([r.jumlah, r.kunci, r.nama, r.arah], [29, 8, 'Naga ber nalare', 'baik']);
  assert.equal(WATAK_NAMA_HURUF.jumlahAksara.sa, 11);
  assert.equal(WATAK_NAMA_HURUF.jumlahAksara.ya, 18);
  // pengulangan: jumlah 26 sama dengan 5, jumlah 47 dengan 5 pula
  assert.equal(watakNama({ depan: 'ga', belakang: 'ja' }).jumlah, 21 + 19); // 40 -> 19
  assert.equal(watakNama({ depan: 'ga', belakang: 'ja' }).kunci, 19);
});

test('bab 114: semua 400 pasangan aksara menghasilkan entri sah', () => {
  for (const a of HANACARAKA) for (const b of HANACARAKA) {
    const r = watakNama({ depan: a, belakang: b });
    assert.ok(r.kunci >= 5 && r.kunci <= 25, `${a}${b}`);
    assert.ok(r.nama);
  }
});

test('bab 116: Sabtu Pahing = 18 = Nabi Yusup', () => {
  const iso = cari(k => k.weton === 'Sabtu Pahing');
  const r = watakNeptu(iso);
  assert.equal(r.jumlahNeptu, RAMALAN_NABI.contohKitab.jumlah);
  assert.equal(r.bab116.nabi, RAMALAN_NABI.contohKitab.nabi);
});

test('bab 117: contoh kitab Rabu Kliwon = 15 = Jun; Jumat Pon, Kamis Legi, Minggu Kliwon = 13 = Asma, malang Sabtu bulan Ruwah', () => {
  assert.equal(watakNeptu(cari(k => k.weton === 'Rabu Kliwon')).bab117.nama, 'Jun');
  for (const w of ['Jumat Pon', 'Kamis Legi', 'Minggu Kliwon']) {
    const r = watakNeptu(cari(k => k.weton === w));
    assert.equal(r.jumlahNeptu, 13, w);
    assert.equal(r.bab117.nama, 'Asma', w);
    assert.deepEqual(r.bab117.malang, ['Sabtu', 'Ruwah'], w);
  }
});

test('bintangHari: hari dan bulan jaya/malang menurut bulan Jawa pada tanggal itu', () => {
  const lahir = cari(k => k.weton === 'Jumat Pon');
  const malang = cari(k => k.hari === 'Sabtu' && k.tanggal.wulan === 'Ruwah');
  const r = bintangHari(lahir, malang);
  assert.equal(r.lahir.bintang, 'Asma');
  assert.equal(r.malang.penuh, true);
  assert.equal(r.jaya.penuh, false);
  const jaya = cari(k => k.hari === 'Minggu' && k.tanggal.wulan === 'Sawal');
  assert.equal(bintangHari(lahir, jaya).jaya.penuh, true);
  const hariSaja = cari(k => k.hari === 'Sabtu' && k.tanggal.wulan !== 'Ruwah');
  const h = bintangHari(lahir, hariSaja);
  assert.deepEqual([h.malang.hari, h.malang.bulan, h.malang.penuh], [true, false, false]);
  assert.ok(r.peringatan && r.asumsi);
});

// --- nama --------------------------------------------------------------------------------------------------------------------------------------------

test('bab 115: contoh kitab Prawiradijaya (baik + sedang) dan Prawiraharja (baik + baik)', () => {
  const a = tinjauNama('Prawiradijaya');
  assert.deepEqual(a.komponen.map(k => k.nama), ['Prawira', 'Dijaya']);
  assert.equal(a.arah, 'baik');
  assert.ok(a.aturan.some(x => /sedang/.test(x)));
  const b = tinjauNama('Prawiraharja');
  assert.deepEqual(b.komponen.map(k => k.nama), ['Prawira', 'Harja']);
  assert.equal(b.arah, 'baik');
  assert.ok(b.aturan.some(x => /Terlebih baik/.test(x)));
});

test('bab 115: pencarian terpanjang dahulu dan aturan merangkai', () => {
  assert.deepEqual(tinjauNama('Surya').komponen.map(k => k.nama), ['Surya']); // bukan Sura
  assert.equal(tinjauNama('Surya').arah, 'buruk');
  assert.deepEqual(tinjauNama('Pranata').komponen.map(k => k.nama), ['Pranata']); // bukan Nata
  assert.equal(tinjauNama('Sujana').arah, 'buruk');
  const campur = tinjauNama('Prawira Nata');
  assert.equal(campur.arah, 'buruk');
  assert.ok(campur.aturan.some(x => /tidak boleh dirangkai/.test(x)));
  assert.equal(tinjauNama('Sura Jaya').arah, 'netral');
  const asing = tinjauNama('Budi');
  assert.deepEqual([asing.komponen.length, asing.arah], [0, null]);
  assert.throws(() => tinjauNama('123'), RangeError);
});

// --- perilaku -----------------------------------------------------------------------------------------------------------------------------------------

test('watakTanggal, watakBulan, watakMangsa: 26 April 1975', () => {
  const t = watakTanggal('1975-04-26');
  assert.equal(t.tanggalJawa.dina, 14);
  assert.equal(t.bab108.hewan, 'Singa');
  assert.equal(t.bab101.arah, 'baik');
  assert.equal(t.bergantungTanggalJawa, true);
  assert.equal(watakBulan('1975-04-26').bulan, 'Bakdamulud');
  assert.equal(watakMangsa('1975-04-26').mangsa, 'Dhesta');
  assert.equal(watakMangsa('2026-06-22').mangsa, 'Kasa');
});

test('watakLanjut: gabungan; nama opsional', () => {
  const r = watakLanjut('1975-04-26');
  assert.deepEqual(Object.keys(r).sort(), ['bulan', 'catatan', 'mangsa', 'neptu', 'tanggal']);
  const n = watakLanjut('1975-04-26', { nama: 'Sukirna' });
  assert.ok(n.nama.nama && n.baikBurukNama);
  assert.equal(n.neptu.jumlahNeptu, 17);
});

test('semua fungsi per-tanggal memuat masehi baku', () => {
  const iso = '2026-10-10';
  for (const f of [watakTanggal, watakBulan, watakMangsa, watakNeptu]) assert.equal(f(iso).masehi, iso, f.name);
  assert.equal(bintangHari(iso, iso).tanggal.masehi, iso);
});

test('600 hari berturut-turut: semua fungsi watak tanpa galat dan bersumber', () => {
  const n0 = nomorHari('2025-01-01');
  for (let i = 0; i < 600; i++) {
    const iso = isoDariNomor(n0 + i);
    const t = watakTanggal(iso);
    assert.ok(t.bab101.makna && t.bab108.hewan, iso);
    assert.ok(watakBulan(iso).bab102.makna && watakBulan(iso).bab111.makna, iso);
    assert.ok(watakMangsa(iso).makna, iso);
    const n = watakNeptu(iso);
    for (const k of ['bab105', 'bab106', 'bab107', 'bab116', 'bab117']) { assert.ok(n[k].sumber.bab, `${iso} ${k}`); assert.ok(n[k].makna || n[k].sifat, `${iso} ${k}`); }
    assert.ok(n.bab106.sisa >= 1 && n.bab106.sisa <= 9);
    assert.ok(n.bab107.sisa >= 1 && n.bab107.sisa <= 8);
  }
});

// --- bab 120 (watak wanita menurut weton), 123 (jam), 128 (catatan) ----------------------------------------------------------------------------------

import { watakWanitaWeton, jamDihindari, jadwalKehamilan, HARI, PASARAN } from '../src/index.js';
import { WATAK_WANITA_WETON } from '../src/data/watakLanjut.js';

test('bab 120: 35 weton tepat sekali (nama mesin), butir 1-35 berurutan menurut siklus 35 hari', () => {
  const semua = HARI.flatMap(h => PASARAN.map(p => `${h} ${p}`)).sort();
  assert.deepEqual(Object.keys(WATAK_WANITA_WETON.tabel).sort(), semua);
  const urut = Object.entries(WATAK_WANITA_WETON.tabel).sort((a, b) => a[1].butir - b[1].butir);
  assert.deepEqual(urut.map(([, v]) => v.butir), Array.from({ length: 35 }, (_, i) => i + 1));
  for (const [, v] of urut) { assert.ok(v.makna); assert.ok(ARAH.has(v.arah)); }
  // daftar kitab berjalan menurut siklus 35 hari: tiap butir = hari berikutnya dengan pasaran berikutnya (mulai Sabtu Pahing)
  const awal = cari(k => k.weton === 'Sabtu Pahing');
  urut.forEach(([weton], i) => assert.equal(kalenderJawa(isoDariNomor(nomorHari(awal) + i)).weton, weton, `butir ${i + 1}`));
});

test('watakWanitaWeton: contoh Sabtu Kliwon (butir 29), masehi dan sumber', () => {
  const iso = '2026-10-10'; // Sabtu Kliwon
  const r = watakWanitaWeton(iso);
  assert.equal(r.masehi, iso);
  assert.equal(r.weton, 'Sabtu Kliwon');
  assert.equal(r.butir, 29);
  assert.equal(r.arah, 'buruk');
  assert.equal(r.sumber.bab, 120);
  assert.ok(r.catatanKitab);
});

test('bab 123 (ditranskripsi terpisah dari scan) sama persis dengan bab 149: jam yang dihindari', () => {
  // [hari, [mulai1, akhir1], [mulai2, akhir2]] jam 12-an seperti tercetak
  const bab123 = {
    Minggu: [[10, 11], [5, 6]], Senin: [[8, 9], [3, 4]], Selasa: [[6, 7], [1, 2]], Rabu: [[12, 1], [5, 6]],
    Kamis: [[10, 11], [3, 4]], Jumat: [[8, 9], [1, 2]], Sabtu: [[6, 7], [11, 12]]
  };
  assert.deepEqual(bab123, JAM_DIHINDARI.cetak);
  assert.equal(JAM_DIHINDARI.serupa.bab, 123);
  const r = jamDihindari(cari(k => k.hari === 'Rabu'));
  assert.equal(r.sumberSerupa.bab, 123);
});

test('bab 128: catatan hamil mendeking ikut pada jadwalKehamilan', () => {
  assert.match(jadwalKehamilan('2026-01-15').catatanBab128, /ke-3, ke-5/);
});
