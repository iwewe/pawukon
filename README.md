# pawukon

Mesin kalender Jawa (Sultan Agungan) dan tafsir kitab **Betaljemur Adammakna** dalam JavaScript murni, tanpa dependensi.

- **Kalender:** weton, neptu, wuku, tanggal Jawa, tahun, windu, lambang, kurup, dan hari mulia.
- **Tafsir:** watak, jodoh, hari baik, rezeki, kesehatan, rumah, bepergian, tabel jam, hajatan, nama, dan ciri tubuh.
  Semua tabel kitab dikodekan dengan rujukan **bab dan halaman scan**, dan diuji dengan contoh hitungan kitab sendiri.

```js
import { kalenderJawa, weton, tafsirLahir, tinjauHari, saatAgung } from './src/index.js';

weton('1975-04-26');
// { hari: 'Sabtu', dinapitu: 'Setu', pasaran: 'Kliwon', weton: 'Sabtu Kliwon',
//   neptu: { hari: 9, pasaran: 8, total: 17 }, wuku: 'Kuningan', nomorWuku: 12 }

kalenderJawa('2021-08-10').teks;
// 'Selasa Pon Kulawu 1 Sura 1955 AJ Alip Sengara Langkir Salasiyah (Asapon) [Siji Sura]'

tafsirLahir('1975-04-26').watak.wuku;   // { nama: 'Kuningan', dewa: 'Indra', kala: 'Barat', ... }
tinjauHari('2026-10-10', { untuk: 'nikah' }).temuan;   // temuan baik/buruk + rujukan bab dan halaman
saatAgung('2026-10-10').saat;           // tujuh saat 06.00-18.00 dengan penilaian
```

Masukan tanggal boleh `'YYYY-MM-DD'`, `Date` (komponen lokal), `[tahun, bulan, hari]`, atau `{tahun, bulan, hari}`.
`kalenderJawa(tgl, { jogja: true })` memakai kurup 3 versi Kasultanan Yogyakarta (memengaruhi 1821-1866).

Repositori: https://github.com/iwewe/pawukon. Lisensi **MIT** ([LICENSE](LICENSE)); rujukan dan kredit di [NOTICE.md](NOTICE.md).

> Semua tafsir adalah **tradisi**, bukan fakta ilmiah, ramalan, atau nasihat profesional (kesehatan, kehamilan, bangunan, pernikahan).

## Isi

Tiap modul `src/*.js` berpasangan dengan data di `src/data/*.js`. Kolom "Verifikasi": **scan** = tabel diperiksa pada
gambar halaman PDF sumber (OCR merusak banyak tabel); **ocr-konsisten** = teks OCR yang bersih dibandingkan dengan scan.

| Modul | Bab (hlm.) | Isi |
|---|---|---|
| `kalender.js` | | Mesin kalender (lihat bagian Kalender) |
| `tafsir.js` | 1-2, 15-17, 97-110, 118 (6-14, 60-90) | Watak lahir (hari, pasaran, weton, sisa 7, wuku), kedudukan, jodoh dasar |
| `hari.js` | 3-14, 26-33 (7-12, 18-21) | Hari baik dan naas: bepergian, Taliwangke, Samparwangke, bulan, tanggal sangar, bulan nikah |
| `rezeki.js` | 91-92, 159-161 (54-56, 128-130) | Mata pencaharian, wiji, nafkah, Sri/Sadana |
| `kesehatan.js` | 318-325 (239-242) | Sebab sakit, bagian tubuh rawan, arah berobat |
| `rumah.js` | 168, 172-181, 187-198 (135-151) | Arah rumah, hari/jam/bulan/mangsa membangun, ukuran, pintu halaman, sumur |
| `bepergian.js` | 130-141, 143-145, 151-156 (112-126) | Naga, rijalolah, Kala/Baya, na'as, sa'at, pindah, menghadap pejabat, arah hidup-mati |
| `jam.js` | 34-37, 146-149, 157-158, 162, 164-166 (22-26, 119-123, 126-127, 131-134) | Saat agung, saat 12, saat bintang, lima saat penjaga, saat perkara, saat akad |
| `pernikahan.js` | 18-25, 167 (14-18, 134-135) | Jodoh menurut nama dan weton, tempat tinggal menurut huruf nama |
| `hajatan.js` | 39-42, 55-57, 65, 68-74 (26-27, 35-38, 42, 44-46) | Hari tarub, tingkeb, kehamilan, jam bayi lahir, nama bayi, jadwal selamatan bayi |
| `watakLanjut.js` | 101-103, 105-108, 111, 114-117, 120 (bag.) (64-84, 78-80, 100-101) | Watak menurut tanggal/bulan/mangsa/neptu, hari binatang, perbintangan, nama |
| `ciriTubuh.js` | 112, 113, 119 (74-77, 91-98) | Andeng-andeng, toh, ukuran anggota badan, tanda gabungan wajah dan badan |

