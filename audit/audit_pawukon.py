#!/usr/bin/env python3
"""Independent, standard-library reconstruction of inspected calendar rules.

This is NOT the original repositories' test suite and does NOT validate the
predictive claims of primbon. It compares explicit arithmetic specifications.
Sources inspected 2026-10-11 (Asia/Jakarta):
- iwewe/pawukon, 7a74fbd720988c2f4ebaf1b8911d9b8eade27bbe,
  src/kalender.js; tests/kraton.test.js; tests/data-kraton.js.
- beaudu/weton, 98383d0739a8c37304350a9077c33d3081229367, weton.m.
- bendahara-selokarto/research-system-javanese-profile,
  081bcd088e900a6202b9874998d7724ec78a8886,
  src/research_system/utils/javanese_calendar.py.
- MasArMuttaqi/almanak, kalender_jawa_sultan_agungan.py, fetched 2026-10-11.
  No commit was pinned for the last source in this reconstruction.

Run: python3 audit/audit_pawukon.py [output.json]
Dates refer to proleptic Gregorian civil dates, NOT sunset-adjusted instants.

Catatan revisi (11 Oktober 2026): kunci 'windu_inspected_js_formula' dan 'lambang_inspected_js_formula' mereproduksi rumus
lama pada commit 7a74fbd (blok 2.835 hari, seperti weton.m). Sejak perbaikan di src/kalender.js, mesin memakai blok delapan tahun
Jawa, yaitu 'windu_by_eight_javanese_years'. Keempat model (rumus pawukon, weton.m, rsjp modern, almanak) dicocokkan dengan keluaran
program aslinya pada revisi ini: 0 selisih.
"""
from __future__ import annotations
from bisect import bisect_right
from datetime import date, timedelta
from pathlib import Path
import json
import sys

EPOCH = date(1633, 7, 8)
YEAR_NAMES = ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakir']
MONTH_NAMES = ['Sura','Sapar','Mulud','Bakdamulud','Jumadilawal','Jumadilakir','Rejeb','Ruwah','Pasa','Sawal','Dulkangidah','Besar']
PATTERN = [354,355,354,354,355,354,354,355]
PREFIX = [sum(PATTERN[:i]) for i in range(8)]
WINDU = ['Kuntara','Sangara','Sancaya','Adi']  # ejaan Karaton; weton.m: Sengara
LAMBANG = ['Kulawu','Langkir']
WUKU = ['Sinta','Landep','Wukir','Kurantil','Tolu','Gumbreg','Warigalit','Warigagung','Julungwangi','Sungsang','Galungan','Kuningan','Langkir','Mandasiya','Julungpujut','Pahang','Kuruwelut','Marakeh','Tambir','Medangkungan','Maktal','Wuye','Manahil','Prangbakat','Bala','Wugu','Wayang','Kulawu','Dukut','Watugunung']


def raw_offset(year: int) -> int:
    q, r = divmod(year-1555, 8)
    return q * 2835 + PREFIX[r]


def paw_start(year: int) -> date:
    if not 1555 <= year <= 1987:
        raise ValueError('This reconstruction covers AJ 1555 through start of 1987.')
    corrections = sum(year >= b for b in (1627,1747,1867,1987))
    return EPOCH + timedelta(days=raw_offset(year)-corrections)


def almanak_start(year: int) -> date:
    return date(2025,6,27) + timedelta(days=raw_offset(year)-raw_offset(1959))


def weton_m_starts() -> dict[int, date]:
    """Translate inspected matrix/offset logic, including end-column placement."""
    w354 = [30,29,30,29,30,29,30,29,30,29,30,29]
    w355 = w354[:-1] + [30]
    dal2 = [30,30,29,29,30,29,30,29,30,29,30,30]
    dal3 = [30,30,29,29,29,29,30,29,30,29,30,30]
    patterns = [
        [w354,w355,w354,w354,w355,w354,w354,w355],
        [w354,w355,w354,w354,dal2,w354,w354,w355],
        [w354,w355,w354,w355,dal3,w354,w354,w355],
        [w354,w355,w354,w355,w354,w354,w354,w355],
    ]
    specs = [(1555,1675,0),(1675,1749,0),(1749,1867,2),(1867,1987,0)]
    result: dict[int,date] = {}
    cursor = EPOCH
    for (first,end,offset), pattern in zip(specs,patterns):
        columns = [list(pattern[i%8]) for i in range(120)]
        columns[end-first-1][-1] -= 1
        for year in range(first,end):
            result[year] = cursor
            cursor += timedelta(days=sum(columns[year-first+offset]))
    result[1987] = cursor
    return result


def rsjp_modern_starts() -> dict[int,date]:
    result: dict[int,date] = {}
    cursor = date(1936,3,25)
    leap_positions = {2,5,7,10,13,16,18,21,24,26,29}
    for year in range(1867,1988):
        result[year] = cursor
        hijri = year-512
        length = 354 if year==1867 else 354+int((hijri-1)%30+1 in leap_positions)
        cursor += timedelta(days=length)
    return result


STARTS = [paw_start(y) for y in range(1555,1988)]


