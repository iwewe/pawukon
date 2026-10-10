# Rekonstruksi Komputasional Kalender Jawa Sultan Agungan dan Petungan Betaljemur Adammakna
## Studi atas perbedaan hasil, ketertelusuran sumber, dan validasi pada repositori pawukon

**Tanggal audit:** 11 Oktober 2026  
**Objek utama:** `iwewe/pawukon`, commit `7a74fbd720988c2f4ebaf1b8911d9b8eade27bbe`  
**Status:** Paparan ilmiah berbasis audit sumber dan rekonstruksi komputasional; bukan artikel yang telah melalui penelaahan sejawat.  
**Revisi:** 11 Oktober 2026. Seluruh angka dan kutipan sumber diperiksa ulang (bagian 2.1). Temuan pada bab 8 telah diperbaiki di kode. Skrip audit kini tersedia di `audit/audit_pawukon.py`. Bagian lain tidak diubah kecuali dinyatakan.

## Abstrak

Digitalisasi primbon Jawa tidak cukup dipahami sebagai pemindahan rumus tradisional ke bahasa pemrograman. Perbedaan keluaran dapat berasal dari pemilihan sistem kalender, batas kurup, penempatan tahun panjang, konvensi pergantian hari, metode petungan, maupun pembacaan edisi teks. Kajian ini menelaah repositori `pawukon` yang menggabungkan kalender aritmetika Sultan Agungan dengan petungan dari Betaljemur Adammakna, membandingkannya dengan implementasi MATLAB, Python, dan C, serta memeriksa literatur etnoaritmetika, tesis ilmu falak, dan dokumentasi Keraton Yogyakarta. Rekonstruksi independen menunjukkan bahwa pergeseran satu hari pada tahun Dal dapat dijelaskan oleh perbedaan penempatan hari tambahan antara tahun Je dan Dal. Dokumentasi peristiwa Keraton tahun Dal 1959 memberikan dukungan eksternal bagi model yang dipilih repositori. Namun, kesesuaian terhadap tabel normatif tidak dengan sendirinya menyelesaikan perbedaan sejarah kalender. Audit juga menemukan ketidaksinkronan label windu dan lambang pada 53 dari 153.086 tanggal; label itu diwarisi dari definisi windu berbasis blok 2.835 hari pada `weton.m` dan telah diperbaiki di pawukon. Kontribusi ilmiah proyek terletak pada formalisasi aturan dan ketertelusuran bukti, bukan pembuktian daya ramal primbon.

**Kata kunci:** kalender Jawa; Sultan Agungan; Betaljemur Adammakna; petungan; kurup; etnoaritmetika; humaniora digital; reproduksibilitas.

## 1. Persoalan penelitian: hasil berbeda menurut acuan yang mana?

Pertanyaan "perhitungan primbon mana yang benar?" perlu dipecah menjadi pertanyaan yang dapat diuji. Apakah hari dan pasarannya tepat? Apakah tanggal Jawa mengikuti kalender aritmetika Yogyakarta yang dipilih? Apakah operasi petungan sesuai bab tertentu dalam kitab? Apakah uraian tafsir setia pada edisi sumber? Keempat pertanyaan tersebut tidak identik.

Repositori pawukon sudah memisahkan mesin kalender dalam `src/kalender.js` dari modul tafsir dan tabel data. Pemisahan ini merupakan dasar metodologis yang baik: kesalahan kalender tidak semestinya langsung disimpulkan sebagai kesalahan seluruh petungan, dan variasi petungan tidak semestinya diselesaikan dengan mengubah kalender. [R1]

Penting pula membedakan tiga objek. **Pawukon** merupakan siklus 30 wuku, masing-masing tujuh hari. **Kalender Sultan Agungan** mencakup tanggal, bulan, tahun, windu, dan kurup. **Primbon** memuat beragam aturan serta tafsir yang dapat menggunakan unsur kalender, nama, dan kategori lain sebagai masukan. Karena itu, nama repositori pawukon lebih sempit daripada cakupan fungsinya. [R1, R5, R10]

Istilah Sultan Agungan menunjuk tradisi kalender, bukan bukti bahwa seluruh teks Betaljemur Adammakna ditulis langsung oleh Sultan Agung. Edisi Jawa yang tersedia di Wikisumber menyebut babon KPH Tjakraningrat dan penghimpunan oleh R. Soemodidjojo. Edisi tersebut dapat dipakai sebagai pembanding tekstual, tetapi tidak boleh otomatis disamakan dengan terjemahan Indonesia modern yang digunakan pengembang. [R11]

## 2. Bahan, metode, dan batas pemeriksaan

Bahan utama adalah README, NOTICE, mesin kalender, fungsi tafsir dasar, tabel neptu, serta pengujian dan tabel rujukan Keraton pada snapshot repositori tersebut. Pembanding algoritmik adalah `weton.m` dan `weton.c` karya Francois Beauducel, `research-system-javanese-profile`, serta `kalender_jawa_sultan_agungan.py` dalam repositori almanak. Pemeriksaan berfokus pada aturan yang benar-benar dijalankan, bukan hanya klaim dokumentasi. [R1, R6-R8]

Pemeriksaan pustaka mencakup Karjanto dan Beauducel (2020), tesis Marhamah (2022), uraian resmi kalender Keraton, dan beberapa catatan peristiwa bertanggal ganda. Bab 15, 16, dan 104 dari transkripsi edisi Jawa Betaljemur diperiksa sebagai pembanding terarah. Buku Rintaiswara (2015) ditelusuri melalui kutipan tesis dan bibliografi Keraton; eksemplar lengkapnya tidak diperiksa langsung. [R3-R5, R10-R15]