## Referensi fungsi

Semua fungsi diekspor dari `src/index.js`. `tgl` = masukan tanggal di atas. Setiap fungsi tafsir mengembalikan objek
berisi `sumber` (bab dan halaman) dan `catatan` atau `peringatan`.

### Kalender

| Fungsi | Mengembalikan |
|---|---|
| `weton(tgl)` | hari, pasaran, weton, neptu, wuku (valid untuk tanggal apa pun) |
| `wuku(tgl)` | wuku dan nomornya |
| `kalenderJawa(tgl, { jogja })` | semua unsur kalender Jawa, hari mulia, `spekulatif`, `teks` |
| `selapan(tgl, n)` | tanggal Masehi tiap 35 hari |
| `nomorHari(tgl)`, `isoDariNomor(n)` | nomor hari berurut dan kebalikannya |

Konstanta: `HARI`, `PASARAN`, `DINAPITU`, `WUKU`, `WULAN`, `TAUN`, `WINDU`, `LAMBANG`, `AWAL_KALENDER`, `AKHIR_KALENDER`.

### Watak, jodoh, rezeki, kesehatan

| Fungsi | Bab | Keterangan |
|---|---|---|
| `tafsirLahir(tgl)` | 1-2, 97-110, 118 | watak hari, pasaran, weton, sisa 7, wuku; kedudukan |
| `jodoh(tglA, tglB)` | 15-17 | tiga metode jodoh dasar (sisa 9, sisa 4, pasangan hari) |
| `jodohNama(pria, wanita)` | 18-21 | huruf depan/belakang nama; Kraton mulyo. Nama atau `{ depan, belakang }` |
| `jodohWeton(suami, istri)` | 22-25 | neptu weton (+ tanggal Jawa); juga menerima `{ hari, pasaran, wulan, taun, tanggal }` |
| `aksaraNama(nama)`, `aksaraSemua(nama)` | | alih huruf nama Latin ke aksara hanacaraka (perkiraan) |
| `desaTinggal(nama, desa)` | 167 | tempat tinggal menurut huruf nama |
| `rezeki(tgl)`, `wiji(tgl)` | 91-92, 159-161 | mata pencaharian, wiji, nafkah, arah |
| `kesehatanLahir(tgl)`, `kesehatanSakit(tgl)`, `arahBerobat(tgl)` | 318-325 | bagian tubuh rawan, sebab sakit, arah berobat. Memuat `PERINGATAN_MEDIS` |
| `watakLanjut(tgl, { nama })` | 101-117 | gabungan semua fungsi di bawah |
| `watakTanggal(tgl)` | 101, 108 | watak tanggal Jawa dan "hari binatang" |
| `watakBulan(tgl)`, `watakMangsa(tgl)` | 102, 111, 103 | watak menurut bulan Jawa dan mangsa |
| `watakNeptu(tgl)` | 105-107, 116, 117 | sisa 9/8, ramalan nabi, perbintangan |
| `bintangHari(lahir, tgl)` | 117 | apakah `tgl` hari/bulan jaya atau malang bintang kelahiran |
| `watakNama(nama)`, `tinjauNama(nama)` | 114, 115 | watak menurut huruf nama; baik-buruknya komponen nama |
| `watakWanitaWeton(tgl)` | 120 (bagian weton) | watak perempuan menurut weton lahir (35 butir); tafsir bernorma zamannya |

