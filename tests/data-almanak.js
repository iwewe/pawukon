/**
 * Tanggal Jawa yang tercetak pada tabel tesis Siti Marhamah (2022), "Kalender Jawa Islam Sultan Agungan di Kesultanan Yogyakarta"
 * (UIN Walisongo Semarang), bab IV, Tabel 6 sampai 15 (hlm. 115-123). Tabel 6-11: Almanak Jawa (Keraton Yogyakarta, 1929-1939);
 * Tabel 12-15: kalender Jawa Islam Sultan Agungan Keraton Yogyakarta (2012, 2020). Dipakai sebagai data uji; fakta tanggal, bukan teks.
 *
 * Isi: 15 baris = 10 awal bulan Pasa (Poso) atau Sawal pada 6 tahun Jawa, ditambah 5 baris hari sebelum atau sesudahnya yang dicetak pada
 * tabel yang sama. Tahun-tahunnya Alip (1859), Be (1864), Ehe (1868), Je (1870), dan Wawu (1945, 1953): TIDAK ADA tahun Dal.
 *
 * Koreksi yang dicatat (tidak diam-diam):
 *  - Tabel 8: tesis mencetak "30 Ruwah 1864" untuk 17 Januari 1934. Hari sebelum 1 Sawal pasti hari terakhir bulan Pasa, jadi nilai yang dipakai
 *    "30 Pasa 1864" (kolom Hijriah pada baris yang sama, 1 Syawal 1352 H, mendukungnya).
 *  - Tabel 14: tabel mencetak 24 April 2020 sedangkan teks sekitarnya menulis "24 Mei 2020". Dipakai 24 April 2020, sesuai tabel dan hari
 *    Jumat Kliwon yang disebut teks (24 Mei 2020 adalah Minggu).
 *  - Tabel 8 diberi judul "Khurup Asapon" tetapi 1864 J masih Aboge (Asapon mulai 1867 J); label kurup tidak dipakai di sini.
 * Nama bulan memakai ejaan mesin: Pasa (tesis: Poso).
 */
export const TITIK_ALMANAK = [
  { tabel: 6, sumber: 'Almanak Jawa', masehi: '1929-02-11', dina: 1, wulan: 'Pasa', tahun: 1859 },
  { tabel: 7, sumber: 'Almanak Jawa', masehi: '1929-03-13', dina: 1, wulan: 'Sawal', tahun: 1859 },
  { tabel: 8, sumber: 'Almanak Jawa', masehi: '1934-01-17', dina: 30, wulan: 'Pasa', tahun: 1864, koreksi: 'tesis mencetak "30 Ruwah"' },
  { tabel: 8, sumber: 'Almanak Jawa', masehi: '1934-01-18', dina: 1, wulan: 'Sawal', tahun: 1864 },
  { tabel: 9, sumber: 'Almanak Jawa', masehi: '1937-11-04', dina: 1, wulan: 'Pasa', tahun: 1868 },
  { tabel: 9, sumber: 'Almanak Jawa', masehi: '1937-11-05', dina: 2, wulan: 'Pasa', tahun: 1868 },
  { tabel: 10, sumber: 'Almanak Jawa', masehi: '1937-12-04', dina: 1, wulan: 'Sawal', tahun: 1868 },
  { tabel: 10, sumber: 'Almanak Jawa', masehi: '1937-12-05', dina: 2, wulan: 'Sawal', tahun: 1868 },
  { tabel: 11, sumber: 'Almanak Jawa', masehi: '1939-10-14', dina: 1, wulan: 'Pasa', tahun: 1870 },
  { tabel: 11, sumber: 'Almanak Jawa', masehi: '1939-10-15', dina: 2, wulan: 'Pasa', tahun: 1870 },
  { tabel: 12, sumber: 'Kalender Keraton', masehi: '2012-07-20', dina: 1, wulan: 'Pasa', tahun: 1945, weton: 'Jumat Kliwon' },
  { tabel: 12, sumber: 'Kalender Keraton', masehi: '2012-07-21', dina: 2, wulan: 'Pasa', tahun: 1945 },
  { tabel: 13, sumber: 'Kalender Keraton', masehi: '2012-08-19', dina: 1, wulan: 'Sawal', tahun: 1945, weton: 'Minggu Kliwon' },
  { tabel: 14, sumber: 'Kalender Keraton', masehi: '2020-04-24', dina: 1, wulan: 'Pasa', tahun: 1953, weton: 'Jumat Kliwon', koreksi: 'teks tesis menulis "24 Mei 2020"' },
  { tabel: 15, sumber: 'Kalender Keraton', masehi: '2020-05-24', dina: 1, wulan: 'Sawal', tahun: 1953, weton: 'Minggu Kliwon' }
];
