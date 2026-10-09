import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => fs.readFileSync(path.join(rootDir, relPath), 'utf8');

test('hero video assets exist with optimized formats (WebM, MP4, WebP poster)', () => {
  const assets = [
    'assets/hero/hero-video-desktop.webm',
    'assets/hero/hero-video-desktop.mp4',
    'assets/hero/hero-video-desktop-poster.webp',
    'assets/hero/hero-video-mobile.webm',
    'assets/hero/hero-video-mobile.mp4',
    'assets/hero/hero-video-mobile-poster.webp',
  ];

  for (const relPath of assets) {
    const fullPath = path.join(rootDir, relPath);
    assert.ok(fs.existsSync(fullPath), `Asset file ${relPath} should exist`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 1000, `Asset file ${relPath} should have valid size`);
  }
});

test('index.html structure includes responsive desktop and mobile hero video elements with webm and mp4 sources', () => {
  const html = read('index.html');

  assert.match(html, /id="heroVideoDesktop"[^>]*class="[^"]*hero-video--desktop/);
  assert.match(html, /id="heroVideoMobile"[^>]*class="[^"]*hero-video--mobile/);

  assert.match(html, /poster="assets\/hero\/hero-video-desktop-poster\.webp"/);
  assert.match(html, /poster="assets\/hero\/hero-video-mobile-poster\.webp"/);

  assert.match(html, /source\s+src="assets\/hero\/hero-video-desktop\.webm"\s+type="video\/webm"/);
  assert.match(html, /source\s+src="assets\/hero\/hero-video-desktop\.mp4"\s+type="video\/mp4"/);
  assert.match(html, /source\s+src="assets\/hero\/hero-video-mobile\.webm"\s+type="video\/webm"/);
  assert.match(html, /source\s+src="assets\/hero\/hero-video-mobile\.mp4"\s+type="video\/mp4"/);

  assert.doesNotMatch(html, /hero-video-villa-plaza\.mp4/);
});

test('style.css defines responsive switching between desktop and mobile hero videos', () => {
  const css = read('style.css');

  assert.match(css, /\.hero-video--desktop\s*\{[^}]*display:\s*block/);
  assert.match(css, /\.hero-video--mobile\s*\{[^}]*display:\s*none/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*\.hero-video--desktop\s*\{[^}]*display:\s*none/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*\.hero-video--mobile\s*\{[^}]*display:\s*block/);
});

test('index.html scripts manage responsive hero video playback and loop sync', () => {
  const html = read('index.html');

  assert.match(html, /const heroVideoDesktop = document\.getElementById\('heroVideoDesktop'\);/);
  assert.match(html, /const heroVideoMobile = document\.getElementById\('heroVideoMobile'\);/);
  assert.match(html, /syncHeroVideoPlayback/);
  assert.match(html, /resetHeroLogoAnim/);
});