### Hari baik, bepergian, rumah

| Fungsi | Bab | Keterangan |
|---|---|---|
| `tinjauHari(tgl, { untuk })` | 3-14, 26-33 | `untuk`: `'semua'`, `'nikah'`, `'umum'`, `'bepergian'` |
| `tinjauBepergian(tgl, { tujuan })` | 130-141, 143-145, 152-156 | arah naga/kala/hidup-mati, kala-baya, sa'at, na'as; `tujuan` = arah mata angin |
| `pindahKediaman(tgl)`, `menghadapPejabat(tgl)` | 151, 153 | |
| `arahRumah(lahir)`, `rumahHari(tgl)` | 172-181 | arah hadap; hari mulai membangun |
| `ukuranRumah(jenis, jumlah)`, `pintuHalaman({...})`, `letakSumur({...})`, `halaman()` | 168, 187-198 | hitungan ukuran, pintu, sumur, bentuk halaman |
| `mangsaDari(tgl)` | | mangsa menurut kalender pranata mangsa baku (bukan dari kitab) |

### Jam

| Fungsi | Bab | Keterangan |
|---|---|---|
| `saatAgung(tgl)`, `saatAgungDi(tgl, jam)` | 147 | tujuh saat 06.00-18.00; saat pada jam tertentu |
| `hariMenurutJam(tgl, jam)`, `jamDihindari(tgl)` | 148, 149 | jam menurut hari; dua jam yang dihindari |
| `saat12(tgl)`, `saat12Di(tgl, jam)` | 146 | saat 12 siang dan malam |
| `saatBintang(tgl, jam)`, `jamSialBaik(tgl)`, `saatMalaikat(tgl)` | 162, 157, 158 | |
| `saatPerkara(tgl)` | 164, 165 | berangkat ke pengadilan, berunding, menyeberang |
| `saatNikah(tgl)`, `suhara(tgl)`, `akadTigaJenis(tgl)` | 34-37, 166 | saat dan hari akad |
| `siklusHari(namaHari)`, `kelompokTanggal(dina)`, `jamDesimal(jam)` | | pembantu (siklus 12 jam, kelompok tanggal 1-5, penguraian jam) |

### Hajatan

| Fungsi | Bab | Keterangan |
|---|---|---|
| `hariTarub(tgl)` | 39-42 | tiga cara memilih hari; saat memasang: `saatNikah()` |
| `tingkeb(tgl)`, `cariTingkeb(dari, hari)` | 56 | Rabu/Sabtu dan tanggal Jawa ganjil < 15 |
| `jadwalKehamilan(acuan)`, `tambahBulan(tgl, n)` | 55-56 | tanggal tiap bulan kehamilan (bulan Masehi dari acuan) |
| `saatBayiLahir(tgl, jam)` | 57 | jam kelahiran yang baik (siang dan malam) |
| `namaBayi(lahir, nama)` | 65 | neptu weton + huruf nama habis dibagi 5? |
| `jadwalBayi(lahir)` | 68-74 | sepasar, selapan, tedak siten, rentang usia upacara |

### Ciri tubuh

| Fungsi | Bab | Keterangan |
|---|---|---|
| `andengAndeng(cari)`, `toh(cari)` | 112, 113 | menurut kata kunci atau nomor butir; tanpa argumen = semua |
| `ciriAnggota(bagian)` | 119 (1-21) | tanpa argumen = daftar anggota badan |
| `tandaGabungan(cari)` | 119 (22-80) | kata kunci atau nomor butir |
| `cariCiri(kata)` | 112, 113, 119 | cari di keempatnya (semua kata harus ada) |

