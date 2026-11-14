import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  validDay,localDay,firstOfMonth,daysInMonth,readDuration,displayDuration,splitDuration,
  emptyAgreement,emptyLine,makeAgreement,makeLine,validateRecord,validateLedger,
  balanceOf,periodStatus,agreementsOf,entriesOf,exportCsv,csvCell,exportBackup,
  importBackup,statement,
} from '../src/domain.ts';
import { previewLegacy,appendLegacy } from '../src/legacy.ts';
const from='2026-11-01',to='2026-11-30';
const base={client:'Acme Studio',project:'Site maintenance',from,to,hours:'12',minutes:'30',note:'Ticket-based support'};
const mk=(id='agree_1',extra={})=>makeAgreement({...base,...extra},id,'2026-11-01T09:00:00.000Z');
const line=(agreement,minutes='30',kind='work',id='log_1',day='2026-11-05')=>makeLine(
  {...emptyLine(day,kind),hours:'0',minutes,description:'Investigated login error'},agreement,id,'2026-11-05T09:30:00.000Z');

test('exact minute arithmetic, including 59-minute boundary and guardrails',()=>{
  assert.equal(readDuration('1','30'),90);
  assert.equal(readDuration('0','59'),59);
  assert.equal(readDuration('9999','59'),599999);
  assert.equal(readDuration('0','0',true),0);
  assert.deepEqual(splitDuration(91),{hours:'1',minutes:'31'});
  assert.equal(displayDuration(90),'1h 30m');
  assert.equal(displayDuration(60),'1h');
  assert.equal(displayDuration(-61),'−1h 01m');
  assert.equal(displayDuration(0),'0h');
  for(const [h,m] of [['1.5','0'],['0','60'],['-2','0'],['1','01x'],['1','90'],['10000','1'],['0','0']])
    assert.throws(()=>readDuration(h,m));
});

test('date-only period leap years and month ends do not depend on DST',()=>{
  assert.equal(validDay('2028-02-29'),true);
  assert.equal(validDay('2026-02-29'),false);
  assert.equal(validDay('2026-11-31'),false);
  assert.equal(validDay('2026-12-01'),true);
  assert.equal(daysInMonth('2028-02-15'),'2028-02-29');
  assert.equal(firstOfMonth('2028-02-29'),'2028-02-01');
  assert.equal(localDay(new Date(2026,10,15)),'2026-11-15');
});

test('a retainer has explicit client/project, fixed term and integer opening allowance',()=>{
  const a=mk();
  assert.equal(a.includedMinutes,750);
  assert.equal(a.state,'open');
  assert.deepEqual(validateRecord(a),a);
  assert.throws(()=>mk('a',{client:' '}));
  assert.throws(()=>mk('a',{project:''}));
  assert.throws(()=>mk('a',{from:'2026-12-01',to:'2026-11-30'}));
  assert.throws(()=>mk('a',{note:'x'.repeat(501)}));
  assert.throws(()=>mk('a',{hours:'0',minutes:'0'}));
  assert.equal(emptyAgreement('2028-02-15').to,'2028-02-29');
});

test('positive work, explicit topups and overage do not round into currency',()=>{
  const a=mk();
  const work=makeLine({day:'2026-11-12',action:'work',hours:'11',minutes:'15',
    description:'Implemented search'},a,'w1','2026-11-12T12:00:00.000Z');
  const extra=makeLine({day:'2026-11-12',action:'topup',hours:'2',minutes:'0',
    description:'Client-approved additional hours'},a,'t1','2026-11-12T14:00:00.000Z');
  const b=balanceOf(a,[work,extra]);
  assert.deepEqual(b,{committed:750,credited:120,available:870,delivered:675,remaining:195,overage:0,percent:78});
  const second=makeLine({day:'2026-11-22',action:'work',hours:'4',minutes:'0',
    description:'Fix user flow'},a,'w2','2026-11-22T12:00:00.000Z');
  assert.equal(balanceOf(a,[work,extra,second]).remaining,-45);
  assert.equal(balanceOf(a,[work,extra,second]).overage,45);
  assert.equal(periodStatus(a,[work,extra,second],'2026-11-22'),'overdrawn');
});

