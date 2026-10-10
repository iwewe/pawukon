# Kalender dan verifikasi

Bagaimana kalender Jawa dalam pustaka ini dihitung, terhadap apa ia diuji, dan seberapa kuat buktinya. Ringkasan untuk awam:
[Kalender Jawa dan kurup](../populer/03-kalender-jawa-dan-kurup.md). Rumus lengkap: [Rumusan perhitungan](../spesifikasi/RUMUSAN_PERHITUNGAN.md).
Klaim yang dapat diperiksa satu per satu: [Matriks klaim dan bukti](MATRIKS_KLAIM_BUKTI.md).

Algoritma merujuk pada `weton.m` (François Beauducel; kode ditulis ulang, lihat [NOTICE.md](../../NOTICE.md)) dan dikoreksi agar cocok dengan tabel Keraton Yogyakarta, dan dibandingkan dengan port Python
yang sudah dikoreksi pada 3344 tanggal tanpa selisih. Epos: 8 Juli 1633 = Jumat Legi, 1 Sura Alip 1555.

| Bagian | Jangkauan |
|---|---|
| weton, wuku, neptu | Tanggal apa pun (siklus murni 5, 7, 35, 210 hari) |
| tanggal Jawa, tahun, windu, lambang, kurup | 8 Juli 1633 - 25 Agustus 2052. Sesudahnya `spekulatif: true` |

**Seberapa bisa dipercaya**

- **Weton dan wuku:** cocok dengan `weton.m`, `research-system-javanese-profile`, dan `almanak`; cocok dengan weton 26 April 1975
  (Sabtu Kliwon) dan siklus Galungan-Kuningan 2024-2027. Penyelarasan wuku dan pasaran juga cocok dengan 11 hari Taliwangke dan
  Samparwangke yang disebut kitab (wuku + hari + pasaran), bukti yang tidak bergantung pada `weton.m`.
- **Tanggal Jawa:** cocok dengan tabel awal bulan kalender **Keraton Yogyakarta** untuk kurup Asapon (1936-2052) dan Aboge (1819-1935), anchor 1 Sura Alip di
  keempat kurup, serta 15 tanggal Almanak Jawa dan kalender Keraton pada Tabel 6-15 tesis (`tests/almanak.test.js`; lihat bagian Verifikasi). Untuk 1633-1819 (Amahgi, Amiswon) tidak ada tabel Keraton; di sana mesin mengikuti metode windu asli (lihat "Metode tertua dan sumber pembanding").
- **Windu dan lambang** mengikuti blok **delapan tahun Jawa** (Alip membuka windu baru; urutan Kuntara, Sangara, Sancaya, Adi menurut Keraton), seperti tesis, uraian
  Keraton ("masing-masing lambang berumur 8 tahun"), dan rsjp. `weton.m` menghitungnya dari blok 2835 hari sejak epoch, sehingga label berbeda satu sampai tiga hari pada
  batas windu (53 dari 153.086 hari; contoh yang diterbitkan `weton.md` untuk 10 Agustus 2021 mencetak "Sengara Langkir", di sini "Sancaya Kulawu"). Ejaan Sangara mengikuti Keraton.
  Penyimpangan ini disengaja dan diuji (`tests/kalender.test.js`).
- **Tes regresi:** `tests/golden.json` berisi 458 tanggal dari port Python `weton.m` yang sudah dikoreksi agar cocok dengan Keraton dan metode windu asli (bukan keluaran Octave asli); `tests/kraton.test.js` memeriksa langsung terhadap tabel Keraton.
- **Hari mulia** yang dihitung: Siji Sura, Kuningan, Hanggara Asih, Dina Mulya, Dina Purnama ("Aboge" dan "Daltugi" di `weton.m`
  hanya memeriksa sebagian syarat, jadi sengaja tidak dimasukkan).

## Aturan yang bergantung kalender Jawa

