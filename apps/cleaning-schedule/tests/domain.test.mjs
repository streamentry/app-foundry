import assert from 'node:assert/strict';import{test}from'node:test';
import{makeChore,nextChore,daysUntilChore,completeChore,undoChore}from'../src/domain.ts';
test('completion is optional and reversible without streaks',()=>{const c=makeChore('a','Kitchen',7,'2026-11-14');assert.equal(nextChore(c),'2026-11-14');const d=completeChore(c,'2026-11-14');assert.equal(daysUntilChore(d,'2026-11-15'),6);assert.equal(undoChore(d,'2026-11-14').doneOn.length,0);assert.throws(()=>makeChore('a','Kitchen',0,'2026-11-14'));});
