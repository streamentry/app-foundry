import assert from 'node:assert/strict';import{test}from'node:test';
import{makeTreatment,recordGiven,undoLast,treatmentRemaining}from'../src/domain.ts';
test('logs treatment with pet identity and supports undo',()=>{const a=makeTreatment('a','Milo','Care plan','2026-11-14',30);const b=recordGiven(a,'2026-11-16');assert.equal(treatmentRemaining(b,'2026-11-16'),30);assert.equal(undoLast(b).dueOn,a.dueOn);assert.equal(recordGiven(b,'2026-11-16').history.length,1);assert.throws(()=>makeTreatment('b','','Care','2026-11-14',1));});
