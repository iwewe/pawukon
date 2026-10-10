# Hitungan dan tafsir: apa yang diuji, apa yang tradisi

*Bacaan untuk awam, tetap berbukti. Kode seperti **K12** menunjuk ke [Matriks klaim dan bukti](../ilmiah/MATRIKS_KLAIM_BUKTI.md).*

Repositori ini memuat dua hal yang sifatnya sangat berbeda. Mencampurnya adalah sumber salah paham yang paling umum, jadi
dipisahkan sejak awal.

## Tiga jenis klaim

| Jenis | Contoh | Bagaimana diperiksa | Seberapa kuat |
|---|---|---|---|
| **Hitungan** | 27 Juni 2025 adalah Jumat Kliwon | Rumus dan tes otomatis; dapat diulang siapa saja | Pasti, selama rumus dan titik pijaknya diterima |
| **Kesesuaian dengan acuan** | Kalender ini cocok dengan tabel Keraton | Dicocokkan dengan tabel, almanak, dan pengumuman Keraton | Kuat, tetapi bergantung pada acuan itu dan pada seberapa independen datanya |
| **Tafsir** | "Weton ini cenderung begini" | Tidak ada | **Tradisi.** Tidak diuji, dan tidak diklaim benar |

## Apakah ini astrologi? Apakah ini pseudo-sains?

Pertanyaan ini wajar, dan jawabannya dibagi per jenis klaim.

**Hitungannya bukan astrologi.** Weton dan wuku hanyalah penghitung siklus 7, 5, 35, dan 210 hari. Tidak ada posisi planet,
jam lahir, atau tempat lahir di dalamnya. Yang berpijak pada gerak Bulan hanyalah tanggal Jawa (bulan dan tahun), dan itu pun
lewat aturan hitung, bukan pengamatan ([halaman 4](04-kalender-jawa-dan-bulan.md)). Hitungan ini sah sebagai
aritmetika kalender: kita bisa memeriksa benar-salahnya.

**Tafsirnya adalah tradisi.** Tafsir watak, jodoh, hari baik, rezeki, dan sebagainya berasal dari kitab Betaljemur Adammakna.
Tidak ada bukti empiris yang kami ketahui bahwa weton atau wuku memengaruhi nasib atau watak seseorang, dan repositori ini **tidak
mengklaimnya**. Statusnya sama dengan tafsir astrologi Barat, Vedic, Human Design, dan sejenisnya: bagian dari warisan
budaya, bukan fakta ilmiah. (Sebagai gambaran, uji buta ganda klasik atas astrologi Barat oleh Carlson pada 1985 tidak menemukan
kemampuan mencocokkan bagan lebih baik daripada kebetulan.)

Sebut saja begini: **pustaka ini bisa membuktikan bahwa tanggalnya benar; ia tidak dan tidak berusaha membuktikan bahwa
maknanya benar.**

## Bagaimana tafsir diperlakukan di sini

* **Setiap butir bertuliskan sumbernya**: bab dan halaman kitab. Pembaca dapat menelusurinya ke kitab.
* **Ditulis ulang, tidak disalin.** Sumbernya adalah terjemahan modern yang punya hak cipta sendiri. Angka, nama, dan pasangan
  dipertahankan; kalimat makna ditulis dengan kata sendiri dan sengaja dibuat lebih netral.
* **Keganjilan kitab dicatat, tidak ditebak.** Bila cetakan kitab keliru atau tidak jelas, nilainya disalin apa adanya dan
  ditandai (`anomali`, `catatanCetak`). Daftarnya ada di [Asumsi dan anomali](../ilmiah/ASUMSI_DAN_ANOMALI.md).
* **Yang sengaja tidak dimasukkan:** ritual (sajen, tata cara), doa dan mantra, penolak, tumbal, ramuan (dapat membahayakan),
  serta penilaian yang menstigma orang dari penampilan. Daftarnya ada di bagian "Belum dikerjakan" pada
  [Referensi pustaka](../pustaka/REFERENSI_API.md).
* **Klasifikasi "baik" dan "buruk" (`arah`) adalah klasifikasi kami** agar hasil mudah diringkas, bukan kata kitab.
* **Hasil kesehatan, kehamilan, bangunan, dan pernikahan bukan nasihat profesional.** Hasil tentang ciri tubuh adalah fisiognomi
  tradisional; jangan dipakai menilai orang.

## Cara memeriksa sendiri

Tiga perintah, dari folder repositori (perlu Node.js 18 atau lebih baru; Python 3 untuk yang ketiga):

```bash
npm test                          # seluruh tes, termasuk contoh hitungan kitab sendiri dan seluruh kalender
npm run verify                    # tes + implementasi acuan Python; mencetak checksum seluruh rentang kalender
python3 audit/audit_pawukon.py    # perbandingan metode: pustaka ini, weton.m, rsjp, dan almanak
```

Checksum kalender yang harus muncul: `9991c8da3e12c39a844465df77c77d933eb68482b53f4e92b20f290f5fe6121b`
(153.086 hari, 8 Juli 1633 sampai 25 Agustus 2052). Penjelasan checksum ada di
[Rumusan perhitungan](../spesifikasi/RUMUSAN_PERHITUNGAN.md), bagian 10.

## Yang tidak diklaim

* Tidak ada klaim bahwa weton, wuku, atau neptu memengaruhi watak atau nasib.
* Tidak ada klaim bahwa kalender Jawa aritmetika sama dengan kalender astronomi atau Hijriyah ([halaman 4](04-kalender-jawa-dan-bulan.md)).
* Tidak ada klaim tentang kurup setelah 25 Agustus 2052 selain bahwa aturan yang sama diteruskan; hasil di sana ditandai `spekulatif`.
* Perbandingan dengan astrologi Barat adalah ringkasan literatur yang kami ketahui, bukan tinjauan sistematis.

**Sebelumnya:** [Kalender Jawa dan Bulan](04-kalender-jawa-dan-bulan.md) · **Istilah:** [Glosarium](06-glosarium.md).
