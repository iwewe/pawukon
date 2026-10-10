# Catatan perubahan

Mengikuti gagasan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/). Nomor versi mengikuti `package.json`. Bagian **Diubah (memengaruhi hasil)**
sengaja dipisahkan: bila Anda mengutip hasil dari pustaka ini, bagian itulah yang menentukan apakah angka Anda masih sama.

Versi bertanda (*tag*) di GitHub belum dibuat; sebutkan commit bila perlu ketepatan.

## [0.2.0] - 2026-10-11

### Diubah (memengaruhi hasil)

* **Tahun wuntu (355 hari) = Ehe, Dal, Jimakir.** Sebelumnya (mengikuti `weton.m`) Je 355 dan Dal 354, sehingga **seluruh tahun Dal bergeser satu hari**:
  1 Sura Dal 1959 kini Jumat Kliwon, **27 Juni 2025** (sebelumnya 28 Juni). Weton, wuku, dan pasaran tidak terpengaruh.
* **Batas kurup mengikuti Keraton**: 1627, 1747, 1867 (sebelumnya 1675 dan 1749 dengan geseran dua hari). Opsi `jogja` dihapus.
* **Pola bulan khusus tahun Dal pada kurup Amiswon** (warisan `weton.m`) dihapus; semua kurup memakai pola windu yang sama.
* **Windu dan lambang** mengikuti blok delapan tahun Jawa, bukan blok 2.835 hari sejak epoch; berbeda pada 53 dari 153.086 hari. Ejaan windu "Sangara".
* Penyesuaian "kurup berakhir lebih cepat sehari" kini jatuh pada tahun terakhir kurup (Jimakir) yang benar.
* **Pemegang hak cipta pada `LICENSE`: Iwewe** (sebelumnya "Bagong"). Lisensi tetap MIT.

### Ditambah

* **Rumusan perhitungan netral bahasa** ([RUMUSAN_PERHITUNGAN](docs/spesifikasi/RUMUSAN_PERHITUNGAN.md)), implementasi acuan Python (`spec/referensi.py`), vektor uji, dan checksum SHA-256 seluruh rentang.
* **Dokumentasi tiga lapis**: halaman populer, dokumen ilmiah (matriks klaim dan bukti, kalender dan verifikasi, pawukon dan astrologi, paparan ilmiah, asumsi dan anomali),
  spesifikasi, dan referensi pustaka. `CITATION.cff`, `CHANGELOG.md`.
* **Pengukuran kalender terhadap bulan baru astronomi** (`audit/selisih_bulan_baru.mjs`) dan skrip audit perbandingan metode (`audit/audit_pawukon.py`).
* Data uji almanak: **15 tanggal** dari Tabel 6-15 tesis Marhamah (`tests/data-almanak.js`, `tests/almanak.test.js`).
* Tes rumus siklus (hari, pasaran, wuku, neptu) terhadap mesin pada 288.134 hari; tes keutuhan tautan dokumentasi.
* `npm run verify`.

### Diperbaiki

* **Klaim "12 titik Almanak Jawa" tidak dapat ditelusuri**: README lama menyebutnya tanpa menyimpan datanya. Diganti dengan 15 tanggal yang kini tersimpan dan diuji;
  hasilnya cocok seluruhnya setelah satu salah ketik tesis (Tabel 8) dicatat.
* Rumusan: rentang neptu tertulis 5..18, yang benar 7..18.
* Berkas cache Python (`audit/__pycache__/*.pyc`) yang tanpa sengaja ikut tercatat di git dihapus dan masuk `.gitignore`.
* Ejaan nama lembaga diseragamkan menjadi "Keraton". (Istilah kitab "Kraton mulyo", bab 21, tidak diubah.)
* Pernyataan README tentang bukti tahun Dal diperbarui: tiga pengumuman acara Keraton 2025-2026 kini dicatat sebagai bukti tambahan.

### Pindah (tautan)

README lama dipecah. `paparan_ilmiah_pawukon.md` dipindah ke `docs/ilmiah/` dan berkas pendek dipertahankan di tempat lama agar tautan yang sudah dibagikan tetap berfungsi.

| Dulu | Sekarang |
|---|---|
| README, bagian "Referensi fungsi", "Isi", "Konvensi hasil", "Belum dikerjakan" | [docs/pustaka/REFERENSI_API.md](docs/pustaka/REFERENSI_API.md) |
| README, bagian "Kalender" | [docs/ilmiah/KALENDER_DAN_VERIFIKASI.md](docs/ilmiah/KALENDER_DAN_VERIFIKASI.md) |
| README, bagian "Asumsi dan anomali kitab", "Cara menulis data" | [docs/ilmiah/ASUMSI_DAN_ANOMALI.md](docs/ilmiah/ASUMSI_DAN_ANOMALI.md) |
| `RUMUSAN_PERHITUNGAN.md` | [docs/spesifikasi/RUMUSAN_PERHITUNGAN.md](docs/spesifikasi/RUMUSAN_PERHITUNGAN.md) |
| `PAWUKON_DAN_ASTROLOGI.md` | [docs/ilmiah/PAWUKON_DAN_ASTROLOGI.md](docs/ilmiah/PAWUKON_DAN_ASTROLOGI.md) |
| `paparan_ilmiah_pawukon.md` | [docs/ilmiah/paparan_ilmiah_pawukon.md](docs/ilmiah/paparan_ilmiah_pawukon.md) |

## [0.1.0] - 2026-10-10

* Rilis awal: mesin kalender Jawa (weton, neptu, wuku, tanggal Jawa, windu, lambang, kurup, hari mulia) dan tafsir kitab Betaljemur Adammakna
  (watak, jodoh, hari baik, rezeki, kesehatan, rumah, bepergian, jam, hajatan, nama, ciri tubuh, watak perempuan menurut weton). Lisensi MIT.