test('line editing validation forbids crossing period or inserting after archive',()=>{
  const a=mk();
  assert.throws(()=>makeLine({...emptyLine('2026-10-31'),description:'Early'},a,'w1'),/within/);
  assert.throws(()=>makeLine({...emptyLine('2026-12-01'),description:'Late'},a,'w1'),/within/);
  assert.throws(()=>makeLine({...emptyLine('2026-11-01'),description:' '},a,'w1'),/description/);
  assert.throws(()=>makeLine({...emptyLine('2026-11-01'),description:'Known',hours:'0',minutes:'0'},a,'w1'));
  assert.throws(()=>makeLine({...emptyLine('2026-11-01'),description:'Known'}, {...a,state:'archived'},'w1'),/Archived/);
});

test('expired, upcoming, near-limit, archived status is derived from period and remaining minutes',()=>{
  const a=mk('main',{hours:'5',minutes:'0'});
  const work=makeLine({...emptyLine('2026-11-05'),hours:'3',minutes:'30',description:'Work'},a,'w1');
  assert.equal(periodStatus(a,[],'2026-10-31'),'upcoming');
  assert.equal(periodStatus(a,[],'2026-12-01'),'ended');
  assert.equal(periodStatus(a,[work],'2026-11-10'),'in-progress');
  const second=makeLine({...emptyLine('2026-11-05'),hours:'0',minutes:'45',description:'More'},a,'w2');
  assert.equal(periodStatus(a,[work,second],'2026-11-10'),'near-limit');
  assert.equal(periodStatus({...a,state:'archived'},[work,second],'2026-11-10'),'archived');
});

test('collection validation prevents orphan entries, wrong types, IDs, duplicate periods',()=>{
  const a=mk();
  const w=line(a,'30','work');
  assert.deepEqual(validateLedger([w,a]),[w,a]);
  assert.throws(()=>validateLedger([a,a]),/Duplicate record ID/);
  assert.throws(()=>validateLedger([w]),/no agreement/);
  assert.throws(()=>validateLedger([a,{...w,agreementId:'elsewhere'}]),/no agreement/);
  assert.throws(()=>validateLedger([a,mk('new_1')]),/already recorded/);
  assert.throws(()=>validateLedger([a,{...w,minutes:-5}]));
  assert.throws(()=>validateLedger([a,{...w,minutes:0}]));
  assert.throws(()=>validateLedger([a,{...w,day:'2026-12-02'}]),/outside/);
  assert.throws(()=>validateLedger([{...a,schema:2}]));
  assert.throws(()=>validateLedger([{...a,includedMinutes:1.5}]));
});

test('sorted agreements and entries correctly separate different clients',()=>{
  const a=mk('c1'),b=mk('c2',{client:'Baker LLP'});
  const wa=line(a,'30','work','x','2026-11-02');
  const wb=line(b,'40','topup','y','2026-11-20');
  assert.equal(agreementsOf([a,b]).length,2);
  assert.deepEqual(entriesOf([a,b,wa,wb],a.id).map(x=>x.id),['x']);
  assert.throws(()=>balanceOf(a,[wb]),/another/);
});

test('client statement presents date, precise balance, credits and chronological entries',()=>{
  const a=mk();
  const work=makeLine({...emptyLine('2026-11-05'),hours:'2',minutes:'45',
    description:'Database review'},a,'w1');
  const note=statement(a,[work]);
  assert.ok(note.includes('Client: Acme Studio'));
  assert.ok(note.includes('Opening hours: 12h 30m'));
  assert.ok(note.includes('Work logged: 2h 45m'));
  assert.ok(note.includes('Remaining: 9h 45m'));
  assert.ok(note.includes('2026-11-05 | Work | 2h 45m | Database review'));
  assert.ok(note.includes('Verify scope and approvals'));
});

