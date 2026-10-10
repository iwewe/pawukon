import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Menjaga dokumentasi sebagai sumber rujukan: semua tautan antardokumen menunjuk berkas dan judul yang ada,
// setiap kode klaim (K1...) di matriks punya bagian sendiri, dan berkas bukti yang disebut matriks benar-benar ada.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function semuaMarkdown(dir = ROOT, hasil = []) {
  for (const nama of readdirSync(dir)) {
    if (nama === 'node_modules' || nama === '.git') continue;
    const p = join(dir, nama);
    if (statSync(p).isDirectory()) semuaMarkdown(p, hasil);
    else if (nama.endsWith('.md')) hasil.push(p);
  }
  return hasil;
}

/** Hapus blok kode dan kode sebaris supaya contoh kode tidak terbaca sebagai tautan. */
function tanpaKode(teks) {
  return teks.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

/** Slug judul menurut aturan GitHub: huruf kecil, buang tanda baca selain - dan _, spasi menjadi -. */
function slug(judul) {
  return judul
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, m => (m === '_' ? '_' : ''))
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

function anchorBerkas(path) {
  const teks = tanpaKode(readFileSync(path, 'utf8'));
  const hitung = new Map();
  const hasil = new Set();
  for (const m of teks.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const dasar = slug(m[1]);
    const n = hitung.get(dasar) ?? 0;
    hitung.set(dasar, n + 1);
    hasil.add(n === 0 ? dasar : `${dasar}-${n}`);
  }
  return hasil;
}

const berkas = semuaMarkdown();

test('dokumentasi: ada README, CHANGELOG, CITATION, peta docs, dan empat lapis', () => {
  for (const f of ['README.md', 'CHANGELOG.md', 'CITATION.cff', 'LICENSE', 'NOTICE.md', 'docs/README.md',
    'docs/ilmiah/MATRIKS_KLAIM_BUKTI.md', 'docs/spesifikasi/RUMUSAN_PERHITUNGAN.md', 'docs/pustaka/REFERENSI_API.md']) {
    assert.ok(existsSync(join(ROOT, f)), `hilang: ${f}`);
  }
  assert.ok(readdirSync(join(ROOT, 'docs/populer')).length >= 6, 'halaman populer');
});

test('dokumentasi: semua tautan relatif antardokumen menunjuk berkas yang ada', () => {
  const rusak = [];
  let diperiksa = 0;
  for (const dok of berkas) {
    const teks = tanpaKode(readFileSync(dok, 'utf8'));
    for (const m of teks.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const tujuan = m[1];
      if (/^(https?:|mailto:|#)/.test(tujuan)) continue;
      const [jalur] = tujuan.split('#');
      const target = resolve(dirname(dok), decodeURIComponent(jalur));
      diperiksa++;
      if (!existsSync(target)) rusak.push(`${relative(ROOT, dok)} -> ${tujuan}`);
    }
  }
  assert.ok(diperiksa > 40, `terlalu sedikit tautan terperiksa (${diperiksa})`);
  assert.deepEqual(rusak, []);
});

test('dokumentasi: semua anchor judul (#...) menunjuk judul yang ada', () => {
  const rusak = [];
  for (const dok of berkas) {
    const teks = tanpaKode(readFileSync(dok, 'utf8'));
    for (const m of teks.matchAll(/\[[^\]]*\]\(([^)\s]*)#([^)\s]+)\)/g)) {
      const [jalur, anchor] = [m[1], m[2]];
      if (/^https?:/.test(jalur)) continue;
      const target = jalur === '' ? dok : resolve(dirname(dok), decodeURIComponent(jalur));
      if (!existsSync(target) || !target.endsWith('.md')) continue;
      if (!anchorBerkas(target).has(anchor)) rusak.push(`${relative(ROOT, dok)} -> ${jalur}#${anchor}`);
    }
  }
  assert.deepEqual(rusak, []);
});

test('matriks klaim: setiap kode K1..K14 punya bagian, ringkasan, dan keempat kolom wajib', () => {
  const m = readFileSync(join(ROOT, 'docs/ilmiah/MATRIKS_KLAIM_BUKTI.md'), 'utf8');
  for (let i = 1; i <= 14; i++) {
    const bagian = m.split(new RegExp(`^## K${i}$`, 'm'))[1];
    assert.ok(bagian, `bagian K${i} hilang`);
    const isi = bagian.split(/^## K\d+$/m)[0];
    for (const wajib of ['**Klaim.**', '**Jenis.**', '**Bukti.**', '**Batas.**']) {
      assert.ok(isi.includes(wajib), `K${i} tanpa ${wajib}`);
    }
    assert.ok(m.includes(`[K${i}](#k${i})`), `K${i} tidak ada di tabel ringkasan`);
  }
});

test('matriks klaim: berkas bukti yang disebut dalam kode (`path`) benar-benar ada', () => {
  const m = readFileSync(join(ROOT, 'docs/ilmiah/MATRIKS_KLAIM_BUKTI.md'), 'utf8');
  const jalur = [...m.matchAll(/`((?:tests|spec|audit|src|docs)\/[A-Za-z0-9_./-]+\.(?:js|mjs|py|json|md))`/g)].map(x => x[1]);
  assert.ok(jalur.length >= 10, `terlalu sedikit berkas bukti (${jalur.length})`);
  const hilang = [...new Set(jalur)].filter(p => !existsSync(join(ROOT, p)));
  assert.deepEqual(hilang, []);
});

test('kode klaim yang dirujuk halaman populer dan README ada di matriks', () => {
  const m = readFileSync(join(ROOT, 'docs/ilmiah/MATRIKS_KLAIM_BUKTI.md'), 'utf8');
  const ada = new Set([...m.matchAll(/^## (K\d+)$/gm)].map(x => x[1]));
  const dirujuk = new Set();
  for (const dok of berkas.filter(f => /docs\/populer\/|README\.md$/.test(f) && !/MATRIKS/.test(f))) {
    for (const x of readFileSync(dok, 'utf8').matchAll(/\*\*(K\d+)(?: sampai (K\d+))?\*\*/g)) {
      dirujuk.add(x[1]);
      if (x[2]) dirujuk.add(x[2]);
    }
  }
  assert.ok(dirujuk.size > 0);
  const hilang = [...dirujuk].filter(k => !ada.has(k));
  assert.deepEqual(hilang, []);
});

test('CITATION.cff: bidang wajib ada dan versinya sama dengan package.json', () => {
  const cff = readFileSync(join(ROOT, 'CITATION.cff'), 'utf8');
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  for (const kunci of ['cff-version: 1.2.0', 'title:', 'authors:', 'license: MIT', 'repository-code:', 'abstract:', 'date-released:']) {
    assert.ok(cff.includes(kunci), `CITATION.cff tanpa ${kunci}`);
  }
  assert.match(cff, new RegExp(`^version: ${pkg.version.replace(/\./g, '\\.')}$`, 'm'));
  assert.match(cff, /^date-released: "\d{4}-\d{2}-\d{2}"$/m);
});

test('LICENSE: pemegang hak cipta Iwewe; CHANGELOG memuat versi package.json', () => {
  const lic = readFileSync(join(ROOT, 'LICENSE'), 'utf8');
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  assert.match(lic, /^Copyright \(c\) 2026 Iwewe$/m);
  const log = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
  assert.ok(log.includes(`## [${pkg.version}]`));
});
