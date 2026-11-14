import { ideaSpecs } from './specs.ts';
import type { IdeaSpec, Entry, FieldSpec } from './types';

export { ideaSpecs };
export type { IdeaSpec, Entry, FieldSpec };

export function findSpec(slug: string): IdeaSpec | undefined {
  return ideaSpecs.find((idea) => idea.slug === slug);
}

export function validDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y,m,d] = value.split('-').map(Number);
  if (!y || y < 1900 || y > 2100) return false;
  const actual = new Date(Date.UTC(y,m!-1,d!));
  return !Number.isNaN(actual.getTime()) && actual.toISOString().slice(0,10) === value;
}

export function todayKey(date: Date = new Date()): string {
  if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid date');
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}

export function daysBetween(start: string, end: string): number {
  if (!validDay(start) || !validDay(end)) throw new RangeError('Invalid calendar date');
  return Math.round((Date.parse(end+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/86400000);
}

export function numberOrThrow(value: string, label: string, nonNegative = false): number {
  const v=value.trim();
  if (!v) throw new RangeError(label+' is required');
  const n=Number(v);
  if (!Number.isFinite(n) || Math.abs(n)>1e12 || (nonNegative && n<0))
    throw new RangeError('Enter a valid '+label.toLowerCase()+' (numeric, in range)');
  return n;
}

function timeMinutes(time: string): number {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new RangeError('Expected 24-hour HH:mm');
  const [h,m]=time.split(':').map(Number);
  return h!*60+m!;
}

export function validateSpec(spec: IdeaSpec): void {
  if (!/^[a-z0-9-]+$/.test(spec.slug)||!/^\d{3}$/.test(spec.id)) throw new RangeError('Bad ID or slug');
  if (spec.fields.length<2||spec.fields.length>10) throw new RangeError('Wrong number of fields: '+spec.slug);
  const seen=new Set<string>();
  for(const field of spec.fields){
    if(seen.has(field.key)||!/^[a-z][a-zA-Z0-9]*$/.test(field.key))throw new RangeError('Bad field key: '+spec.slug);
    seen.add(field.key);
    if(field.type==='choice' && (!field.options||field.options.length<2))throw new RangeError('Choice needs options: '+spec.slug);
  }
  if(!spec.cta.trim()||!spec.job.trim()||!spec.icp.trim())throw new RangeError('Missing product promise: '+spec.slug);
  const required:Record<string,readonly string[]>={
    rounding:['clockIn','clockOut','interval'],
    cash:['hundreds','fifties','twenties','tens','fives','ones'],
    shortage:['ordered','received'],
    commission:['amount','percent'],
    reorder:['quantity','threshold'],
    area:['length','width'],
    difference: spec.slug==='luggage-weight-check'?['weight','limit']:['paidHours','usedHours'],
    cutlist:['board','cut','quantity'],
    split:['amount','people'],
    progress:['target','amount'],
    'unique:first':[spec.fields[0]!.key],
  };
  for(const key of required[spec.rule]??[])if(!seen.has(key))throw new RangeError('Missing '+key+' for '+spec.slug);
  if(spec.flow==='counter' && spec.rule!=='counterValue')throw new RangeError('Counter needs counter rule');
}

export function cleanValues(spec: IdeaSpec, values: Record<string,string>): Record<string,string> {
  const clean:Record<string,string>={};
  for(const field of spec.fields){
    const raw=values[field.key]??'';
    const value=raw.trim();
    if(field.required&&!value)throw new RangeError(field.label+' is required');
    if(value.length>(field.type==='notes'?500:field.type==='text'?160:50))throw new RangeError(field.label+' is too long');
    if(value){
      if(field.type==='date'&&!validDay(value))throw new RangeError('Invalid '+field.label+' date');
      if(field.type==='time')timeMinutes(value);
      if(field.type==='number'){
        const n=numberOrThrow(value,field.label);
        if (spec.rule==='cash' && (!Number.isInteger(n)||n<0))
          throw new RangeError('Cash denominations require whole non-negative counts');
        if(['quantity','threshold','minutes','board','cut','people','target','interval','paidHours','usedHours'].includes(field.key) && n<0)
          throw new RangeError(field.label+' must be non-negative');
        if(field.key==='percent'&&(n<0||n>100))throw new RangeError('Percentage must be 0–100');
      }
      if(field.type==='choice'&&!field.options?.includes(value))throw new RangeError('Unknown '+field.label+' option');
    }
    clean[field.key]=value;
  }
  // Formula-specific invalid conditions must fail before the record is persisted.
  const draft:Entry={id:'draft',createdAt:new Date(0).toISOString(),values:clean,done:false,count:0};
  calculate(spec,draft);
  return clean;
}

export function makeEntry(spec:IdeaSpec, id:string, values:Record<string,string>, createdAt = new Date().toISOString()):Entry {
  if(!/^[a-zA-Z0-9_-]{1,90}$/.test(id))throw new RangeError('Invalid record identifier');
  if(Number.isNaN(Date.parse(createdAt)))throw new RangeError('Invalid createdAt');
  return {id,createdAt,values:cleanValues(spec,values),done:false,count:0};
}

export function recordLabel(spec:IdeaSpec, entry:Entry):string {
  return entry.values[spec.fields[0]!.key]||'Untitled record';
}

export type Metric={value:number;display:string;label:string};

/** Domain-specific formulas run locally. Never financial, tax, payroll, clinical or legal advice. */
export function calculate(spec:IdeaSpec, entry:Entry):Metric|null {
  const v=entry.values;
  const get=(key:string)=>numberOrThrow(v[key]??'',key);
  const m=(value:number,label:string,unit='')=>{
    if(!Number.isFinite(value)||Math.abs(value)>1e12)throw new RangeError('Calculation overflow');
    return {value,display:(Math.round(value*100)/100).toLocaleString('en-US',{maximumFractionDigits:2})+unit,label};
  };
  switch(spec.rule){
    case 'none':case 'unique:first':return null;
    case 'counterValue':return m(entry.count,'Current count');
    case 'rounding':{
      const interval=get('interval');if(![5,10,15,30].includes(interval))throw new RangeError('Unsupported rounding interval');
      const start=timeMinutes(v.clockIn??'');const end=timeMinutes(v.clockOut??'');
      const duration=((end-start)+1440)%1440;
      if(duration===0)throw new RangeError('Start and end must differ');
      const round=(minutes:number)=>Math.round(minutes/interval)*interval;
      // Calculate actual and rounded absolute durations, allowing an overnight end.
      const rounded=round(end<=start?end+1440:end)-round(start);
      return m(rounded-duration,'Difference in rounded minutes',' min');
    }
    case 'cash':{
      const denominations:[string,number][]=[['hundreds',100],['fifties',50],['twenties',20],['tens',10],['fives',5],['ones',1]];
      return m(denominations.reduce((sum,[key,value])=>sum+get(key)*value,0),'Drawer total (denomination units)');
    }
    case 'shortage':return m(Math.max(0,get('ordered')-get('received')),'Units missing');
    case 'commission':return m(get('amount')*get('percent')/100,'Calculated commission');
    case 'reorder':return m(Math.max(0,get('threshold')-get('quantity')),'Units to reorder');
    case 'area':return m(get('length')*get('width')/10000,'Area',' m²');
    case 'change':return m(get('reading'),'Meter reading');
    case 'difference':return spec.slug==='luggage-weight-check'
      ?m(get('limit')-get('weight'),'Weight remaining',' kg')
      :m(get('paidHours')-get('usedHours'),'Hours remaining',' h');
    case 'cutlist':return m(get('board')-get('cut')*get('quantity'),'Board length remaining',' mm');
    case 'split':{
      const people=get('people');if(!Number.isSafeInteger(people)||people<1||people>10000)throw new RangeError('Number of people must be a whole positive number');
      return m(get('amount')/people,'Equal share per person');
    }
    case 'progress':{
      const target=get('target');if(target<=0)throw new RangeError('Target must be positive');
      return m(get('amount')/target*100,'Goal progress','%');
    }
    case 'sum':{
      const field=spec.fields.find(f=>f.type==='number');
      if(!field || !v[field.key]?.trim())return null;
      return m(get(field.key),field.label);
    }
  }
}

export function ensureUnique(spec:IdeaSpec,entry:Entry,existing:readonly Entry[]):void{
  if(spec.rule!=='unique:first')return;
  const key=spec.fields[0]!.key;
  const value=(entry.values[key]??'').toLocaleLowerCase('en-US');
  if(existing.some(r=>r.id!==entry.id&&(r.values[key]??'').toLocaleLowerCase('en-US')===value))
    throw new RangeError('This '+spec.fields[0]!.label.toLowerCase()+' is already recorded');
}

export function toggleDone(entry:Entry):Entry{return {...entry,done:!entry.done};}
export function increment(entry:Entry,delta:number):Entry{
  if(!Number.isSafeInteger(delta)||Math.abs(delta)>1000)throw new RangeError('Invalid change');
  const next=entry.count+delta;
  if(next<0||next>1000000)throw new RangeError('Count must be 0–1,000,000');
  return {...entry,count:next};
}

export function leadingDate(spec:IdeaSpec,entry:Entry):string|null{
  const date=spec.fields.find(f=>f.type==='date');
  const value=date?entry.values[date.key]:null;
  return value&&validDay(value)?value:null;
}

export function sortedEntries(spec:IdeaSpec, entries:readonly Entry[]):Entry[]{
  const sorted=[...entries];
  if(spec.flow==='timeline')return sorted.sort((a,b)=>(leadingDate(spec,a)??'9999').localeCompare(leadingDate(spec,b)??'9999'));
  return sorted.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}

export interface Summary {main:string; label:string; secondary:string; outstanding:number}
export function summarize(spec:IdeaSpec, entries:readonly Entry[], today:string):Summary {
  const total=entries.length;
  const outstanding=entries.filter(e=>!e.done).length;
  const count=entries.reduce((sum,e)=>sum+e.count,0);
  const measured=entries.map(e=>calculate(spec,e)).filter((x):x is Metric=>x!==null);
  const sum=measured.reduce((s,m)=>s+m.value,0);
  if(spec.flow==='counter')return {main:String(count),label:'Count recorded',secondary:total+' active counters',outstanding};
  if(spec.flow==='checklist'||spec.flow==='handoff'||spec.flow==='flashcard'){
    return {main:String(total-outstanding)+' / '+total,label:'Checked off',secondary:outstanding+' remaining',outstanding};
  }
  if(spec.flow==='ledger')return {main:Math.round(sum*100)/100+'',label:'Recorded total',secondary:total+' entries',outstanding};
  if(spec.flow==='session')return {main:Math.round(sum)+'',label:'Minutes recorded',secondary:total+' sessions',outstanding};
  if(spec.flow==='calculator'||spec.flow==='progress'){
    const mostRecent=sortedEntries(spec,entries)[0];
    const latest=mostRecent?calculate(spec,mostRecent):null;
    return {main:latest?.display??'—',label:latest?.label??'Your next calculation',secondary:total+' saved calculations',outstanding};
  }
  if(spec.flow==='timeline'){
    const next=sortedEntries(spec,entries).find(e=>{
      const d=leadingDate(spec,e);return d && daysBetween(today,d)>=0&&!e.done;
    });
    const d=next?leadingDate(spec,next):null;
    return {main:d?String(daysBetween(today,d)):'—',label:d?'Days until next date':'No upcoming dates',secondary:total+' items',outstanding};
  }
  if(spec.flow==='inventory'){
    const under=entries.filter(e=>{
      const quantity=Number(e.values.quantity??'0');
      const threshold=e.values.threshold?Number(e.values.threshold):0;
      return threshold>0 && quantity<threshold;
    }).length;
    return {main:String(total),label:'Items tracked',secondary:under+' below threshold',outstanding};
  }
  if(spec.flow==='measure'){
    const latest=sortedEntries(spec,entries)[0];
    const field=spec.fields.find(f=>f.type==='number');
    const value=latest&&field?latest.values[field.key]:null;
    return {main:value??'—',label:field?'Latest '+field.label:'Latest reading',secondary:total+' measurements',outstanding};
  }
  return {main:String(total),label:'Records saved',secondary:'Private on this device',outstanding};
}

function csvCell(value:string):string{
  const cleaned=/^\s*[=+\-@\t\r]/.test(value)?"'"+value:value;
  return '"'+cleaned.replace(/"/g,'""')+'"';
}

export function toCSV(spec:IdeaSpec,entries:readonly Entry[]):string{
  const fields=spec.fields.map(f=>f.label);
  const headings=['Record ID','Created at',...fields,'Done','Count'];
  const lines=sortedEntries(spec,entries).map(entry=>{
    const row=[entry.id,entry.createdAt,...spec.fields.map(f=>entry.values[f.key]??''),String(entry.done),String(entry.count)];
    return row.map(csvCell).join(',');
  });
  return '\uFEFF'+headings.map(csvCell).join(',')+'\r\n'+lines.join('\r\n')+'\r\n';
}

/** Validate imports before allowing a user to restore data; no unsafe auto-merge. */
export function validateBackup(spec:IdeaSpec,payload:unknown):Entry[]{
  if(!payload||typeof payload!=='object')throw new TypeError('Invalid backup');
  const obj=payload as Record<string,unknown>;
  if(obj.schema!==1||obj.slug!==spec.slug||!Array.isArray(obj.entries))throw new TypeError('Backup is for a different app or format');
  if(obj.entries.length>10000)throw new RangeError('Backup too large');
  const seen=new Set<string>();const output:Entry[]=[];
  for(const item of obj.entries){
    if(!item||typeof item!=='object')throw new TypeError('Invalid record in backup');
    const row=item as Record<string,unknown>;
    if(typeof row.id!=='string'||typeof row.createdAt!=='string'||!row.values||typeof row.values!=='object'||typeof row.done!=='boolean'||typeof row.count!=='number'||!Number.isSafeInteger(row.count)||row.count<0||row.count>1000000)
      throw new TypeError('Invalid backup record');
    const values=row.values as Record<string,unknown>;
    if(Object.values(values).some(v=>typeof v!=='string'))throw new TypeError('Invalid backup field');
    if(seen.has(row.id))throw new TypeError('Duplicate backup record');
    seen.add(row.id);
    const clean=makeEntry(spec,row.id,values as Record<string,string>,row.createdAt);
    ensureUnique(spec,clean,output);
    output.push({...clean,done:row.done as boolean,count:row.count as number});
  }
  return output;
}

export function toBackup(spec:IdeaSpec,entries:readonly Entry[]):string{
  return JSON.stringify({schema:1,slug:spec.slug,exportedAt:new Date().toISOString(),entries},null,2);
}
