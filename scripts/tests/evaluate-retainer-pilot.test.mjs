import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluatePilot, SCENARIOS } from '../evaluate-retainer-pilot.mjs';
const empty=JSON.parse(readFileSync('docs/research/retainer-hours/results.json','utf8'));
function observed(i,changes={}){
  const row=empty.participants[i];
  return {...row,observedAt:'2026-11-15T08:00:00.000Z',qualified:true,
    baselineTool:'spreadsheet',baselineSeconds:310,appSeconds:180,
    baselineResultMinutes:SCENARIOS[row.baselineScenario].expectedMinutes,
    appResultMinutes:SCENARIOS[row.appScenario].expectedMinutes,
    appUnassisted:true,statementGenerated:true,secondUseRequested:true,
    commitment:i<2?'trial_scheduled':'none',evidenceNote:i<2?'Confirmed dated second session':'',
    ...changes};
}
function dataset(rows){return {...empty,participants:rows};}
test('unobserved placeholders never count as recruited or validated',()=>{
  assert.equal(evaluatePilot(empty).decision,'NOT_EVALUABLE');
  assert.equal(evaluatePilot(empty).observed,0);
  const rows=empty.participants.map((p,i)=>i===0?observed(i):p);
  assert.equal(evaluatePilot(dataset(rows)).decision,'NOT_EVALUABLE');
  assert.equal(evaluatePilot(dataset(rows)).observed,1);
});
test('scenario answers are exact signed minute balances',()=>{
  assert.equal(SCENARIOS.A.openingMinutes+SCENARIOS.A.extraMinutes-
    SCENARIOS.A.workMinutes.reduce((a,b)=>a+b,0),-45);
  assert.equal(SCENARIOS.B.openingMinutes+SCENARIOS.B.extraMinutes-
    SCENARIOS.B.workMinutes.reduce((a,b)=>a+b,0),65);
});
test('qualified five-person results trigger only a longer trial, not release',()=>{
  const summary=evaluatePilot(dataset(empty.participants.map((_,i)=>observed(i))));
  assert.equal(summary.decision,'GO_TO_LONGER_TRIAL');
  assert.equal(summary.correctUnassisted,5);
  assert.equal(summary.hardCommitment,2);
  assert.equal(summary.medianRelativeGain>0.15,true);
});
test('missing hard commitments or lower unassisted correctness fail',()=>{
  const rows=empty.participants.map((_,i)=>observed(i));
  assert.equal(evaluatePilot(dataset(rows.map(p=>({...p,commitment:'verbal_only'})))).decision,'STOP_OR_NARROW');
  const errors=rows.map((p,i)=>i<2?{...p,appUnassisted:false}:p);
  assert.equal(evaluatePilot(dataset(errors)).decision,'STOP_OR_NARROW');
});
test('slower than baseline with no accuracy advantage is not a go',()=>{
  const rows=empty.participants.map((_,i)=>observed(i,{appSeconds:400}));
  assert.equal(evaluatePilot(dataset(rows)).decision,'STOP_OR_NARROW');
});
test('cannot score invalid IDs, dates, unqualified rows or fake hard commitments',()=>{
  const rows=empty.participants.map((_,i)=>observed(i));
  assert.throws(()=>evaluatePilot(dataset([...rows.slice(0,4),rows[0]])),/unique/);
  assert.throws(()=>evaluatePilot(dataset(rows.map((p,i)=>i===0?{...p,qualified:false}:p))),/invalid or unqualified/);
  assert.throws(()=>evaluatePilot(dataset(rows.map((p,i)=>i===0?{...p,observedAt:'yesterday'}:p))),/invalid or unqualified/);
  assert.throws(()=>evaluatePilot(dataset(rows.map((p,i)=>i===0?{...p,evidenceNote:null}:p))),/evidence note/);
});
test('null and partial slots cannot accidentally pass',()=>{
  const rows=empty.participants.map((_,i)=>observed(i));
  rows[0]={...rows[0],appSeconds:null};
  assert.equal(evaluatePilot(dataset(rows)).decision,'NOT_EVALUABLE');
  assert.equal(evaluatePilot(dataset(rows)).observed,4);
});