def paw_date(value: date) -> dict[str,object]:
    if not STARTS[0] <= value < STARTS[-1]:
        raise ValueError('Outside documented non-speculative date range.')
    index = bisect_right(STARTS,value)-1
    year = 1555+index
    offset = (value-STARTS[index]).days
    total = (STARTS[index+1]-STARTS[index]).days
    lengths = [30,29,30,29,30,29,30,29,30,29,30,total-325]
    month = 0
    while offset >= lengths[month]:
        offset -= lengths[month]
        month += 1
    # MATLAB-style day ordinal, exactly as used by the inspected JS formula.
    dt = value.toordinal()+366
    day_index = (dt+4)%7
    pasaran_index = (dt+2)%5
    hari = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'][day_index]
    pasaran = ['Pon','Wage','Kliwon','Legi','Pahing'][pasaran_index]
    dti = (value-EPOCH).days+1
    fixed_day_cycle = dti//2835
    year_cycle = (year-1555)//8
    return {
        'gregorian':value.isoformat(), 'day':offset+1,
        'month':MONTH_NAMES[month], 'year':year,
        'year_name':YEAR_NAMES[(year-1555)%8],
        'weton':hari+' '+pasaran,
        'wuku':WUKU[((dt-2)//7+25)%30],
        'neptu':[4,3,7,8,6,9,5][day_index]+[7,4,8,5,9][pasaran_index],
        'windu_inspected_js_formula':WINDU[fixed_day_cycle%4],
        'lambang_inspected_js_formula':LAMBANG[fixed_day_cycle%2],
        'windu_by_eight_javanese_years':WINDU[year_cycle%4],
        'lambang_by_eight_javanese_years':LAMBANG[year_cycle%2],
    }


def run() -> dict[str,object]:
    # Cross-check the compact year-start formula against a separate year loop.
    cursor = EPOCH
    for year in range(1555,1987):
        assert cursor == paw_start(year)
        length = PATTERN[(year-1555)%8]-int(year in (1626,1746,1866,1986))
        cursor += timedelta(days=length)
    assert cursor == paw_start(1987)
    anchors = {1555:'1633-07-08',1627:'1703-05-17',1747:'1819-10-20',1867:'1936-03-24',1957:'2023-07-20',1959:'2025-06-27',1960:'2026-06-17',1987:'2052-08-26'}
    for year, iso in anchors.items():
        assert paw_start(year).isoformat()==iso
    assert paw_date(date(1975,4,26))['weton']=='Sabtu Kliwon'
    assert paw_date(date(1975,4,26))['wuku']=='Kuningan'
    assert paw_date(date(1975,4,26))['neptu']==17
    wm = weton_m_starts()
    rs = rsjp_modern_starts()
    rows = []
    for year in (1555,1627,1675,1747,1749,1865,1866,1867,1955,1956,1957,1958,1959,1960,1987):
        rows.append({'aj':year,'year_name':YEAR_NAMES[(year-1555)%8],
          'pawukon_rules':paw_start(year).isoformat(),
          'weton_m_rules':wm[year].isoformat(),
          'almanak_rules':almanak_start(year).isoformat(),
          'rsjp_modern_rules':rs[year].isoformat() if year in rs else None})
    boundary = [paw_date(date.fromisoformat(s)) for s in
      ('1641-04-11','1641-04-12','2021-08-09','2021-08-10','2021-08-11','2021-08-12')]
    events = [paw_date(date.fromisoformat(s)) for s in
      ('2025-06-30','2025-11-17','2026-01-18','2026-01-26','2026-06-15')]
    count = 0
    boundary_examples = []
    for i in range((STARTS[-1]-EPOCH).days):
        value = EPOCH+timedelta(days=i)
        # only the year and cycle labels are necessary for this daily audit
        year = 1555+bisect_right(STARTS,value)-1
        a = ((value-EPOCH).days+1)//2835
        b = (year-1555)//8
        if a%4 != b%4:
            count += 1
            if len(boundary_examples)<12:
                boundary_examples.append(value.isoformat())
    return {
      'method':'Independent reconstruction of inspected formulas; NOT upstream test execution.',
      'date':'2026-10-11',
      'sources':__doc__,
      'year_start_comparisons':rows,
      'windu_boundary_checks':boundary,
      'official_event_dates_for_comparison':events,
      'windu_formula_disagreement':{'days_tested':(STARTS[-1]-EPOCH).days,
        'disagreeing_days':count,'first_examples':boundary_examples,
        'interpretation':'Compared with windu defined as blocks of eight AJ years; not a claim of empirical primbon validity.'},
      'start_date_disagreements':{
        'weton_m_vs_pawukon_1555_1986':sum(wm[y]!=paw_start(y) for y in range(1555,1987)),
        'rsjp_modern_vs_pawukon_1867_1986':sum(rs[y]!=paw_start(y) for y in range(1867,1987)),
        'almanak_vs_pawukon_1867_1986':sum(almanak_start(y)!=paw_start(y) for y in range(1867,1987))},
      'caveat':'The models being compared have different specifications. A difference is not automatically a bug. Tables alone do not prove historical practice.'
    }


if __name__ == '__main__':
    result = run()
    text = json.dumps(result,ensure_ascii=False,indent=2)
    if len(sys.argv)>1:
        Path(sys.argv[1]).write_text(text+'\n',encoding='utf-8')
    print(text)
