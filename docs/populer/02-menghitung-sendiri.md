# Menghitung weton dan wuku sendiri

*Bacaan untuk awam, tetap berbukti. Kode **K1** menunjuk ke [Matriks klaim dan bukti](../ilmiah/MATRIKS_KLAIM_BUKTI.md).*

Anda tidak perlu komputer. Dengan satu tanggal yang wetonnya sudah diketahui dan empat aturan putar, Anda bisa menghitung tanggal
mana pun.

## Empat aturan putar

Urutan pasaran: **Legi → Pahing → Pon → Wage → Kliwon → Legi** (berputar).

| Jika tanggal maju... | maka hari | pasaran | wuku |
|---|---|---|---|
| 1 hari | maju 1 | maju 1 | sama, kecuali saat berganti ke hari Minggu |
| **7 hari** | sama | **maju 2** | **pindah ke wuku berikutnya** |
| **35 hari** | sama | sama | maju 5 |
| **210 hari** | sama | sama | sama (satu putaran pawukon) |

Mengapa pasaran maju 2 tiap pekan? Karena 7 hari = 5 + 2: satu putaran pasaran penuh, ditambah dua langkah.

## Contoh: dari 27 Juni 2025 ke 4 Juli 2025

Titik pijak: **27 Juni 2025 = Jumat Kliwon, wuku Medangkungan** (wuku ke-20).

* Maju 7 hari ke **4 Juli 2025**: harinya tetap **Jumat**.
* Pasaran maju dua dari Kliwon: Kliwon → Legi → **Pahing**.
* Wuku pindah ke berikutnya, yaitu ke-21: **Maktal**.

Hasil: **Jumat Pahing, wuku Maktal**. Cocok dengan keluaran pustaka (`weton('2025-07-04')`).

## Rumus untuk program komputer

Misalkan `d` adalah jumlah hari sejak **8 Juli 1633** (Jumat Legi), dan boleh negatif untuk tanggal sebelumnya. Maka:

```
hari    = (d + 4) mod 7                      Senin = 0 ... Minggu = 6
pasaran = d mod 5                            Legi = 0, Pahing, Pon, Wage, Kliwon = 4
wuku    = floor(((d + 194) mod 210) / 7)     Sinta = 0 ... Watugunung = 29
```

(`mod` adalah sisa bagi yang selalu nol atau positif, dan `floor` membulatkan ke bawah.)

**Contoh: 26 April 1975.** Jumlah harinya sejak 8 Juli 1633 adalah `d = 124839`.

```
hari    : (124839 + 4) mod 7 = 5            → Sabtu
pasaran : 124839 mod 5       = 4            → Kliwon
wuku    : (124839 + 194) mod 210 = 83;  floor(83 / 7) = 11   → Kuningan (indeks 11, wuku ke-12)
neptu   : Sabtu 9 + Kliwon 8 = 17
```

Hasil: **Sabtu Kliwon, wuku Kuningan, neptu 17**, sama dengan yang tertulis di halaman 1.

Cara menghitung `d` dari tanggal Masehi tanpa pustaka tanggal ada di [Rumusan perhitungan](../spesifikasi/RUMUSAN_PERHITUNGAN.md),
bagian 3. Dokumen itu juga memuat tabel lengkap, vektor uji, dan checksum agar Anda dapat memeriksa hasil implementasi sendiri
dalam bahasa pemrograman apa pun.

## Memeriksanya dengan pustaka ini

Dengan Node.js 18 atau lebih baru, dari folder repositori:

```bash
node -e "import('./src/index.js').then(m => console.log(m.weton('1975-04-26')))"
```

Keluarannya memuat `weton: 'Sabtu Kliwon'`, `wuku: 'Kuningan'`, dan `neptu: { total: 17 }`.

## Seberapa teruji?

Tiga rumus di atas dibandingkan dengan mesin kalender pada **288.134 hari berturut-turut**, yaitu 50.000 hari sebelum 8 Juli 1633
sampai 3 Juli 2285, dan tidak ada satu pun yang berbeda. Tes itu ada di repositori dan dapat dijalankan siapa saja (`npm test`),
sebagaimana dicatat pada **K1**.

## Satu catatan tentang malam hari

Menurut tradisi (dan menurut Keraton), hari Jawa berganti saat **magrib**, bukan tengah malam. Orang yang lahir sesudah magrib
secara tradisi memiliki weton hari berikutnya. Pustaka ini menghitung per **tanggal sipil** (tengah malam), sehingga untuk
kelahiran sesudah magrib Anda perlu menambah satu hari sendiri. Hal ini dicatat sebagai pilihan yang disengaja (**K10**).

**Sebelumnya:** [Apa itu weton, wuku, dan pawukon?](01-apa-itu-weton-dan-pawukon.md) ·
**Selanjutnya:** [Kalender Jawa dan kurup](03-kalender-jawa-dan-kurup.md).
