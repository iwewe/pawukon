#!/usr/bin/env python3
"""Implementasi acuan rumusan_perhitungan_pawukon.md: bilangan bulat murni, hanya pustaka standar.

Ditulis dari spesifikasi (bukan dari src/kalender.js) supaya dapat menjadi pembanding independen. Tidak memakai
`datetime`; semua dari aritmetika bilangan bulat.
"""

# --- 1. konstanta -----------------------------------------------------------------------------------------------------------
HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']
NEPTU_HARI = [4, 3, 7, 8, 6, 9, 5]        # Senin..Minggu
NEPTU_PASARAN = [5, 9, 7, 4, 8]           # Legi, Pahing, Pon, Wage, Kliwon
WUKU = ['Sinta', 'Landep', 'Wukir', 'Kurantil', 'Tolu', 'Gumbreg', 'Warigalit', 'Warigagung', 'Julungwangi', 'Sungsang',
        'Galungan', 'Kuningan', 'Langkir', 'Mandasiya', 'Julungpujut', 'Pahang', 'Kuruwelut', 'Marakeh', 'Tambir',
        'Medangkungan', 'Maktal', 'Wuye', 'Manahil', 'Prangbakat', 'Bala', 'Wugu', 'Wayang', 'Kulawu', 'Dukut', 'Watugunung']
WULAN = ['Sura', 'Sapar', 'Mulud', 'Bakdamulud', 'Jumadilawal', 'Jumadilakir', 'Rejeb', 'Ruwah', 'Pasa', 'Sawal',
         'Dulkangidah', 'Besar']
TAUN = ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakir']
PANJANG_TAUN = [354, 355, 354, 354, 355, 354, 354, 355]
AWAL_KUMULATIF = [0, 354, 709, 1063, 1417, 1772, 2126, 2480]
WINDU = ['Kuntara', 'Sangara', 'Sancaya', 'Adi']
LAMBANG = ['Kulawu', 'Langkir']
KURUP = ['Jamingiyah', 'Kamsiyah', 'Arbangiyah', 'Salasiyah']
BATAS_PERTAMA = 1627                       # tahun AJ pertama kurup ke-2; batas berikutnya tiap 120 tahun: 1747, 1867, 1987, 2107, ...
PANJANG_KURUP = 120
AJ0 = 1555
HARI_PER_WINDU = 2835


def floor_div(a, b):
    return a // b            # Python: floor; di bahasa lain gunakan pembagian lantai


def mod(a, b):
    return a % b             # hasil selalu 0 <= r < b


# --- 2. nomor hari ----------------------------------------------------------------------------------------------------------------
def hari_dari_sipil(y, m, d):
    """Jumlah hari sejak 1970-01-01 (kalender Gregorian proleptik); algoritma Hinnant, bilangan bulat."""
    y -= 1 if m <= 2 else 0
    era = floor_div(y, 400)
    yoe = y - era * 400
    doy = floor_div(153 * (m + (-3 if m > 2 else 9)) + 2, 5) + d - 1
    doe = yoe * 365 + floor_div(yoe, 4) - floor_div(yoe, 100) + doy
    return era * 146097 + doe - 719468


def sipil_dari_hari(z):
    z += 719468
    era = floor_div(z, 146097)
    doe = z - era * 146097
    yoe = floor_div(doe - floor_div(doe, 1460) + floor_div(doe, 36524) - floor_div(doe, 146096), 365)
    y = yoe + era * 400
    doy = doe - (365 * yoe + floor_div(yoe, 4) - floor_div(yoe, 100))
    mp = floor_div(5 * doy + 2, 153)
    d = doy - floor_div(153 * mp + 2, 5) + 1
    m = mp + (3 if mp < 10 else -9)
    return y + (1 if m <= 2 else 0), m, d


E_EPOCH = hari_dari_sipil(1633, 7, 8)       # nomor hari Unix untuk 1 Sura 1555 AJ


def nomor_epoch(y, m, d):
    """d: selisih hari dari epoch (8 Juli 1633). Boleh negatif."""
    return hari_dari_sipil(y, m, d) - E_EPOCH


# --- 3. siklus pasti: hari, pasaran, weton, neptu, wuku -----------------------------------------------------------------------------
def siklus(d):
    ih = mod(d + 4, 7)
    ip = mod(d, 5)
    iw = floor_div(mod(d + 194, 210), 7)
    return {
        'hari': HARI[ih], 'pasaran': PASARAN[ip], 'weton': HARI[ih] + ' ' + PASARAN[ip],
        'neptu': NEPTU_HARI[ih] + NEPTU_PASARAN[ip], 'wuku': WUKU[iw], 'nomorWuku': iw + 1,
        'indeks': [ih, ip, iw],
    }