Konstanta: `CATATAN`, `PERINGATAN_MEDIS`, `PERINGATAN_CIRI`.

## Konvensi hasil

- **`sumber`**: `{ bab, halaman: [...], verifikasi }`, halaman = nomor halaman cetak kitab.
- **`arah`**: `'baik'`, `'buruk'`, atau `'netral'`; **klasifikasi kami** agar mudah diringkas, bukan kata kitab.
- **`bergantungTanggalJawa: true`**: aturan memakai tanggal, bulan, atau tahun Jawa dan bisa bergeser sehari (lihat di bawah).
- **`spekulatif: true`**: tanggal di luar jangkauan kalender Jawa (sesudah 25 Agustus 2052).
- **`asumsi`, `anomali`, `catatanCetak`, `catatanBanding`**: konvensi yang kami tambahkan, atau keganjilan cetakan kitab yang disalin apa adanya.
- **`peringatan`**: pada hasil kesehatan, perbintangan, dan ciri tubuh.
- **Jam** memakai 24 jam; jam dalam hari ditulis desimal (7.5 = 07.30); jam > 24 jatuh pada dini hari berikutnya.
- Nama mengikuti mesin: Minggu (bukan Ahad), Pahing (bukan Paing), Mulud, Bakdamulud, Pasa, Sawal, Dulkangidah.

## Kalender

Algoritma merujuk pada `weton.m` (François Beauducel; kode ditulis ulang, lihat [NOTICE.md](NOTICE.md)) dan dibandingkan dengan port Python pada
3344 tanggal tanpa selisih. Epos: 8 Juli 1633 = Jumat Legi, 1 Sura Alip 1555.

| Bagian | Jangkauan |
|---|---|
| weton, wuku, neptu | Tanggal apa pun (siklus murni 5, 7, 35, 210 hari) |
| tanggal Jawa, tahun, windu, lambang, kurup | 8 Juli 1633 - 25 Agustus 2052. Sesudahnya `spekulatif: true` |

**Seberapa bisa dipercaya**

- **Weton dan wuku:** cocok dengan `weton.m`, `research-system-javanese-profile`, dan `almanak`; cocok dengan weton 26 April 1975
  (Sabtu Kliwon) dan siklus Galungan-Kuningan 2024-2027. Penyelarasan wuku dan pasaran juga cocok dengan 11 hari Taliwangke dan
  Samparwangke yang disebut kitab (wuku + hari + pasaran), bukti yang tidak bergantung pada `weton.m`.
- **Tanggal Jawa:** mengikuti tabel kurup `weton.m`, cocok dengan 4 contoh yang dipublikasikan. **Belum diverifikasi** terhadap kalender
  resmi Kraton: pada 1 Sura 1957 dan 1959 mesin ini berbeda satu hari dari `research-system-javanese-profile`.
- **Tes regresi:** `tests/golden.json` berisi 458 tanggal (+76 Yogyakarta) dari port Python `weton.m`; itu bukan keluaran Octave asli.
- **Hari mulia** yang dihitung: Siji Sura, Kuningan, Hanggara Asih, Dina Mulya, Dina Purnama ("Aboge" dan "Daltugi" di `weton.m`
  hanya memeriksa sebagian syarat, jadi sengaja tidak dimasukkan).

### Aturan yang bergantung kalender Jawa

