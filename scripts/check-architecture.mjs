import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const root = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const app = JSON.parse(readFileSync(new URL('../apps/starter/package.json', import.meta.url), 'utf8'));
assert.deepEqual(root.workspaces, ['apps/*', 'packages/*']);
assert.equal(app.main, 'expo-router/entry');
assert.ok(app.dependencies['@foundry/core']);
console.log('Architecture contract OK');