Aturan yang terbaca kemudian direkonstruksi dalam skrip Python mandiri, `audit/audit_pawukon.py` (tersedia di repositori). Skrip tersebut menghitung awal tahun, membandingkan beberapa model, dan menguji konsistensi label windu terhadap blok delapan tahun Jawa. **Ini bukan eksekusi `npm test` repositori asli, bukan eksekusi MATLAB asli, dan bukan verifikasi ulang seluruh 337 bab.** Angka hasil pengujian yang berasal dari README dibedakan dari hasil rekonstruksi audit ini.

Citra tabel tesis belum berhasil diperiksa ulang dalam sesi ini; pembacaan tesis menggunakan teks PDF yang tersedia. Sebaliknya, Tabel 6, 8, dan 9 artikel Karjanto-Beauducel diperiksa pada citra halaman. Penanda `verifikasi: 'scan'` dalam data pawukon diperlakukan sebagai catatan verifikasi pengembang, bukan sebagai klaim bahwa audit ini telah memeriksa semua scan yang sama.

### 2.1 Pemeriksaan ulang pada revisi ini

Pada revisi ini setiap angka dan kutipan yang dapat diperiksa dicocokkan ulang dengan sumbernya. Hasilnya:

- **Rumus bab 3.1** (hari, pasaran, wuku dari epoch) cocok dengan mesin pada 4.286 hari (tiap tujuh hari selama 30.000 hari), 0 selisih.
- **Rumus bab 3.2** (awal tahun) cocok dengan mesin pada seluruh 432 awal tahun AJ 1555-1986, dan dengan penjumlahan panjang tahun satu per satu pada skrip audit, 0 selisih.
- **Tabel 5.1** direproduksi. Rekonstruksi aturan pada skrip audit dibandingkan dengan keluaran program aslinya (kode rsjp dan kode almanak dijalankan; port Python `weton.m` dijalankan): 0 selisih pada AJ 1867-1986 untuk ketiganya. rsjp berbeda dari pawukon pada 32 dari 120 awal tahun, `weton.m` pada 15 (semuanya tahun Dal), almanak pada 0.
- **Windu:** 53 dari 153.086 hari berlabel berbeda pada rumus lama, dan kedua contoh tanggal pada bab 8 benar.
- **Keraton:** tiga halaman peristiwa tahun Dal 1959 dan halaman Mubeng Beteng diambil pada 11 Oktober 2026; teksnya memuat tanggal-tanggal yang dikutip (4 Sura, 29 Rejeb, 29 Besar Dal 1959; Rabu 19 Juli 2023; Sugengan sekitar pukul 11.00 WIB).
- **Karjanto dan Beauducel:** teks PDF arXiv memuat Tabel 6, 8 (Amiswon Alip 1675, Aboge Jimawal 1749, 118 tahun), dan 9 (Aboge Yogyakarta Alip 1795-1866, 72 tahun).
- **Identitas:** hash snapshot `weton` (`98383d0`) dan rsjp (`081bcd0`) sama dengan HEAD saat ini; semua URL referensi dapat diakses.

Batas pemeriksaan tetap berlaku: citra tabel tesis tidak dibuka, MATLAB asli tidak dijalankan, dan Rintaiswara (2015) tidak dibaca langsung.

## 3. Struktur matematis perhitungan

### 3.1 Hari, pasaran, weton, dan wuku

Mesin mengubah tanggal Gregorian menjadi bilangan hari berurutan. Hari dan pasaran dihitung dengan aritmetika modular; wuku dihitung dari posisi dalam siklus 210 hari. Kalender lunarnya tidak diperlukan untuk menentukan ketiga siklus tersebut bagi sebuah tanggal Gregorian yang sudah ditetapkan. [R1, R6]

Dalam notasi yang setara dengan aturan sumber, tetapkan `d` sebagai selisih hari dari 8 Juli 1633. Dengan Senin berindeks 0 dan Legi berindeks 0:

```
indeks_hari    = (d + 4) mod 7
indeks_pasaran = d mod 5
indeks_wuku    = floor(((d + 194) mod 210) / 7)
```

Urutan wuku dimulai dari Sinta. Konstanta 194 menyatakan posisi epoch dalam putaran pawukon. Repositori memakai rotasi indeks pasaran yang berbeda, tetapi menghasilkan nama yang sama. Pengubahan asal indeks tidak mengubah metode selama konstanta dan urutan nama disesuaikan bersama. Ketiga rumus di atas diuji pada 4.286 hari dan cocok dengan keluaran mesin pada semuanya. [R1, R7]

Secara matematis, pertemuan siklus tujuh dan lima hari berulang setiap `KPK(7,5) = 35` hari. Sementara itu, satu putaran pawukon berumur `30 x 7 = 210` hari. Inilah alasan weton dapat sama sementara wukunya berbeda.

Neptu adalah bobot menurut tabel tradisi, bukan besaran astronomis. Sebagai contoh, Jumat memiliki bobot 6 dan Legi 5 sehingga neptu Jumat Legi adalah 11. Kesalahan memilih tabel bobot dapat mengubah petungan meskipun tanggal dan weton sudah benar. [R1: `src/data/neptu.js`]

### 3.2 Tanggal Jawa: pola windu dan koreksi kurup

Model yang dipilih pawukon menggunakan urutan Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, Jimakir dengan panjang tahun:

```
354, 355, 354, 354, 355, 354, 354, 355
```

Tahun panjangnya adalah Ehe, Dal, dan Jimakir. Bulan berselang-seling 30 dan 29 hari; Besar berumur 30 hari pada tahun panjang, kecuali penyesuaian akhir kurup yang diimplementasikan. Ini sesuai pola yang dijelaskan sumber Keraton dan dijadikan acuan repositori. [R1, R3, R10]

