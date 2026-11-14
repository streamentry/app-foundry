import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { join } from 'node:path';

const load = (path) => JSON.parse(readFileSync(path, 'utf8'));
const data = load('docs/ideas/ideas.json');
assert.equal(data.ideas.length, 100);
assert.equal(new Set(data.ideas.map(x => x.slug)).size, 100);
assert.equal(new Set(data.ideas.map(x => x.id)).size, 100);

const ios = new Set();
const android = new Set();
for (const idea of data.ideas) {
  const dir = join('apps', 'ideas', idea.slug);
  const pkg = load(join(dir, 'package.json'));
  const config = load(join(dir, 'app.json'));
  const screen = readFileSync(join(dir, 'app', 'index.tsx'), 'utf8');
  assert.equal(pkg.name, '@foundry/idea-' + idea.slug);
  assert.equal(pkg.main, 'expo-router/entry');
  assert.equal(pkg.dependencies['@foundry/idea-engine'], '0.1.0');
  assert.ok(!pkg.scripts.publish, 'Prototype must not publish automatically: ' + idea.slug);
  assert.ok(config.expo.ios.bundleIdentifier.endsWith('.i' + idea.id));
  assert.ok(config.expo.android.package.endsWith('.i' + idea.id));
  if (idea.slug === 'cash-float-count') {
    // First product promoted from the generic idea renderer to its own researched workflow.
    assert.ok(screen.includes('<CashCloseApp'), 'Promoted cash close screen is missing');
    assert.ok(existsSync(join(dir, 'src', 'domain.ts')));
    assert.ok(existsSync(join(dir, 'tests', 'domain.test.mjs')));
  } else if (idea.slug === 'freelance-retainer-hours') {
    // Promoted retainer ledger; customer-specific UI, minute-exact domain, native JS export.
    assert.ok(screen.includes('<RetainerHoursApp'), 'Retainer UI entrypoint missing');
    assert.ok(existsSync(join(dir, 'src', 'domain.ts')));
    assert.ok(existsSync(join(dir, 'src', 'RetainerHoursApp.tsx')));
    assert.ok(existsSync(join(dir, 'tests', 'domain.test.mjs')));
  } else {
    assert.ok(screen.includes('<IdeaApp slug="' + idea.slug + '"'));
  }
  assert.ok(existsSync(join(dir, 'app', '_layout.tsx')));
  assert.ok(existsSync(join(dir, 'tsconfig.json')));
  assert.ok(existsSync(join(dir, 'README.md')));
  ios.add(config.expo.ios.bundleIdentifier);
  android.add(config.expo.android.package);
}
assert.equal(ios.size, 100);
assert.equal(android.size, 100);
const root = load('package.json');
assert.deepEqual(root.workspaces, ['apps/*', 'apps/ideas/*', 'packages/*']);
assert.equal(load('apps/idea-lab/package.json').name, '@foundry/idea-lab');
console.log('Verified 100 unique offline Expo projects with valid identifiers and entrypoints.');
