#!/usr/bin/env node
// Mengukur seberapa jauh awal bulan kalender aritmetika Jawa dari bulan baru astronomi (konjungsi Bulan-Matahari).
//
// Perlu `astronomy-engine` (bukan dependensi proyek ini; hanya untuk skrip audit ini):
//   npm i --no-save astronomy-engine && node audit/selisih_bulan_baru.mjs
//   atau: ASTRONOMY_ENGINE=/jalur/ke/astronomy-engine/esm/astronomy.js node audit/selisih_bulan_baru.mjs
// Keluaran: JSON ke stdout. Dokumen penjelasan: PAWUKON_DAN_ASTROLOGI.md.
//
// Definisi: untuk tiap tanggal 1 bulan Jawa (tanggal sipil D), ambil bulan baru yang waktunya paling dekat dengan D 00:00 WIB (UTC+7),
//   ("awalMaghribSebelumKonjungsi": jam < 0.25 hari, yaitu magrib pembuka hari ke-1 (kira-kira 18.00 WIB, 6 jam sebelum D 00:00) jatuh sebelum konjungsi.)
//   lalu ukur  selisihHari = D - (tanggal sipil WIB konjungsi)  (bilangan bulat)  dan  jam = (D 00:00 WIB - waktu konjungsi) dalam hari.
// Pembanding "windu murni" = kalender yang sama tanpa koreksi kurup: tanggalnya n hari lebih lambat (n = jumlah batas kurup yang dicapai).
import { pathToFileURL } from 'node:url';
import { kalenderJawa, nomorHari, isoDariNomor } from '../src/index.js';

const spesifikasi = process.env.ASTRONOMY_ENGINE ?? 'astronomy-engine';
const A = await import(spesifikasi.startsWith('/') ? pathToFileURL(spesifikasi).href : spesifikasi);

const WIB = 7 * 3600e3;
const HARI_MS = 86400e3;
const awal = nomorHari('1633-07-08');
const akhir = nomorHari('2052-08-25');

// 1) awal bulan Jawa menurut mesin, beserta n (jumlah batas kurup yang dicapai tahunnya: 0, 1, 2, 3)
const bulan = [];
for (let n = awal; n <= akhir; n++) {
  const iso = isoDariNomor(n);
  const { tanggal: t } = kalenderJawa(iso);
  if (t.dina === 1) bulan.push({ iso, tahun: t.tahun, n: t.tahun < 1627 ? 0 : Math.floor((t.tahun - 1627) / 120) + 1 });
}

// 2) seluruh bulan baru astronomi dari 1633 sampai 2052 (UT)
const bulanBaru = [];
let t = A.SearchMoonPhase(0, new Date(Date.UTC(1633, 5, 1)), 40);
while (t && t.date.getTime() < Date.UTC(2052, 11, 1)) {
  bulanBaru.push(t.date.getTime());
  t = A.SearchMoonPhase(0, new Date(t.date.getTime() + 20 * HARI_MS), 40);
}

// 3) cocokkan
const tanggalWIB = ms => Math.floor((ms + WIB) / HARI_MS);   // hari sejak 1970-01-01 menurut WIB
function ukur(mundur) {
  return bulan.map(b => {
    const [y, m, d] = b.iso.split('-').map(Number);
    const dHari = Date.UTC(y, m - 1, d) / HARI_MS + mundur(b);      // tanggal sipil (hari sejak 1970), untuk "murni" digeser +n
    const tD = dHari * HARI_MS - WIB;                              // D 00:00 WIB dalam ms UT
    let lo = 0, hi = bulanBaru.length - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (bulanBaru[mid] < tD) lo = mid + 1; else hi = mid; }
    const cand = [lo - 1, lo].filter(i => i >= 0);
    const i = cand.reduce((a, c) => (Math.abs(bulanBaru[c] - tD) < Math.abs(bulanBaru[a] - tD) ? c : a));
    return { tahun: b.tahun, n: b.n, selisihHari: dHari - tanggalWIB(bulanBaru[i]), jam: (tD - bulanBaru[i]) / HARI_MS };
  });
}

function ringkas(baris) {
  const rata = a => a.reduce((s, x) => s + x, 0) / a.length;
  const sd = a => { const m = rata(a); return Math.sqrt(rata(a.map(x => (x - m) ** 2))); };
  const dist = {};
  for (const r of baris) dist[r.selisihHari] = (dist[r.selisihHari] ?? 0) + 1;
  const jam = baris.map(r => r.jam);
  return { bulan: baris.length, rataSelisihHari: +rata(baris.map(r => r.selisihHari)).toFixed(3), rataHari: +rata(jam).toFixed(3), sdHari: +sd(jam).toFixed(3), minHari: +Math.min(...jam).toFixed(3), maksHari: +Math.max(...jam).toFixed(3),
    awalMaghribSebelumKonjungsi: baris.filter(r => r.jam < 0.25).length, distribusi: dist };
}

// kemiringan (hari per tahun) dari regresi linear selisih jam terhadap tahun
function kemiringan(baris) {
  const x = baris.map(r => r.tahun), y = baris.map(r => r.jam);
  const mx = x.reduce((a, b) => a + b, 0) / x.length, my = y.reduce((a, b) => a + b, 0) / y.length;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; }
  return sxy / sxx;
}

// simpangan bulan baru sejati dari garis lurus (bulan baru rata-rata): regresi waktu konjungsi terhadap nomor urut lunasi
function simpanganSejati() {
  const n = bulanBaru.length, x = bulanBaru.map((_, i) => i), y = bulanBaru.map(v => v / HARI_MS);
  const mx = (n - 1) / 2, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; }
  const b = sxy / sxx, a = my - b * mx;
  const sisa = y.map((v, i) => (v - (a + b * i)) * 24);
  return { bulanSinodisRataRata: +b.toFixed(6), sdJam: +Math.sqrt(sisa.reduce((s, v) => s + v * v, 0) / n).toFixed(2), maksJam: +Math.max(...sisa.map(Math.abs)).toFixed(2) };
}

const mesin = ukur(() => 0);
const murni = ukur(b => b.n);
const NAMA = ['Jamingiyah 1555-1626', 'Kamsiyah 1627-1746', 'Arbangiyah 1747-1866', 'Salasiyah 1867-1986'];
const hasil = {
  bulanBaruAstronomi: bulanBaru.length,
  bulanJawa: bulan.length,
  bulanBaruSejati: simpanganSejati(),
  semua: { mesin: ringkas(mesin), murni: ringkas(murni) },
  kemiringanHariPerTahun: { mesin: +kemiringan(mesin).toFixed(5), murni: +kemiringan(murni).toFixed(5) },
  perKurup: NAMA.map((nama, k) => ({ kurup: nama, mesin: ringkas(mesin.filter(r => r.n === k)), murni: ringkas(murni.filter(r => r.n === k)) })),
};
console.log(JSON.stringify(hasil, null, 1));
