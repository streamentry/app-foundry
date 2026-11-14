import assert from 'node:assert/strict';import{test}from'node:test';
import{makeMoment,daysUntil,timeline}from'../src/domain.ts';
test('events support future and past days',()=>{const a=makeMoment('a','Trip','2027-01-01'),b=makeMoment('b','Past','2026-01-01');assert.equal(daysUntil(a,'2026-12-31'),1);assert.deepEqual(timeline([b,a],'2026-12-31').map(x=>x.id),['a','b']);assert.throws(()=>makeMoment('c','','2027-01-01'));});
