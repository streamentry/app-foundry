import assert from 'node:assert/strict';import{test}from'node:test';
import{makePlant,nextWater,daysToWater,water}from'../src/domain.ts';
test('care intervals update only when recorded',()=>{const a=makePlant('a','Fern',7,'2026-11-14');assert.equal(nextWater(a),'2026-11-21');assert.equal(daysToWater(a,'2026-11-22'),-1);const b=water(a,'2026-11-22');assert.equal(nextWater(b),'2026-11-29');assert.equal(water(b,'2026-11-22').history.length,2);assert.throws(()=>makePlant('a','Fern',0,'2026-11-14'));});
