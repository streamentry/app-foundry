import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const root = read('package.json');
assert.deepEqual(root.workspaces, ['apps/*', 'packages/*']);

const products = ['shift-calendar','countdown-widget','medication-checklist','baby-feeding-log','plant-watering','pet-medication','mileage-log','warranty-tracker','cleaning-schedule','elderly-routine'];
const ios = new Set();
const android = new Set();
for (const id of products) {
  const pkg = read('apps/' + id + '/package.json');
  const cfg = read('apps/' + id + '/app.json');
  assert.equal(pkg.name, '@foundry/' + id);
  assert.equal(pkg.main, 'expo-router/entry');
  assert.ok(pkg.dependencies['@foundry/design-system']);
  assert.ok(existsSync(new URL('../apps/' + id + '/app/index.tsx', import.meta.url)));
  assert.ok(cfg.expo.ios.bundleIdentifier.endsWith('.dev'));
  assert.ok(cfg.expo.android.package.endsWith('.dev'));
  ios.add(cfg.expo.ios.bundleIdentifier);
  android.add(cfg.expo.android.package);
}
assert.equal(ios.size, products.length, 'Each product needs a unique iOS ID');
assert.equal(android.size, products.length, 'Each product needs a unique Android package');
assert.equal(read('apps/starter/package.json').main, 'expo-router/entry');
console.log('Architecture contract OK: ' + products.length + ' independent products');
