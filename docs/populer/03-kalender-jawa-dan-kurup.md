# Kalender Jawa, windu, dan kurup

*Bacaan untuk awam, tetap berbukti. Kode seperti **K3** menunjuk ke [Matriks klaim dan bukti](../ilmiah/MATRIKS_KLAIM_BUKTI.md).*

Weton dan wuku berputar sendiri, tanpa menghiraukan bulan. Kalender Jawa adalah hal lain: ia menghitung **tanggal, bulan, dan
tahun** (misalnya *1 Sura 1959*), dan di sinilah perhitungan menjadi rumit.

## Bahan dasarnya

**Bulan.** Dua belas bulan bergantian 30 dan 29 hari: Sura (30), Sapar (29), Mulud (30), dan seterusnya sampai Besar (29).
Satu tahun biasa karenanya 354 hari.

**Tahun.** Delapan tahun membentuk satu **windu**. Tahun-tahunnya bernama Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, dan Jimakir.
Tiga di antaranya, yaitu **Ehe, Dal, dan Jimakir**, diberi satu hari tambahan pada bulan Besar sehingga berumur 355 hari
(*tahun wuntu*). Lima lainnya 354 hari (*tahun wastu*). Satu windu jadinya 3 × 355 + 5 × 354 = **2.835 hari**.

**Titik awal.** Hitungan mulai pada **1 Sura Alip 1555 AJ** yang bertepatan dengan **Jumat Legi, 8 Juli 1633** (AJ = *Anno
Javanico*, tahun Jawa). Dari titik itu, seluruh kalender tinggal dijumlahkan: windu demi windu, tahun demi tahun.

Nama windu ada empat (Kuntara, Sangara, Sancaya, Adi) dan bergilir; ada pula dua **lambang** (Kulawu dan Langkir) yang bergilir
setiap windu. Satu windu dan satu lambang masing-masing berumur delapan tahun Jawa.

## Mengapa ada "kurup"?

Kalender di atas sedikit tidak pas dengan Bulan. Satu tahun Jawa rata-rata 354,375 hari, sedangkan dua belas bulan sebenarnya
(bulan baru ke bulan baru) 354,367 hari. Selisihnya kecil, sekitar 11 menit per tahun, tetapi menumpuk menjadi **sekitar satu
hari tiap 120 tahun**. Bagaimana ini terukur ada di [halaman 4](04-kalender-jawa-dan-bulan.md).

Perbaikannya disebut **kurup**: setiap 120 tahun kalender **dimundurkan satu hari**, caranya dengan memendekkan bulan Besar pada
tahun terakhir kurup itu. Empat kurup pertama diberi nama:

| Kurup | Tahun AJ | Hari 1 Sura tahun Alip |
|---|---|---|
| Amahgi (Jamingiyah) | 1555 sampai 1626 (hanya 72 tahun) | Jumat Legi |
| Amiswon (Kamsiyah) | 1627 sampai 1746 | Kamis Kliwon |
| **Aboge** (Arbangiyah) | 1747 sampai 1866 | Rabu Wage |
| **Asapon** (Salasiyah) | 1867 sampai 1986 | Selasa Pon |

Nama *Aboge* dan *Asapon* berasal dari hari-pasaran 1 Sura Alip: **A**lip **Bo**ge = Rabu Wage, dan **A**lip **Sapon** = Selasa Pon.
Kurup yang berlaku sekarang adalah Asapon, yang berakhir pada 25 Agustus 2052.

Hasilnya, misalnya: **1 Sura 1959 (tahun Dal) = Jumat Kliwon, 27 Juni 2025**, dan 1 Sura 1960 (tahun Be) = Rabu Kliwon, 17 Juni 2026.

## Mengapa hasil berbagai program bisa berbeda?

Aturan dasar sama, tetapi ada tiga titik rawan: **tahun mana yang 355 hari**, **kapan kurup berganti**, dan **dari mana
tahun dihitung**. Pustaka ini mengikuti kalender **Keraton Ngayogyakarta** pada ketiganya. Beberapa program lain mengambil
pilihan berbeda, sehingga hasilnya bergeser satu hari pada tahun-tahun tertentu:

* **`weton.m`** (karya François Beauducel): memberi 355 hari pada tahun *Je* dan 354 pada tahun *Dal*, serta memakai batas
  kurup 1675 dan 1749. Dibandingkan pustaka ini, **82 dari 432** awal tahun (AJ 1555 sampai 1986) berbeda.
* **`research-system-javanese-profile`**: batas kurup sama dengan Keraton, tetapi memperlakukan tahun *Je* sebagai tahun 355
  hari mulai kurup Aboge. **32 dari 120** awal tahun modern (AJ 1867 sampai 1986) berbeda.
* **Skrip `almanak`**: memakai **metode tertua** (windu murni tanpa kurup) dengan jangkar 1 Sura 1959 = 27 Juni 2025.
  Pada kurup Asapon sama persis dengan pustaka ini; pada kurup lebih awal berbeda tetap 1, 2, atau 3 hari.

Perbedaan itu belum tentu "kesalahan": masing-masing program memakai spesifikasi yang berbeda. Yang kita lakukan adalah
memilih **satu acuan** dan mengujinya sekeras mungkin.

## Terhadap apa pustaka ini diuji?

1. **Tabel awal bulan Keraton** untuk kurup Aboge dan Asapon: seluruh **1.440 + 1.440** awal bulan cocok (**K3**). Angka 1.440
   perlu dibaca dengan jujur: itu berasal dari 96 pola (8 tahun × 12 bulan) yang berulang selama 15 windu, bukan 2.880 pengamatan
   sejarah yang berdiri sendiri.
2. **Lima belas tanggal dari tabel Almanak Jawa dan kalender Keraton** (1929 sampai 2020) dan **tiga pengumuman acara Keraton** untuk tahun Dal 1959: 4 Sura = 30 Juni 2025,
   29 Rejeb = 18 Januari 2026, dan 29 Besar = 15 Juni 2026 (**K4**). Tanggal 18 Januari berupa upacara sekitar pukul 11.00 WIB,
   jadi tidak bergantung pada soal pergantian hari saat magrib.
3. **Implementasi lain yang ditulis terpisah** (windu murni dengan pergeseran kurup): sama pada setiap hari (**K5**).

Yang **belum** tersedia: tabel Keraton untuk kurup Amahgi dan Amiswon (1633 sampai 1819), dan almanak cetak tahun Dal. Pada
rentang itu pustaka mengikuti metode windu murni, dan hal ini tertulis sebagai batas.

## Kebijakan: Keraton, bukan pemerintah atau hilal

Pustaka ini **tidak** mengikuti penetapan awal Ramadan, Syawal, atau hari besar oleh pemerintah, tidak juga pengamatan hilal.
Kalender Jawa Keraton adalah kalender **hitungan** yang tetap, dan itu yang kita hitung. Karena itu **jangan memakainya untuk
menentukan hari ibadah**; gunakan penetapan resmi (**K13**).

**Sebelumnya:** [Menghitung sendiri](02-menghitung-sendiri.md) · **Selanjutnya:** [Kalender Jawa dan Bulan](04-kalender-jawa-dan-bulan.md).
Pembahasan teknis: [Kalender dan verifikasi](../ilmiah/KALENDER_DAN_VERIFIKASI.md).
