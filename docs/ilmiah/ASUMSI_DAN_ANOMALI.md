# Asumsi dan anomali kitab, serta cara menulis data

Setiap tabel tafsir berasal dari kitab Betaljemur Adammakna (terjemahan Indonesia modern). Dokumen ini mencatat tempat kitab tidak jelas atau
tidak konsisten, apa yang kami asumsikan, dan bagaimana data ditulis supaya tidak menyalin teks. Daftar fungsi dan bab:
[Referensi pustaka](../pustaka/REFERENSI_API.md).

Tercatat di data dan keluar pada hasil fungsi yang bersangkutan. Keganjilan cetakan **disalin apa adanya dan tidak ditebak**.

**Umum**
- Sisa 0 dibaca sebagai pembaginya (9, 7, 5, 4, ...) bila kitab tidak menyebut; tabelnya biasanya memuat sisa itu.
- Jumlah lebih kecil dari pembagi dipakai apa adanya (contoh kitab bab 107).
- Pembagi yang tidak tertulis (bab 141: 5; 151: 6; 176-180, 318: sebanyak nama) dibaca sebagai hitungan berputar; hanya bab 141 punya contoh.

**Jam, bepergian, hari baik**
- Jam kitab ditulis 12-an (1-5 = 13-17) dan dibaca sebagai 06.00-18.00; bab 147, 149, 164, 165 memakai angka 24 jam yang cocok.
- Bab 147-149, 164, 165 satu siklus: tujuh saat 2,2,1,2,2,2,1 jam dari 06.00. Bab 148 (ditranskripsi terpisah) cocok pada 49 titik; bab 149 sama dengan saat Lara dan Pati.
- Salah cetak (di `selisihCetak`): bab 147 Rabu-Wiji "1 - 1"; bab 165 Selasa Tresna "8-9" dan Tangguh "16-17"; bab 164 Rabu dan Jumat satu entri Cidra.
- Bab 156: Rabu Kliwon tercetak dua kali dan Rabu Legi tidak ada. Bab 157: angka baik kedua Selasa tercetak 1 (pola: 10). Bab 37: Sabtu siang 10.00-18.00 (pola: selisih 7 jam).
- Bab 34: "Idem" = sel di atasnya; "yang ke-n" = urutan hari itu dalam bulan Jawa (tanggal 1-7 = ke-1, ...).
- Naga/kala adalah arah yang dihindari menurut kitab; klasifikasi tiap arah milik kami, rijalolah hanya dilaporkan (netral).
- Bab 57 dan bab 173 adalah tabel jam yang sama dan berbeda di dua angka (Rabu dan Sabtu); masing-masing disimpan sesuai cetakan.

**Jodoh dan nama**
- Kitab memberi nama dalam aksara Jawa; mesin mengalihhurufkan nama Latin dengan kaidah sederhana (perkiraan). Berikan `{ depan, belakang }` bila ejaan menyimpang.
- Ada empat skema neptu aksara berbeda (bab 18, 19, 20/167, 114), semuanya dibaca dari scan.
- Bab 21: garis I-IV diagram Kraton mulyo dibaca dari gambar; pihak yang kalah hanya ditentukan untuk garis bersebelahan (garis berhadapan: `kalah: null`).
- Bab 22: "dibagi 7 atau 10, sisa tidak boleh lebih dari 7": dicoba 10 dulu, selain itu 7; kedua kandidat dilaporkan. Urutan nama 5 dan 6 terbalik dari bab 104.
- Bab 24-25: neptu tanggal = nomor tanggal Jawa kelahiran (contoh kitab 20 dan 14).

**Hajatan**
- Bab 39-41: tiga cara berbeda (jumlah neptu, tanggal mod 5, tanggal mod 7), pilih salah satu; catatan bab 41 salah merujuk ke "no 36, 37, 38".
- Bab 55-56: usia kehamilan dihitung dalam bulan Masehi dari tanggal acuan. Bab 65: hanya hitungan habis dibagi 5 yang disebut baik; sisa lain `netral`.
- Bab 68-74: hanya tanggal; selapan jatuh pada weton lahir.

**Watak dan ciri tubuh**
- Kalimat ditulis lebih netral daripada kitab (mis. "durhaka" menjadi "kurang berbakti"). Penolak, syarat cincin, kisah nabi (bab 108), ciri pencuri, dan uraian persetubuhan tidak dimasukkan.
- Bab 117: kata "harus dimulai" pada hari kemalangan tampaknya salah cetak; mesin hanya melaporkan kecocokan hari dan bulan. Kalimat "dekat ajal" adalah isi kitab, bukan fakta medis.
- Bab 112: Tujusih (butir 17 dan 18) dan Gunasakti (9 dan 21) ganda; butir 36 dan 37 bertuliskan letak sama dengan nama berbeda; butir 57 tanpa nama.
- **Bab 120-129 (hanya bagian berbasis kalender yang dikodekan):** watak perempuan menurut weton lahir (bab 120, 35 butir; kalimat dilunakkan dan tafsirnya mencerminkan norma zamannya),
  jam larangan bab 123 (tabel yang sama persis dengan bab 149, dipakai sebagai uji silang tanpa disalin lagi), dan catatan bab 128 tentang "hamil mendeking" (urutan kehamilan atau bulan? tidak jelas; dua bacaan disebut).
  Lihat ["Belum dikerjakan"](../pustaka/REFERENSI_API.md#belum-dikerjakan-kitab-337-bab) untuk yang sengaja tidak dimasukkan.
- Ciri tubuh adalah fisiognomi tradisional tanpa dasar ilmiah; butir yang berisi perkiraan umur dan keturunan diberi tanda "(kitab)". Jangan dipakai menilai orang.

## Cara menulis data

- **Bukan salinan teks.** Sumbernya terjemahan Indonesia modern kitab ini, yang punya hak cipta sendiri. Fakta (angka, nama, pasangan, arah) dipertahankan;
  kalimat makna ditulis ulang. Teks OCR mentah tidak disertakan di repo.
- **Kemiripan diukur:** dari 923 teks deskriptif dalam data, tidak ada yang memuat rangkaian kata berturut-turut sama dengan sumber lebih dari 6 kata
  (62 teks memuat rangkaian 5-6 kata, umumnya nama anggota badan dan frasa lazim). Pengukuran dilakukan terhadap OCR seluruh kitab. Bila data ini akan
  dipublikasikan luas, pertimbangkan pemeriksaan hukum.
- **Daftar istilah yang disalin** (nama hari binatang, nama bintang, nama letak) adalah fakta, bukan ekspresi.