Satu windu dasar mempunyai `5 x 354 + 3 x 355 = 2.835` hari. Lima belas windu mempunyai 42.525 hari; pemendekan satu hari menghasilkan 42.524 hari. Kurup pertama hanya 72 tahun (sembilan windu) sehingga berumur 25.514 hari. Angka-angka ini merupakan sifat model aritmetika, bukan pernyataan bahwa setiap awal bulan identik dengan observasi hilal.

Dalam rentang implementasinya, pawukon menggunakan batas awal kurup AJ 1555, 1627, 1747, dan 1867. AJ berarti Anno Javanico atau tahun Jawa dalam penomoran yang dipakai model. Awal kalendernya adalah 1 Sura Alip 1555, dipadankan dengan 8 Juli 1633. [R1, R3]

Rumus ringkas berikut merupakan penurunan dari aturan repositori. Untuk awal tahun `y` pada AJ 1555-1986, tetapkan:

```
q = floor((y - 1555) / 8)
r = (y - 1555) mod 8
B = [0, 354, 709, 1063, 1417, 1772, 2126, 2480]
c(y) = banyaknya batas 1627, 1747, 1867 yang telah dicapai
awal_tahun(y) = epoch + 2835*q + B[r] - c(y) hari
```

Tanggal dalam bulan diperoleh dengan mengurangi akumulasi panjang bulan sampai ditemukan bulan yang menaungi hari tersebut. Formula ringkas ini cocok dengan mesin JavaScript pada seluruh 432 awal tahun AJ 1555-1986 dan dengan implementasi kedua yang menambahkan panjang tahun satu per satu (`audit/audit_pawukon.py`).

### 3.3 Petungan: bukan satu rumus neptu universal

Bab 15 Betaljemur menghitung sisa pembagian neptu masing-masing pasangan dengan sembilan, lalu membaca pasangan sisa pada tabel. Bab 16 menjumlahkan kedua neptu terlebih dahulu, lalu membaginya dengan empat. `src/tafsir.js` memisahkan kedua operasi tersebut. [R1, R11]

Dengan neptu 14 dan 15, misalnya, metode bab 15 menghasilkan pasangan sisa 5 dan 6, bukan sisa dari 29 dibagi sembilan. Ketika sebuah aplikasi memakai penjumlahan gabungan untuk semua bab, hasilnya dapat tampak masuk akal tetapi sebenarnya menerapkan metode lain.

Pawukon memakai konvensi sisa positif: hasil habis dibagi dibaca sebagai pembaginya. Untuk bilangan positif, notasinya:

```
sisa_positif(n, m) = 1 + ((n - 1) mod m)
```

Konvensi itu perlu dibedakan dari operator `%` biasa dan harus dicatat ketika teks tidak menjelaskannya secara eksplisit. [R1]

Bab 104 memberikan contoh penting tentang spesifikasi lokal. Bobotnya bukan neptu umum: Jumat bernilai 1, Sabtu 2, sampai Kamis 7; Kliwon bernilai 1 sampai Wage 5. Untuk Jumat Legi, bobot bab 104 adalah `1 + 2 = 3`, sedangkan neptu umum adalah `6 + 5 = 11`, bersisa 4 jika dibagi tujuh. Perbedaan keluaran berasal dari tabel masukan yang berbeda, bukan kesalahan operasi pembagian. Pemisahan `URUTAN_BAB_104` pada repositori didukung pembanding teks Jawa. [R1, R11]

## 4. Perbandingan metode komputasi

| Implementasi | Aturan yang diperiksa | Implikasi |
|---|---|---|
| pawukon, JavaScript | Windu Ehe-Dal-Jimakir; koreksi kurup pada batas yang dipilih dari rujukan Yogyakarta | Model normatif yang dinyatakan secara eksplisit |
| weton.m, MATLAB | Pola tahun dan bulan Dal berbeda menurut kurup; pada kurup lanjut Je panjang dan Dal pendek. Windu dan lambang dihitung dari blok 2.835 hari sejak epoch (`floor(dti/(81*7*5))`), bukan dari blok delapan tahun | Dapat menggeser tanggal Jawa setahun Dal tanpa mengubah siklus hari-pasaran; label windu bergeser satu sampai tiga hari pada batas windu |
| research-system-javanese-profile, Python | Cabang modern memakai jangkar 25 Maret 1936 (tahun jangkar dipaksa 354 hari) dan tahun kabisat Hijriah tabular 30 tahun (posisi `(H-1) mod 30 + 1`) | Bukan sekadar port model windu delapan tahun |
| almanak, Python | Windu dasar dengan jangkar 1 Sura 1959 = 27 Juni 2025; tanpa koreksi kurup dalam konverter yang diperiksa | Cocok pada fase modern tertentu, tidak identik untuk seluruh sejarah |
| `@damarkuncoro/primbon` 1.0.3, JavaScript | Pola windu tanpa koreksi kurup; menghasilkan galat pada sekitar separuh tanggal sebelum 1900 | Cocok penuh sejak 1950; selisih satu hari pada 1900-1949 dan satu sampai tiga hari sebelum 1900 (sejalan dengan jumlah kurup yang tidak dikoreksi) |
| weton.c, C | Kongruensi hari dan pasaran | Tidak menghitung tanggal Jawa lengkap atau wuku dalam file yang diperiksa |

Sumber tabel: pembacaan kode [R1, R6-R8]. Perbedaan bahasa pemrograman bukan penyebab utama perbedaan kalender. Yang menentukan adalah spesifikasi, epoch, cabang program, dan pengecualian.

Temuan penting pada pembanding Python ialah perbedaan antara tabel deklaratif dan jalur eksekusi. Tabel kurupnya memang mencantumkan tahun panjang Jawa. Namun, untuk tanggal modern, `_year_cycle_from_asapon_anchor()` memanggil `_asapon_anchor_year_length()`, yang memakai pola kabisat Hijriah 30 tahun. Membandingkan tabel konfigurasi tanpa menelusuri pemanggilan fungsi akan menghasilkan penjelasan yang tidak lengkap. [R7]