# --- 4. tanggal Jawa -----------------------------------------------------------------------------------------------------------------
def koreksi(y):
    """c(y): banyaknya batas kurup (1627, 1747, 1867, 1987, ...) yang telah dicapai tahun y."""
    return 0 if y < BATAS_PERTAMA else (y - BATAS_PERTAMA) // PANJANG_KURUP + 1


def awal_tahun(y):
    """Selisih hari dari epoch sampai 1 Sura tahun AJ y (1555 <= y <= 1987)."""
    q = floor_div(y - AJ0, 8)
    r = mod(y - AJ0, 8)
    return q * HARI_PER_WINDU + AWAL_KUMULATIF[r] - koreksi(y)


def akhir_kurup(y):
    """True bila tahun y adalah tahun terakhir sebuah kurup (tahun berikutnya awal kurup)."""
    return y + 1 >= BATAS_PERTAMA and mod(y + 1 - BATAS_PERTAMA, PANJANG_KURUP) == 0


def panjang_bulan(y):
    p = [30 if i % 2 == 0 else 29 for i in range(12)]
    if PANJANG_TAUN[mod(y - AJ0, 8)] == 355:
        p[11] = 30
    if akhir_kurup(y):
        p[11] -= 1
    return p


AKHIR_TERDEFINISI = awal_tahun(1987) - 1     # 25 Agustus 2052


def kurup_indeks(y):
    """0 = Jamingiyah (1555-1626), 1 = Kamsiyah, 2 = Arbangiyah, 3 = Salasiyah, >=4 spekulatif."""
    return 0 if y < BATAS_PERTAMA else (y - BATAS_PERTAMA) // PANJANG_KURUP + 1


def tanggal_jawa(d):
    """d >= 0 (d > AKHIR_TERDEFINISI = ekstrapolasi spekulatif). Mengembalikan (dina, indeks_wulan, tahun)."""
    if d < 0:
        raise ValueError('sebelum epoch')
    y = AJ0 + floor_div(8 * d, HARI_PER_WINDU)
    while awal_tahun(y + 1) <= d:
        y += 1
    while awal_tahun(y) > d:
        y -= 1
    sisa = d - awal_tahun(y)
    for i, p in enumerate(panjang_bulan(y)):
        if sisa < p:
            return sisa + 1, i, y
        sisa -= p
    raise AssertionError


def label(y):
    w = floor_div(y - AJ0, 8)
    k = kurup_indeks(y)
    return {'taun': TAUN[mod(y - AJ0, 8)], 'windu': WINDU[mod(w, 4)], 'lambang': LAMBANG[mod(w, 2)],
            'kurup': KURUP[k] if k < 4 else 'Kurup %d' % (k + 1)}


def hari_mulia(dina, iw, wulan, ih, ip):
    out = []
    if dina == 1 and wulan == 0:
        out.append('Siji Sura')
    if WUKU[iw] == 'Kuningan' and HARI[ih] == 'Sabtu' and PASARAN[ip] == 'Kliwon':
        out.append('Kuningan')
    if WUKU[iw] == 'Dukut' and HARI[ih] == 'Selasa' and PASARAN[ip] == 'Kliwon':
        out.append('Hanggara Asih')
    if WUKU[iw] == 'Watugunung' and HARI[ih] == 'Jumat' and PASARAN[ip] == 'Kliwon':
        out.append('Dina Mulya')
    if HARI[ih] == 'Jumat' and PASARAN[ip] == 'Legi':
        out.append('Dina Purnama')
    return out


def kalender_jawa(y, m, dd):
    d = nomor_epoch(y, m, dd)
    s = siklus(d)
    hasil = {'masehi': '%04d-%02d-%02d' % (y, m, dd), 'd': d, **s}
    if d >= 0:
        dina, iwl, thn = tanggal_jawa(d)
        hasil.update({'dina': dina, 'wulan': WULAN[iwl], 'tahun': thn, **label(thn),
                      'spekulatif': d > AKHIR_TERDEFINISI, 'hariMulia': hari_mulia(dina, s['indeks'][2], iwl, s['indeks'][0], s['indeks'][1])})
    return hasil


def baris_kanonik(d):
    """Satu baris kanonik per hari untuk checksum lintas bahasa."""
    dina, iwl, thn = tanggal_jawa(d)
    return '%d|%d|%d|%d' % (d, dina, iwl, thn)


if __name__ == '__main__':
    import hashlib
    h = hashlib.sha256()
    for d in range(0, AKHIR_TERDEFINISI + 1):
        h.update((baris_kanonik(d) + '\n').encode())
    print('hari terdefinisi:', AKHIR_TERDEFINISI + 1, 'sha256:', h.hexdigest())