Aturan yang hanya memakai **hari, pasaran, wuku, atau jumlah neptu** bersifat pasti. Aturan yang memakai **tanggal, bulan, atau tahun Jawa**
ditandai `bergantungTanggalJawa: true`. Kitab mengikuti sistem **Aboge** (Alip = Rabu Wage), sedangkan kalender ini memakai **Asapon** sejak
1867 (Alip = Selasa Pon). Akibatnya hari pekan yang tercatat di sebagian tabel kitab (Kunarpawarsa, Sangarwarsa, Anggarakasih) bisa bergeser
sehari, sehingga aturannya dievaluasi lewat tanggal dan bulan, bukan lewat hari pekan yang tertulis. Mangsa memakai kalender pranata mangsa
baku, bukan dari kitab.

## Verifikasi dengan kalender Keraton Yogyakarta

**Sumber:** Siti Marhamah, *Kalender Jawa Islam Sultan Agungan di Kesultanan Yogyakarta* (Tesis Ilmu Falak, UIN Walisongo Semarang, 2022):
rumus dan tabel awal bulan hlm. 51-69 (mengutip KRT Rintaiswara, *Tahun Jawa Islam Sultan Agungan*, Dinas Kebudayaan DIY bersama Keraton
Ngayogyakarta Hadiningrat, 2015), serta data Almanak Jawa dan kalender Keraton hlm. 114-127. Tabel disalin ke `tests/data-kraton.js`.

**Hasil.** Keraton menetapkan 1 Sura tiap tahun dalam windu secara tetap sepanjang satu kurup (Asapon: Alip Selasa Pon, Ehe Sabtu Pahing,
Jimawal Kamis Pahing, Je Senin Legi, Dal Jumat Kliwon, Be Rabu Kliwon, Wawu Ahad Wage, Jimakir Kamis Pon), dengan tahun wuntu (355 hari) =
**Ehe, Dal, Jimakir** (tahun ke-2, 5, 8). Mesin ini sebelumnya (mengikuti `weton.m`) memberi 355 hari pada **Je** dan 354 pada **Dal**, sehingga
**seluruh tahun Dal bergeser satu hari** dari tabel Keraton, dan penyesuaian "kurup berakhir lebih cepat sehari" jatuh pada tahun yang keliru di
ujung Aboge (AJ 1865-1866). Keduanya sudah dikoreksi. Sekarang mesin cocok dengan tabel Keraton pada **semua 1440 awal bulan Asapon
(1936-2052) dan semua 1440 awal bulan Aboge (1819-1935)**, dan dengan 15 tanggal Almanak Jawa/kalender Keraton pada Tabel 6-15 tesis (10 awal bulan Pasa dan Sawal pada 6 tahun Jawa, tanpa tahun Dal; `tests/almanak.test.js`). Catatan: angka 1440 per kurup berasal dari 96 entri pola (8 tahun x 12 bulan) yang berulang selama 15 windu (192 entri untuk kedua kurup), bukan 2.880 observasi sejarah yang independen.

- Contoh yang berubah: 1 Sura Dal 1959 = **Jumat Kliwon 27 Juni 2025** (sebelumnya 28 Juni, Sabtu Legi). Tahun Dal berikutnya: AJ 1967 (2033-2034).
  1 Sura Jimawal 1957 = Kamis Pahing 20 Juli 2023 tidak berubah.
- Weton, wuku, dan pasaran tidak pernah terpengaruh (siklus murni). Yang berubah hanya nomor tanggal, bulan, dan batas tahun Jawa: pada tahun Dal
  Asapon (AJ 1871, 1879, ..., 1959, 1967, ..., 1983), sebagian tahun Dal Aboge, AJ 1865-1866, dan seluruh AJ 1627-1818 (batas kurup, selisih satu hari). Dari 3344
  tanggal uji, 607 berubah dibanding versi `weton.m`; pada tanggal sesudah 1936 hanya tahun Dal yang berubah.
- `research-system-javanese-profile` (rsjp), pembanding sebelumnya, juga tidak sepenuhnya cocok dengan Keraton: ia benar pada tahun Dal tetapi memberi
  tahun Jimawal satu hari lebih awal (1 Sura 1957 = 19 Juli 2023, Keraton: 20 Juli 2023).