Paket npm yang disebut README pawukon sebagai `primbon` teridentifikasi sebagai `@damarkuncoro/primbon` versi 1.0.3 (penulis Damar Kuncoro; repositori `github.com/damarkuncoro/primbon`, HEAD `d88dd7c` pada salinan yang diperiksa). Paket dengan nama mirip atau namespace berbeda bukan pembanding yang sama. Pada 3.344 tanggal uji pawukon (1633-2052), paket ini menghasilkan galat eksekusi (`Pasaran tidak boleh kosong`) pada 1.561 tanggal, semuanya sebelum 1900; dari 365 tanggal sebelum 1900 yang tidak galat, seluruhnya berselisih satu sampai tiga hari dari pawukon; pada 1900-1949 tanggalnya berselisih satu hari pada 266 dari 357 tanggal (sisanya, sesudah 1936, cocok); dan sejak 1950 cocok pada seluruh 1.061 tanggal. Pola selisih tiga, dua, satu, lalu nol hari menurut era sejalan dengan model tanpa koreksi kurup yang berjangkar modern. Pengukuran ini berasal dari menjalankan paket tersebut pada sampel yang sama dengan README, tetapi skripnya tidak disertakan karena memerlukan paket pihak ketiga.

## 5. Hasil rekonstruksi dan bukti eksternal

### 5.1 Awal tahun yang membedakan model

Tabel berikut adalah **hasil rekonstruksi independen aturan yang dibaca**, bukan keluaran proses upstream yang dijalankan langsung. Semua tanggal adalah tanggal sipil Gregorian.

| Awal tahun Jawa | pawukon | weton.m | rsjp, cabang modern | almanak |
|---|---|---|---|---|
| Alip 1867 | 24-03-1936 | 24-03-1936 | 25-03-1936 | 24-03-1936 |
| Ehe 1956 | 30-07-2022 | 30-07-2022 | 30-07-2022 | 30-07-2022 |
| Jimawal 1957 | 20-07-2023 | 20-07-2023 | 19-07-2023 | 20-07-2023 |
| Je 1958 | 08-07-2024 | 08-07-2024 | 08-07-2024 | 08-07-2024 |
| Dal 1959 | 27-06-2025 | 28-06-2025 | 27-06-2025 | 27-06-2025 |
| Be 1960 | 17-06-2026 | 17-06-2026 | 17-06-2026 | 17-06-2026 |

Hasil lengkap dan skrip pembentuknya disediakan dalam lampiran (`audit/audit_pawukon.py`). Model rsjp berbeda pada 32 dari 120 awal tahun Asapon yang dibandingkan, dan model `weton.m` pada 15 (semuanya tahun Dal). Model almanak berjangkar modern sama pada seluruh 120 awal tahun tersebut, tetapi tidak sama ketika dibawa mundur melampaui koreksi kurup: selisihnya tetap -3 hari pada AJ 1556-1626, -2 pada 1627-1746, dan -1 pada 1747-1866, yaitu jumlah kurup yang tidak dikoreksi. Hal ini sekaligus menunjukkan bahwa pola windu murni pada model almanak identik dengan pola pawukon; yang berbeda hanyalah koreksi kurup. Ini bukan pemeringkatan akurasi universal: masing-masing menghasilkan tanggal menurut spesifikasi berbeda.

Kasus Dal dapat dijelaskan tanpa spekulasi. Bila Je berumur 355 hari, awal Dal datang sehari lebih lambat daripada model Je 354 hari. Setelah Dal selesai, kedua model dapat bertemu kembali karena `355 + 354 = 354 + 355`. Kesamaan hasil pada tahun Be karena itu tidak membuktikan bahwa kedua model selalu sama.

### 5.2 Dokumentasi Keraton pada tahun Dal 1959

README menyatakan bahwa dua belas titik almanak yang digunakannya tidak mencakup tahun Dal, sehingga koreksi Dal semula ditopang oleh aturan tabel. Audit ini menemukan dokumentasi peristiwa resmi yang menambah bukti eksternal. [R1]

| Tanggal Gregorian | Penanggalan dalam dokumentasi Keraton | Hasil rekonstruksi pawukon |
|---|---|---|
| 30 Juni 2025 | 4 Sura Dal 1959 | Sesuai |
| 18 Januari 2026 | 29 Rejeb Dal 1959 | Sesuai |
| 15 Juni 2026 | 29 Besar Dal 1959 | Sesuai |

Sumber: artikel Srimpi Merak Kesimpir [R13], Tingalan Jumenengan Dalem [R14], dan Uyon-Uyon 15 Juni 2026 [R15]. Ketiga halaman diambil ulang pada 11 Oktober 2026 dan teksnya memuat penanggalan tersebut.

Titik 18 Januari 2026 sangat berguna: artikel menyebut upacara Sugengan berlangsung sekitar pukul 11.00 WIB. Dengan demikian, kecocokan 29 Rejeb tidak bergantung pada penafsiran acara setelah maghrib. Pola Dal yang mulai sehari lebih lambat akan menghasilkan 28 Rejeb pada tanggal sipil tersebut. [R14; perhitungan audit]

Dukungan normatif independen datang dari uraian resmi Keraton sendiri [R10], yang menyatakan bahwa tahun Ehe, Dal, dan Jimakir berumur 355 hari (Taun Wuntu), bulan Besar berumur 30 hari pada tahun tersebut, tiap lambang berumur 8 tahun, serta menyebut batas kurup Amahgi 1555-1627, Amiswon 1627-1747, dan Aboge dari 1747. Bukti ini memperkuat pilihan model untuk tahun Dal yang diuji. Namun, tiga dokumentasi peristiwa tidak sama dengan pemeriksaan seluruh halaman almanak, tidak menghapus kemungkinan salah tulis artikel, dan tidak membuktikan seluruh rekonstruksi sebelum abad ke-20.

