# pawukon

**Kalender Jawa Sultan Agungan, weton, wuku, dan petungan kitab Betaljemur Adammakna: dapat dihitung, diuji, dan diulang.**

Pustaka JavaScript murni (Node.js 18+, tanpa dependensi) sekaligus **sumber rujukan** yang memisahkan tiga hal yang sering tercampur:
apa yang **dihitung** (aritmetika), apa yang **diuji** terhadap acuan (kalender Keraton Ngayogyakarta), dan apa yang hanya **tradisi** (tafsir).

> Semua tafsir adalah **tradisi**, bukan fakta ilmiah, ramalan, atau nasihat profesional (kesehatan, kehamilan, bangunan, pernikahan).

## Empat temuan, masing-masing dengan bukti

Kode **K#** menunjuk ke [Matriks klaim dan bukti](docs/ilmiah/MATRIKS_KLAIM_BUKTI.md): apa klaimnya, buktinya, cara mengulang, dan batasnya.

1. **Weton, wuku, dan neptu hanyalah tiga rumus sisa bagi** dari nomor hari (siklus 7, 5, 35, dan 210 hari). Tidak ada data astronomi di dalamnya, jadi
   pawukon bukan astrologi, melainkan kalender dan petungan. Rumus ditulis ulang terpisah dan cocok dengan mesin pada 288.134 hari berturut-turut (**K1**).
2. **Kalender Jawa Keraton dapat dihitung dengan satu rumus tertutup** dan cocok dengan seluruh 2 × 1.440 awal bulan pada tabel Keraton, 15 tanggal almanak
   yang tercetak, dan tiga pengumuman acara Keraton tahun Dal 1959 (**K2 sampai K5**). Program lain berbeda pada tahun Dal dan batas kurup (**K6**).
3. **Kurup terukur benar-benar mengoreksi Bulan.** Tahun Jawa (354,375 hari) sedikit lebih panjang dari dua belas bulan sinodis (354,367 hari). Pada
   5.184 bulan, windu murni tertinggal +0,00792 hari per tahun terhadap bulan baru astronomi, dan dengan kurup hanya −0,00022 (**K8**). Namun kalender
   hitungan tidak menjamin awal bulan sesudah bulan baru (**K9**).
4. **Tafsir tidak diuji dan tidak diklaim valid** (**K12**). Hitungan sahih tidak berarti maknanya sahih.

## Peta dokumentasi