Aturan yang hanya memakai **hari, pasaran, wuku, atau jumlah neptu** bersifat pasti. Aturan yang memakai **tanggal, bulan, atau tahun Jawa**
ditandai `bergantungTanggalJawa: true`. Kitab mengikuti sistem **Aboge** (Alip = Rabu Wage), sedangkan kalender ini memakai **Asapon** sejak
1867 (Alip = Selasa Pon). Akibatnya hari pekan yang tercatat di sebagian tabel kitab (Kunarpawarsa, Sangarwarsa, Anggarakasih) bisa bergeser
sehari, sehingga aturannya dievaluasi lewat tanggal dan bulan, bukan lewat hari pekan yang tertulis. Mangsa memakai kalender pranata mangsa
baku, bukan dari kitab.

### Selisih satu hari dengan kalender lain (terbuka, menunggu kalender Kraton)

**Status:** belum terselesaikan; akan diperbaiki setelah kalender resmi Kraton tersedia sebagai pembanding.

**Yang diketahui.** Mesin ini dibandingkan dengan `research-system-javanese-profile` (rsjp) pada 6209 hari (2018-2034):
- **Weton, wuku, dan pasaran identik pada semua hari** (0 selisih). Hanya **nomor tanggal Jawa** (dan batas tahun) yang bisa berbeda.
- Pada tahun AJ **1951 (Jan-Sep 2018), 1957, 1959, 1965, dan 1967 (sebagian 1968)** seluruh tanggal mesin ini **tertinggal satu hari** dari rsjp.
  Pada tahun lain di rentang itu (1952-1956, 1958, 1960-1964, 1966) keduanya sama.
- Contoh: 1 Sura 1957 menurut mesin = Kamis Pahing 20 Juli 2023, menurut rsjp = Rabu Legi 19 Juli 2023; 1 Sura 1959 menurut mesin =
  Sabtu Legi 28 Juni 2025, menurut rsjp = Jumat Kliwon 27 Juni 2025. Awal 1956, 1958, dan 1960 sama (30 Juli 2022, 8 Juli 2024, 17 Juni 2026).
- Pada 1956-1959 pola ini berarti hari ke-355 (tahun wuntu) jatuh pada tahun yang berbeda: mesin memberi 355 hari pada 1956 dan 1958, rsjp pada 1957 dan 1959.

**Dugaan sebab (belum terbukti):** perbedaan penetapan tahun mana yang berumur 355 hari / pergeseran kurup, atau konvensi pergantian hari
saat maghrib (malam 1 Sura jatuh pada malam sebelum tanggal Masehi yang dikutip). Tidak ada satu pun dari keduanya yang dapat dipastikan tanpa kalender Kraton.

**Dampak:** hanya hasil yang memakai tanggal, bulan, atau tahun Jawa (`kalenderJawa`, aturan `bergantungTanggalJawa: true`) pada tahun-tahun di atas yang bisa
bergeser satu hari. Semua yang berbasis hari, pasaran, wuku, dan jumlah neptu tidak terpengaruh. Opsi `{ jogja: true }` hanya menyangkut kurup 1821-1866.

**Rencana perbaikan:**
1. Kumpulkan 1 Sura (hari, pasaran, tanggal Masehi) dan panjang tiap bulan dari kalender Kraton untuk AJ sekitar 1930-1990 (lebih panjang lebih baik).
2. Bandingkan dengan mesin dan rsjp; tentukan mana yang cocok.
3. Bila Kraton cocok dengan salah satunya, koreksi tabel panjang tahun/kurup di `src/kalender.js` dan perbarui `tests/golden.json`; bila berbeda dari
   keduanya, tambahkan opsi `kalenderJawa(tgl, { kraton: true })` seperti `jogja`.
4. Tambahkan tes regresi per tanggal 1 Sura dari data Kraton.

## Asumsi dan anomali kitab

Tercatat di data dan keluar pada hasil fungsi yang bersangkutan. Keganjilan cetakan **disalin apa adanya dan tidak ditebak**.

**Umum**
- Sisa 0 dibaca sebagai pembaginya (9, 7, 5, 4, ...) bila kitab tidak menyebut; tabelnya biasanya memuat sisa itu.
- Jumlah lebih kecil dari pembagi dipakai apa adanya (contoh kitab bab 107).
- Pembagi yang tidak tertulis (bab 141: 5; 151: 6; 176-180, 318: sebanyak nama) dibaca sebagai hitungan berputar; hanya bab 141 punya contoh.

