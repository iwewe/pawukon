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
Kalender yang dipakai adalah **kalender aritmetika Karaton Ngayogyakarta** (lihat "Acuan kalender" di bawah); tidak ada opsi varian.

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
| `kalenderJawa(tgl)` | semua unsur kalender Jawa, hari mulia, `spekulatif`, `teks` |
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

Algoritma merujuk pada `weton.m` (François Beauducel; kode ditulis ulang, lihat [NOTICE.md](NOTICE.md)) dan dikoreksi agar cocok dengan tabel Karaton Yogyakarta, dan dibandingkan dengan port Python
yang sudah dikoreksi pada 3344 tanggal tanpa selisih. Epos: 8 Juli 1633 = Jumat Legi, 1 Sura Alip 1555.

| Bagian | Jangkauan |
|---|---|
| weton, wuku, neptu | Tanggal apa pun (siklus murni 5, 7, 35, 210 hari) |
| tanggal Jawa, tahun, windu, lambang, kurup | 8 Juli 1633 - 25 Agustus 2052. Sesudahnya `spekulatif: true` |

**Seberapa bisa dipercaya**

- **Weton dan wuku:** cocok dengan `weton.m`, `research-system-javanese-profile`, dan `almanak`; cocok dengan weton 26 April 1975
  (Sabtu Kliwon) dan siklus Galungan-Kuningan 2024-2027. Penyelarasan wuku dan pasaran juga cocok dengan 11 hari Taliwangke dan
  Samparwangke yang disebut kitab (wuku + hari + pasaran), bukti yang tidak bergantung pada `weton.m`.
- **Tanggal Jawa:** cocok dengan tabel awal bulan kalender **Karaton Yogyakarta** untuk kurup Asapon (1936-2052) dan Aboge (1819-1935), anchor 1 Sura Alip di
  keempat kurup, serta 12 titik Almanak Jawa (lihat bagian Verifikasi). Untuk 1633-1819 (Amahgi, Amiswon) tidak ada tabel Karaton; di sana mesin mengikuti metode windu asli (lihat "Metode tertua dan sumber pembanding").
- **Tes regresi:** `tests/golden.json` berisi 458 tanggal dari port Python `weton.m` yang sudah dikoreksi agar cocok dengan Karaton dan metode windu asli (bukan keluaran Octave asli); `tests/kraton.test.js` memeriksa langsung terhadap tabel Karaton.
- **Hari mulia** yang dihitung: Siji Sura, Kuningan, Hanggara Asih, Dina Mulya, Dina Purnama ("Aboge" dan "Daltugi" di `weton.m`
  hanya memeriksa sebagian syarat, jadi sengaja tidak dimasukkan).

### Aturan yang bergantung kalender Jawa

Aturan yang hanya memakai **hari, pasaran, wuku, atau jumlah neptu** bersifat pasti. Aturan yang memakai **tanggal, bulan, atau tahun Jawa**
ditandai `bergantungTanggalJawa: true`. Kitab mengikuti sistem **Aboge** (Alip = Rabu Wage), sedangkan kalender ini memakai **Asapon** sejak
1867 (Alip = Selasa Pon). Akibatnya hari pekan yang tercatat di sebagian tabel kitab (Kunarpawarsa, Sangarwarsa, Anggarakasih) bisa bergeser
sehari, sehingga aturannya dievaluasi lewat tanggal dan bulan, bukan lewat hari pekan yang tertulis. Mangsa memakai kalender pranata mangsa
baku, bukan dari kitab.

### Verifikasi dengan kalender Karaton Yogyakarta

**Sumber:** Siti Marhamah, *Kalender Jawa Islam Sultan Agungan di Kesultanan Yogyakarta* (Tesis Ilmu Falak, UIN Walisongo Semarang, 2022):
rumus dan tabel awal bulan hlm. 51-69 (mengutip KRT Rintaiswara, *Tahun Jawa Islam Sultan Agungan*, Dinas Kebudayaan DIY bersama Karaton
Ngayogyakarta Hadiningrat, 2015), serta data Almanak Jawa dan kalender Karaton hlm. 114-127. Tabel disalin ke `tests/data-kraton.js`.