**Salah ketik tesis** dikoreksi karena terbukti secara aritmetika (awal bulan berurutan harus berselisih 29 atau 30 hari): Aboge Alip Jumadilakir
"Kamis Pon" -> "Kamis Pahing"; Aboge Je Sapar "Kamis Pon" -> "Kamis Pahing"; Asapon Jimawal Rejeb "Selasa Wage" -> "Sabtu Wage".
Pada teks 1 Poso 1953 tercetak "24 Mei 2020", padahal tabelnya 24 April 2020 (1 Ramadhan 1441 H).

**Batas bukti (jujur).** Lima belas tanggal almanak yang tercetak (`tests/data-almanak.js`) tidak ada yang jatuh pada tahun Dal, jadi tidak membedakan mesin lama dan baru. Dua koreksi salah ketik tesis pada data itu dicatat di berkasnya (Tabel 8: "30 Ruwah" seharusnya 30 Pasa; Tabel 14: 24 April, bukan 24 Mei 2020). Catatan: README versi lama menyebut "12 titik Almanak Jawa" tanpa menyimpan datanya; angka itu tidak dapat ditelusuri dan diganti dengan 15 tanggal yang kini tersimpan dan diuji.
Koreksi bertumpu pada rumus dan tabel Keraton dari publikasi 2015 serta panjang tahun pada Tabel 1 tesis. Sesudah itu ditemukan tiga pengumuman acara
Keraton untuk tahun Dal 1959 yang cocok dengan mesin: 4 Sura = 30 Juni 2025, 29 Rejeb = 18 Januari 2026, dan 29 Besar = 15 Juni 2026 (laman resmi Keraton,
diambil ulang 11 Oktober 2026; rujukan R13-R15 di [paparan ilmiah](paparan_ilmiah_pawukon.md)). Titik 18 Januari berupa upacara sekitar pukul 11.00 WIB, jadi tidak
bergantung pada tafsir pergantian hari saat maghrib. Yang masih belum ada: almanak **cetak** tahun Dal yang dicocokkan; bila tersedia, 1 Sura 1959 harus Jumat Kliwon, 27 Juni 2025.

**Batas kurup (terselesaikan dengan uji).** Tesis menyebut kurup Keraton: Amahgi (Jumat Legi) 1555-1627 (72 tahun), Amiswon (Kamis Kliwon) 1627-1747,
Aboge (Rabu Wage) 1747-1867, Asapon (Selasa Pon) 1867-1987 (2053 M). Mesin sebelumnya memakai batas `weton.m` (1675, 1749 dengan geseran 2, dan varian
Yogyakarta 1795). Kedua konfigurasi konsisten pada dirinya sendiri (1 Sura tahun Alip selalu jatuh pada hari-pasaran kurup yang dilabelkan), jadi yang membedakan
adalah kecocokan dengan Keraton: (a) pada konfigurasi `weton.m`, 1 Sura Alip 1627 jatuh pada Jumat Legi dan 1747 pada Kamis Kliwon, padahal tesis menetapkan
Kamis Kliwon (Amiswon mulai 1627) dan Rabu Wage (Aboge mulai 1747); (b) tabel Aboge Keraton cocok pada 1416 dari 1440 awal bulan, dengan 24 selisih tepat pada
AJ 1747-1748. Konfigurasi Keraton lolos semuanya (1440 dari 1440), dan anchor 1 Sura Alip mundur satu hari dan satu pasaran tiap kurup (Jumat Legi, Kamis Kliwon,
Rabu Wage, Selasa Pon). Maka batas kurup Keraton dipakai dan opsi `{ jogja: true }` dihapus. Kurup ke-3 mulai 1795 memang dilaporkan untuk sejarah Yogyakarta (Karjanto dan Beauducel 2020, Tabel 9), tetapi dokumentasi Keraton masa kini dan tesis menyebut 1747; opsi itu dicabut sebagai keputusan produk, bukan bukti bahwa varian tersebut tidak pernah dipakai (lihat [paparan_ilmiah_pawukon.md](paparan_ilmiah_pawukon.md), bab 6.1).
Amahgi dan Amiswon tidak punya tabel Keraton untuk diuji; pola bulan di sana kini sama dengan metode windu asli (lihat bagian berikut), setelah pola bulan khusus tahun Dal milik `weton.m` di Amiswon dihapus.

