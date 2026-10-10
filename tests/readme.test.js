import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as api from '../src/index.js';

// Referensi fungsi pindah dari README ke docs/pustaka/REFERENSI_API.md; README tinggal pintu masuk.
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const ref = readFileSync(new URL('../docs/pustaka/REFERENSI_API.md', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('referensi API: setiap fungsi yang diekspor index.js tercantum sebagai `nama(`', () => {
  const hilang = Object.entries(api)
    .filter(([, v]) => typeof v === 'function')
    .map(([k]) => k)
    .filter(k => !ref.includes(`\`${k}(`));
  assert.deepEqual(hilang, []);
});

test('referensi API: setiap konstanta yang diekspor index.js disebut', () => {
  const hilang = Object.entries(api)
    .filter(([, v]) => typeof v !== 'function')
    .map(([k]) => k)
    .filter(k => !ref.includes(k));
  assert.deepEqual(hilang, []);
});

test('README dan referensi API tidak menyebut fungsi yang tidak ada (nama(...) dalam backtick)', () => {
  const dikenal = new Set(Object.keys(api));
  const disebut = [...(readme + '\n' + ref).matchAll(/`([a-z][A-Za-z0-9]+)\(/g)].map(m => m[1]);
  const asing = [...new Set(disebut)].filter(n => !dikenal.has(n));
  assert.deepEqual(asing, []);
});

test('package.json: berkas utama dan exports ada; skrip test dan verify menunjuk berkas tes', () => {
  assert.equal(pkg.main, 'src/index.js');
  assert.equal(pkg.exports, './src/index.js');
  assert.match(pkg.scripts.test, /tests\/\*\.test\.js/);
  assert.match(pkg.scripts.verify, /tests\/\*\.test\.js/);
  assert.match(pkg.scripts.verify, /spec\/referensi\.py/);
  assert.ok(pkg.engines.node);
});