## 6. Mengapa hasil dapat berbeda?

### 6.1 Kalender normatif dan kalender historis menjawab pertanyaan berbeda

Pawukon memilih batas kurup 1627 dan 1747, sama dengan uraian resmi Keraton [R10] dan tesis Marhamah [R3]. Sebaliknya, Tabel 8 artikel Karjanto-Beauducel memakai awal Amiswon 1675 dan Aboge 1749; Tabel 9 melaporkan awal Aboge Yogyakarta pada 1795 (selama 72 tahun). Dengan demikian perbedaan itu bukan antara pawukon dan Keraton, melainkan antara dokumentasi Keraton masa kini dan rekonstruksi historis dalam artikel. Artikel menghubungkan perbedaan itu dengan sejarah penerapan koreksi oleh otoritas yang berbeda. [R1, R5]

Karena itu, kecocokan dengan tabel normatif Yogyakarta tidak cukup untuk menyatakan semua konfigurasi lain keliru secara sejarah. Klaim yang dapat dipertahankan ialah: "implementasi ini mengikuti rekonstruksi aritmetika Yogyakarta berdasarkan acuan yang dipilih." Klaim "seluruh perbedaan historis telah terselesaikan" membutuhkan penelitian arsip tambahan.

Menghapus opsi varian dari API merupakan keputusan produk yang sah untuk menghindari campur-aduk hasil. Namun, penghapusan opsi perangkat lunak bukan pembuktian bahwa varian historis tidak pernah dipakai.

### 6.2 Tanggal sipil berbeda dari saat pergantian hari

Pawukon menerima tanggal sipil dan tidak otomatis mengubahnya menurut maghrib. Tesis Marhamah menjelaskan bahwa hari Jawa dimulai ketika matahari terbenam. Tanpa penjelasan konvensi ini, pengguna dapat mengira ada kesalahan sehari padahal dua sistem sedang melabeli rentang waktu yang berbeda. [R1, R3]

Contoh konkret terdapat pada berita Mubeng Beteng menyambut 1 Sura Jimawal 1957. Keraton menyebut Rabu 19 Juli 2023, rangkaian dimulai pukul 20.30 dan pemberangkatan berlangsung pukul 24.00. Berita malam itu tidak dapat langsung dijadikan bukti bahwa tanggal sipil 1 Sura harus 19 Juli. Ia konsisten dengan malam yang mendahului tanggal sipil 20 Juli. [R12]

Hal yang sama perlu diperhatikan untuk tanggal lahir. Data "lahir 19 Juli malam" belum cukup untuk memilih konvensi weton jika aplikasi hanya meminta tanggal tanpa jam dan lokasi. Ini merupakan persoalan spesifikasi masukan, bukan masalah modulo.

### 6.3 Perbedaan teks, edisi, dan operasi petungan

Repositori mengakui pembagi yang tidak selalu eksplisit, transliterasi nama yang bersifat perkiraan, beberapa skema neptu aksara, serta aturan bab 22 yang menyediakan pembagi tujuh atau sepuluh. Ia juga mencatat anomali cetakan dan menahan diri untuk tidak menjalankan bab 137 ketika cara hitungnya belum jelas. [R1]

Pembedaan berikut perlu dijaga: aturan yang dinyatakan teks, aturan yang direkonstruksi dari contoh, dan pilihan tambahan pengembang. Ketiganya dapat hadir dalam aplikasi yang sama, tetapi status buktinya berbeda.

Kasus koreksi tiga entri tabel tesis dalam `tests/data-kraton.js` juga perlu ditulis sebagai emendasi berbasis aritmetika. Sebaiknya bacaan tercetak tetap disimpan bersama bacaan yang dipakai, alasan koreksi, dan sumber pembanding. Mengganti bacaan tanpa jejak akan menghilangkan objek yang justru perlu diperiksa oleh peneliti berikutnya. [R1]

### 6.4 Makna budaya tidak identik dengan skor statistik

Klasifikasi `baik`, `buruk`, dan `netral` dinyatakan repo sebagai kategori editorial. Demikian pula, ringkasan jumlah metode yang menghasilkan kategori tertentu bukan probabilitas keberhasilan perkawinan atau ukuran risiko medis. [R1]

Perbedaan antarmetode tidak harus diselesaikan melalui pemungutan suara. Tiga metode dapat memakai asumsi dan kategori berbeda. Tanpa teori agregasi dari sumber atau penelitian empiris terpisah, menyatukannya menjadi persentase kecocokan justru menambah klaim baru yang tidak diuji.

## 7. Seberapa kuat pengujian yang sudah tersedia?

Pengujian pawukon mencakup pencocokan awal bulan terhadap tabel Keraton, pemeriksaan pola panjang tahun, jangkar kurup, serta kesesuaian dengan implementasi windu dasar yang digeser sesuai koreksi. README juga melaporkan pembandingan 3.344 tanggal dengan port Python. Infrastruktur pengujian tersebut berguna untuk menahan regresi dan memperjelas asumsi. [R1]

Namun, klaim 1.440 awal bulan Aboge ditambah 1.440 Asapon harus dibaca secara tepat. Data acuannya berisi delapan tipe tahun kali dua belas bulan untuk masing-masing kurup: **192 entri pola**, yang berulang selama lima belas windu menjadi **2.880 pemeriksaan**. Angka 2.880 bukan jumlah 2.880 observasi sejarah yang independen. README kini menuliskannya sebagai 192 entri pola yang berulang selama lima belas windu. [R1: `tests/data-kraton.js`, `tests/kraton.test.js`; penghitungan struktur data]