## Metode tertua dan sumber pembanding

Metode tertua adalah **windu murni**: pola 8 tahun (Ehe, Dal, Jimakir = 355 hari; bulan 30/29; Besar 30 pada tahun wuntu), tanpa koreksi kurup 120 tahun (tesis hlm. 52-56).
Mesin ini adalah metode itu **ditambah** koreksi kurup Keraton (tiap kurup membuat kalender mundur satu hari). Ini diuji langsung di `tests/kraton.test.js` dengan
implementasi windu murni yang terpisah: mesin sama pada **setiap hari** 1633-2052 setelah digeser 0, 1, 2, 3 hari menurut kurup.

Perbandingan sumber (diukur pada awal tahun 1 Sura AJ 1555-1986, relatif terhadap mesin ini yang cocok dengan Keraton):

| Sumber | Metode | Hasil |
|---|---|---|
| skrip almanak (`kalender_jawa_sultan_agungan.py`) | windu murni, tanpa kurup, berjangkar 1 Sura 1959 = 27 Juni 2025 | persis metode tertua; selisih konstan -3, -2, -1, 0 hari per kurup; hanya tepat pada Asapon |
| `research-system-javanese-profile` | batas kurup sama dengan Keraton; dua kurup awal memakai Ehe/Dal/Jimakir, lalu Ehe/Je/Jimakir mulai Aboge; tanggal modern (AJ 1867-1986) memakai tahun Hijriah tabular 30 tahun berjangkar 25 Maret 1936 | sama persis pada AJ 1555-1626; selisih +1 hingga +2 hari pada 1627-1862 dan +-1 hari sesudahnya |
| `weton.m` | empat kurup dengan batas 1675 dan 1749; Je 355 dan Dal 354; pola bulan khusus tahun Dal Amiswon | sama persis hanya pada AJ 1555-1626 |
| paket npm `@damarkuncoro/primbon` 1.0.3 | tipe tanpa kurup | cocok penuh sejak 1950; selisih 1 hari pada 1900-1949; sebelum 1900 error pada 1561 dari 3344 tanggal uji dan selisih 1-3 hari pada yang lain |
| `weton.c`, `weton.pl` | hanya weton dan wuku | tidak menghitung tanggal Jawa |

Kurup tertua (Amahgi, AJ 1555-1626) disepakati semua sumber yang menghitungnya; perbedaan muncul ketika sumber menambahkan aturan yang lebih baru (Je menggantikan Dal).

## Acuan kalender (kebijakan)

Prinsip: **ikuti yang paling valid dan lolos uji di mesin sendiri**. Konkretnya:
- Acuan tunggal adalah **kalender aritmetika Keraton Yogyakarta** (rumus dan tabel yang tetap; tidak bergantung pada pengamatan atau penetapan).
- **Tidak mengikuti penetapan awal Ramadan, Syawal, atau hari besar oleh pemerintah, rukyat, atau hisab Hijriyah.** Sejak 3 Januari 1946 penetapan itu ada pada
  pemerintah (tesis hlm. 117-127), sehingga awal Poso dan Sawal Keraton bisa berbeda satu hari dari Hijriyah; mesin ini tidak berusaha menyamakannya. Untuk
  tanggal ibadah gunakan penetapan resmi, bukan mesin ini.
- Hari Jawa dimulai saat maghrib (tesis hlm. 54), tetapi mesin menghitung per **hari kalender Masehi**: "malam 1 Sura" jatuh pada malam sebelum tanggal Masehi yang dilaporkan.
- Sumber pembanding lain (`weton.m`, `research-system-javanese-profile`, `almanak`) dipakai hanya bila lolos uji terhadap tabel Keraton; bila tidak, Keraton yang dipakai.
