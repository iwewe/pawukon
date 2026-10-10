# Matriks klaim, bukti, dan batas

Dokumen ini adalah **daftar pemeriksaan** repositori `pawukon`. Setiap klaim yang dibuat dokumentasi diberi kode (K1, K2, ...), dan
untuk tiap kode dicatat: apa yang diklaim, **jenisnya**, buktinya, cara mengulang pemeriksaan, dan **batasnya**. Bila sebuah klaim
tidak punya bukti yang dapat diulang dari repositori, hal itu dituliskan.

Ringkasan untuk awam ada di [halaman populer](../populer/01-apa-itu-weton-dan-pawukon.md); paparan akademik audit sumber ada di
[paparan ilmiah](paparan_ilmiah_pawukon.md). Semua perintah dijalankan dari folder repositori; perlu Node.js 18+ dan, untuk yang
disebut, Python 3.

## Cara membaca

| Jenis | Artinya |
|---|---|
| **Aritmetika** | Dibuktikan lewat perhitungan dan pembandingan dengan implementasi lain; tidak bergantung pada pengamatan. |
| **Kesesuaian dengan acuan** | Cocok dengan tabel, almanak, atau pengumuman pihak lain. Kuat sejauh acuan itu kuat dan datanya independen. |
| **Pengukuran** | Diukur terhadap data astronomi; hasilnya angka dengan ketidakpastian. |
| **Pilihan** | Keputusan desain atau kebijakan, bukan temuan. Dicatat agar orang lain dapat memilih lain. |
| **Tradisi** | Isi kitab. Tidak diuji, dan tidak diklaim benar. |

## Ringkasan

