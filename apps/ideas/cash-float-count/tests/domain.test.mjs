import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CURRENCIES, PROFILES, denominations, parseMoney, formatMoney, digitsOnlyQuantity,
  isDay, emptyDraft, makeSession, validateSession, totalMinor, sumCash,
  varianceMinor, reconciliation, draftFromSession, exportBackup,
  importBackup, exportCsv, sortedSessions,
} from '../src/domain.ts';
import {legacySessions,appendLegacy} from '../src/legacy.ts';

const fresh=(currency='USD', extra={})=>({
  ...emptyDraft(currency,'2026-11-15'),drawer:'Front till',...extra,
});
test('four currency profiles have unique denomination keys and stable minor units',()=>{
  assert.deepEqual(CURRENCIES,['USD','VND','SGD','EUR']);
  for(const currency of CURRENCIES){
    const denoms=denominations(currency);
    assert.ok(denoms.length>0);
    assert.equal(new Set(denoms.map(d=>d.id)).size,denoms.length);
    assert.ok(denoms.every(d=>Number.isSafeInteger(d.minor)&&d.minor>0));
    assert.ok(denoms.every(d=>d.kind==='note'||d.kind==='coin'));
  }
  assert.equal(PROFILES.VND.fractionDigits,0);
  assert.equal(PROFILES.EUR.fractionDigits,2);
  assert.ok(denominations('USD').some(d=>d.id==='c1'));
  assert.ok(denominations('VND').some(d=>d.id==='n500000'));
});
test('money parsing is exact in minor units, including decimal comma',()=>{
  assert.equal(parseMoney('1234.56','USD'),123456);
  assert.equal(parseMoney('1234,56','EUR'),123456);
  assert.equal(parseMoney('0.01','USD'),1);
  assert.equal(parseMoney('1.2','SGD'),120);
  assert.equal(parseMoney('500000','VND'),500000);
  assert.equal(parseMoney('0','VND'),0);
  for(const bad of ['','1,234.56','1.234.56','-12','12e2','12.001','0.001','   ']){
    assert.throws(()=>parseMoney(bad,'USD'),bad);
  }
  assert.throws(()=>parseMoney('1000.50','VND'));
  assert.equal(formatMoney(-123456,'USD'),'−$1,234.56');
  assert.equal(formatMoney(500000,'VND'),'500,000 ₫');
  assert.equal(formatMoney(1,'EUR'),'€0.01');
  assert.equal(formatMoney(120,'SGD'),'S$1.20');
});
test('only whole nonnegative safe piece counts are accepted',()=>{
  assert.equal(digitsOnlyQuantity('00025'),25);
  assert.equal(digitsOnlyQuantity('0'),0);
  for(const bad of ['','-1','1.2','2e2','100000','1,000','NaN'])assert.throws(()=>digitsOnlyQuantity(bad));
});
test('business date validation rejects invalid leap dates without timezone drift',()=>{
  assert.equal(isDay('2028-02-29'),true);
  assert.equal(isDay('2026-02-29'),false);
  assert.equal(isDay('2026-13-02'),false);
  assert.equal(isDay('0000-01-01'),false);
});
test('bill and coin arithmetic stays exact at scale and handles other tender',()=>{
  const a=makeSession(fresh('USD',{counts:{n10000:1,n2000:3,c25:3,c1:1},otherInput:'0.14',expectedInput:'160.90'}),'row_1');
  assert.equal(sumCash('USD',a.counts,'note'),16000);
  assert.equal(sumCash('USD',a.counts,'coin'),76);
  assert.equal(totalMinor(a),16090);
  assert.equal(varianceMinor(a),0);
  assert.equal(reconciliation(a).label,'Balanced');
  const over={...a,expectedMinor:16000};
  const under={...a,expectedMinor:17000};
  assert.deepEqual(reconciliation(over),{label:'Over',difference:90});
  assert.deepEqual(reconciliation(under),{label:'Short',difference:-910});
  assert.deepEqual(reconciliation({...a,expectedMinor:null}),{label:'No expectation',difference:null});
});
test('Vietnamese high-value notes and Singapore/Euro coins sum correctly',()=>{
  const vn=makeSession(fresh('VND',{counts:{n500000:4,n200000:3,n100:1},expectedInput:'2600100'}),'vn_1');
  assert.equal(totalMinor(vn),2600100);
  assert.equal(varianceMinor(vn),0);
  const sg=makeSession(fresh('SGD',{counts:{n200:1,c5:1}}),'sg_1');
  assert.equal(totalMinor(sg),205);
  const eu=makeSession(fresh('EUR',{counts:{c200:1,c2:1,c1:1}}),'eu_1');
  assert.equal(totalMinor(eu),203);
});
test('empty drawer is valid, but bad amounts/denominations/fields are not',()=>{
  const empty=makeSession(fresh(),'empty_1');
  assert.equal(totalMinor(empty),0);
  assert.equal(empty.expectedMinor,null);
  assert.equal(makeSession(fresh('USD',{expectedInput:'0'}),'zero_1').expectedMinor,0);
  assert.throws(()=>makeSession(fresh('USD',{counts:{n200000:1}}),'bad_1'),/Unknown denomination/);
  assert.throws(()=>makeSession(fresh('USD',{counts:{n10000:-1}}),'bad_1'),/quantity/);
  assert.throws(()=>makeSession(fresh('USD',{counts:{n10000:1.2}}),'bad_1'),/quantity/);
  assert.throws(()=>makeSession(fresh('USD',{drawer:'x'.repeat(73)}),'bad_1'));
  assert.throws(()=>makeSession(fresh('USD',{expectedInput:'1,234.00'}),'bad_1'));
  assert.throws(()=>makeSession(fresh('USD',{otherInput:'-10'}),'bad_1'));
});
test('edit draft round-trip preserves all money values, including decimal currencies',()=>{
  const orig=makeSession(fresh('EUR',{counts:{n20000:1,c1:1},otherInput:'2.45',expectedInput:'202.46'}),'edit_1','2026-11-15T09:00:00Z');
  const copy=makeSession(draftFromSession(orig),orig.id,orig.createdAt);
  assert.deepEqual(copy,orig);
});
test('backup round-trip validates schema, IDs, types and cross-app data',()=>{
  const row=makeSession(fresh('VND',{counts:{n500000:2}}),'row_1','2026-11-15T09:00:00Z');
  const json=exportBackup([row],'2026-11-15T09:30:00Z');
  assert.deepEqual(importBackup(json),[row]);
  assert.throws(()=>importBackup('broken'),/JSON/);
  assert.throws(()=>importBackup(JSON.stringify({version:1,product:'cash-drawer-closeout',sessions:[row]})));
  assert.throws(()=>importBackup(JSON.stringify({version:2,product:'other',sessions:[row]})));
  assert.throws(()=>importBackup(JSON.stringify({version:2,product:'cash-drawer-closeout',sessions:[row,row]})),/Duplicate/);
  assert.throws(()=>importBackup(JSON.stringify({version:2,product:'cash-drawer-closeout',sessions:[{...row,counts:{n500000:1.5}}]})));
  assert.throws(()=>importBackup(JSON.stringify({version:2,product:'cash-drawer-closeout',sessions:[{...row,note:'x'.repeat(501)}]})));
});
test('CSV is UTF-8 BOM, row-safe and does not combine different currencies',()=>{
  const first=makeSession(fresh('USD',{drawer:'=HYPERLINK("evil")',note:'+SUM(1)'}),'csv_1','2026-11-15T08:00:00Z');
  const second=makeSession(fresh('VND',{counts:{n500000:1}}),'csv_2','2026-11-15T10:00:00Z');
  const content=exportCsv([first,second]);
  assert.ok(content.startsWith('\uFEFF'));
  assert.ok(content.includes("'=HYPERLINK"));
  assert.ok(content.includes("'+SUM"));
  assert.ok(content.includes('"VND"'));
  assert.equal(sortedSessions([first,second])[0]?.id,'csv_2');
});
test('migration requires deliberate USD assumption, keeps originals and skips imported IDs',()=>{
  const old={version:1,records:[{
    id:'old_1',createdAt:'2026-11-15T09:00:00Z',
    values:{label:'Cash close',hundreds:'2',twenties:'3',ones:'4'},
  }]};
  const imported=legacySessions(JSON.stringify(old));
  assert.equal(imported.length,1);
  assert.equal(imported[0]?.currency,'USD');
  assert.equal(imported[0]?.source,'legacy-import');
  assert.equal(totalMinor(imported[0]),26400);
  const original=makeSession(fresh(),'existing_1');
  assert.equal(appendLegacy([original],imported).length,2);
  assert.equal(appendLegacy([original,...imported],imported).length,2);
  assert.throws(()=>legacySessions(JSON.stringify({version:1,records:[old.records[0],old.records[0]]})),/Duplicate/);
  assert.throws(()=>legacySessions(JSON.stringify({version:1,records:[{...old.records[0],values:{hundreds:'-4'}}]})),/Invalid old/);
});
