import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveAssetUrl } from '../src/utils/assets.js';
import { menuData } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('resolveAssetUrl', () => {
  it('normalizes leading slashes against root base "/"', () => {
    assert.equal(resolveAssetUrl('images/hot_drink.jpg', '/'), '/images/hot_drink.jpg');
    assert.equal(resolveAssetUrl('/images/hot_drink.jpg', '/'), '/images/hot_drink.jpg');
  });

  it('prefixes subpath base URLs cleanly with or without trailing slash', () => {
    assert.equal(resolveAssetUrl('images/hot_drink.jpg', '/QR_Menu/'), '/QR_Menu/images/hot_drink.jpg');
    assert.equal(resolveAssetUrl('/images/hot_drink.jpg', '/QR_Menu/'), '/QR_Menu/images/hot_drink.jpg');
    assert.equal(resolveAssetUrl('images/cold_drink.jpg', '/QR_Menu'), '/QR_Menu/images/cold_drink.jpg');
  });

  it('returns external and data/blob URLs unchanged', () => {
    assert.equal(resolveAssetUrl('https://example.com/logo.jpg', '/QR_Menu/'), 'https://example.com/logo.jpg');
    assert.equal(resolveAssetUrl('data:image/png;base64,AAA', '/QR_Menu/'), 'data:image/png;base64,AAA');
  });

  it('returns empty string for invalid or empty paths', () => {
    assert.equal(resolveAssetUrl('', '/QR_Menu/'), '');
    assert.equal(resolveAssetUrl(null, '/QR_Menu/'), '');
    assert.equal(resolveAssetUrl(undefined, '/QR_Menu/'), '');
  });
});

describe('menuData integrity', () => {
  it('contains non-empty categories with unique IDs and expected sections', () => {
    assert.ok(Array.isArray(menuData) && menuData.length >= 3);
    const categoryIds = menuData.map((c) => c.id);
    assert.deepEqual(categoryIds, ['sicak', 'soguk', 'fastfood']);
    assert.equal(new Set(categoryIds).size, categoryIds.length);
  });

  it('contains valid menu items with unique IDs, prices in TL, and proper spelling', () => {
    const itemIds = new Set();
    let pizzaFound = false;

    for (const category of menuData) {
      assert.ok(typeof category.category === 'string' && category.category.trim().length > 0);
      assert.ok(Array.isArray(category.items) && category.items.length > 0);

      for (const item of category.items) {
        assert.ok(Number.isInteger(item.id) && item.id > 0);
        assert.ok(!itemIds.has(item.id), `Duplicate item id: ${item.id}`);
        itemIds.add(item.id);

        assert.ok(typeof item.name === 'string' && item.name.trim().length > 0);
        assert.ok(typeof item.description === 'string' && item.description.trim().length > 0);
        assert.match(item.price, /^\d+\s*₺$/);
        assert.ok(typeof item.image === 'string' && item.image.length > 0);
        assert.ok(!item.description.toLowerCase().includes('mozerella'), 'Spelling typo "mozerella" found');

        if (item.name.includes('Pizza')) {
          pizzaFound = true;
          assert.ok(item.description.includes('mozzarella peyniri'));
        }
      }
    }

    assert.equal(itemIds.size, 9);
    assert.ok(pizzaFound, 'Expected Karışık Pizza item in menuData');
  });

  it('references existing JPEG files under public/ for all menu items and restaurant logo', () => {
    const publicDir = path.join(projectRoot, 'public');
    const pathsToVerify = [
      'images/restaurant_logo.jpg',
      ...menuData.flatMap((c) => c.items.map((item) => item.image.replace(/^\/+/, ''))),
    ];

    for (const relPath of pathsToVerify) {
      const fullPath = path.join(publicDir, relPath);
      assert.ok(fs.existsSync(fullPath), `Missing image asset on disk: ${fullPath}`);
      const header = fs.readFileSync(fullPath).subarray(0, 3);
      assert.deepEqual([...header], [0xff, 0xd8, 0xff], `Expected valid JPEG header for ${relPath}`);
    }
  });
});
