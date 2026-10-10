/**
 * Awal tiap bulan Jawa (hari dan pasaran tanggal 1) menurut Karaton Ngayogyakarta, kurup Aboge dan Asapon.
 * Sumber: Siti Marhamah, "Kalender Jawa Islam Sultan Agungan di Kesultanan Yogyakarta" (Tesis Ilmu Falak, UIN Walisongo
 * Semarang, 2022), hlm. 56-69, yang mengutip KRT Rintaiswara, Tahun Jawa Islam Sultan Agungan (Dinas Kebudayaan DIY bekerja
 * sama dengan Karaton Ngayogyakarta Hadiningrat, 2015), hlm. 9-13.
 *
 * Tiga salah ketik pada tesis dikoreksi karena terbukti secara aritmetika (selisih antarbulan harus 29 atau 30 hari):
 *   Aboge  Alip Jumadilakir  "Kamis Pon"   -> "Kamis Pahing"
 *   Aboge  Je   Sapar        "Kamis Pon"   -> "Kamis Pahing"
 *   Asapon Jimawal Rejeb     "Selasa Wage" -> "Sabtu Wage"
 * Pada kurup Asapon (1867-1986 AJ, 1936-2052 M) dan Aboge (1747/1749-1866 AJ) tabel yang sama berulang tiap windu.
 */
export const ABOGE = {
  Alip: { Sura: 'Rabu Wage', Sapar: 'Jumat Wage', Mulud: 'Sabtu Pon', Bakdamulud: 'Senin Pon', Jumadilawal: 'Selasa Pahing', Jumadilakir: 'Kamis Pahing', Rejeb: 'Jumat Legi', Ruwah: 'Minggu Legi', Pasa: 'Senin Kliwon', Sawal: 'Rabu Kliwon', Dulkangidah: 'Kamis Wage', Besar: 'Sabtu Wage' },
  Ehe: { Sura: 'Minggu Pon', Sapar: 'Selasa Pon', Mulud: 'Rabu Pahing', Bakdamulud: 'Jumat Pahing', Jumadilawal: 'Sabtu Legi', Jumadilakir: 'Senin Legi', Rejeb: 'Selasa Kliwon', Ruwah: 'Kamis Kliwon', Pasa: 'Jumat Wage', Sawal: 'Minggu Wage', Dulkangidah: 'Senin Pon', Besar: 'Rabu Pon' },
  Jimawal: { Sura: 'Jumat Pon', Sapar: 'Minggu Pon', Mulud: 'Senin Pahing', Bakdamulud: 'Rabu Pahing', Jumadilawal: 'Kamis Legi', Jumadilakir: 'Sabtu Legi', Rejeb: 'Minggu Kliwon', Ruwah: 'Selasa Kliwon', Pasa: 'Rabu Wage', Sawal: 'Jumat Wage', Dulkangidah: 'Sabtu Pon', Besar: 'Senin Pon' },
  Je: { Sura: 'Selasa Pahing', Sapar: 'Kamis Pahing', Mulud: 'Jumat Legi', Bakdamulud: 'Minggu Legi', Jumadilawal: 'Senin Kliwon', Jumadilakir: 'Rabu Kliwon', Rejeb: 'Kamis Wage', Ruwah: 'Sabtu Wage', Pasa: 'Minggu Pon', Sawal: 'Selasa Pon', Dulkangidah: 'Rabu Pahing', Besar: 'Jumat Pahing' },
  Dal: { Sura: 'Sabtu Legi', Sapar: 'Senin Legi', Mulud: 'Selasa Kliwon', Bakdamulud: 'Kamis Kliwon', Jumadilawal: 'Jumat Wage', Jumadilakir: 'Minggu Wage', Rejeb: 'Senin Pon', Ruwah: 'Rabu Pon', Pasa: 'Kamis Pahing', Sawal: 'Sabtu Pahing', Dulkangidah: 'Minggu Legi', Besar: 'Selasa Legi' },
  Be: { Sura: 'Kamis Legi', Sapar: 'Sabtu Legi', Mulud: 'Minggu Kliwon', Bakdamulud: 'Selasa Kliwon', Jumadilawal: 'Rabu Wage', Jumadilakir: 'Jumat Wage', Rejeb: 'Sabtu Pon', Ruwah: 'Senin Pon', Pasa: 'Selasa Pahing', Sawal: 'Kamis Pahing', Dulkangidah: 'Jumat Legi', Besar: 'Minggu Legi' },
  Wawu: { Sura: 'Senin Kliwon', Sapar: 'Rabu Kliwon', Mulud: 'Kamis Wage', Bakdamulud: 'Sabtu Wage', Jumadilawal: 'Minggu Pon', Jumadilakir: 'Selasa Pon', Rejeb: 'Rabu Pahing', Ruwah: 'Jumat Pahing', Pasa: 'Sabtu Legi', Sawal: 'Senin Legi', Dulkangidah: 'Selasa Kliwon', Besar: 'Kamis Kliwon' },
  Jimakir: { Sura: 'Jumat Wage', Sapar: 'Minggu Wage', Mulud: 'Senin Pon', Bakdamulud: 'Rabu Pon', Jumadilawal: 'Kamis Pahing', Jumadilakir: 'Sabtu Pahing', Rejeb: 'Minggu Legi', Ruwah: 'Selasa Legi', Pasa: 'Rabu Kliwon', Sawal: 'Jumat Kliwon', Dulkangidah: 'Sabtu Wage', Besar: 'Senin Wage' }
};