| Kode | Klaim singkat | Jenis | Status |
|---|---|---|---|
| [K1](#k1) | Hari, pasaran, wuku, dan neptu adalah tiga rumus sisa bagi dari nomor hari | Aritmetika | Terbukti pada 288.134 hari |
| [K2](#k2) | Awal tahun Jawa punya rumus tertutup | Aritmetika | Terbukti (AJ 1555 sampai 2226) |
| [K3](#k3) | Mesin cocok dengan tabel awal bulan Keraton (kurup Aboge dan Asapon) | Kesesuaian dengan acuan | Teruji; bukti terbatas oleh sifat data |
| [K4](#k4) | Mesin cocok dengan almanak cetak dan pengumuman acara Keraton | Kesesuaian dengan acuan | Teruji; belum ada almanak cetak tahun Dal |
| [K5](#k5) | Mesin sama dengan windu murni digeser menurut kurup | Aritmetika | Terbukti pada setiap hari 1633 sampai 2052 |
| [K6](#k6) | Sumber lain berbeda dari mesin pada hitungan tertentu | Pengukuran perbandingan | Terukur |
| [K7](#k7) | Windu dan lambang mengikuti tahun Jawa, bukan blok 2.835 hari | Pilihan, terukur | Berbeda pada 53 dari 153.086 hari |
| [K8](#k8) | Kurup mengoreksi selisih tahun Jawa terhadap bulan sinodis | Pengukuran | Terukur pada 5.184 bulan |
| [K9](#k9) | Kalender hitungan tidak menjamin awal bulan sesudah konjungsi | Pengukuran | Terukur (4,9% bulan) |
| [K10](#k10) | Mesin menghitung per tanggal sipil; hari Jawa sebenarnya berganti saat magrib | Pilihan | Disengaja |
| [K11](#k11) | Data tafsir setia pada kitab dan keganjilannya dicatat | Kesesuaian dengan acuan | Teruji sebagian; bergantung pada terjemahan modern |
| [K12](#k12) | Tafsir adalah tradisi | Tradisi | **Tidak diklaim valid** |
| [K13](#k13) | Acuan tunggal adalah Keraton, bukan pemerintah atau hilal | Pilihan | Kebijakan |
| [K14](#k14) | Kalimat tafsir ditulis ulang, bukan disalin | Pengukuran | **Tidak dapat diulang dari repositori** |

---

## K1

**Klaim.** Untuk nomor hari `d` (hari sejak Jumat Legi, 8 Juli 1633, boleh negatif): hari = `(d+4) mod 7`, pasaran = `d mod 5`
(Legi = 0), wuku = `floor(((d+194) mod 210) / 7)`, dan neptu = neptu hari + neptu pasaran (7 sampai 18).

**Jenis.** Aritmetika.

**Bukti.** `tests/spesifikasi.test.js` menulis ketiga rumus dari [Rumusan perhitungan](../spesifikasi/RUMUSAN_PERHITUNGAN.md) secara terpisah dan
membandingkannya dengan mesin pada **288.134 hari berturut-turut** (50.000 hari sebelum epoch sampai 3 Juli 2285): tidak ada selisih.
Cocok pula dengan weton yang diketahui (Sabtu Kliwon, 26 April 1975, ditegaskan dalam `audit/audit_pawukon.py`; Jumat Legi, 17 Agustus 1945,
weton Proklamasi yang dikenal luas dan tidak ditelusuri ke sumber cetak dalam audit ini), serta dengan siklus Galungan-Kuningan 2024-2027
dan sebelas hari Taliwangke dan Samparwangke yang disebut kitab ([Kalender dan verifikasi](KALENDER_DAN_VERIFIKASI.md)).

**Ulangi.** `node --test tests/spesifikasi.test.js`

**Batas.** Titik pijak (8 Juli 1633 = Jumat Legi) adalah konvensi yang dicocokkan dengan weton yang diketahui, bukan sesuatu yang dapat
diturunkan dari alam. Klaim ini menyatakan konsistensi hitungan, bukan makna. Batas hari magrib tidak dibahas di sini (lihat K10).

## K2

**Klaim.** Hari ke-`d` untuk 1 Sura tahun AJ `y` adalah `2835·floor((y−1555)/8) + B[(y−1555) mod 8] − c(y)`, dengan
`B = [0, 354, 709, 1063, 1417, 1772, 2126, 2480]` dan `c(y)` = banyaknya batas kurup (1627, 1747, 1867, 1987, ...) yang telah dicapai `y`.

**Jenis.** Aritmetika.

**Bukti.** `tests/spesifikasi.test.js` memeriksa 673 baris awal tahun (AJ 1555 sampai 2227) terhadap mesin (tanggal, weton, dan panjang
tahun). `audit/audit_pawukon.py` memeriksa rumus yang sama terhadap penjumlahan tahun demi tahun, dengan pernyataan internal yang
akan menghentikan skrip bila berbeda.

**Ulangi.** `node --test tests/spesifikasi.test.js` dan `python3 -I audit/audit_pawukon.py /dev/null`

**Batas.** Diuji sampai AJ 2226 (3 Juli 2285). Sesudah 25 Agustus 2052 rumus diteruskan tanpa otoritas (lihat K3 dan K5).

## K3

**Klaim.** Mesin cocok dengan **semua 1.440 awal bulan kurup Asapon (1936 sampai 2052)** dan **semua 1.440 awal bulan kurup Aboge
(1819 sampai 1935)** pada tabel Keraton.

**Jenis.** Kesesuaian dengan acuan.

**Bukti.** `tests/kraton.test.js` terhadap `tests/data-kraton.js` (weton tanggal 1 tiap bulan, delapan nama tahun × dua belas bulan).
Sumber tabel: Siti Marhamah (2022), tesis UIN Walisongo, hlm. 51-69, yang mengutip KRT Rintaiswara (2015).

**Ulangi.** `node --test tests/kraton.test.js`

**Batas.**
1. Angka 1.440 per kurup berasal dari **96 pola** (8 tahun × 12 bulan) yang berulang selama 15 windu; bukan 2.880 pengamatan sejarah yang
   berdiri sendiri.
2. Buku Rintaiswara tidak diperiksa langsung; tabel diperoleh lewat tesis. Citra tabel tesis belum diperiksa ulang (pembacaan memakai teks PDF).
3. **Tiga salah ketik tesis dikoreksi** karena terbukti secara aritmetika (awal bulan berurutan harus berselisih 29 atau 30 hari); rinciannya
   di kepala `tests/data-kraton.js`.
4. Kurup Amahgi dan Amiswon (1633 sampai 1819) **tidak punya tabel Keraton** untuk diuji; di sana mesin mengikuti metode windu murni (K5).

## K4

**Klaim.** Mesin cocok dengan **15 tanggal Jawa yang tercetak** pada Tabel 6 sampai 15 tesis Marhamah (Almanak Jawa 1929 sampai 1939 dan kalender
Keraton 2012 dan 2020) serta, untuk tahun Dal 1959, tiga pengumuman acara Keraton: 4 Sura = 30 Juni 2025, 29 Rejeb = 18 Januari 2026, dan
29 Besar = 15 Juni 2026.

**Jenis.** Kesesuaian dengan acuan.

**Bukti.** `tests/almanak.test.js` terhadap data `tests/data-almanak.js`: 15 baris, yaitu 10 awal bulan Pasa dan Sawal pada 6 tahun Jawa
(Alip 1859, Be 1864, Ehe 1868, Je 1870, Wawu 1945 dan 1953) ditambah 5 baris hari pendamping pada tabel yang sama. Tiga pengumuman acara bersumber
dari laman resmi Keraton (rujukan R13-R15 di [paparan ilmiah](paparan_ilmiah_pawukon.md)), diambil ulang 11 Oktober 2026, dan dicetak oleh
`audit/audit_pawukon.py` pada kunci `official_event_dates_for_comparison` (skrip itu mencetak dua tanggal tambahan yang **tidak** dipakai sebagai
bukti). Titik 18 Januari 2026 berupa upacara sekitar pukul 11.00 WIB, jadi tidak bergantung pada tafsir pergantian hari saat magrib.

**Ulangi.** `node --test tests/almanak.test.js` dan `python3 -I audit/audit_pawukon.py /dev/null`

**Batas.**
1. **Tidak ada titik tahun Dal** pada tabel tesis, sehingga 15 tanggal itu tidak membedakan pola Dal lama dan baru. Bukti tahun Dal bertumpu pada
   rumus dan tabel Keraton (K3) serta tiga pengumuman acara; **belum ada almanak cetak tahun Dal yang dicocokkan**.
2. Dua salah ketik tesis dikoreksi dan dicatat di `tests/data-almanak.js`: Tabel 8 mencetak "30 Ruwah 1864" padahal hari sebelum 1 Sawal pasti
   hari terakhir bulan Pasa; Tabel 14 mencetak 24 April 2020 tetapi teks sekitarnya menulis 24 Mei 2020.
3. Tabel tesis adalah salinan sekunder dari Almanak Jawa dan kalender Keraton; almanak aslinya tidak diperiksa langsung.
4. Laman web dapat berubah dan bukan arsip permanen.
5. Versi lama README menyebut "12 titik Almanak Jawa" tanpa menyimpan datanya. Angka itu tidak dapat ditelusuri dan telah diganti dengan 15 tanggal
   di atas, yang tersimpan dan diuji.

## K5

**Klaim.** Mesin sama dengan **windu murni** (pola 8 tahun 354, 355, 354, 354, 355, 354, 354, 355 hari tanpa kurup) yang digeser 0, 1, 2, dan 3
hari menurut kurup, pada setiap hari.

**Jenis.** Aritmetika.

**Bukti.** `tests/kraton.test.js` membangun windu murni dengan implementasi terpisah dan membandingkannya dengan mesin pada setiap hari
1633 sampai 2052. `tests/spesifikasi.test.js` membandingkan mesin dengan implementasi acuan (`spec/referensi.py`) lewat checksum SHA-256
pada setiap hari sampai 3 Juli 2285.

**Ulangi.** `npm run verify`

**Batas.** Ini bukti bahwa mesin = definisi itu, bukan bukti sejarah bahwa windu murni dipakai pada masa tertentu. Sesudah 2052 hasil
ditandai spekulatif.

## K6

**Klaim.** Program pembanding memberi hasil berbeda dari mesin: `weton.m` pada **82 dari 432** awal tahun (AJ 1555 sampai 1986),
`research-system-javanese-profile` (cabang modern) pada **32 dari 120** (AJ 1867 sampai 1986), skrip `almanak` pada **0 dari 120** (AJ 1867 sampai 1986).

**Jenis.** Pengukuran perbandingan.

**Bukti.** `audit/audit_pawukon.py`, rekonstruksi mandiri empat model dari aturan yang terbaca, dengan pernyataan internal. Menurut catatan
revisi di kepala skrip, keempat model dicocokkan dengan keluaran program aslinya tanpa selisih pada revisi itu. Kunci hasil:
`start_date_disagreements`.

**Ulangi.** `python3 -I audit/audit_pawukon.py /dev/null`

**Batas.** Skrip adalah rekonstruksi, bukan menjalankan program asli pada setiap pembacaan. Selisih tidak otomatis berarti kesalahan: tiap
program memakai spesifikasi berbeda (tahun mana yang 355 hari, batas kurup, asal hitungan). Rinciannya di [Kalender dan verifikasi](KALENDER_DAN_VERIFIKASI.md).

## K7

**Klaim.** Windu dan lambang dihitung dari **tahun Jawa** (`floor((y−1555)/8)`), bukan dari blok 2.835 hari sejak epoch. Kedua cara berbeda
pada **53 dari 153.086 hari** (1633 sampai 2052).

**Jenis.** Pilihan, dengan akibat yang terukur.

**Bukti.** `audit/audit_pawukon.py` (kunci `windu_formula_disagreement`) dan `tests/kalender.test.js`. Pilihan itu sejalan dengan uraian Keraton
("lambang berumur 8 tahun"), tesis Marhamah, dan `research-system-javanese-profile`.

**Ulangi.** `node --test tests/kalender.test.js`

**Batas.** Cara blok hari (warisan `weton.m`) bukan salah hitung, melainkan definisi lain; contoh yang diterbitkan `weton.md` untuk 10 Agustus 2021
sengaja berbeda dan ditandai di tes.

## K8

**Klaim.** Kurup mengoreksi selisih antara tahun Jawa (354,375 hari) dan dua belas bulan sinodis (354,367 hari): windu murni tertinggal
terhadap bulan baru astronomi sebesar **+0,00792 hari per tahun**, sedangkan mesin dengan kurup hanya **−0,00022 hari per tahun**.

**Jenis.** Pengukuran.

**Bukti.** `audit/selisih_bulan_baru.mjs` membandingkan 5.184 awal bulan Jawa (1633 sampai 2052) dengan 5.189 konjungsi dari `astronomy-engine`
2.1.19. Hasil mentah: `audit/selisih_bulan_baru.json`. Rata-rata selisih per kurup (hari): windu murni 1,445, 2,207, 3,158, 4,112; dengan kurup
1,445, 1,207, 1,158, 1,112. Selisih teoretis 0,00794 hari per tahun dihitung dari 2835/8 − 12 × 29,530588.

**Ulangi.** `npm i --no-save astronomy-engine && node audit/selisih_bulan_baru.mjs` (atau `ASTRONOMY_ENGINE=/jalur/astronomy.js node ...`).

**Batas.** Konjungsi terdekat dan waktu UTC+7 (Keraton memakai waktu setempat sekitar UTC+7:20, jauh di bawah skala hari). Kurup sedikit
**berlebihan**: rata-rata turun sekitar 0,048 hari per kurup penuh (1 − 0,953). Kurup pertama hanya 72 tahun sehingga tidak sebanding. Sebaran
bulanan 0,57 hari; sebagian berasal dari Bulan (bulan baru sejati menyimpang dari garis rata-rata 7,5 jam, maksimum 14,2 jam), sisanya dari
struktur kalender dan belum diuraikan. Model ΔT historis `astronomy-engine` tidak diperiksa terpisah.

## K9

**Klaim.** Karena dihitung dengan aturan tetap, kalender ini tidak menjamin awal bulan jatuh sesudah bulan baru: bila magrib dianggap pukul 18.00,
**254 dari 5.184 bulan (4,9%)** dimulai sebelum konjungsi, termasuk **98 dari 1.440 (6,8%)** pada kurup Asapon.

**Jenis.** Pengukuran.

**Bukti.** `audit/selisih_bulan_baru.json`, kunci `awalMaghribSebelumKonjungsi`.

**Ulangi.** Lihat K8.

**Batas.** Magrib diasumsikan tetap pukul 18.00 (sebenarnya berubah sekitar ±0,5 jam sepanjang tahun), sehingga angkanya bergeser sedikit bila
memakai terbenam sebenarnya. Ini sifat kalender hisab urfi, bukan kesalahan mesin; konsekuensinya, kalender ini tidak boleh disajikan sebagai
kalender astronomi atau dipakai untuk hari ibadah (K13).

## K10

**Klaim.** Mesin menghitung per **tanggal sipil** (tengah malam). Menurut tradisi dan Keraton (tesis hlm. 54), hari Jawa sebenarnya berganti saat magrib.

**Jenis.** Pilihan.

**Bukti.** Kode `src/kalender.js` tidak memakai jam atau lokasi. Penanganan magrib tidak ada di repositori ini.

**Batas.** Untuk kelahiran sesudah magrib, pemakai perlu menambah satu hari sendiri. Rancangan perhitungan magrib dari terbenam matahari ada di
[Pawukon dan astrologi](PAWUKON_DAN_ASTROLOGI.md), bagian 5; penerapannya di luar repositori ini tidak diverifikasi di sini.

## K11

**Klaim.** Data tafsir setia pada kitab: tiap tabel dikodekan dengan rujukan bab dan halaman, diuji dengan contoh hitungan kitab dan uji silang
antar tabel, dan keganjilan cetakan disalin apa adanya serta ditandai.

**Jenis.** Kesesuaian dengan acuan.

**Bukti.** Berkas `tests/*.test.js` per modul (`tafsir`, `hari`, `rezeki`, `kesehatan`, `rumah`, `bepergian`, `jam`, `pernikahan`, `hajatan`, `watakLanjut`,
`ciriTubuh`), termasuk uji silang bab 147-149, 133-135, dan 57/173, serta daftar keganjilan di [Asumsi dan anomali](ASUMSI_DAN_ANOMALI.md).

**Ulangi.** `npm test`

**Batas.** Sumbernya terjemahan Indonesia modern kitab, bukan naskah Jawa; teks OCR sering merusak tabel sehingga banyak tabel diperiksa pada citra
halaman. Penanda `verifikasi: 'scan'` adalah catatan pengembang; audit independen tidak memeriksa semua citra. Hanya sebagian dari 337 bab yang
dikodekan (lihat "Belum dikerjakan" di [Referensi pustaka](../pustaka/REFERENSI_API.md)).

## K12

**Klaim.** Tafsir (watak, jodoh, hari baik, rezeki, kesehatan, dan sebagainya) adalah **tradisi**.

**Jenis.** Tradisi.

**Bukti.** Tidak ada, dan tidak diklaim ada. Repositori ini tidak menguji validitas empiris tafsir apa pun.

**Batas.** Tafsir bukan fakta ilmiah, ramalan, atau nasihat profesional. Bagian ini dicatat justru agar jelas bahwa kesahihan hitungan (K1 sampai K5)
tidak diperluas ke tafsir.

## K13

**Klaim.** Acuan tunggal adalah kalender aritmetika Keraton Ngayogyakarta; **bukan** penetapan awal Ramadan, Syawal, atau hari besar oleh pemerintah,
rukyat, atau hisab Hijriyah.

**Jenis.** Pilihan (kebijakan).

**Bukti.** Kebijakan tertulis di [Kalender dan verifikasi](KALENDER_DAN_VERIFIKASI.md), bagian "Acuan kalender (kebijakan)".

**Batas.** Awal Poso dan Sawal menurut Keraton bisa berbeda satu hari dari penetapan resmi. Untuk tanggal ibadah, gunakan penetapan resmi.

## K14

**Klaim.** Kalimat tafsir ditulis ulang dengan kata sendiri; dari 923 teks deskriptif, tidak ada yang memuat rangkaian kata berturut-turut sama
dengan sumber lebih dari 6 kata (62 teks memuat rangkaian 5 sampai 6 kata, umumnya nama anggota badan dan frasa lazim).

**Jenis.** Pengukuran.

**Bukti.** Pengukuran dilakukan terhadap OCR seluruh kitab. OCR itu **tidak disertakan** di repositori (hak cipta sumber), sehingga angka ini
**tidak dapat diulang dari repositori**.

**Batas.** Diperlakukan sebagai klaim yang tidak dapat diverifikasi pihak ketiga. Bila data akan dipublikasikan luas, pertimbangkan pemeriksaan hukum.