Kecocokan JavaScript dengan port Python terutama memperkuat kesetaraan implementasi. Jika keduanya diturunkan dari pola dan koreksi yang sama, kesalahan sumber bersama tetap dapat lolos. Oleh sebab itu perlu dibedakan:

- **Konsistensi internal:** program menjalankan aturan tanpa kontradiksi.
- **Kesesuaian sumber:** aturan dan tabel cocok dengan edisi yang dipilih.
- **Kesesuaian eksternal:** tanggal cocok dengan arsip, almanak, atau peristiwa yang tidak dihasilkan program tersebut.

Ketiga jenis bukti saling melengkapi. Tidak satu pun dari ketiganya, dengan sendirinya, merupakan pengujian daya ramal watak, rezeki, kesehatan, atau jodoh.

## 8. Temuan tambahan: label windu dan lambang belum selalu mengikuti batas tahun (telah diperbaiki)

Audit menemukan masalah yang berbeda dari perselisihan sumber. Pada `src/kalender.js` (commit yang diaudit), pergantian label windu diturunkan dari:

```js
const putaranWindu = Math.floor(dti / (81 * 7 * 5));
```

`dti` merupakan jumlah hari sejak epoch ditambah satu, sedangkan `81 * 7 * 5 = 2835`. Sementara tanggal dan tahun sudah mendapat koreksi kurup, penghitung label ini tetap menggunakan blok hari tetap. [R1]

**Asal rumus.** Rumus itu bukan galat port. `weton.m` sendiri menetapkan "Windu and Lambang = 8-taun cycle = 81-wetonan = 2835-day" dan menghitung `windu_index = mod(floor(dti/(81*7*5)) + 1, 4) + 1`; contoh yang diterbitkan di `weton.md` untuk 10 Agustus 2021 mencetak "1 Sura 1955 AJ Alip Sêngara Langkir". Jadi rumus lama setia pada upstream. Yang tidak dimodelkan upstream adalah bahwa koreksi kurup memendekkan kalender sehingga blok 2.835 hari menyimpang satu sampai tiga hari dari batas tahun. [R6]

**Definisi yang dipakai.** Windu didefinisikan sebagai delapan tahun Jawa, dengan awal windu pada tahun Alip. Ini sesuai tesis Marhamah (Tabel 1 dan 3) [R3], uraian Keraton yang menyatakan "masing-masing lambang berumur 8 tahun" [R10], dan rsjp, yang menempatkan Dal 1959 sebagai tahun kelima windu Sancaya [R7]. Urutan Kuntara, Sangara, Sancaya, Adi menurut Keraton dan tesis; ejaan Sangara dipakai menggantikan Sengara dari `weton.m`.

Rekonstruksi menghasilkan contoh berikut. Pada **10 dan 11 Agustus 2021**, tanggalnya sudah **1 dan 2 Sura Alip 1955**, tetapi rumus label masih menghasilkan **Sangara-Langkir** (dieja Sengara pada versi lama). Label **Sancaya-Kulawu** baru muncul pada 12 Agustus, yaitu 3 Sura. Dengan definisi windu delapan tahun, ketiga tanggal itu seharusnya sudah berada dalam windu yang sama.

Pada batas awal juga ada kasus sehari terlalu cepat: 11 April 1641 masih 30 Besar Jimakir 1562, tetapi label sudah berpindah ke windu berikutnya. Penyebabnya adalah penghitungan hari satu-indeks yang dibagi langsung dengan 2.835.

Dalam pemeriksaan 153.086 tanggal dari 8 Juli 1633 sampai 25 Agustus 2052, ditemukan **53 tanggal** yang label windunya berbeda antara rumus hari pada kode dan pengelompokan delapan tahun Jawa. Angka ini direproduksi oleh `audit/audit_pawukon.py` (bukan hasil suite asli repositori) dan diperiksa ulang pada revisi ini.

**Perbaikan (diterapkan).** Pada kode, label diturunkan dari tahun:

```js
const putaranWindu = Math.floor((tahun - AJ) / 8);
```

disertai uji pada seluruh 153.086 hari (label sama dengan blok delapan tahun Jawa), pada contoh 10-12 Agustus 2021, dan pada batas 1641. Port Python yang dikoreksi dan mesin JavaScript tetap sepakat pada 3.344 tanggal, dan baris golden yang terdampak (satu baris) diperbarui. Akibatnya pawukon sengaja berbeda dari keluaran terbitan `weton.md` pada 53 hari, dan tes contoh terbit memuat satu penyimpangan yang dinyatakan secara eksplisit. Temuan ini tidak membatalkan hasil weton atau koreksi tanggal Dal; ia memperlihatkan bahwa label yang berbeda memerlukan pengujian tersendiri.

## 9. Arah penyempurnaan sebagai karya ilmiah

**Status rekomendasi pada revisi ini.** Telah dilaksanakan: skrip audit disertakan di repositori; identitas paket npm dan commit pembanding almanak dibekukan (bagian referensi); label windu diperbaiki dan diuji; klaim 2.880 pemeriksaan dinyatakan sebagai 192 entri pola; ejaan windu mengikuti Keraton. Masih terbuka: metadata edisi Indonesia yang dipakai, pemisahan catatan ilmiah per metode, tanggal diskriminatif tambahan (Jimawal dan tahun Dal lain), dan pemeriksaan citra tesis serta Rintaiswara (2015).

**Lengkapi identitas baseline.** Sebutan "Betaljemur Adammakna, terjemahan Indonesia modern" belum cukup untuk penelitian yang menelusuri perbedaan bacaan. Catat penyusun, penerjemah, tahun, penerbit, nomor cetakan, serta identitas scan. Simpan nomor halaman cetak terpisah dari indeks halaman PDF. Edisi pembanding Jawa 2018 tidak boleh menggantikan metadata edisi Indonesia yang sebenarnya digunakan. [R1, R11]

