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

function readWebpDimensions(filename) {
  const bytes = fs.readFileSync(filename);
  const chunk = bytes.toString('ascii', 12, 16);

  if (chunk === 'VP8 ') {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === 'VP8X') {
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
    };
  }

  throw new Error(`Unsupported WebP chunk: ${chunk}`);
}

test('ships high-resolution WebP pages for mobile rendering', () => {
  const mobilePagesDir = path.join(root, 'assets/CardapioMenu/pages/mobile');

  for (let page = 1; page <= 12; page += 1) {
    const filename = `page-${String(page).padStart(2, '0')}.webp`;
    const fullPath = path.join(mobilePagesDir, filename);
    assert.equal(fs.existsSync(fullPath), true, fullPath);
    assert.deepEqual(readWebpDimensions(fullPath), { width: 1862, height: 2632 }, filename);
    assert.ok(fs.statSync(fullPath).size >= 100_000, `${filename} should retain readable detail`);
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

test('uses cache-busted Villa Plaza assets and accessible action icons', () => {
  const html = read('index.html');
  const version = 'v=20260815_v3';

  for (const asset of [
    `style.css?${version}`,
    `assets/css/menu-flipbook.css?${version}`,
    `assets/js/page-flip.browser.js?${version}`,
    `assets/js/menu-flipbook.js?${version}`,
  ]) {
    assert.ok(html.includes(asset), `${asset} should invalidate stale browser caches`);
  }

  assert.match(html, /id="menuFullscreenBtn"[^>]*aria-label="Abrir tela cheia"[^>]*title="Abrir tela cheia"[\s\S]*?<svg/);
  assert.match(html, /id="menuDownloadBtn"[^>]*href="assets\/CardapioMenu\/cardapio-villa-plaza\.pdf"[^>]*download[^>]*aria-label="Baixar PDF"[^>]*title="Baixar PDF"[\s\S]*?<svg/);
  assert.doesNotMatch(html, /menuZoomOut|menuZoomIn|menuFitBtn/);
  assert.doesNotMatch(html, />Tela cheia<|>Baixar PDF</);
});

test('selects local mobile pages without forcing a giant canvas', () => {
  const controller = read('assets/js/menu-flipbook.js');

  assert.match(controller, /MOBILE_PAGE_IMAGES/);
  assert.match(controller, /getPageImagesForViewport/);
  assert.match(controller, /loadFromImages\(getPageImagesForViewport\(\)\)/);
  assert.match(controller, /settings\.minWidth = PAGE_FLIP_OPTIONS\.minWidth/);
  assert.match(controller, /elements\.pages\?\.clientWidth/);
  assert.match(controller, /Math\.floor\(elements\.pages\.clientWidth \/ 2\) \+ 1/);
  assert.doesNotMatch(controller, /minWidth\s*=\s*mobile\s*\?\s*10000/);
  assert.match(controller, /settings\.drawShadow = !mobile/);
  assert.match(controller, /const pixelRatio = mobile[\s\S]*Math\.min\(window\.devicePixelRatio \|\| 1, 3\)/);
  assert.doesNotMatch(controller, /XMLHttpRequest|fetch\([^)]*\.pdf/i);
});

test('supports keyboard, swipe and pinch interactions', () => {
  const controller = read('assets/js/menu-flipbook.js');
  const css = read('assets/css/menu-flipbook.css');

  assert.match(controller, /ArrowRight/);
  assert.match(controller, /ArrowLeft/);
  assert.match(controller, /function getTouchDistance/);
  assert.match(controller, /function bindTouchZoom/);
  assert.match(controller, /touchstart/);
  assert.match(controller, /touchmove/);
  assert.match(controller, /touchend/);
  assert.match(controller, /preventDefault\(\)/);
  assert.match(controller, /mobileScrollSupport: false/);
  assert.match(controller, /swipeDistance: 30/);
  assert.match(css, /#menuFlipbookStage[\s\S]*touch-action:\s*none/);
});

test('uses the Villa Plaza visual system in the isolated flipbook stylesheet', () => {
  const css = read('assets/css/menu-flipbook.css');
  const controller = read('assets/js/menu-flipbook.js');

  assert.match(css, /--vp-wine|#57101D/i);
  assert.match(css, /--wine-gold-accent|#D3B97B/i);
  assert.match(css, /--wine-cream|#F1E6D5/i);
  assert.match(css, /flipbook-header/);
  assert.match(css, /menuFlipbookPages|\.stf__parent/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*\.flipbook-nav[\s\S]*background:\s*rgba\(5, 4, 3, 0\.24\)/);
  assert.match(css, /\.flipbook-nav:hover:not\(:disabled\)[\s\S]*background:\s*rgba\(5, 4, 3, 0\.32\)/);
  assert.match(controller, /LOCAL_PAGE_IMAGES/);
  assert.match(controller, /loadFromImages\(getPageImagesForViewport\(\)\)/);
  assert.match(controller, /devicePixelRatio/);
  assert.match(controller, /flipNext/);
  assert.match(controller, /flipPrev/);
  assert.match(controller, /turnToPage/);
});

test('uses the entire mobile viewport without reserving side gutters for navigation', () => {
  const css = read('assets/css/menu-flipbook.css');

  assert.match(css, /@media \(max-width: 820px\)[\s\S]*#menuModal\.menu-modal-overlay\s*\{[\s\S]*width:\s*100vw[\s\S]*height:\s*100dvh/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*#menuModal \.menu-modal-card\s*\{[\s\S]*width:\s*100vw[\s\S]*height:\s*100dvh/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*#menuFlipbookPages,[\s\S]*#menuFlipbookPages\.stf__parent\s*\{[\s\S]*width:\s*100%/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*#menuFlipbookPages,[\s\S]*#menuFlipbookPages\.stf__parent\s*\{[\s\S]*aspect-ratio:\s*1862\s*\/\s*2632/);
  assert.doesNotMatch(css, /@media \(max-width: 820px\)[\s\S]*width:\s*calc\(100% - 3\.1rem\)/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*\.flipbook-nav-prev\s*\{\s*left:\s*0\.3rem/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*\.flipbook-nav-next\s*\{\s*right:\s*0\.3rem/);
});

test('keeps the footer year current automatically', () => {
  const html = read('index.html');
  const currentYearScript = read('assets/js/current-year.js');

  assert.match(html, /©\s*<span[^>]*data-current-year[^>]*>2026<\/span>\s*Villa Plaza/);
  assert.match(html, /assets\/js\/current-year\.js\?v=20260815_v1/);
  assert.doesNotMatch(html, /©\s*2024\s+Villa Plaza/);
  assert.match(currentYearScript, /new Date\(\)\.getFullYear\(\)/);
  assert.match(currentYearScript, /querySelector\(['"]\[data-current-year\]['"]\)/);
});
