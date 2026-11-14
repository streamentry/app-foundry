import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const read=(path)=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const root=read('package.json');
assert.deepEqual(root.workspaces,['apps/*','apps/ideas/*','packages/*']);

const products=['shift-calendar','countdown-widget','medication-checklist','baby-feeding-log','plant-watering','pet-medication','mileage-log','warranty-tracker','cleaning-schedule','elderly-routine'];
const ids=new Set();
for(const id of products){
  const pkg=read('apps/'+id+'/package.json');
  const app=read('apps/'+id+'/app.json');
  assert.equal(pkg.name,'@foundry/'+id);
  assert.equal(pkg.main,'expo-router/entry');
  assert.ok(pkg.dependencies['@foundry/design-system']);
  assert.ok(existsSync(new URL('../apps/'+id+'/app/index.tsx',import.meta.url)));
  ids.add(app.expo.ios.bundleIdentifier);
}
assert.equal(ids.size,products.length,'Ten existing apps must keep distinct iOS identifiers');
const ideas=read('docs/ideas/ideas.json').ideas;
assert.equal(ideas.length,100);
assert.ok(existsSync(new URL('../packages/idea-engine/src/specs.ts',import.meta.url)));
assert.equal(read('apps/idea-lab/package.json').name,'@foundry/idea-lab');
assert.equal(read('apps/starter/package.json').main,'expo-router/entry');
console.log('Architecture verified: ten original apps, 100 independent research MVPs and Idea Lab.');
