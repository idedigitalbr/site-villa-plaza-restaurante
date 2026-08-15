import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('ships the local Villa Plaza flipbook assets', () => {
  for (const relativePath of [
    'assets/css/menu-flipbook.css',
    'assets/js/menu-flipbook-state.mjs',
    'assets/js/menu-flipbook.js',
    'assets/js/page-flip.browser.js',
    'assets/CardapioMenu/cardapio-villa-plaza.pdf',
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }

  for (let page = 1; page <= 12; page += 1) {
    const filename = `assets/CardapioMenu/pages/page-${String(page).padStart(2, '0')}.png`;
    const stats = fs.statSync(path.join(root, filename));
    assert.ok(stats.size >= 300_000, `${filename} should be a high-resolution render`);
  }
});

test('integrates a local flipbook modal without the PDF.js viewer or external PDF loading', () => {
  const html = read('index.html');

  for (const marker of [
    'id="menuFlipbookStage"',
    'id="menuFlipbookPages"',
    'id="menuPrevBtn"',
    'id="menuNextBtn"',
    'id="menuPageInput"',
    'assets/CardapioMenu/cardapio-villa-plaza.pdf',
    'assets/js/page-flip.browser.js',
    'assets/js/menu-flipbook.js',
  ]) {
    assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(html, /cdnjs\.cloudflare\.com\/ajax\/libs\/pdf\.js/);
  assert.doesNotMatch(html, /pdfjsLib\.getDocument/);
  assert.doesNotMatch(html, /class="menu-pdf-viewer"/);
});

test('keeps the page state contract for cover, spreads and one-sheet navigation', async () => {
  const statePath = path.join(root, 'assets/js/menu-flipbook-state.mjs');
  assert.equal(fs.existsSync(statePath), true, 'state module should exist');
  const { normalizePage, getSpread, nextPage, previousPage } = await import(pathToFileURL(statePath));

  assert.equal(normalizePage(0, 12), 1);
  assert.equal(normalizePage(20, 12), 12);
  assert.deepEqual(getSpread(1, 12), { current: 1, pages: [1], isCover: true });
  assert.deepEqual(getSpread(2, 12), { current: 2, pages: [2, 3], isCover: false });
  assert.deepEqual(getSpread(12, 12), { current: 12, pages: [12], isCover: false });
  assert.equal(nextPage(1, 12), 2);
  assert.equal(nextPage(10, 12), 12);
  assert.equal(previousPage(2, 12), 1);
  assert.equal(previousPage(12, 12), 10);
});

test('uses the Villa Plaza visual system in the isolated flipbook stylesheet', () => {
  const css = read('assets/css/menu-flipbook.css');
  const controller = read('assets/js/menu-flipbook.js');

  assert.match(css, /--vp-wine|#57101D/i);
  assert.match(css, /--wine-gold-accent|#D3B97B/i);
  assert.match(css, /--wine-cream|#F1E6D5/i);
  assert.match(css, /flipbook-header/);
  assert.match(css, /menuFlipbookPages|\.stf__parent/);
  assert.match(controller, /LOCAL_PAGE_IMAGES/);
  assert.match(controller, /loadFromImages\(LOCAL_PAGE_IMAGES\)/);
  assert.match(controller, /devicePixelRatio/);
  assert.match(controller, /flipNext/);
  assert.match(controller, /flipPrev/);
  assert.match(controller, /turnToPage/);
});