**Jam, bepergian, hari baik**
- Jam kitab ditulis 12-an (1-5 = 13-17) dan dibaca sebagai 06.00-18.00; bab 147, 149, 164, 165 memakai angka 24 jam yang cocok.
- Bab 147-149, 164, 165 satu siklus: tujuh saat 2,2,1,2,2,2,1 jam dari 06.00. Bab 148 (ditranskripsi terpisah) cocok pada 49 titik; bab 149 sama dengan saat Lara dan Pati.
- Salah cetak (di `selisihCetak`): bab 147 Rabu-Wiji "1 - 1"; bab 165 Selasa Tresna "8-9" dan Tangguh "16-17"; bab 164 Rabu dan Jumat satu entri Cidra.
- Bab 156: Rabu Kliwon tercetak dua kali dan Rabu Legi tidak ada. Bab 157: angka baik kedua Selasa tercetak 1 (pola: 10). Bab 37: Sabtu siang 10.00-18.00 (pola: selisih 7 jam).
- Bab 34: "Idem" = sel di atasnya; "yang ke-n" = urutan hari itu dalam bulan Jawa (tanggal 1-7 = ke-1, ...).
- Naga/kala adalah arah yang dihindari menurut kitab; klasifikasi tiap arah milik kami, rijalolah hanya dilaporkan (netral).
- Bab 57 dan bab 173 adalah tabel jam yang sama dan berbeda di dua angka (Rabu dan Sabtu); masing-masing disimpan sesuai cetakan.

**Jodoh dan nama**
- Kitab memberi nama dalam aksara Jawa; mesin mengalihhurufkan nama Latin dengan kaidah sederhana (perkiraan). Berikan `{ depan, belakang }` bila ejaan menyimpang.
- Ada empat skema neptu aksara berbeda (bab 18, 19, 20/167, 114), semuanya dibaca dari scan.
- Bab 21: garis I-IV diagram Kraton mulyo dibaca dari gambar; pihak yang kalah hanya ditentukan untuk garis bersebelahan (garis berhadapan: `kalah: null`).
- Bab 22: "dibagi 7 atau 10, sisa tidak boleh lebih dari 7": dicoba 10 dulu, selain itu 7; kedua kandidat dilaporkan. Urutan nama 5 dan 6 terbalik dari bab 104.
- Bab 24-25: neptu tanggal = nomor tanggal Jawa kelahiran (contoh kitab 20 dan 14).

**Hajatan**
- Bab 39-41: tiga cara berbeda (jumlah neptu, tanggal mod 5, tanggal mod 7), pilih salah satu; catatan bab 41 salah merujuk ke "no 36, 37, 38".
- Bab 55-56: usia kehamilan dihitung dalam bulan Masehi dari tanggal acuan. Bab 65: hanya hitungan habis dibagi 5 yang disebut baik; sisa lain `netral`.
- Bab 68-74: hanya tanggal; selapan jatuh pada weton lahir.

**Watak dan ciri tubuh**
- Kalimat ditulis lebih netral daripada kitab (mis. "durhaka" menjadi "kurang berbakti"). Penolak, syarat cincin, kisah nabi (bab 108), ciri pencuri, dan uraian persetubuhan tidak dimasukkan.
- Bab 117: kata "harus dimulai" pada hari kemalangan tampaknya salah cetak; mesin hanya melaporkan kecocokan hari dan bulan. Kalimat "dekat ajal" adalah isi kitab, bukan fakta medis.
- Bab 112: Tujusih (butir 17 dan 18) dan Gunasakti (9 dan 21) ganda; butir 36 dan 37 bertuliskan letak sama dengan nama berbeda; butir 57 tanpa nama.
- **Bab 120-129 (hanya bagian berbasis kalender yang dikodekan):** watak perempuan menurut weton lahir (bab 120, 35 butir; kalimat dilunakkan dan tafsirnya mencerminkan norma zamannya),
  jam larangan bab 123 (tabel yang sama persis dengan bab 149, dipakai sebagai uji silang tanpa disalin lagi), dan catatan bab 128 tentang "hamil mendeking" (urutan kehamilan atau bulan? tidak jelas; dua bacaan disebut).
  Lihat "Belum dikerjakan" untuk yang sengaja tidak dimasukkan.
