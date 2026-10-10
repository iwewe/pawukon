# Rumusan perhitungan pawukon dan kalender Jawa

Dokumen ini memuat rumusan komputasi **yang tidak bergantung pada bahasa pemrograman**: hanya bilangan bulat, penjumlahan,
pembagian lantai (`floor`), dan sisa bagi (`mod`). Siapa pun dapat mengimplementasikannya di bahasa apa pun (C, Go, Rust, Java,
PHP, Kotlin, Dart, SQL, ...) lalu memeriksa hasilnya dengan vektor uji dan checksum di bagian 10.

Acuan kalender: **kalender aritmetika Sultan Agungan menurut Keraton Ngayogyakarta** (kebijakan proyek, lihat [Kalender dan verifikasi](../ilmiah/KALENDER_DAN_VERIFIKASI.md#acuan-kalender-kebijakan)). Tidak ada
masukan dari rukyat, hisab Hijriyah, atau penetapan Ramadan/Syawal pemerintah; semuanya murni aritmetika.

Berkas pendukung:

| Berkas | Isi |
|---|---|
| [`spec/referensi.py`](../../spec/referensi.py) | implementasi acuan (±180 baris), hanya pustaka standar Python, ditulis dari dokumen ini |
| [`spec/vektor_uji.json`](../../spec/vektor_uji.json) | vektor uji (awal 673 tahun, 19 tanggal) dan checksum, dalam JSON |
| [`tests/spesifikasi.test.js`](../../tests/spesifikasi.test.js) | menjaga dokumen, vektor, dan mesin JS tetap sama |

## 0. Ringkasan satu layar

Misalkan `d` = jumlah hari sejak **8 Juli 1633 (Jumat Legi)**, dengan `d` boleh negatif.

```
hari     = (d + 4) mod 7              Senin = 0 ... Minggu = 6
pasaran  = d mod 5                    Legi = 0, Pahing, Pon, Wage, Kliwon = 4
wuku     = floor(((d + 194) mod 210) / 7)        Sinta = 0 ... Watugunung = 29
neptu    = neptuHari[hari] + neptuPasaran[pasaran]

awalTahun(y) = 2835 * floor((y-1555)/8) + B[(y-1555) mod 8] - c(y)        hari ke-d untuk 1 Sura tahun y
B            = [0, 354, 709, 1063, 1417, 1772, 2126, 2480]
c(y)         = 0 bila y < 1627, selain itu floor((y-1627)/120) + 1
```

Wuku, hari, dan pasaran **tidak bergantung pada tanggal Jawa** (siklus 210, 7, dan 5 hari yang berjalan tanpa putus). Hanya
tanggal, bulan, tahun, windu, dan kurup yang memakai aturan kalender di bagian 5 sampai 6.

## 1. Lingkup dan konvensi

1. **Tanggal masukan** adalah tanggal sipil Gregorian proleptik (tahun, bulan, tanggal), tanpa zona waktu dan tanpa jam.
   Hari Jawa sebenarnya berganti saat magrib; rumusan ini bekerja pada hari sipil (tengah malam). Pemakai yang memerlukan
   pergantian magrib menambah satu hari pada tanggal sipil untuk waktu sesudah magrib sebelum memanggil rumusan.
2. **Rentang terdefinisi** (kalender Keraton): `d = 0` (8 Juli 1633 = 1 Sura 1555 AJ) sampai `d = 153085` (25 Agustus 2052 =
   29 Besar 1986 AJ). Sesudahnya adalah **ekstrapolasi spekulatif** dengan aturan yang sama (bagian 8).
   Siklus hari, pasaran, wuku, dan neptu (bagian 4) berlaku untuk semua `d`, juga negatif.
3. **Operator.** `floor(a / b)` adalah pembagian lantai dan `a mod b` selalu bernilai `0 <= r < b`, juga untuk `a` negatif.
   Banyak bahasa (C, C++, Java, JavaScript, Go, Rust `%`, PHP `%` dan `intdiv`) memotong ke arah nol sehingga memberi hasil
   keliru untuk `a` negatif. Tulis dua fungsi bantu sekali saja dan pakai di semua tempat:

   ```
   floorDiv(a, b) = q = a / b (pembagian bulat memotong); jika (a mod_potong b != 0) dan ((a < 0) != (b < 0)) maka q = q - 1
   mod(a, b)      = a - b * floorDiv(a, b)
   ```

   (Python `//` dan `%`, Ruby, Lua, Rust `div_euclid`/`rem_euclid` sudah benar.) Semua bilangan cukup muat dalam `int32`
   untuk tahun 1 sampai 9999.
4. **Indeks mulai dari 0.** Urutan nama ada di bagian 2.

## 2. Konstanta dan tabel

```
HARI          = [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu]
HARI_JAWA     = [Senen, Selasa, Rebo, Kemis, Jemuwah, Setu, Ngahad]            (nama alternatif, opsional)
PASARAN       = [Legi, Pahing, Pon, Wage, Kliwon]
NEPTU_HARI    = [4, 3, 7, 8, 6, 9, 5]            urutan HARI (Senin..Minggu)
NEPTU_PASARAN = [5, 9, 7, 4, 8]                  urutan PASARAN (Legi, Pahing, Pon, Wage, Kliwon)

WUKU (30) = [Sinta, Landep, Wukir, Kurantil, Tolu, Gumbreg, Warigalit, Warigagung, Julungwangi, Sungsang,
             Galungan, Kuningan, Langkir, Mandasiya, Julungpujut, Pahang, Kuruwelut, Marakeh, Tambir,
             Medangkungan, Maktal, Wuye, Manahil, Prangbakat, Bala, Wugu, Wayang, Kulawu, Dukut, Watugunung]

WULAN (12) = [Sura, Sapar, Mulud, Bakdamulud, Jumadilawal, Jumadilakir, Rejeb, Ruwah, Pasa, Sawal, Dulkangidah, Besar]
TAUN  (8)  = [Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, Jimakir]
WINDU (4)  = [Kuntara, Sangara, Sancaya, Adi]
LAMBANG(2) = [Kulawu, Langkir]
KURUP (4)  = [Jamingiyah (A'ahgi), Kamsiyah (Amiswon), Arbangiyah (Aboge), Salasiyah (Asapon)]      kurup ke-5 dan seterusnya: "Kurup n"

PANJANG_TAUN = [354, 355, 354, 354, 355, 354, 354, 355]       panjang tahun menurut TAUN; 355 = wuntu (Ehe, Dal, Jimakir)
B            = [0, 354, 709, 1063, 1417, 1772, 2126, 2480]    B[r] = jumlah PANJANG_TAUN[0..r-1]
HARI_PER_WINDU = 2835                                         = jumlah PANJANG_TAUN
AJ0 = 1555                                                    tahun AJ epoch
BATAS_PERTAMA = 1627, PANJANG_KURUP = 120                     batas kurup: 1627, 1747, 1867, 1987, 2107, ...
```

Catatan: urutan pasaran di sini dimulai dari Legi karena `d = 0` adalah Legi. Sebagian pustaka lain memulai dari Pon; itu
hanya soal indeks, bukan hasil.

## 3. Nomor hari `d` dari tanggal sipil

`d = hariDariSipil(y, m, t) - hariDariSipil(1633, 7, 8)`. Fungsi `hariDariSipil` memberi jumlah hari sejak 1970-01-01 dan
dapat memakai pustaka tanggal bahasa Anda bila ia proleptik Gregorian (hati-hati: beberapa pustaka memakai kalender Julian
sebelum 1582). Tanpa pustaka, algoritma bilangan bulat berikut (H. Hinnant) cukup; diuji sama dengan `datetime` Python
(kedua arah) pada setiap 7 hari dari tahun 1 sampai sekitar 8200:

```
hariDariSipil(y, m, t):
    jika m <= 2: y = y - 1
    era = floorDiv(y, 400)
    yoe = y - era * 400                                     0..399
    mp  = (m > 2) ? m - 3 : m + 9
    doy = floorDiv(153 * mp + 2, 5) + t - 1                 0..365
    doe = yoe * 365 + floorDiv(yoe, 4) - floorDiv(yoe, 100) + doy
    kembalikan era * 146097 + doe - 719468

sipilDariHari(z):                                           kebalikannya
    z = z + 719468
    era = floorDiv(z, 146097);  doe = z - era * 146097
    yoe = floorDiv(doe - floorDiv(doe, 1460) + floorDiv(doe, 36524) - floorDiv(doe, 146096), 365)
    y = yoe + era * 400
    doy = doe - (365 * yoe + floorDiv(yoe, 4) - floorDiv(yoe, 100))
    mp = floorDiv(5 * doy + 2, 153)
    t = doy - floorDiv(153 * mp + 2, 5) + 1
    m = (mp < 10) ? mp + 3 : mp - 9
    kembalikan (m <= 2 ? y + 1 : y, m, t)
```

`hariDariSipil(1633, 7, 8) = -122898`, jadi `d = hariDariSipil(y, m, t) + 122898`.

## 4. Siklus pasti: hari, pasaran, weton, neptu, wuku, selapan

Berlaku untuk **semua** bilangan bulat `d`.

```
ih = mod(d + 4, 7)                  indeks HARI
ip = mod(d, 5)                      indeks PASARAN
iw = floorDiv(mod(d + 194, 210), 7) indeks WUKU

weton   = HARI[ih] + " " + PASARAN[ip]
neptu   = NEPTU_HARI[ih] + NEPTU_PASARAN[ip]                  7..18  (3 + 4 sampai 9 + 9)
selapan = 35 hari = KPK(7, 5): weton yang sama berulang bila d bertambah 35
pawukon = 210 hari = 30 wuku x 7 hari = KPK(7, 30 x 7)
```

Asal konstanta: `d = 0` jatuh pada **Jumat** (indeks 4), **Legi** (indeks 0), dan wuku **Kulawu** (indeks 27), karena
`194 = 27 * 7 + 5`, yaitu hari ke-6 dalam wuku yang dimulai hari Minggu (Minggu, Senin, Selasa, Rabu, Kamis, **Jumat**).
Wuku berganti pada hari Minggu: `(d + 194) mod 7 = 0` terjadi tepat saat `ih = 6`. Pemeriksaan cepat: 26 April 1975 harus
Sabtu Kliwon, wuku Kuningan, neptu 17.

## 5. Tanggal Jawa (1 Sura 1555 AJ sampai 29 Besar 1986 AJ)

### 5.1 Struktur kalender

* **Windu** = 8 tahun berurutan, dengan `PANJANG_TAUN = [354, 355, 354, 354, 355, 354, 354, 355]` (jumlah 2835 hari).
  Tahun wuntu (355 hari) adalah Ehe, Dal, Jimakir; tahun lain wastu (354 hari).
* **Bulan** berselang-seling: bulan ke-1, 3, 5, ... berumur 30 hari, bulan ke-2, 4, 6, ... berumur 29 hari
  (Sura 30, Sapar 29, ..., Dulkangidah 30, **Besar 29**). Pada tahun wuntu, **Besar berumur 30 hari**.
* **Kurup** = koreksi 120 tahun. Pada **tahun terakhir tiap kurup**, Besar dipendekkan **satu hari**. Tahun itu selalu
  Jimakir (AJ 1626, 1746, 1866, 1986, ... karena 120 habis dibagi 8 dan 72 = 9 windu), sehingga Besar 30 menjadi 29 dan
  tahunnya 355 menjadi 354 hari. Dengan demikian setiap kurup memundurkan kalender satu hari terhadap windu murni.
* Kurup pertama (Jamingiyah/A'ahgi) hanya 72 tahun (AJ 1555 sampai 1626). Kurup berikutnya masing-masing 120 tahun:
  Kamsiyah 1627 sampai 1746, Arbangiyah 1747 sampai 1866, Salasiyah 1867 sampai 1986, lalu seterusnya per 120 tahun.
  Hari 1 Sura Alip tiap kurup: Jumat Legi (1555), Kamis Kliwon (1627), Rabu Wage (1747), Selasa Pon (1867); inilah yang
  menjadi nama Aboge (Alip Rebo Wage) dan Asapon (Alip Selasa Pon).

### 5.2 Rumus tertutup untuk awal tahun

Untuk tahun AJ `y >= 1555`:

```
q = floorDiv(y - 1555, 8)
r = mod(y - 1555, 8)
c = (y < 1627) ? 0 : floorDiv(y - 1627, 120) + 1               jumlah batas kurup yang sudah dicapai y
awalTahun(y) = q * 2835 + B[r] - c                              nilai d untuk 1 Sura tahun y
panjangTahun(y) = PANJANG_TAUN[r] - (y + 1 adalah batas kurup ? 1 : 0)
                = awalTahun(y + 1) - awalTahun(y)
```

`y + 1` adalah batas kurup bila `y + 1 >= 1627` dan `mod(y + 1 - 1627, 120) = 0`. Identitas
`awalTahun(y+1) - awalTahun(y) = panjangTahun(y)` berlaku untuk semua tahun (teruji pada setiap tahun 1555 sampai 2226).

### 5.3 Panjang bulan

```
panjangBulan(y)[i] = (i genap) ? 30 : 29           i = 0..11 (Sura = 0)
jika PANJANG_TAUN[mod(y - 1555, 8)] = 355:   panjangBulan(y)[11] = 30
jika y + 1 adalah batas kurup:               panjangBulan(y)[11] = panjangBulan(y)[11] - 1
```

Jumlah ke-12 bulan sama dengan `panjangTahun(y)`.

### 5.4 Dari `d` ke tanggal Jawa

```
tanggalJawa(d):                                    syarat: d >= 0
    y = 1555 + floorDiv(8 * d, 2835)               tebakan awal (selisih paling banyak 1 tahun)
    selama awalTahun(y + 1) <= d:  y = y + 1
    selama awalTahun(y) > d:       y = y - 1
    sisa = d - awalTahun(y)
    untuk i = 0..11:
        jika sisa < panjangBulan(y)[i]:  kembalikan (dina = sisa + 1, wulan = i, tahun = y)
        sisa = sisa - panjangBulan(y)[i]
```

Hasilnya selalu ditemukan karena `awalTahun(y) <= d < awalTahun(y + 1)`. Biaya O(1) (tebakan, paling banyak satu
koreksi, lalu paling banyak 12 langkah). Alternatif: bangun tabel kumulatif dan cari secara biner (cara mesin JS);
hasilnya sama.

### 5.5 Dari tanggal Jawa ke `d`

```
dariTanggalJawa(dina, wulan, tahun):
    kembalikan awalTahun(tahun) + (jumlah panjangBulan(tahun)[0 .. wulan-1]) + (dina - 1)
```

Syarat: `1 <= dina <= panjangBulan(tahun)[wulan]`.

## 6. Label tahun, windu, lambang, kurup

```
taun    = TAUN[mod(y - 1555, 8)]
w       = floorDiv(y - 1555, 8)                    nomor windu (0 untuk AJ 1555..1562)
windu   = WINDU[mod(w, 4)]                         Kuntara, Sangara, Sancaya, Adi, ...
lambang = LAMBANG[mod(w, 2)]                       Kulawu, Langkir, ...
k       = (y < 1627) ? 0 : floorDiv(y - 1627, 120) + 1
kurup   = (k < 4) ? KURUP[k] : "Kurup " + (k + 1)
```

Windu dihitung dari **tahun Jawa** (`floorDiv(y - 1555, 8)`), bukan dari blok 2835 hari: karena koreksi kurup memendekkan
kalender, blok hari melenceng 1 sampai 3 hari dari batas tahun dan memberi label keliru pada sekitar 53 hari (lihat bagian 11).

## 7. Hari mulia

Dievaluasi dari hasil bagian 4 dan 5 (`dina`, `wulan`, `ih`, `ip`, `iw`):

| Nama | Syarat |
|---|---|
| Siji Sura | `dina = 1` dan `wulan = Sura` |
| Kuningan | wuku Kuningan, Sabtu Kliwon |
| Hanggara Asih | wuku Dukut, Selasa Kliwon |
| Dina Mulya | wuku Watugunung, Jumat Kliwon |
| Dina Purnama | Jumat Legi (semua wuku) |

Dalam rentang spekulatif, `hariMulia` tetap dihitung dengan aturan yang sama.

## 8. Rentang dan perilaku di luar rentang

| `d` | Perilaku |
|---|---|
| `d < 0` (sebelum 8 Juli 1633) | siklus bagian 4 tetap berlaku; **tanggal Jawa tidak terdefinisi** (kembalikan galat/`null`) |
| `0 <= d <= 153085` | seluruh hasil terdefinisi; sesuai kalender Keraton |
| `d > 153085` (sesudah 25 Agustus 2052) | rumus bagian 5 diteruskan tanpa batas dan ditandai `spekulatif = true`; kurup ke-5 mulai 26 Agustus 2052 (Senin Pahing, 1 Sura 1987) |

Tidak ada otoritas yang menetapkan kurup sesudah 2052; ekstrapolasi ini hanya menerapkan aturan "tiap 120 tahun mundur
sehari". Mesin JS (`src/kalender.js`) sengaja memuat tabel 672 tahun (AJ 1555 sampai 2226, sampai 3 Juli 2285); lihat
bagian 11 untuk batasan itu. Rumusan di dokumen ini tidak memiliki batas atas.

## 9. Algoritma lengkap

```
fungsi kalenderJawa(y, m, t):
    d  = hariDariSipil(y, m, t) + 122898
    ih = mod(d + 4, 7);  ip = mod(d, 5);  iw = floorDiv(mod(d + 194, 210), 7)
    hasil = { d, hari: HARI[ih], pasaran: PASARAN[ip], weton: ..., neptu: NEPTU_HARI[ih] + NEPTU_PASARAN[ip],
              wuku: WUKU[iw], nomorWuku: iw + 1 }
    jika d < 0: kembalikan hasil                                       (tanpa tanggal Jawa)
    (dina, wulan, tahun) = tanggalJawa(d)                              bagian 5.4
    lengkapi: taun, windu, lambang, kurup                              bagian 6
    lengkapi: hariMulia                                                bagian 7
    hasil.spekulatif = (d > 153085)
    kembalikan hasil
```

Contoh hitung tangan: **27 Juni 2025**.

```
d       = 143164                                           (hariDariSipil + 122898)
hari    : (143164 + 4) mod 7 = 4  -> Jumat
pasaran : 143164 mod 5      = 4  -> Kliwon                 neptu = 6 + 8 = 14
wuku    : (143164 + 194) mod 210 = 138; floor(138 / 7) = 19 -> Medangkungan (wuku ke-20)
tahun   : tebakan 1555 + floor(8 * 143164 / 2835) = 1555 + 403 = 1958
          awalTahun(1959) = 50 * 2835 + B[4] - 3 = 141750 + 1417 - 3 = 143164 <= d  -> y = 1959
          awalTahun(1959) = 143164 = d  -> sisa = 0 -> 1 Sura 1959, taun Dal (r = 4)
          w = 50: windu Sancaya (50 mod 4 = 2), lambang Kulawu (50 mod 2 = 0); k = 3: Salasiyah
hasil   : Jumat Kliwon, 1 Sura 1959 Dal, hari mulia Siji Sura
```

## 10. Verifikasi

Sebuah implementasi dianggap sesuai bila lolos semuanya, berurutan dari yang termurah.

### 10.1 Titik tambat (tangan)

| Tanggal | `d` | Weton | Neptu | Wuku | Tanggal Jawa |
|---|---:|---|---:|---|---|
| 1633-07-07 | -1 | Kamis Kliwon | 16 | Kulawu | (tidak terdefinisi) |
| 1633-07-08 | 0 | Jumat Legi | 11 | Kulawu | 1 Sura 1555 Alip, Kuntara Kulawu, Jamingiyah |
| 1703-05-16 | 25513 | Rabu Wage | 11 | Langkir | 29 Besar 1626 Jimakir |
| 1703-05-17 | 25514 | Kamis Kliwon | 16 | Langkir | 1 Sura 1627 Alip, Sangara Langkir, Kamsiyah |
| 1819-10-20 | 68038 | Rabu Wage | 11 | Kulawu | 1 Sura 1747 Alip, Kuntara Kulawu, Arbangiyah |
| 1936-03-24 | 110562 | Selasa Pon | 10 | Langkir | 1 Sura 1867 Alip, Adi Langkir, Salasiyah |
| 1975-04-26 | 124839 | Sabtu Kliwon | 17 | Kuningan | 14 Bakdamulud 1907 Alip, hari mulia Kuningan |
| 2025-06-27 | 143164 | Jumat Kliwon | 14 | Medangkungan | 1 Sura 1959 Dal, Sancaya Kulawu, Siji Sura |
| 2025-06-30 | 143167 | Senin Pon | 11 | Maktal | 4 Sura 1959 Dal |
| 2026-06-15 | 143517 | Senin Pon | 11 | Galungan | 29 Besar 1959 Dal |
| 2026-06-17 | 143519 | Rabu Kliwon | 15 | Galungan | 1 Sura 1960 Be, Siji Sura |
| 2052-08-25 | 153085 | Minggu Legi | 10 | Kulawu | 29 Besar 1986 Jimakir (hari terakhir terdefinisi) |
| 2052-08-26 | 153086 | Senin Pahing | 13 | Kulawu | 1 Sura 1987 Alip, Kurup 5, **spekulatif** |

Tiga baris 2025 sampai 2026 cocok dengan peristiwa yang tercantum di laman resmi Keraton (4 Sura 1959 = 30 Juni 2025,
29 Besar 1959 = 15 Juni 2026). Daftar lengkap ada di `spec/vektor_uji.json` (`tanggal`).

### 10.2 Awal tahun

`spec/vektor_uji.json` memuat `awalTahun`: 673 baris `[tahun, d, tanggal-sipil, weton, panjang-tahun]` untuk AJ 1555 sampai
2227. Contoh: 1555 = `d` 0; 1563 = 2835 (12 April 1641, Jumat Legi); 1627 = 25514; 1747 = 68038; 1867 = 110562;
1959 = 143164; 1960 = 143519; 1987 = 153086. Kolom panjang tahun (355 untuk Ehe/Dal/Jimakir, 354 lainnya, dikurangi 1 pada
tahun terakhir kurup) harus sama.

### 10.3 Checksum seluruh rentang

Untuk setiap `d = 0..N` bentuklah baris UTF-8 `d|dina|indeksWulan|tahun` diikuti `\n` (`indeksWulan`: Sura = 0, ..., Besar = 11;
tanpa spasi, tanpa `\r`), sambungkan semuanya, lalu hitung SHA-256.

| `N` | Rentang | SHA-256 |
|---:|---|---|
| 153085 | 1633-07-08 sampai 2052-08-25 (terdefinisi) | `9991c8da3e12c39a844465df77c77d933eb68482b53f4e92b20f290f5fe6121b` |
| 238133 | sampai 2285-07-03 (termasuk spekulatif) | `ef1d58208a0e5dd1bdcc974138f6efa168bc75f7e6989e11a8d8ccdb5f415da5` |

Satu hari saja yang salah mengubah seluruh checksum. Ini pemeriksaan terkuat; implementasi yang lolos pasti identik dengan
acuan pada setiap hari. Checksum kedua hanya mengukur ekstrapolasi.

### 10.4 Uji kesetaraan dengan windu murni (independen)

Kalender ini sama dengan **windu murni** yang digeser sesuai kurup. Implementasi tersendiri yang tidak memakai bagian 5.2:

```
POLA = [354, 355, 354, 354, 355, 354, 354, 355]
murni = []                                       urutan (dina, wulan, tahun) hari demi hari sejak 1 Sura 1555
untuk t = 1555, 1556, ...:
    wuntu = (POLA[mod(t - 1555, 8)] = 355)
    untuk b = 0..11:
        panjang = (b = 11) ? (wuntu ? 30 : 29) : ((b genap) ? 30 : 29)
        untuk dina = 1..panjang: tambahkan (dina, b, t)

tanggalJawa(d) = murni[d + n]       dengan n = c(tahun hasil) = jumlah batas kurup yang sudah dicapai (0, 1, 2, 3, ...)
```

Artinya: pada kurup ke-`n+1`, kalender berada `n` hari lebih awal daripada windu murni (selisih 0, 1, 2, 3 hari). Uji ini sama
dengan acuan `spec/referensi.py` pada setiap hari 1633-07-08 sampai 2285-07-03 (238.134 hari, tanpa selisih), dan untuk mesin JS
pada setiap hari 1633 sampai 2052 (`tests/kraton.test.js`). Bukti empiris hanya sampai kurup ke-4; sesudahnya rumus yang
sama diteruskan.

### 10.5 Pembanding eksternal

Rumusan ini diuji terhadap data di luar kode proyek:

* tabel awal bulan Keraton untuk kurup Aboge dan Asapon (8 nama tahun x 12 bulan, weton tanggal 1 tiap bulan) dari tesis
  Marhamah (2022, mengutip KRT Rintaiswara 2015): **seluruh 1440 awal bulan tiap kurup cocok**. Perhatikan bahwa angka ini
  berasal dari 96 entri pola per kurup yang berulang 15 windu (bukan observasi sejarah independen);
* 15 tanggal dari Tabel 6-15 tesis Marhamah (Almanak Jawa 1929-1939 dan kalender Keraton 2012, 2020; [`tests/almanak.test.js`](../../tests/almanak.test.js)) dan 3 peristiwa Keraton 2025 sampai 2026 (bagian 10.1);
* `audit/audit_pawukon.py`: rekonstruksi mandiri empat model (rumus pawukon, weton.m, rsjp, almanak) beserta pernyataan
  internalnya (awal tahun rumus tertutup sama dengan penjumlahan tahun demi tahun; 26 April 1975 = Sabtu Kliwon, Kuningan, 17).

## 11. Batasan, penyimpangan, dan hal yang disengaja

1. **Bukan pengamatan.** Seluruhnya aritmetika. Kalender Keraton juga mengikuti aturan hitung (tahun wuntu/wastu dan kurup),
   bukan pengamatan hilal, sehingga tidak sama dengan kalender Hijriyah resmi atau penetapan pemerintah.
2. **Kurup Jamingiyah dan Kamsiyah (1633 sampai 1819)** tidak memiliki tabel awal bulan Keraton sebagai pembanding; kalender
   di rentang itu mengikuti aturan windu murni dengan koreksi kurup (bagian 10.4). Pembuktian empiris ada pada Aboge dan
   Asapon saja.
3. **Pola Dal.** Tahun Dal berumur 355 hari (wuntu) menurut laman resmi Keraton (Ehe, Dal, Jimakir). `weton.m` memakai Je 355
   dan Dal 354, sehingga setiap tahun Dal berselisih sehari; dokumen ini mengikuti Keraton.
4. **Batas kurup** 1627, 1747, 1867 (Keraton); `weton.m` memakai 1675 dan 1749 dengan geseran dua hari. Satu laporan
   akademik (Karjanto dan Beauducel, tabel 9) memuat 1795 untuk Yogyakarta secara historis; dokumen ini memilih angka dari
   dokumentasi Keraton saat ini.
5. **Windu menurut tahun, bukan blok hari.** Pembentukan windu dari `floor(dti / 2835)` (cara `weton.m`) berbeda dari
   `floor((y - 1555) / 8)` pada 53 hari dalam 1633 sampai 2052; dokumen ini memakai yang kedua.
6. **Magrib.** Lihat bagian 1.
7. **Batasan mesin JS (bukan rumusan).** `src/kalender.js` membangun tabel 672 tahun; **sesudah 3 Juli 2285 (akhir AJ 2226)
   tabelnya habis**, dan fungsi mengembalikan hasil keliru tanpa galat. Rumusan tertutup di dokumen ini tidak mengalami hal itu.
   Sampai batas tersebut hasil mesin JS dan acuan sama pada setiap hari (238.134 hari).
8. **Nama.** Ejaan windu mengikuti Keraton ("Sangara"). Ejaan lain di pustaka (mis. "Sengara") hanya soal tulisan.

## 12. Cara menjalankan acuan dan tes

```
python3 -I spec/referensi.py            # mencetak jumlah hari terdefinisi dan SHA-256 (harus 153086 dan 9991c8da...)
node --test tests/spesifikasi.test.js   # mesin JS = vektor + checksum di dokumen ini
```

`spec/referensi.py` tidak mengimpor `datetime`; semua dari bilangan bulat sehingga mudah diterjemahkan baris demi baris ke bahasa
lain. Saran urutan porting: (1) `floorDiv`/`mod`, (2) `hariDariSipil`, (3) siklus bagian 4 dan titik tambat 10.1,
(4) `awalTahun` dan uji 10.2, (5) `tanggalJawa` dan checksum 10.3.
