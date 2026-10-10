# Peta dokumentasi

Dokumentasi dibagi menurut **siapa pembacanya**. Semuanya berbahasa Indonesia; ringkasan Inggris ada di [README](../README.md#in-english).
Setiap klaim yang dibuat diberi kode (K1, K2, ...) dan dicatat di [Matriks klaim dan bukti](ilmiah/MATRIKS_KLAIM_BUKTI.md).

## Lapis populer

Untuk awam. Bahasa sehari-hari, tetap berbukti: tiap halaman menunjuk ke kode klaim yang mendasarinya.

| Halaman | Isi |
|---|---|
| [1. Apa itu weton, wuku, dan pawukon?](populer/01-apa-itu-weton-dan-pawukon.md) | Tiga roda gigi yang berputar bersama; neptu; contoh |
| [2. Menghitung sendiri](populer/02-menghitung-sendiri.md) | Aturan putar tanpa komputer; rumus untuk program |
| [3. Kalender Jawa, windu, dan kurup](populer/03-kalender-jawa-dan-kurup.md) | Bulan, tahun, windu, kurup; mengapa program berbeda hasil |
| [4. Seberapa dekat kalender Jawa dengan Bulan?](populer/04-kalender-jawa-dan-bulan.md) | Temuan pengukuran terhadap bulan baru astronomi |
| [5. Hitungan dan tafsir](populer/05-hitungan-dan-tafsir.md) | Apa yang diuji, apa yang tradisi; apakah ini astrologi |
| [6. Glosarium](populer/06-glosarium.md) | Istilah |

## Lapis ilmiah

Untuk pembaca yang ingin memeriksa. Klaim, bukti, batas, dan sumber.

| Dokumen | Isi |
|---|---|
| [Matriks klaim dan bukti](ilmiah/MATRIKS_KLAIM_BUKTI.md) | Daftar pemeriksaan: tiap klaim, jenisnya, buktinya, cara mengulang, dan batasnya |
| [Kalender dan verifikasi](ilmiah/KALENDER_DAN_VERIFIKASI.md) | Cara kalender dihitung dan diuji; kebijakan acuan; perbandingan sumber |
| [Pawukon dan astrologi](ilmiah/PAWUKON_DAN_ASTROLOGI.md) | Letak perbedaan dengan astrologi; pengukuran terhadap bulan baru; batas hari magrib |
| [Paparan ilmiah](ilmiah/paparan_ilmiah_pawukon.md) | Audit sumber dan rekonstruksi komputasional (snapshot 11 Oktober 2026; belum ditelaah sejawat) |
| [Asumsi dan anomali kitab](ilmiah/ASUMSI_DAN_ANOMALI.md) | Keganjilan cetakan kitab, asumsi kami, dan cara data ditulis |

## Lapis spesifikasi

Untuk yang mengimplementasikan ulang dalam bahasa lain.

| Berkas | Isi |
|---|---|
| [Rumusan perhitungan](spesifikasi/RUMUSAN_PERHITUNGAN.md) | Rumus bilangan bulat, algoritma, vektor uji, dan checksum |
| [`spec/referensi.py`](../spec/referensi.py) | Implementasi acuan (Python, tanpa `datetime`) |
| [`spec/vektor_uji.json`](../spec/vektor_uji.json) | 673 awal tahun dan 19 tanggal, beserta checksum |

## Lapis pustaka

Untuk pemakai kode.

| Dokumen | Isi |
|---|---|
| [Referensi pustaka](pustaka/REFERENSI_API.md) | Modul, fungsi, bentuk hasil, bab kitab yang dikodekan, dan yang belum dikerjakan |

## Skrip pemeriksaan di luar `docs/`

| Berkas | Fungsi |
|---|---|
| [`audit/audit_pawukon.py`](../audit/audit_pawukon.py) | Rekonstruksi empat model kalender dan perbandingannya |
| [`audit/selisih_bulan_baru.mjs`](../audit/selisih_bulan_baru.mjs) | Mengukur awal bulan Jawa terhadap bulan baru astronomi (perlu `astronomy-engine`) |
| [`tests/`](../tests/) | Seluruh tes; data acuan di `tests/data-kraton.js` dan `tests/data-almanak.js` |
