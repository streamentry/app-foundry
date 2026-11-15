import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MAX_ORDINAL,emptySeries,createSeries,createEvent,formatReference,validateLedger,
  validateRecord,seriesOf,referencesOf,gapsOf,summaryOf,reserveNext,recordExisting,
  resolveReserved,archiveSeries,exportBackup,importBackup,exportCsv,csvField,
  validDay,todayKey,
} from '../src/domain.ts';

const fixedAt='2026-11-15T00:00:00.000Z',day='2026-11-15';
const mk=(id='series_1',input={label:'Consulting',code:'INV-2026-',start:'1',width:'4'})=>
  createSeries(input,id,fixedAt);
const state=(rows,series=rows.find(x=>x.kind==='series'))=>
  ({refs:referencesOf(rows,series),stats:summaryOf(series,referencesOf(rows,series))});
const next=(rows,id)=>reserveNext(rows,'series_1',id,day,fixedAt);

test('series requires separated unique prefixes and safe starting counters',()=>{
  const a=mk();
  assert.equal(formatReference(a,1),'INV-2026-0001');
  assert.equal(formatReference(a,12005),'INV-2026-12005');
  assert.equal(validateRecord(a).code,a.code);
  for(const code of ['INV','1INV-','inv_','INV/','INV=','INV-xxx'])
    assert.throws(()=>mk('s2',{...{label:'A',start:'1',width:'4'},code}));
  assert.throws(()=>mk('s',{label:'',code:'INV-',start:'1',width:'4'}));
  assert.throws(()=>mk('s',{label:'valid',code:'INV-',start:'0',width:'4'}));
  assert.throws(()=>mk('s',{label:'valid',code:'INV-',start:'1',width:'9'}));
  assert.throws(()=>validateLedger([a,mk('other')]),/Duplicate series prefix/);
});
test('the default prefix is visibly annual but rollover is not automatic',()=>{
  const blank=emptySeries();
  assert.ok(/^INV-\d{4}-$/.test(blank.code));
  assert.equal(blank.start,'1');
  assert.equal(blank.width,'4');
});
test('each reserved number is unique and increasing even after void',()=>{
  let rows=[mk()];
  const r1=next(rows,'e1');rows=r1.rows;
  assert.equal(r1.ordinal,1);
  rows=resolveReserved(rows,'series_1',1,'void','','Customer cancelled the draft','e2',day,fixedAt);
  const r2=next(rows,'e3');
  assert.equal(r2.ordinal,2);
  const result=state(r2.rows);
  assert.equal(result.stats.reserved,1);
  assert.equal(result.stats.voided,1);
  assert.equal(result.stats.issued,0);
  assert.equal(result.stats.next,3);
  assert.deepEqual(result.refs.map(x=>x.status),['reserved','void']);
});
test('a reserved number can be issued once; issued and void references cannot be recycled',()=>{
  let rows=next([mk()],'e1').rows;
  rows=resolveReserved(rows,'series_1',1,'issue','Acme','','e2',day,fixedAt);
  assert.equal(state(rows).refs[0].status,'issued');
  assert.equal(state(rows).refs[0].client,'Acme');
  assert.deepEqual(state(rows).refs[0].events.map(e=>e.action),['reserve','issue']);
  assert.throws(()=>resolveReserved(rows,'series_1',1,'void','','Oops','e3',day,fixedAt),/Only reserved/);
  assert.throws(()=>resolveReserved(rows,'series_1',1,'issue','','','e3',day,fixedAt),/Only reserved/);
  assert.throws(()=>recordExisting(rows,'series_1',1,'issued','','External reference','e3',day,fixedAt),/already allocated/);
});
test('import existing external issued reference with explicit provenance and detect gaps',()=>{
  let rows=[mk()];
  rows=recordExisting(rows,'series_1',8,'issued','Builder Co','Manual record, verified outside app','e1',day,fixedAt);
  assert.equal(state(rows).stats.next,9);
  assert.deepEqual(gapsOf(mk(),state(rows).refs),[{first:1,last:7}]);
  assert.equal(state(rows).stats.unaccounted,7);
  assert.equal(state(rows).stats.issued,1);
  rows=recordExisting(rows,'series_1',3,'void','','Voided in old register','e2',day,fixedAt);
  assert.deepEqual(state(rows).stats.gaps,[{first:1,last:2},{first:4,last:7}]);
  assert.equal(state(rows).stats.unaccounted,6);
  assert.equal(state(rows).stats.next,9);
});
test('gap computation is bounded by recorded numbers, not millions of iterations',()=>{
  const a=mk('s',{label:'Large',code:'L-',start:'1',width:'4'});
  const rows=recordExisting([a],a.id,MAX_ORDINAL,'issued','','External register confirmed','e1',day,fixedAt);
  const summary=state(rows,a).stats;
  assert.equal(summary.next,null);
  assert.equal(summary.unaccounted,MAX_ORDINAL-1);
  assert.deepEqual(summary.gaps,[{first:1,last:MAX_ORDINAL-1}]);
  assert.throws(()=>reserveNext(rows,a.id,'e2',day,fixedAt),/limit/);
});
test('manual entry rejects duplicate, below start and missing provenance',()=>{
  const a=mk('s',{label:'Legacy',code:'OLD-',start:'10',width:'4'});
  assert.throws(()=>recordExisting([a],'s',9,'issued','','Old invoice','e1',day,fixedAt),/outside/);
  assert.throws(()=>recordExisting([a],'s',10,'issued','','','e1',day,fixedAt),/note/);
  assert.throws(()=>recordExisting([a],'s',10,'void','','','e1',day,fixedAt),/note/);
  let rows=recordExisting([a],'s',10,'issued','','Verified in old books','e1',day,fixedAt);
  assert.throws(()=>recordExisting(rows,'s',10,'issued','','Verified twice','e2',day,fixedAt),/already allocated/);
  assert.equal(state(rows,a).stats.issued,1);
});
test('archiving preserves history but disables new numbers and transitions',()=>{
  let rows=next([mk()],'e1').rows;
  rows=archiveSeries(rows,'series_1',true);
  assert.equal(state(rows).stats.next,2);
  assert.throws(()=>reserveNext(rows,'series_1','e2',day,fixedAt),/archived/);
  assert.throws(()=>resolveReserved(rows,'series_1',1,'issue','','','e2',day,fixedAt),/archived/);
  rows=archiveSeries(rows,'series_1',false);
  assert.equal(next(rows,'e2').ordinal,2);
});
test('no mutation can remove past issued/void events silently from a valid restored ledger',()=>{
  let rows=next([mk()],'e1').rows;
  rows=resolveReserved(rows,'series_1',1,'issue','','','e2',day,fixedAt);
  assert.throws(()=>validateLedger(rows.filter(r=>r.kind!=='series')),/no series/);
  assert.throws(()=>validateLedger([rows[0],rows[2]]),/Only reserved/);
  assert.throws(()=>validateLedger([...rows,rows[2]]),/Duplicate record ID/);
  assert.throws(()=>validateLedger([rows[0],rows[1],{
    ...rows[2],id:'e3',action:'void',
  }]),/Only reserved/);
});
test('unrelated invoice series never share counters, even with different padding',()=>{
  const a=mk('s1'),b=mk('s2',{label:'Retail',code:'POS-2026-',start:'1',width:'3'});
  const rows=[a,b];
  const v=reserveNext(rows,'s2','e1',day,fixedAt);
  assert.equal(v.ordinal,1);
  assert.equal(summaryOf(a,referencesOf(v.rows,a)).next,1);
  assert.equal(summaryOf(b,referencesOf(v.rows,b)).next,2);
  assert.deepEqual(seriesOf(v.rows).map(x=>x.code),['INV-2026-','POS-2026-']);
});
test('strict dates, schema and controls reject malformed records',()=>{
  assert.equal(validDay('2028-02-29'),true);
  assert.equal(validDay('2026-02-29'),false);
  assert.equal(validDay('2026-11-31'),false);
  assert.equal(todayKey(new Date(2026,10,15)),'2026-11-15');
  const badEvent=createEvent({seriesId:'s',ordinal:2,action:'reserve',day,client:'',note:''},'e1',fixedAt);
  assert.throws(()=>validateLedger([badEvent]),/no series/);
  assert.throws(()=>createEvent({...badEvent,day:'2026-13-01'},'e2',fixedAt),/date/);
  assert.throws(()=>createEvent({...badEvent,client:'x'.repeat(97)},'e2',fixedAt),/client/);
  assert.throws(()=>createEvent({...badEvent,note:'bad\u0002text'},'e2',fixedAt),/note/);
  assert.throws(()=>validateRecord({...mk(),schema:3}),/schema/);
});
test('backup must be from this app and all recorded transitions validate',()=>{
  let rows=next([mk()],'e1').rows;
  rows=resolveReserved(rows,'series_1',1,'issue','Studio','','e2',day,fixedAt);
  const backup=exportBackup(rows,fixedAt);
  assert.deepEqual(importBackup(backup),rows);
  assert.throws(()=>importBackup(backup.replace('invoice-number-ledger','other-app')),/Wrong app/);
  assert.throws(()=>importBackup('invalid'),/JSON/);
  const malformed=JSON.parse(backup);
  malformed.records=[rows[0],rows[2]];
  assert.throws(()=>importBackup(JSON.stringify(malformed)),/Only reserved/);
  malformed.records=[rows[0],rows[1],rows[2],rows[2]];
  assert.throws(()=>importBackup(JSON.stringify(malformed)),/Duplicate record ID/);
});
test('CSV preserves event history with escaped formula injection',()=>{
  const a=mk('s',{label:'=EXCEL',code:'T-',start:'1',width:'4'});
  let rows=reserveNext([a],'s','e1',day,fixedAt).rows;
  rows=resolveReserved(rows,'s',1,'issue','+SUM(1,1)','@click','e2',day,fixedAt);
  const csv=exportCsv(rows);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes("'=EXCEL"));
  assert.ok(csv.includes("'+SUM"));
  assert.ok(csv.includes("'@click"));
  assert.ok(csv.includes('T-0001'));
  assert.equal(csv.split('\r\n').filter(Boolean).length,3);
  assert.equal(csvField('x"y'),'"x""y"');
  assert.equal(csvField('\t=1'),'"\'\t=1"');
});
test('initial start from existing books does not fabricate earlier invoice history',()=>{
  const a=mk('s',{label:'Contractors',code:'CN-2026-',start:'215',width:'5'});
  const result=reserveNext([a],'s','e1',day,fixedAt);
  assert.equal(result.ordinal,215);
  assert.equal(summaryOf(a,referencesOf(result.rows,a)).unaccounted,0);
  assert.equal(formatReference(a,215),'CN-2026-00215');
});