**Pisahkan asal aturan dari interpretasi.** Setiap metode sebaiknya menyertakan identitas bab, tabel bobot, operasi, pembagi, konvensi sisa, status emendasi, dan versi parafrasa. Istilah seperti `asumsi` dan `anomali` yang sudah ada dapat dikembangkan menjadi catatan ilmiah yang lebih terstruktur. [R1; rekomendasi audit]

**Bekukan pembanding.** Catat pemilik, versi paket, commit, dan jalur eksekusi setiap program. Khusus rsjp, tuliskan bahwa tanggal modern memakai tahun Hijriah tabular (README pawukon kini mencatatnya). Untuk npm primbon, identitas paket kini dilengkapi (`@damarkuncoro/primbon` 1.0.3); skrip pengukurnya masih perlu disimpan bila angkanya hendak dipublikasikan sebagai temuan yang dapat direplikasi.

**Tambahkan bukti diskriminatif.** Pilih tanggal yang membuat dua model menghasilkan jawaban berbeda, bukan hanya tanggal yang sudah pasti cocok. Dokumentasi 29 Rejeb Dal 1959 merupakan contoh yang berguna. Tambahkan tahun Jimawal, tahun Dal lain, batas kurup, dan kasus sebelum/sesudah maghrib. Pisahkan hasil uji tanggal dari hasil uji tafsir.

**Batasi cakupan klaim.** Nama yang lebih tepat untuk model produksi ialah "kalender aritmetika Sultan Agungan menurut acuan Yogyakarta yang dipilih", dengan rentang dan kebijakan hari yang dinyatakan. Jika kelak diperlukan penelitian sejarah, model varian dapat disimpan sebagai profil eksperimen tanpa harus ditawarkan kepada semua pengguna aplikasi.

## 10. Kesimpulan

Perbedaan hasil antarperhitungan primbon tidak memiliki satu penyebab tunggal. Pada lapisan kalender, penempatan hari tambahan dan batas kurup dapat menggeser tanggal Jawa. Pada lapisan masukan, malam dan tanggal sipil dapat menimbulkan selisih yang hanya tampak. Pada lapisan petungan, tabel bobot dan urutan operasi berbeda antar-bab. Pada lapisan teks, edisi, salah cetak, transkripsi, dan parafrasa memengaruhi keluaran.

Pawukon mempunyai dasar yang kuat sebagai proyek humaniora digital: aturan dipisahkan dari data, sumber dicatat sampai bab, dan pengujian dibuat eksplisit. Audit ini menambahkan dukungan dokumenter bagi model tahun Dal 1959 sekaligus menunjukkan keterbatasan klaim sejarah dan sebuah masalah batas pada label windu-lambang.

Rumusan kontribusi yang paling dapat dipertanggungjawabkan adalah: **pawukon menyediakan implementasi aturan kalender dan petungan yang dapat ditelusuri, diuji, dan dibandingkan secara terbuka.** Ia bukan pembuktian satu kalender yang berlaku seragam untuk semua periode dan otoritas, serta bukan validasi empiris ramalan primbon. Dengan perbedaan itu dijaga, tradisi tidak direduksi menjadi klaim prediktif, dan ketelitian komputasi tidak disamakan dengan kepastian sejarah.

## Referensi dan status penggunaannya

### A. Sumber dan pembanding yang tercatat dalam repositori

**[R1] iwewe. (2026). _pawukon_.** Snapshot commit yang diaudit `7a74fbd720988c2f4ebaf1b8911d9b8eade27bbe`; perbaikan sesudah audit tercatat pada riwayat git berikutnya. Berkas utama yang diperiksa: README, NOTICE, `src/kalender.js`, `src/tafsir.js`, `src/data/neptu.js`, `tests/kraton.test.js`, dan `tests/data-kraton.js`. Alamat: `https://github.com/iwewe/pawukon`.

**[R2] _Kitab Primbon Betaljemur Adammakna_. Edisi terjemahan Indonesia modern yang digunakan pawukon.** Identitas penerjemah, tahun, penerbit, nomor cetakan, serta scan belum teridentifikasi lengkap dalam dokumentasi yang diperiksa. Ini adalah baseline yang dinyatakan pengembang; tidak diisi dengan metadata edisi lain.

**[R3] Marhamah, Siti. (2022). _Kalender Jawa Islam Sultan Agungan di Kesultanan Yogyakarta_.** Tesis Magister Ilmu Falak, UIN Walisongo Semarang. Bagian relevan: aturan kalender dan rumus awal bulan sekitar hlm. 51-69 serta data kalender/almanak sekitar hlm. 114-127. PDF: `https://eprints.walisongo.ac.id/id/eprint/20058/1/Tesis_2002048019_Siti_Marhamah.pdf`.

**[R4] Rintaiswara, KRT. (2015). _Tahun Jawa Islam Sultan Agungan_.** Yogyakarta: Dinas Kebudayaan Daerah Istimewa Yogyakarta bekerja sama dengan Keraton Ngayogyakarta Hadiningrat, menurut bibliografi tesis Marhamah. Uraian situs Keraton mencantumkan KHP Widyabudaya. Digunakan secara tidak langsung melalui [R3] dan [R10]; eksemplar lengkap belum diperiksa.

**[R5] Karjanto, Natanael, dan Francois Beauducel. (2020). _An ethnoarithmetic excursion into the Javanese calendar_.** Preprint arXiv:2012.10064v1; DOI `10.48550/arXiv.2012.10064`. Bagian penting: Tabel 6 (panjang tahun), Tabel 8-9 (batas kurup). Alamat: `https://arxiv.org/abs/2012.10064`.