| Anda ingin... | Mulai dari |
|---|---|
| memahami dengan bahasa sehari-hari | [docs/populer/](docs/populer/01-apa-itu-weton-dan-pawukon.md) (enam halaman pendek) |
| memeriksa klaim satu per satu | [Matriks klaim dan bukti](docs/ilmiah/MATRIKS_KLAIM_BUKTI.md) |
| membaca dasar ilmiah | [docs/ilmiah/](docs/README.md#lapis-ilmiah): kalender dan verifikasi, pawukon dan astrologi, paparan ilmiah |
| mengimplementasikan di bahasa lain | [Rumusan perhitungan](docs/spesifikasi/RUMUSAN_PERHITUNGAN.md), [vektor uji](spec/vektor_uji.json), [implementasi acuan](spec/referensi.py) |
| memakai pustaka | [Referensi pustaka](docs/pustaka/REFERENSI_API.md) |

Peta lengkap dengan deskripsi tiap berkas: [docs/README.md](docs/README.md).

## Mencoba

```js
import { kalenderJawa, weton, tafsirLahir, tinjauHari, saatAgung } from './src/index.js';

weton('1975-04-26');
// { hari: 'Sabtu', dinapitu: 'Setu', pasaran: 'Kliwon', weton: 'Sabtu Kliwon',
//   neptu: { hari: 9, pasaran: 8, total: 17 }, wuku: 'Kuningan', nomorWuku: 12 }

kalenderJawa('2025-06-27').teks;
// 'Jemuwah Kliwon Medangkungan 1 Sura 1959 AJ Dal Sancaya Kulawu Salasiyah (Asapon) [Siji Sura]'

tafsirLahir('1975-04-26').watak.wuku;   // { nama: 'Kuningan', dewa: 'Indra', kala: 'Barat', ... }
tinjauHari('2026-10-10', { untuk: 'nikah' }).temuan;   // temuan baik/buruk + rujukan bab dan halaman
saatAgung('2026-10-10').saat;           // tujuh saat 06.00-18.00 dengan penilaian
```

Masukan tanggal boleh `'YYYY-MM-DD'`, `Date` (komponen lokal), `[tahun, bulan, hari]`, atau `{tahun, bulan, hari}`. Kalender yang dipakai adalah
**kalender aritmetika Keraton Ngayogyakarta**; tidak ada opsi varian. Semua fungsi: [Referensi pustaka](docs/pustaka/REFERENSI_API.md).

Catatan: mesin menghitung per **tanggal sipil**; hari Jawa sebenarnya berganti saat magrib (**K10**).

## Mengulang semua hasil

```bash
npm test                           # seluruh tes: kalender, tabel Keraton, almanak, spesifikasi, tafsir
npm run verify                     # tes + implementasi acuan Python; mencetak checksum seluruh rentang kalender
python3 -I audit/audit_pawukon.py /dev/null          # perbandingan metode: pustaka ini, weton.m, rsjp, almanak
npm i --no-save astronomy-engine && node audit/selisih_bulan_baru.mjs     # ukuran kalender terhadap bulan baru astronomi
```

Checksum kalender yang harus muncul pada `npm run verify`: `9991c8da3e12c39a844465df77c77d933eb68482b53f4e92b20f290f5fe6121b` (153.086 hari).

## Cara mengutip

Berkas [CITATION.cff](CITATION.cff) dibaca GitHub (tombol "Cite this repository"). Secara singkat:

> Iwewe. (2026). *pawukon: rumusan komputasi kalender Jawa Sultan Agungan dan petungan Betaljemur Adammakna* (versi 0.2.0) [perangkat lunak dan dokumentasi].
> https://github.com/iwewe/pawukon

Sebutkan versi atau commit yang Anda pakai: dokumen berubah seiring temuan baru, dan [CHANGELOG](CHANGELOG.md) mencatat tiap perubahan yang memengaruhi hasil.

## Batas dan penafian

* Hasil sesudah 25 Agustus 2052 adalah ekstrapolasi (`spekulatif: true`); tabel mesin berakhir 3 Juli 2285.
* Kalender ini bukan kalender astronomi atau Hijriyah, dan **tidak untuk menentukan hari ibadah** (**K9**, **K13**).
* Tabel Keraton untuk kurup Amahgi dan Amiswon (1633 sampai 1819) tidak tersedia; di sana mesin mengikuti metode windu murni (**K3**, **K5**).
* Belum ada almanak cetak tahun Dal yang dicocokkan (**K4**).
* Kalimat tafsir ditulis ulang dari terjemahan modern kitab; ritual, doa, mantra, penolak, dan ramuan sengaja tidak dimasukkan.

## In English

**pawukon** is a dependency-free JavaScript library and a reproducible reference for the Javanese Sultan Agungan arithmetic calendar (as kept by the
Keraton Ngayogyakarta), the 210-day *pawukon* cycle (weton, wuku, neptu), and the traditional readings of the *Betaljemur Adammakna* primbon.
The calendar is specified as a language-neutral integer formulation with test vectors and SHA-256 checksums, checked day by day against an independent
implementation, and compared with the Keraton month-start tables (2 × 1,440 months), printed almanac dates and Keraton event announcements.
A measurement against astronomical new moons (5,184 months, 1633–2052) shows that the 120-year *kurup* correction removes the secular drift between the
arithmetic year (354.375 days) and twelve synodic months (354.367 days). Interpretations (character, compatibility, auspicious days) are tradition: they
are not tested and not claimed to be valid. Documentation is in Indonesian; the [claims and evidence matrix](docs/ilmiah/MATRIKS_KLAIM_BUKTI.md) lists every
claim with its evidence, how to reproduce it, and its limits.

## Lisensi dan kredit

**MIT** ([LICENSE](LICENSE)), hak cipta Iwewe. Rujukan dan kredit di [NOTICE.md](NOTICE.md). Kode ditulis ulang; tidak ada kode sumber pihak lain yang disalin.