- Ciri tubuh adalah fisiognomi tradisional tanpa dasar ilmiah; butir yang berisi perkiraan umur dan keturunan diberi tanda "(kitab)". Jangan dipakai menilai orang.

## Cara menulis data

- **Bukan salinan teks.** Sumbernya terjemahan Indonesia modern kitab ini, yang punya hak cipta sendiri. Fakta (angka, nama, pasangan, arah) dipertahankan;
  kalimat makna ditulis ulang. Teks OCR mentah tidak disertakan di repo.
- **Kemiripan diukur:** dari 923 teks deskriptif dalam data, tidak ada yang memuat rangkaian kata berturut-turut sama dengan sumber lebih dari 6 kata
  (62 teks memuat rangkaian 5-6 kata, umumnya nama anggota badan dan frasa lazim). Pengukuran dilakukan terhadap OCR seluruh kitab. Bila data ini akan
  dipublikasikan luas, pertimbangkan pemeriksaan hukum.
- **Daftar istilah yang disalin** (nama hari binatang, nama bintang, nama letak) adalah fakta, bukan ekspresi.

## Belum dikerjakan (kitab 337 bab)

| Topik | Bab | Catatan |
|---|---|---|
| Bertamu (cuwa/suka/hewa/begja) | 137 | Data ada di `bepergian.js`, tidak dihitung: kitab tidak menyebut cara menjatuhkan neptu ke empat nama |
| Na'as hari, bulan, tahun | 163 | Hanya uraian akibat |
| Hajatan: sajen, busana, tata cara, penolak godaan | 38, 43-54, 58-64, 66-67, 71-74 (tata cara) | **Sengaja tidak dimasukkan** (ritual) |
| Bab 120-129 selain bagian di atas | 120 (penilaian perempuan menurut warna kulit, bentuk badan, gerak-gerik), 121, 122, 124-127, 128-129 (selain catatan) | **Sengaja tidak dimasukkan:** bukan hitungan kalender dan menstigma (penilaian watak dan kesetiaan perempuan dari penampilan; penilaian erotis tubuh), mantra dan tata cara (125-126), ramuan pembersih (127), aturan hari yang mengaitkan kecacatan atau "kegilaan" anak dengan perilaku orang tua (122), serta pantangan, ramuan, dan doa kehamilan (128-129) |
| Ramuan, mantra, doa, tumbal, ritual bepergian | 75-90, 138, 139, 142, 169-171, 182-184, 186, 200-221, 280-285, 319, 323-324, 326; doa pada 157; busana/ritual pada 158 dan 166 | **Sengaja tidak dimasukkan** (ramuan dapat membahayakan, doa bukan data) |
| Tanda alam, hewan, mimpi, pencuri, barang hilang | 222-317 | Di luar perhitungan kalender |
| Selisih satu hari tanggal Jawa dengan Kraton | | Menunggu kalender Kraton sebagai pembanding |

## Pengembangan

```bash
npm test   # Node >= 18; 170+ tes termasuk contoh hitungan kitab, uji silang antar tabel, dan 600 hari berturut-turut
```

Uji penting: `tests/golden.json` (kalender), uji silang antar tabel kitab (mis. bab 147-149, 133-135, 57/173), dan `tests/readme.test.js`
yang memastikan setiap fungsi yang diekspor tercantum di README ini.