test('backup round trip preserves lines, rejects wrong product and duplicate IDs',()=>{
  const a=mk();const w=line(a,'30','work');
  const raw=exportBackup([a,w],'2026-11-15T09:00:00.000Z');
  assert.deepEqual(importBackup(raw),[a,w]);
  assert.throws(()=>importBackup('not-json'),/JSON/);
  assert.throws(()=>importBackup(raw.replace('retainer-hours-ledger','other-product')),/Wrong app/);
  const payload=JSON.parse(raw);
  payload.records.push(w);
  assert.throws(()=>importBackup(JSON.stringify(payload)),/Duplicate/);
  payload.records=[w];
  assert.throws(()=>importBackup(JSON.stringify(payload)),/no agreement/);
});

test('CSV includes allowances + entries without spreadsheet formula injection',()=>{
  const a=mk('c1',{client:'=HYPERLINK("evil")',project:'@malicious'});
  const w=makeLine({...emptyLine('2026-11-05'),minutes:'1',description:'+SUM(1,2)'},a,'w1');
  const csv=exportCsv([a,w]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes("'=HYPERLINK"));
  assert.ok(csv.includes("'@malicious"));
  assert.ok(csv.includes("'+SUM"));
  assert.ok(csv.includes('"Opening allowance"'));
  assert.equal(csvCell('\t=1'),'"\'\t=1"');
});

test('legacy calculator migration requires exact whole minutes and preserves original meaning',()=>{
  const source={version:1,records:[{
    id:'old_1',createdAt:'2026-11-08T12:00:00.000Z',
    values:{client:'Acme Studio',paidHours:'12.5',usedHours:'4.25'},
  }]};
  const migrated=previewLegacy(JSON.stringify(source));
  assert.equal(migrated.length,2);
  const a=migrated.find(x=>x.kind==='agreement');
  assert.ok(a);
  assert.equal(a.includedMinutes,750);
  assert.equal(a.state,'archived');
  assert.equal(a.note.includes('one-day'),true);
  const w=migrated.find(x=>x.kind==='line');
  assert.ok(w);
  assert.equal(w.minutes,255);
  assert.equal(balanceOf(a,[w]).remaining,495);
  assert.equal(appendLegacy(migrated,migrated).length,2);
  assert.throws(()=>previewLegacy(JSON.stringify({...source,records:[{...source.records[0],
    values:{...source.records[0].values,usedHours:'0.33'}}]})),/exact whole-minute/);
});

test('Hours Left visual design passes WCAG AA text contrast for both modes',()=>{
  const source=readFileSync(new URL('../src/ui.tsx',import.meta.url),'utf8');
  const luminosity=hex=>{
    const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
      .map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  };
  const contrast=(a,b)=>{
    const x=luminosity(a),y=luminosity(b);
    return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  };
  for(const mode of ['DAY','NIGHT']){
    const match=source.match(new RegExp('export const '+mode+':Colors=\\{([\\s\\S]*?)\\};'));
    assert.ok(match,mode+' palette missing');
    const values=Object.fromEntries([...match[1].matchAll(/([a-zA-Z]+):'(#[0-9a-fA-F]{6})'/g)]
      .map(x=>[x[1],x[2]]));
    for(const [a,b] of [['ink','canvas'],['ink','surface'],['muted','canvas'],
      ['muted','surface'],['onPrimary','primary'],['onSoft','soft'],['onWarning','warning']]){
      assert.ok(contrast(values[a],values[b])>=4.5,mode+' text contrast fails '+a+'/'+b);
    }
  }
});
test('new entries require deliberate time input: do not fabricate 30-minute work',()=>{
  const a=mk();
  assert.deepEqual(emptyLine('2026-11-15'),{
    day:'2026-11-15',action:'work',hours:'0',minutes:'0',description:'',
  });
  assert.deepEqual([emptyAgreement('2026-11-15').hours,emptyAgreement('2026-11-15').minutes],['0','0']);
  assert.throws(()=>makeLine({...emptyLine('2026-11-15'),description:'No work'},a,'w0'),/positive/);
});
