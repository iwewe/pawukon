# Seberapa dekat kalender Jawa dengan Bulan sebenarnya?

*Bacaan untuk awam, tetap berbukti. Kode **K8** dan **K9** menunjuk ke [Matriks klaim dan bukti](../ilmiah/MATRIKS_KLAIM_BUKTI.md).*

Kalender Jawa adalah kalender bulan: tiap bulan kira-kira satu putaran Bulan. Tetapi ia dihitung dengan **aturan tetap**
(bulan 29 dan 30 hari bergantian), bukan dengan melihat langit. Pertanyaan yang wajar: seberapa jauh ia menyimpang dari Bulan
yang sebenarnya?

## Pertanyaan yang diuji

Untuk setiap awal bulan Jawa pada **5.184 bulan** (AJ 1555 sampai 1986, 8 Juli 1633 sampai 25 Agustus 2052), kita bandingkan
dengan **bulan baru astronomi** yang dihitung dari pergerakan Bulan dan Matahari (saat keduanya segaris, disebut
*konjungsi*; 5.189 konjungsi pada rentang itu). Perhitungan astronomi memakai pustaka `astronomy-engine`.

## Temuan 1: kurup bukan sekadar kebiasaan, ia benar-benar menjinakkan selisih

Tanpa kurup (metode windu murni), awal bulan Jawa makin lama makin **terlambat** terhadap Bulan: rata-rata naik sekitar satu hari
setiap 120 tahun. Dengan kurup, selisih itu tidak bertambah.

| | Pergeseran terhadap Bulan |
|---|---|
| Windu murni (tanpa kurup) | **+0,00792 hari per tahun** (sekitar satu hari tiap 120 tahun) |
| Dengan kurup (pustaka ini) | **−0,00022 hari per tahun** (praktis nol) |

Angka pertama nyaris sama dengan perhitungan di atas kertas: tahun Jawa 354,375 hari dikurangi dua belas bulan sinodis
354,367 hari = 0,00794 hari per tahun. Jadi kurup bukan angka asal-asalan: besarnya sesuai dengan selisih yang memang ada.

Ada juga rincian halus: satu hari penuh sedikit **terlalu banyak** untuk 120 tahun (selisih sebenarnya 0,953 hari), sehingga
setiap kurup menggeser rata-rata sekitar 0,048 hari ke arah sebaliknya. Itu terlihat pada data (rata-rata 1,207, 1,158, lalu
1,112 hari pada tiga kurup penuh) dan sesuai dengan hitungan.

## Temuan 2: kalender hitungan tidak menjamin awal bulan sesudah bulan baru

Awal bulan Jawa rata-rata jatuh sekitar **1,2 hari** sesudah konjungsi (dihitung dari tengah malam tanggal itu), dengan sebaran besar (simpangan baku 0,57 hari atau
sekitar 13,6 jam). Sebagian sebaran itu berasal dari Bulan sendiri: bulan baru yang sebenarnya menyimpang dari garis rata-rata
dengan simpangan baku 7,5 jam dan paling jauh 14,2 jam. Sisanya berasal dari struktur kalender (selingan 30 dan 29 hari dan
pola delapan tahun), yang belum kami uraikan lebih jauh.

Akibatnya, pada sebagian bulan, hari pertama sudah dimulai **sebelum** konjungsi. Jika magrib dianggap pukul 18.00:

* **254 dari 5.184 bulan (4,9%)** di seluruh rentang;
* **98 dari 1.440 bulan (6,8%)** pada kurup Asapon yang berlaku sekarang.

Pada bulan-bulan itu, bulan sabit baru tidak mungkin terlihat. Ini **bukan kesalahan** pustaka: kalender hitungan (*hisab
urfi*) memang tidak dirancang mengikuti hilal. Tetapi ia berarti kalender ini **tidak boleh disajikan sebagai kalender
astronomi**, dan tidak untuk menentukan hari ibadah.

## Batas pengukuran

* Pencocokan memakai konjungsi terdekat dan waktu UTC+7; Keraton memakai waktu setempat sekitar UTC+7:20, selisih yang jauh
  lebih kecil dari satu hari.
* Magrib diasumsikan tetap pukul 18.00 pada hitungan "sebelum konjungsi"; angka 254 dan 98 bergeser sedikit bila memakai
  magrib sebenarnya yang berubah sepanjang tahun.
* Hasil ini mengukur kalender terhadap Bulan. Ia **bukan** bukti bahwa tafsir weton atau wuku benar.

## Mengulang sendiri

```bash
npm i --no-save astronomy-engine
node audit/selisih_bulan_baru.mjs        # mencetak JSON; hasil acuan: audit/selisih_bulan_baru.json
```

**Sebelumnya:** [Kalender Jawa dan kurup](03-kalender-jawa-dan-kurup.md) · **Selanjutnya:**
[Hitungan dan tafsir](05-hitungan-dan-tafsir.md). Uraian teknis: [Pawukon dan astrologi](../ilmiah/PAWUKON_DAN_ASTROLOGI.md), bagian 4.
