import assert from 'node:assert/strict';import{test}from'node:test';
import{makeEntry,recentEntries,latestOf}from'../src/domain.ts';
test('journal groups only the last 24 hours without making health claims',()=>{const now=new Date('2026-11-14T14:00:00Z');const a=makeEntry('a','feed','2026-11-14T13:00:00Z');const b=makeEntry('b','diaper','2026-11-13T12:00:00Z');assert.deepEqual(recentEntries([b,a],now).map(e=>e.id),['a']);assert.equal(latestOf([b,a],'diaper')?.id,'b');assert.throws(()=>makeEntry('c','sleep','2026-11-14T00:00:00Z'));});
