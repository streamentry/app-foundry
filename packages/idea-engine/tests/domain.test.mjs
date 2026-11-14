import assert from 'node:assert/strict';
import {test} from 'node:test';
import {ideaSpecs,findSpec,validDay,makeEntry,validateSpec,calculate,summarize,increment,ensureUnique,toCSV,daysBetween,validateBackup,toBackup} from '../src/domain.ts';

const by=(slug)=>{const spec=findSpec(slug);assert.ok(spec,'missing '+slug);return spec;};
const sample=(spec)=>{
  const v={};
  for(const f of spec.fields){
    if(f.type==='text'||f.type==='notes')v[f.key]='Sample';
    else if(f.type==='date')v[f.key]='2028-02-29';
    else if(f.type==='time')v[f.key]='09:00';
    else if(f.type==='number')v[f.key]=['threshold','target','people','cut','board','ordered','received','percent'].includes(f.key)?'10':'1';
    else if(f.type==='choice')v[f.key]=f.options[0];
  }
  if(spec.rule==='rounding'){v.clockIn='09:07';v.clockOut='17:08';v.interval='15';}
  if(spec.rule==='cash')for(const f of spec.fields)if(f.type==='number')v[f.key]='1';
  if(spec.rule==='cutlist'){v.board='100';v.cut='25';v.quantity='2';}
  return v;
};
test('all 100 specs have unique IDs and valid, distinct job-specific forms',()=>{
  assert.equal(ideaSpecs.length,100);
  assert.equal(new Set(ideaSpecs.map(s=>s.slug)).size,100);
  assert.equal(new Set(ideaSpecs.map(s=>s.id)).size,100);
  assert.ok(new Set(ideaSpecs.map(s=>s.flow)).size>=10);
  for(const spec of ideaSpecs){
    assert.doesNotThrow(()=>validateSpec(spec));
    assert.equal(findSpec(spec.slug),spec);
    const entry=makeEntry(spec,'record_'+spec.id,sample(spec));
    assert.ok(Object.keys(entry.values).length>=2);
    assert.ok(summarize(spec,[entry],'2028-02-28'));
    assert.ok(toCSV(spec,[entry]).startsWith('\uFEFF'));
    assert.deepEqual(validateBackup(spec,JSON.parse(toBackup(spec,[entry]))),[entry]);
    assert.throws(()=>validateBackup(spec,{schema:1,slug:'wrong',entries:[entry]}));
  }
});
test('calendar arithmetic handles leap days and negative countdown',()=>{
  assert.equal(validDay('2028-02-29'),true);
  assert.equal(validDay('2026-02-29'),false);
  assert.equal(daysBetween('2028-02-28','2028-03-01'),2);
  assert.equal(daysBetween('2028-03-01','2028-02-28'),-2);
});
test('cash, commissions, split, cutlist and rounded clocks calculate',()=>{
  const cash=by('cash-float-count');
  assert.equal(calculate(cash,makeEntry(cash,'cash_1',sample(cash)))?.value,186);
  const commission=by('commission-split');
  assert.equal(calculate(commission,makeEntry(commission,'com_1',{...sample(commission),amount:'100',percent:'15'}))?.value,15);
  const split=by('shared-cost-split-offline');
  assert.equal(calculate(split,makeEntry(split,'split_1',{...sample(split),amount:'100',people:'4'}))?.value,25);
  const cutlist=by('woodworking-cutlist');
  assert.equal(calculate(cutlist,makeEntry(cutlist,'cuts_1',sample(cutlist)))?.value,50);
  const round=by('timesheet-rounding');
  assert.equal(calculate(round,makeEntry(round,'round_1',sample(round)))?.value,14);
});
test('record identifiers, formula rules, uniqueness and CSV injection are validated',()=>{
  const invoice=by('invoice-number-ledger');
  const first=makeEntry(invoice,'invoice_1',{...sample(invoice),number:'ABC-001'});
  assert.throws(()=>ensureUnique(invoice,makeEntry(invoice,'invoice_2',{...sample(invoice),number:'abc-001'}),[first]));
  assert.throws(()=>makeEntry(invoice,'bad id',sample(invoice)));
  const csv=toCSV(invoice,[makeEntry(invoice,'invoice_3',{...sample(invoice),number:'=IMPORTXML("evil")'})]);
  assert.ok(csv.includes("'=IMPORTXML"));
  const counter=by('knitting-row-counter');
  const initial=makeEntry(counter,'counter_1',sample(counter));
  assert.equal(increment(initial,1).count,1);
  assert.throws(()=>increment(initial,-1));
  const backup=JSON.parse(toBackup(invoice,[first]));
  backup.entries[0].values.number=5;
  assert.throws(()=>validateBackup(invoice,backup));
});
test('no existing 10 portfolio apps were duplicated',()=>{
const existing=new Set(['shift-calendar','countdown-widget','medication-checklist','baby-feeding-log','plant-watering','pet-medication','mileage-log','warranty-tracker','cleaning-schedule','elderly-routine']);
for(const spec of ideaSpecs)assert.ok(!existing.has(spec.slug),spec.slug);
});

test('optional ledger amounts do not crash summaries or blank records',()=>{
  const spec=by('invoice-number-ledger');
  const values={...sample(spec)};
  delete values.amount;
  const row=makeEntry(spec,'no_amount',values);
  assert.equal(calculate(spec,row),null);
  assert.doesNotThrow(()=>summarize(spec,[row],'2028-02-29'));
  assert.equal(summarize(spec,[row],'2028-02-29').main,'1'); // Register displays record count, not optional amount.
});
test('backup restore rejects duplicate invoice identifiers (case-insensitive)',()=>{
  const spec=by('invoice-number-ledger');
  const first=makeEntry(spec,'invoice_a',{...sample(spec),number:'abc-01'});
  const second=makeEntry(spec,'invoice_b',{...sample(spec),number:'ABC-01'});
  const payload={schema:1,slug:spec.slug,entries:[first,second]};
  assert.throws(()=>validateBackup(spec,payload),/already recorded/);
});
