import assert from 'node:assert/strict';import{test}from'node:test';
import{makeMedication,toggleLog,isLogged,dueToday}from'../src/domain.ts';
test('records are explicit per calendar day and reversible',()=>{const med=makeMedication('1','Vitamin D','08:00');let m=toggleLog(med,'2026-11-14');assert.equal(isLogged(m,'2026-11-14'),true);assert.equal(dueToday([m],'2026-11-14').length,0);m=toggleLog(m,'2026-11-14');assert.equal(isLogged(m,'2026-11-14'),false);assert.throws(()=>makeMedication('1','X','99:99'));});
