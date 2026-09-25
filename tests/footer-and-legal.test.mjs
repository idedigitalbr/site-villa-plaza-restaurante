import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => fs.readFileSync(path.join(rootDir, relPath), 'utf8');

test('index.html includes the updated 3-part footer bar with IDE Digital and terms link', () => {
  const html = read('index.html');

  assert.match(html, /class="footer-bottom__left"[^>]*>Copyright\s+©\s*<span[^>]*data-current-year[^>]*>2026<\/span>\s*Villa Plaza/);
  assert.match(html, /<a\s+href="termos-e-privacidade\.html"\s+class="footer-bottom__link">Termos\s+&amp;\s+Privacidade<\/a>/);
  assert.match(html, /class="footer-dev"/);
  assert.match(html, /Desenvolvido por:/);
  assert.match(html, /href="https:\/\/digital\.ideinstituto\.com\.br\/"/);
  assert.match(html, /src="assets\/logos\/logo-idedigital\.png(?:\?[^"]*)?"/);
  assert.match(html, /alt="IDE Digital"/);
});

test('style.css defines luxury styling and responsiveness for footer-bottom and footer-dev', () => {
  const css = read('style.css');

  assert.match(css, /\.footer-bottom\s*\{[^}]*background:\s*#FFFFFF/);
  assert.match(css, /\.footer-bottom__inner\s*\{[^}]*grid-template-columns:\s*1fr\s+auto\s+1fr/);
  assert.match(css, /\.footer-bottom__link\s*\{[^}]*color:\s*#000000/);
  assert.match(css, /\.footer-dev\s*\{[^}]*display:\s*inline-flex/);
  assert.match(css, /\.footer-dev-logo\s*\{[^}]*height:\s*18px/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*\.footer-bottom__inner[\s\S]*flex-direction:\s*column/);
});

test('termos-e-privacidade.html is complete and well-structured', () => {
  const html = read('termos-e-privacidade.html');

  assert.match(html, /<title>Termos\s+&amp;\s+Privacidade\s+\|\s+Villa Plaza Restaurante<\/title>/);
  assert.match(html, /Política de Privacidade/);
  assert.match(html, /LGPD/);
  assert.match(html, /Termos e Condições de Uso/);
  assert.match(html, /Av\. Gov\. José Malcher,\s*2388/);
  assert.match(html, /9215-9505/);
  assert.match(html, /assets\/css\/legal\.css/);
  assert.match(html, /id="backToTopBtn"/);
  assert.match(html, /assets\/logos\/logo-idedigital\.png/);
});

test('termos-e-privacidade/index.html provides clean-route redirection', () => {
  const html = read('termos-e-privacidade/index.html');

  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, /url=\.\.\/termos-e-privacidade\.html/);
});

test('assets/logos/logo-idedigital.png is present and valid', () => {
  const logoPath = path.join(rootDir, 'assets/logos/logo-idedigital.png');
  assert.ok(fs.existsSync(logoPath), 'Logo IDE Digital exists');
  const stat = fs.statSync(logoPath);
  assert.ok(stat.size > 1000, 'Logo file has valid size');
});

test('index.html uses gastronomia-buffet-saladas.webp in the lunch showcase slide', () => {
  const html = read('index.html');
  assert.match(html, /assets\/gastronomia\/gastronomia-buffet-saladas\.webp/);
  const imgPath = path.join(rootDir, 'assets/gastronomia/gastronomia-buffet-saladas.webp');
  assert.ok(fs.existsSync(imgPath), 'gastronomia-buffet-saladas.webp exists on disk');
});

test('footer displays updated opening hours (Segunda à sábado) across pages', () => {
  const indexHtml = read('index.html');
  const termosHtml = read('termos-e-privacidade.html');

  for (const html of [indexHtml, termosHtml]) {
    assert.match(html, /<span>Segunda à sábado<\/span>/);
    assert.match(html, /<div class="footer-hours-time">12h às 15h \/ 19h às 23h<\/div>/);
    assert.doesNotMatch(html, /<div class="footer-col footer-col-hours">[\s\S]*?<span>Domingo<\/span>/);
  }
});

