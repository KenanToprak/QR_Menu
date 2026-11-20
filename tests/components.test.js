import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformWithEsbuild } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');
const require = createRequire(import.meta.url);

const reactPathUrl = pathToFileURL(require.resolve('react')).href;
const jsxRuntimePathUrl = pathToFileURL(require.resolve('react/jsx-runtime')).href;

async function compileSrcToTempDir(baseUrl) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qr-menu-test-'));
  fs.mkdirSync(path.join(tempDir, 'components'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'utils'), { recursive: true });

  const relativeFiles = [
    'utils/assets.js',
    'data.js',
    'components/Header.jsx',
    'components/CategoryMenu.jsx',
    'components/MenuItem.jsx',
    'components/Modal.jsx',
    'components/ErrorBoundary.jsx',
    'App.jsx',
  ];

  for (const relFile of relativeFiles) {
    const absInput = path.join(srcRoot, relFile);
    const source = fs.readFileSync(absInput, 'utf8');
    const loader = relFile.endsWith('.jsx') ? 'jsx' : 'js';

    const result = await transformWithEsbuild(source, absInput, {
      loader,
      jsx: 'automatic',
      format: 'esm',
      define: {
        'import.meta.env.BASE_URL': JSON.stringify(baseUrl),
        'import.meta.env': JSON.stringify({ BASE_URL: baseUrl }),
      },
    });

    const rewrittenCode = result.code
      .replace(/from\s+["']react\/jsx-runtime["']/g, `from "${jsxRuntimePathUrl}"`)
      .replace(/from\s+["']react["']/g, `from "${reactPathUrl}"`)
      .replace(/(\.\.?\/[^"']+)\.jsx(["'])/g, '$1.mjs$2')
      .replace(/(\.\.?\/[^"']+)\.js(["'])/g, '$1.mjs$2');

    const outRel = relFile.replace(/\.(jsx|js)$/, '.mjs');
    fs.writeFileSync(path.join(tempDir, outRel), rewrittenCode, 'utf8');
  }

  return tempDir;
}

describe('QR_Menu components with Vite BASE_URL="/QR_Menu/"', () => {
  let tempDir;
  let Header;
  let CategoryMenu;
  let MenuItem;
  let Modal;
  let ErrorBoundary;
  let App;
  let menuData;

  before(async () => {
    tempDir = await compileSrcToTempDir('/QR_Menu/');
    const importTemp = (rel) => import(pathToFileURL(path.join(tempDir, rel)).href);

    ({ menuData } = await importTemp('data.mjs'));
    Header = (await importTemp('components/Header.mjs')).default;
    CategoryMenu = (await importTemp('components/CategoryMenu.mjs')).default;
    MenuItem = (await importTemp('components/MenuItem.mjs')).default;
    Modal = (await importTemp('components/Modal.mjs')).default;
    ErrorBoundary = (await importTemp('components/ErrorBoundary.mjs')).default;
    App = (await importTemp('App.mjs')).default;
  });

  after(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('Header renders logo under /QR_Menu/images/ with Turkish alt text', () => {
    const html = renderToStaticMarkup(createElement(Header));
    assert.ok(html.includes('src="/QR_Menu/images/restaurant_logo.jpg"'), html);
    assert.ok(!html.includes('src="/images/'), html);
    assert.ok(html.includes('alt="Restoran Logosu"'), html);
    assert.ok(html.includes('<h1 class="restaurant-name">QR MENU</h1>'), html);
  });

  it('CategoryMenu renders semantic <nav>, button types, and aria-current on active category', () => {
    const html = renderToStaticMarkup(
      createElement(CategoryMenu, {
        categories: menuData,
        activeCategory: 'soguk',
        onSelectCategory: () => {},
      })
    );
    assert.ok(html.startsWith('<nav class="category-menu-container" aria-label="Menü kategorileri">'), html);
    assert.ok(html.includes('type="button"'), html);
    assert.ok(html.includes('class="category-button active" aria-current="true"'), html);
    assert.equal((html.match(/aria-current="true"/g) || []).length, 1);
  });

  it('MenuItem renders native button element with lazy-loaded image', () => {
    const sampleItem = menuData[0].items[0];
    const html = renderToStaticMarkup(
      createElement(MenuItem, { item: sampleItem, onClick: () => {} })
    );
    assert.ok(html.startsWith('<button type="button" class="menu-item">'), html);
    assert.ok(html.includes('loading="lazy"'), html);
    assert.ok(html.includes('src="/QR_Menu/images/hot_drink.jpg"'), html);
    assert.ok(html.includes(sampleItem.name), html);
    assert.ok(html.includes(sampleItem.price), html);
  });

  it('Modal renders null when item is falsy and accessible dialog when item is present', () => {
    const emptyHtml = renderToStaticMarkup(
      createElement(Modal, { item: null, onClose: () => {} })
    );
    assert.equal(emptyHtml, '');

    const sampleItem = menuData[2].items[0];
    const html = renderToStaticMarkup(
      createElement(Modal, { item: sampleItem, onClose: () => {} })
    );
    assert.ok(html.includes('role="dialog"'), html);
    assert.ok(html.includes('aria-modal="true"'), html);
    assert.ok(html.includes('aria-labelledby="modal-title"'), html);
    assert.ok(html.includes('type="button" class="modal-close"'), html);
    assert.ok(html.includes('id="modal-title"'), html);
    assert.ok(html.includes(sampleItem.name), html);
    assert.ok(html.includes(sampleItem.price), html);
  });

  it('ErrorBoundary renders children normally and renders Turkish alert fallback on error state', () => {
    const okHtml = renderToStaticMarkup(
      createElement(ErrorBoundary, null, createElement('span', null, 'Menü Hazır'))
    );
    assert.equal(okHtml, '<span>Menü Hazır</span>');

    assert.deepEqual(ErrorBoundary.getDerivedStateFromError(new Error('boom')), { hasError: true });
    const instance = new ErrorBoundary({ children: null });
    instance.state = { hasError: true };
    const fallbackHtml = renderToStaticMarkup(instance.render());
    assert.ok(fallbackHtml.includes('role="alert"'), fallbackHtml);
    assert.ok(fallbackHtml.includes('Bir şeyler ters gitti'), fallbackHtml);
    assert.ok(fallbackHtml.includes('Sayfayı Yenile'), fallbackHtml);
  });

  it('App renders all categories and prefixes every image URL with /QR_Menu/', () => {
    const html = renderToStaticMarkup(createElement(App));
    assert.ok(html.includes('id="sicak"'), html);
    assert.ok(html.includes('id="soguk"'), html);
    assert.ok(html.includes('id="fastfood"'), html);

    const imgSrcMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(imgSrcMatches.length, 10); // 1 logo + 9 menu items
    for (const src of imgSrcMatches) {
      assert.ok(src.startsWith('/QR_Menu/images/'), `Unexpected image src: ${src}`);
    }
    assert.ok(!html.includes('src="/images/'), 'Found unprefixed /images/ src in rendered App');
  });
});