**Hasil.** Karaton menetapkan 1 Sura tiap tahun dalam windu secara tetap sepanjang satu kurup (Asapon: Alip Selasa Pon, Ehe Sabtu Pahing,
Jimawal Kamis Pahing, Je Senin Legi, Dal Jumat Kliwon, Be Rabu Kliwon, Wawu Ahad Wage, Jimakir Kamis Pon), dengan tahun wuntu (355 hari) =
**Ehe, Dal, Jimakir** (tahun ke-2, 5, 8). Mesin ini sebelumnya (mengikuti `weton.m`) memberi 355 hari pada **Je** dan 354 pada **Dal**, sehingga
**seluruh tahun Dal bergeser satu hari** dari tabel Karaton, dan penyesuaian "kurup berakhir lebih cepat sehari" jatuh pada tahun yang keliru di
ujung Aboge (AJ 1865-1866). Keduanya sudah dikoreksi. Sekarang mesin cocok dengan tabel Karaton pada **semua 1440 awal bulan Asapon
(1936-2052) dan semua 1440 awal bulan Aboge (1819-1935)**, dan dengan 12 titik data Almanak Jawa/kalender Karaton yang dimuat tesis.

- Contoh yang berubah: 1 Sura Dal 1959 = **Jumat Kliwon 27 Juni 2025** (sebelumnya 28 Juni, Sabtu Legi). Tahun Dal berikutnya: AJ 1967 (2033-2034).
  1 Sura Jimawal 1957 = Kamis Pahing 20 Juli 2023 tidak berubah.
- Weton, wuku, dan pasaran tidak pernah terpengaruh (siklus murni). Yang berubah hanya nomor tanggal, bulan, dan batas tahun Jawa: pada tahun Dal
  Asapon (AJ 1871, 1879, ..., 1959, 1967, ..., 1983), sebagian tahun Dal Aboge, AJ 1865-1866, dan seluruh AJ 1627-1818 (batas kurup, selisih satu hari). Dari 3344
  tanggal uji, 607 berubah dibanding versi `weton.m`; pada tanggal sesudah 1936 hanya tahun Dal yang berubah.
- `research-system-javanese-profile` (rsjp), pembanding sebelumnya, juga tidak sepenuhnya cocok dengan Karaton: ia benar pada tahun Dal tetapi memberi
  tahun Jimawal satu hari lebih awal (1 Sura 1957 = 19 Juli 2023, Karaton: 20 Juli 2023).

**Salah ketik tesis** dikoreksi karena terbukti secara aritmetika (awal bulan berurutan harus berselisih 29 atau 30 hari): Aboge Alip Jumadilakir
"Kamis Pon" -> "Kamis Pahing"; Aboge Je Sapar "Kamis Pon" -> "Kamis Pahing"; Asapon Jimawal Rejeb "Selasa Wage" -> "Sabtu Wage".
Pada teks 1 Poso 1953 tercetak "24 Mei 2020", padahal tabelnya 24 April 2020 (1 Ramadhan 1441 H).

**Batas bukti (jujur).** Dua belas titik data almanak yang tercetak tidak ada yang jatuh pada tahun Dal, jadi tidak membedakan mesin lama dan baru.
Koreksi bertumpu pada rumus/tabel Karaton dari publikasi 2015 dan panjang tahun pada Tabel 1 tesis, bukan pada satu tanggal almanak tahun Dal.
Sangat disarankan mencocokkan dengan kalender cetak Karaton tahun 1959 J (Juni 2025 - Juni 2026): 1 Sura harus Jumat Kliwon 27 Juni 2025.

**Batas kurup (terselesaikan dengan uji).** Tesis menyebut kurup Karaton: Amahgi (Jumat Legi) 1555-1627 (72 tahun), Amiswon (Kamis Kliwon) 1627-1747,
Aboge (Rabu Wage) 1747-1867, Asapon (Selasa Pon) 1867-1987 (2053 M). Mesin sebelumnya memakai batas `weton.m` (1675, 1749 dengan geseran 2, dan varian
Yogyakarta 1795). Kedua konfigurasi konsisten pada dirinya sendiri (1 Sura tahun Alip selalu jatuh pada hari-pasaran kurup yang dilabelkan), jadi yang membedakan
adalah kecocokan dengan Karaton: (a) pada konfigurasi `weton.m`, 1 Sura Alip 1627 jatuh pada Jumat Legi dan 1747 pada Kamis Kliwon, padahal tesis menetapkan
Kamis Kliwon (Amiswon mulai 1627) dan Rabu Wage (Aboge mulai 1747); (b) tabel Aboge Karaton cocok pada 1416 dari 1440 awal bulan, dengan 24 selisih tepat pada
AJ 1747-1748. Konfigurasi Karaton lolos semuanya (1440 dari 1440), dan anchor 1 Sura Alip mundur satu hari dan satu pasaran tiap kurup (Jumat Legi, Kamis Kliwon,
Rabu Wage, Selasa Pon). Maka batas kurup Karaton dipakai dan opsi `{ jogja: true }` (kurup ke-3 mulai 1795, bertentangan dengan Karaton Yogyakarta sendiri) dihapus.
Amahgi dan Amiswon tidak punya tabel Karaton untuk diuji; pola bulan di sana kini sama dengan metode windu asli (lihat bagian berikut), setelah pola bulan khusus tahun Dal milik `weton.m` di Amiswon dihapus.

