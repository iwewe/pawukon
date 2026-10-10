# Pawukon dan astrologi: letak perbedaannya, satu temuan tentang kurup, dan rancangan penyejajaran

Dokumen ini menjawab pertanyaan: *apakah hitungan pawukon dapat disejajarkan dengan mesin horoskop (astrologi Barat, Vedic,
Human Design, Gene Keys), atau ia pseudo-astrologi?* Jawaban dibagi per lapis, ditambah satu pengukuran yang menunjukkan
kalender Jawa aritmetika **memang berpijak pada gerak Bulan**, meski wuku dan pasaran tidak.

Pembanding yang dibaca adalah NatalEngine (https://github.com/Unforced-Dev/natalengine, MIT, v1.6.0), mesin yang memberi data
bagan kelahiran tanpa tafsir. Semua angka pengukuran di bawah dapat diulang dengan `audit/selisih_bulan_baru.mjs`
(hasil mentah: `audit/selisih_bulan_baru.json`).

## 1. Ringkasan

1. **Wuku, pasaran, dan weton bukan astrologi.** Ketiganya penghitung siklus (7, 5, 35, 210 hari) yang hanya bergantung pada
   nomor hari. Tidak ada posisi planet, jam lahir, atau lokasi di dalamnya. Setahu saya siklus itu tidak terkait benda langit.
2. **Tanggal Jawa (Sura, Sapar, ...) berpijak pada Bulan.** Tahun Jawa rata-rata 354,375 hari, sedangkan dua belas bulan
   sinodis sebenarnya 354,367 hari. Selisih 0,0079 hari per tahun itu persis yang dikoreksi **kurup** (satu hari per 120
   tahun). Ini terukur terhadap bulan baru astronomi (bagian 4), bukan hanya klaim.
3. **Hitungan sahih, tafsir tidak tervalidasi.** Hitungan adalah aritmetika kalender yang deterministik dan diuji. Tafsir (watak,
   jodoh, hari baik) adalah tradisi tanpa bukti empiris, sama statusnya dengan tafsir astrologi Barat, Vedic, Human Design,
   dan Gene Keys.
4. **Penyejajaran teknis mungkin dan menguntungkan kedua pihak.** NatalEngine sudah punya efemeris, jadi *batas hari magrib*
   (yang rumusan kita belum selesaikan) dapat dihitung tepat dari terbenam matahari menurut lokasi (bagian 5).

## 2. Dua lapis pada mesin horoskop, satu lapis pada pawukon

| | Astrologi (Barat/Vedic/HD) | Pawukon |
|---|---|---|
| Lapis 1: astronomi (posisi benda langit) | ada: `astronomy-engine` (VSOP87, ±1 menit busur) | **tidak ada** untuk wuku dan pasaran |
| Lapis 2: konvensi (zodiak, ayanamsa, gerbang, nakshatra, kurup, ...) | ada | ada (kalender aritmetika Karaton) |
| Lapis 3: tafsir | ada (tidak tervalidasi) | ada (tidak tervalidasi) |
| Masukan | tanggal, jam, lokasi | tanggal (jam hanya untuk batas magrib) |
| Ukuran kebenaran lapis hitung | akurasi astronomi | kesesuaian dengan acuan Karaton |

Akibatnya: menyebut pawukon "astrologi" kurang tepat. Istilah yang jujur adalah **kalender dan petungan** (numerologi
hari, tradisi primbon).

## 3. Status tiap lapis

* **Hitungan.** Bukan pseudo. Rumusan di [RUMUSAN_PERHITUNGAN.md](RUMUSAN_PERHITUNGAN.md) deterministik, cocok pada
  setiap hari dengan implementasi acuan, dan diuji terhadap tabel Karaton. Kebenarannya *kesesuaian dengan acuan*, bukan
  kebenaran fisik; itu sebabnya selisih sehari pada tahun Dal dapat diputuskan dari tabel, bukan dari pengamatan.
* **Tafsir.** Tradisi. Tidak ada validasi empiris yang saya ketahui untuk tafsir pawukon. Untuk astrologi Barat, uji buta ganda
  klasik (Carlson, *Nature* 318, 1985) tidak menemukan kemampuan mencocokkan bagan lebih baik daripada kebetulan; Human Design
  dan Gene Keys tidak punya validasi yang lebih kuat sepengetahuan saya. Jadi pawukon tidak lebih "palsu" daripada yang lain,
  dan juga tidak lebih benar. Penafian di README tetap berlaku: tafsir adalah tradisi, bukan fakta ilmiah atau nasihat
  profesional.

## 4. Temuan: kurup adalah koreksi atas selisih bulan sinodis

### 4.1 Aritmetika

```
windu            = 2835 hari / 8 tahun                 = 354,375    hari per tahun Jawa
12 bulan sinodis = 12 x 29,530588                      = 354,36706  hari  (rata-rata bulan sinodis modern)
selisih          = 354,375 - 354,36706                 =   0,00794  hari per tahun
per kurup        = 0,00794 x 120 tahun                 =   0,953    hari  ->  dikoreksi 1 hari per kurup
```

Tahun Jawa sedikit lebih panjang daripada dua belas bulan sebenarnya, sehingga kalender murni (tanpa kurup) tertinggal dari
Bulan sekitar satu hari setiap 120 tahun. Mesin ini menambahkan koreksi kurup Karaton; pembandingnya adalah kalender windu
murni, yaitu metode tertua (README, "Metode tertua").

### 4.2 Pengukuran terhadap bulan baru astronomi

Metode (skrip `audit/selisih_bulan_baru.mjs`, `astronomy-engine` 2.1.19):

* Untuk tiap tanggal 1 bulan Jawa (5.184 bulan, AJ 1555-1986, tanggal sipil `D`), ambil bulan baru astronomi (konjungsi
  Bulan-Matahari, 5.189 buah, 1633-2052) yang paling dekat dengan `D 00:00 WIB` (UTC+7).
* `jam` = selisih `D 00:00 WIB` dikurangi waktu konjungsi, dalam hari (nilai 1,2 berarti awal bulan sekitar 29 jam
  sesudah konjungsi).
* "Windu murni" = kalender yang sama tanpa koreksi kurup: tanggalnya `n` hari lebih lambat (`n` = banyak batas kurup yang
  telah dicapai).

Hasil:

| Kurup | Bulan | Mesin: rata-rata `jam` | Windu murni: rata-rata `jam` | Mesin: awal bulan sebelum konjungsi* |
|---|---:|---:|---:|---:|
| Jamingiyah 1555-1626 | 864 | 1,445 | 1,445 | 6 (0,7%) |
| Kamsiyah 1627-1746 | 1440 | 1,207 | 2,207 | 67 (4,7%) |
| Arbangiyah 1747-1866 | 1440 | 1,158 | 3,158 | 83 (5,8%) |
| Salasiyah 1867-1986 | 1440 | 1,112 | 4,112 | 98 (6,8%) |
| **Semua** | 5184 | **1,207** | **2,873** | **254 (4,9%)** |

\* Magrib yang membuka hari ke-1 dianggap pukul 18.00 WIB pada hari sebelumnya, yaitu 6 jam sebelum `D 00:00`. Sebuah bulan dihitung "sebelum konjungsi" bila magrib itu mendahului konjungsi, yaitu `jam < 0,25` hari.
Magrib sebenarnya di Jawa bergeser sekitar ±0,5 jam sepanjang tahun; perhitungan tepat menyusul pada rancangan di bagian 5.

Kemiringan rata-rata selisih terhadap tahun (regresi linear atas seluruh bulan):

| | hari per tahun | setara per 120 tahun |
|---|---:|---:|
| Windu murni | **+0,00792** | +0,95 hari |
| Mesin (dengan kurup) | **-0,00022** | -0,03 hari |

Yang tampak:

1. **Prediksi terbukti.** Kemiringan windu murni terukur 0,00792 hari/tahun, nyaris sama dengan hitungan 0,00794 pada 4.1.
   Rata-rata selisih windu murni naik sekitar satu hari per kurup penuh (2,207, 3,158, 4,112; kurup pertama hanya 72 tahun).
   Dengan kurup, rata-rata hampir datar dan kemiringannya mendekati nol.
2. **Kurup sedikit berlebihan.** Rata-rata mesin turun perlahan antar kurup penuh (1,207, 1,158, 1,112), sekitar 0,048 hari
   per kurup, sesuai dengan 1 - 0,953. Koreksi satu hari bulat melawan selisih sebenarnya 0,953 hari. Kurup pertama hanya 72
   tahun sehingga tidak sebanding.
3. **Sebaran bulanan besar dan sebagian bukan kesalahan kalender.** Simpangan baku `jam` mesin 0,57 hari (13,6 jam).
   Bulan baru sejati menyimpang dari garis rata-rata dengan simpangan baku 7,5 jam dan maksimum 14,2 jam (terukur dari
   5.189 konjungsi yang sama), jadi sebagian sebaran berasal dari Bulan itu sendiri, sebagian dari struktur kalender
   (selingan 30/29 hari dan pola delapan tahun). Saya tidak menguraikan porsinya lebih jauh.
4. **Kalender aritmetika tidak menjamin awal bulan sesudah konjungsi.** Pada kurup Salasiyah, 98 dari 1.440 awal bulan
   (6,8%) bila dihitung dari magrib 18.00 jatuh *sebelum* konjungsi (hingga sekitar 16 jam pada Salasiyah dan 18 jam pada
   seluruh data), sehingga bulan sabit baru mustahil tampak. Ini sifat kalender hisab urfi, yang memang tidak dirancang mengikuti hilal; bukan kesalahan mesin.
   Sebaliknya ia berarti kalender ini tidak boleh disajikan sebagai kalender astronomi (tidak untuk penentuan hari ibadah).

### 4.3 Batas pengukuran

* Pencocokan memakai konjungsi terdekat dan `UTC+7`; Karaton Yogyakarta memakai waktu lokal sekitar UTC+7:20 (selisih 20
  menit, jauh di bawah skala hari).
* Magrib dianggap tetap 18.00 WIB pada hitungan "sebelum konjungsi"; angka 254 dan 98 bergeser sedikit bila memakai magrib
  sebenarnya.
* Tanggal sipil di sini Gregorian proleptik (konvensi seluruh proyek); tidak berhubungan dengan penanggalan Eropa pada masa itu.
* Model ΔT `astronomy-engine` untuk tahun lampau mengandung ketidakpastian detik hingga menit; di bawah skala pengukuran.
* Ini mengukur kalender aritmetika terhadap Bulan; bukan bukti bahwa tafsir weton atau wuku benar.

## 5. Rancangan penyejajaran di NatalEngine

### 5.1 Kategori dan prinsip

Prinsip NatalEngine ("no interpretation, just the facts") sama dengan prinsip rumusan ini. Pawukon cocok sebagai kalkulator
terpisah yang hanya mengembalikan fakta (weton, wuku, neptu, tanggal Jawa, windu, lambang, kurup), dengan tafsir di modul
data. Kategorinya **kalender/petungan**, bukan astrologi.

### 5.2 Antarmuka usulan

Mengikuti urutan parameter `calculateAstrology(birthDate, birthHour, timezone, latitude?, longitude?)`:

```
calculatePawukon(birthDate, birthHour, timezone, latitude?, longitude?, options?)
options: { batasHari: 'magrib' | 'tengahMalam' }

hasil: {
  masehi,                    // tanggal sipil lahir
  hariJawa: {                // tanggal yang dipakai sesudah memperhitungkan batas hari
    masehi, bergeserSatuHari
  },
  batas: { aturan, magribLokal, sesudahMagrib, akurat },   // 'akurat' = false bila lokasi tidak diberikan
  hari, pasaran, weton, neptu: {hari, pasaran, total},
  wuku, nomorWuku,
  tanggal: { dina, wulan, tahun, taun, windu, lambang, kurup },
  hariMulia: [...], spekulatif
}
```

### 5.3 Batas hari magrib

Semua keluaran pawukon (hari, pasaran, wuku, tanggal Jawa) bergantung pada nomor hari yang sama, jadi batas hari cukup
menggeser nomor hari satu langkah bila lahir sesudah magrib.

```
magrib = SearchRiseSet(Body.Sun, new Observer(lintang, bujur, 0), -1, awalHariLokal, 1)     // -1 = terbenam
sesudahMagrib = (waktuLahirUT >= magrib)
hariJawa = sesudahMagrib ? tanggalSipil + 1 : tanggalSipil
lalu: kalenderJawa(hariJawa)                                                                 // mesin pawukon, tanpa perubahan
```

Catatan:
* Konfirmasi API dari berkas deklarasi `astronomy.d.ts` (astronomy-engine 2.1.19): `direction` bernilai `+1` terbit atau `-1`
  terbenam; hasil `null` bila tidak ada peristiwa pada jendela (kasus kutub), sehingga perlu cadangan (jatuh ke 18.00 lokal,
  `akurat: false`).
* Tanpa lintang/bujur: pakai 18.00 lokal dan tandai `akurat: false`, mengikuti kebiasaan `rising.accurate` di NatalEngine.
* Zona waktu: parameter `timezone` NatalEngine adalah selisih UTC dalam jam; sambungkan dengan `resolveUtcOffset` yang sudah ada.

### 5.4 Keputusan terbuka (milik pengguna)

1. **Batas bawaan.** Karaton memakai magrib (tesis hlm. 54), tetapi pemakai primbon bermacam-macam; banyak yang memakai tanggal
   sipil. Usulan: bawaan `magrib` bila lokasi tersedia, selain itu `tengahMalam`, selalu menampilkan `batas`.
2. **Definisi magrib.** Terbenam matahari geometris (bawaan `astronomy-engine`, ada koreksi refraksi), atau ditambah selisih
   beberapa menit. Usulan: terbenam standar tanpa tambahan.
3. **Hasil `spekulatif`.** Sesudah 25 Agustus 2052 hasil adalah ekstrapolasi dan tabel mesin berakhir 3 Juli 2285 (lihat
   RUMUSAN_PERHITUNGAN.md bagian 11). Usulan: lempar galat atau tandai `spekulatif`, dan jangan mengembalikan hasil diam-diam.
4. **Ketergantungan.** Pawukon tanpa dependensi; hanya pembungkus NatalEngine yang memakai `astronomy-engine`. Usulan: pembungkus
   memanggil `kalenderJawa(tanggalSipil)` milik pawukon dan hanya mengurus batas hari.
5. **Tafsir.** Tetap di luar kalkulator, sama seperti NatalEngine memisahkan data bagan dari deskripsi.

## 6. Yang tidak diklaim

* Tidak ada klaim bahwa weton, wuku, atau neptu memengaruhi watak atau nasib.
* Tidak ada klaim bahwa kalender Jawa aritmetika sama dengan kalender astronomi atau Hijriyah; hasil di bagian 4 menunjukkan ia
  tidak.
* Tidak ada klaim tentang kurup di luar 1555-1986 selain "aturan yang sama diteruskan".
* Perbandingan dengan validitas astrologi Barat adalah ringkasan literatur yang saya ketahui, bukan tinjauan sistematis.

## 7. Mengulang pengukuran

```
npm i --no-save astronomy-engine
node audit/selisih_bulan_baru.mjs > audit/selisih_bulan_baru.json
# atau, tanpa memasang paket:
ASTRONOMY_ENGINE=/jalur/ke/node_modules/astronomy-engine/esm/astronomy.js node audit/selisih_bulan_baru.mjs
```

Berkas hasil di repo dibuat dengan `astronomy-engine` 2.1.19, Node 22.