**[R6] Beauducel, Francois. _weton_.** Kode MATLAB `weton.m` dan C `weton.c`; repositori juga menyediakan `weton.pl`. Snapshot yang diperiksa: `98383d0739a8c37304350a9077c33d3081229367`; komentar `weton.m` menyatakan pembaruan 24 Desember 2020. Alamat: `https://github.com/beaudu/weton`.

**[R7] bendahara-selokarto. (2026). _research-system-javanese-profile_.** Snapshot `081bcd088e900a6202b9874998d7724ec78a8886`; berkas `src/research_system/utils/javanese_calendar.py` dan catatan analisis windu. Alamat: `https://github.com/bendahara-selokarto/research-system-javanese-profile`.

**[R8] MasArMuttaqi. _almanak_.** Berkas `kalender_jawa_sultan_agungan.py`, diakses 11 Oktober 2026. Commit yang dibekukan: `c2c93887b55f5b04ad5cdc5d13dc02bb4b3110d9` (sama dengan HEAD saat itu dan dengan salinan yang dijalankan); aturan yang dibaca disertakan dalam rekonstruksi. Alamat: `https://github.com/MasArMuttaqi/almanak`.

**[R9] Kuncoro, Damar. _@damarkuncoro/primbon_, versi 1.0.3 (paket npm).** Tercatat sebagai `primbon` dalam README [R1]. Repositori: `https://github.com/damarkuncoro/primbon` (HEAD `d88dd7c242223b482c958ec699a6fbaf93148824` pada salinan yang diperiksa). Dijalankan pada sampel tanggal yang sama dengan README; skrip pengukur belum disertakan.

### B. Sumber tambahan untuk pemeriksaan silang

**[R10] Keraton Ngayogyakarta Hadiningrat. (2019, 2 April). _Kalender Jawa Sultan Agungan_.** Uraian kelembagaan tentang siklus kalender, tahun panjang, dan epoch. Alamat: `https://www.kratonjogja.id/ragam/21-kalender-jawa-sultan-agungan/`.

**[R11] Soemodidjojo, R. (penghimpun). (2018). _Kitab Primbon Betaljemur Adammakna_.** Babon KPH Tjakraningrat; cetakan ke-63; edisi bahasa Jawa, Soemodidjojo Mahadewa. Transkripsi digital Wikisumber. Digunakan sebagai pembanding terarah bab 15, 16, dan 104, bukan sebagai identifikasi otomatis edisi sumber pawukon. Alamat: `https://jv.wikisource.org/wiki/Kitab_Primbon_Betaljemur_Adammakna`.

**[R12] Keraton Ngayogyakarta Hadiningrat. (2023, 31 Agustus). _Hajad Kawula Dalem Mubeng Beteng 1 Sura Jimawal 1957 Kembali Diselenggarakan Secara Langsung_.** Bukti konteks malam 19 Juli 2023. Alamat: `https://www.kratonjogja.id/peristiwa/1274-hajad-kawula-dalem-mubeng-beteng-1-sura-jimawal-1957-kembali-diselenggarakan-secara-langsung/`.

**[R13] Keraton Ngayogyakarta Hadiningrat. _Srimpi Merak Kesimpir_.** Mencantumkan pergelaran 30 Juni 2025 sebagai 4 Sura Dal 1959. Alamat: `https://www.kratonjogja.id/kagungan-dalem/86-srimpi-merak-kesimpir/`.

**[R14] Keraton Ngayogyakarta Hadiningrat. (2026, 30 Januari). _Tingalan Jumenengan Dalem Dal 1959: Rasa Syukur Tandai 38 Tahun Sri Sultan Bertakhta_.** Mencantumkan 18 Januari 2026 sebagai 29 Rejeb Dal 1959 dan upacara Sugengan sekitar pukul 11.00 WIB. Alamat: `https://www.kratonjogja.id/peristiwa/1462-tingalan-jumenengan-dalem-dal-1959-rasa-syukur-tandai-38-tahun-sri-sultan-bertakhta/`.

**[R15] Keraton Ngayogyakarta Hadiningrat. (2026, 15 Juni). _Uyon-Uyon Hadiluhung Senin Pon 15 Juni 2026_.** Mencantumkan 29 Besar Dal 1959. Alamat: `https://www.kratonjogja.id/en/peristiwa/1486-uyon-uyon-hadiluhung-senin-pon-15-juni-2026/`.

## Lampiran reproduksi

Berkas `audit/audit_pawukon.py` tidak memerlukan paket pihak ketiga atau koneksi internet. Jalankan:

```bash
python3 audit/audit_pawukon.py hasil_audit.json
```

Hasil JSON mencakup perbandingan awal tahun (pawukon, `weton.m`, almanak, rsjp modern), contoh batas windu, tanggal peristiwa Keraton untuk pemeriksaan silang, dan jumlah perbedaan. Skrip memuat pemeriksaan internal (rumus awal tahun terhadap penjumlahan tahun demi tahun, jangkar tanggal, dan weton 26 April 1975). Pada revisi ini keempat model pada skrip dicocokkan dengan keluaran program aslinya (kode rsjp dan almanak dijalankan; port Python `weton.m` dijalankan): 0 selisih pada AJ 1867-1986, dan pada `weton.m` juga 0 selisih terhadap seluruh AJ 1555-1986 (82 awal tahun berbeda dari pawukon). Untuk menghindari kesan kepastian berlebihan, nama kolom secara eksplisit menyebut rekonstruksi aturan. Kunci `windu_inspected_js_formula` mereproduksi rumus lama; sejak perbaikan bab 8, mesin mengikuti `windu_by_eight_javanese_years`. Validasi berikutnya yang paling bernilai adalah menjalankan kasus yang sama pada checkout upstream asli dan mencocokkannya dengan eksemplar kalender serta kitab yang identitasnya dibekukan.