export const ASAPON = {
  Alip: { Sura: 'Selasa Pon', Sapar: 'Kamis Pon', Mulud: 'Jumat Pahing', Bakdamulud: 'Minggu Pahing', Jumadilawal: 'Senin Legi', Jumadilakir: 'Rabu Legi', Rejeb: 'Kamis Kliwon', Ruwah: 'Sabtu Kliwon', Pasa: 'Minggu Wage', Sawal: 'Selasa Wage', Dulkangidah: 'Rabu Pon', Besar: 'Jumat Pon' },
  Ehe: { Sura: 'Sabtu Pahing', Sapar: 'Senin Pahing', Mulud: 'Selasa Legi', Bakdamulud: 'Kamis Legi', Jumadilawal: 'Jumat Kliwon', Jumadilakir: 'Minggu Kliwon', Rejeb: 'Senin Wage', Ruwah: 'Rabu Wage', Pasa: 'Kamis Pon', Sawal: 'Sabtu Pon', Dulkangidah: 'Minggu Pahing', Besar: 'Selasa Pahing' },
  Jimawal: { Sura: 'Kamis Pahing', Sapar: 'Sabtu Pahing', Mulud: 'Minggu Legi', Bakdamulud: 'Selasa Legi', Jumadilawal: 'Rabu Kliwon', Jumadilakir: 'Jumat Kliwon', Rejeb: 'Sabtu Wage', Ruwah: 'Senin Wage', Pasa: 'Selasa Pon', Sawal: 'Kamis Pon', Dulkangidah: 'Jumat Pahing', Besar: 'Minggu Pahing' },
  Je: { Sura: 'Senin Legi', Sapar: 'Rabu Legi', Mulud: 'Kamis Kliwon', Bakdamulud: 'Sabtu Kliwon', Jumadilawal: 'Minggu Wage', Jumadilakir: 'Selasa Wage', Rejeb: 'Rabu Pon', Ruwah: 'Jumat Pon', Pasa: 'Sabtu Pahing', Sawal: 'Senin Pahing', Dulkangidah: 'Selasa Legi', Besar: 'Kamis Legi' },
  Dal: { Sura: 'Jumat Kliwon', Sapar: 'Minggu Kliwon', Mulud: 'Senin Wage', Bakdamulud: 'Rabu Wage', Jumadilawal: 'Kamis Pon', Jumadilakir: 'Sabtu Pon', Rejeb: 'Minggu Pahing', Ruwah: 'Selasa Pahing', Pasa: 'Rabu Legi', Sawal: 'Jumat Legi', Dulkangidah: 'Sabtu Kliwon', Besar: 'Senin Kliwon' },
  Be: { Sura: 'Rabu Kliwon', Sapar: 'Jumat Kliwon', Mulud: 'Sabtu Wage', Bakdamulud: 'Senin Wage', Jumadilawal: 'Selasa Pon', Jumadilakir: 'Kamis Pon', Rejeb: 'Jumat Pahing', Ruwah: 'Minggu Pahing', Pasa: 'Senin Legi', Sawal: 'Rabu Legi', Dulkangidah: 'Kamis Kliwon', Besar: 'Sabtu Kliwon' },
  Wawu: { Sura: 'Minggu Wage', Sapar: 'Selasa Wage', Mulud: 'Rabu Pon', Bakdamulud: 'Jumat Pon', Jumadilawal: 'Sabtu Pahing', Jumadilakir: 'Senin Pahing', Rejeb: 'Selasa Legi', Ruwah: 'Kamis Legi', Pasa: 'Jumat Kliwon', Sawal: 'Minggu Kliwon', Dulkangidah: 'Senin Wage', Besar: 'Rabu Wage' },
  Jimakir: { Sura: 'Kamis Pon', Sapar: 'Sabtu Pon', Mulud: 'Minggu Pahing', Bakdamulud: 'Selasa Pahing', Jumadilawal: 'Rabu Legi', Jumadilakir: 'Jumat Legi', Rejeb: 'Sabtu Kliwon', Ruwah: 'Senin Kliwon', Pasa: 'Selasa Wage', Sawal: 'Kamis Wage', Dulkangidah: 'Jumat Pon', Besar: 'Minggu Pon' }
};