### Metode tertua dan sumber pembanding

Metode tertua adalah **windu murni**: pola 8 tahun (Ehe, Dal, Jimakir = 355 hari; bulan 30/29; Besar 30 pada tahun wuntu), tanpa koreksi kurup 120 tahun (tesis hlm. 52-56).
Mesin ini adalah metode itu **ditambah** koreksi kurup Karaton (tiap kurup membuat kalender mundur satu hari). Ini diuji langsung di `tests/kraton.test.js` dengan
implementasi windu murni yang terpisah: mesin sama pada **setiap hari** 1633-2052 setelah digeser 0, 1, 2, 3 hari menurut kurup.

Perbandingan sumber (diukur pada awal tahun 1 Sura AJ 1555-1986, relatif terhadap mesin ini yang cocok dengan Karaton):

| Sumber | Metode | Hasil |
|---|---|---|
| skrip almanak (`kalender_jawa_sultan_agungan.py`) | windu murni, tanpa kurup, berjangkar 1 Sura 1959 = 27 Juni 2025 | persis metode tertua; selisih konstan -3, -2, -1, 0 hari per kurup; hanya tepat pada Asapon |
| `research-system-javanese-profile` | batas kurup sama dengan Karaton; dua kurup awal memakai Ehe/Dal/Jimakir, lalu Ehe/Je/Jimakir mulai Aboge | sama persis pada AJ 1555-1626; selisih +1 hingga +2 hari pada 1627-1862 dan +-1 hari sesudahnya |
| `weton.m` | empat kurup dengan batas 1675 dan 1749; Je 355 dan Dal 354; pola bulan khusus tahun Dal Amiswon | sama persis hanya pada AJ 1555-1626 |
| paket npm `primbon` | tipe tanpa kurup | cocok sejak 1950; error pada 1561 dari 3344 tanggal uji sebelum 1900; selisih 1-3 hari di antaranya |
| `weton.c`, `weton.pl` | hanya weton dan wuku | tidak menghitung tanggal Jawa |

Kurup tertua (Amahgi, AJ 1555-1626) disepakati semua sumber yang menghitungnya; perbedaan muncul ketika sumber menambahkan aturan yang lebih baru (Je menggantikan Dal).

### Acuan kalender (kebijakan)

Prinsip: **ikuti yang paling valid dan lolos uji di mesin sendiri**. Konkretnya:
- Acuan tunggal adalah **kalender aritmetika Karaton Yogyakarta** (rumus dan tabel yang tetap; tidak bergantung pada pengamatan atau penetapan).
- **Tidak mengikuti penetapan awal Ramadan, Syawal, atau hari besar oleh pemerintah, rukyat, atau hisab Hijriyah.** Sejak 3 Januari 1946 penetapan itu ada pada
  pemerintah (tesis hlm. 117-127), sehingga awal Poso dan Sawal Karaton bisa berbeda satu hari dari Hijriyah; mesin ini tidak berusaha menyamakannya. Untuk
  tanggal ibadah gunakan penetapan resmi, bukan mesin ini.
- Hari Jawa dimulai saat maghrib (tesis hlm. 54), tetapi mesin menghitung per **hari kalender Masehi**: "malam 1 Sura" jatuh pada malam sebelum tanggal Masehi yang dilaporkan.
- Sumber pembanding lain (`weton.m`, `research-system-javanese-profile`, `almanak`) dipakai hanya bila lolos uji terhadap tabel Karaton; bila tidak, Karaton yang dipakai.

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
| Tabel awal bulan Karaton untuk kurup Amahgi dan Amiswon (1633-1819) | | Tidak ada; kurup ini hanya diuji terhadap metode windu asli dan anchor 1 Sura Alip |

## Pengembangan

```bash
npm test   # Node >= 18; 170+ tes termasuk contoh hitungan kitab, uji silang antar tabel, dan 600 hari berturut-turut
```

Uji penting: `tests/golden.json` (kalender), uji silang antar tabel kitab (mis. bab 147-149, 133-135, 57/173), dan `tests/readme.test.js`
yang memastikan setiap fungsi yang diekspor tercantum di README ini.
