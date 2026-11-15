/** Invoice reference sequence ledger. This does NOT issue legal invoices, taxes, or signed audit trails.
 * Records are locally append-only events. No invoice number can be silently recycled.
 */
export const STORE_KEY='invoice-reference-ledger.v1';
export const MAX_ORDINAL=9_999_999;
export const MAX_RECORDS=10_000;
export const BACKUP_ID='invoice-number-ledger';
export type Action='reserve'|'issue'|'void'|'import_issue'|'import_void';
export type ReferenceStatus='reserved'|'issued'|'void';
export interface InvoiceSeries{
  schema:1; kind:'series'; id:string; createdAt:string;
  label:string; code:string; start:number; width:number; archived:boolean;
}
export interface InvoiceEvent{
  schema:1; kind:'event'; id:string; createdAt:string;
  seriesId:string; ordinal:number; action:Action; day:string;
  client:string; note:string;
}
export type LedgerRecord=InvoiceSeries|InvoiceEvent;
export interface SeriesInput{label:string;code:string;start:string;width:string;}
export interface EventInput{
  seriesId:string;ordinal:number;action:Action;day:string;client:string;note:string;
}
export interface Reference{
  seriesId:string;ordinal:number;formatted:string;status:ReferenceStatus;
  client:string;lastDay:string;lastNote:string;events:InvoiceEvent[];
}
export interface GapRange{first:number;last:number;}
export interface SeriesSummary{
  total:number;reserved:number;issued:number;voided:number;
  unaccounted:number;gaps:GapRange[];next:number|null;
}
const idValid=(value:string)=>/^[a-zA-Z0-9_-]{1,100}$/.test(value);
export function validDay(day:string):boolean{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
  const [y,m,d]=day.split('-').map(Number);
  if(!y||y<1900||y>2100)return false;
  return new Date(Date.UTC(y,m!-1,d!)).toISOString().slice(0,10)===day;
}
export function todayKey(date:Date=new Date()):string{
  if(!Number.isFinite(date.getTime()))throw new RangeError('Invalid date');
  return [String(date.getFullYear()).padStart(4,'0'),
    String(date.getMonth()+1).padStart(2,'0'),
    String(date.getDate()).padStart(2,'0')].join('-');
}
function validIso(input:string):boolean{
  if(typeof input!=='string'||!Number.isFinite(Date.parse(input)))return false;
  return new Date(input).toISOString()===input;
}
function textField(value:unknown,max:number,label:string,required=false):string{
  if(typeof value!=='string')throw new TypeError(label+' must be text');
  const cleaned=value.trim();
  if(cleaned.length>max||(required&&!cleaned)||[...cleaned].some(ch=>{
    const n=ch.charCodeAt(0);return n<=8||n===11||(n>=14&&n<=31);
  }))throw new RangeError('Invalid '+label);
  return cleaned;
}
function positiveInteger(value:string,label:string,min:number,max:number):number{
  if(typeof value!=='string'||!/^\d{1,8}$/.test(value.trim()))
    throw new RangeError('Enter '+label+' as a whole number');
  const parsed=Number(value.trim());
  if(!Number.isSafeInteger(parsed)||parsed<min||parsed>max)
    throw new RangeError(label+' must be '+min+'–'+max);
  return parsed;
}
function checkIdAndTime(id:string,createdAt:string){
  if(!idValid(id)||!validIso(createdAt))throw new TypeError('Invalid record ID or timestamp');
}
export const emptySeries=():SeriesInput=>({
  label:'',code:'INV-'+todayKey().slice(0,4)+'-',start:'1',width:'4',
});
export function createSeries(input:SeriesInput,id:string,
  createdAt:string=new Date().toISOString(),archived=false):InvoiceSeries{
  checkIdAndTime(id,createdAt);
  const label=textField(input.label,72,'series name',true);
  const code=textField(input.code,18,'series prefix',true).toUpperCase();
  // The final hyphen separates the prefix from an all-digit counter, so distinct
  // prefixes cannot accidentally render identical complete reference numbers.
  if(!/^[A-Z][A-Z0-9-]{0,16}-$/.test(code))
    throw new RangeError('Prefix must start with a letter, contain A–Z/0–9/hyphens and end with -');
  if(typeof archived!=='boolean')throw new TypeError('Invalid archived state');
  return {schema:1,kind:'series',id,createdAt,label,code,
    start:positiveInteger(input.start,'starting number',1,MAX_ORDINAL),
    width:positiveInteger(input.width,'digit padding',1,8),archived};
}
export function createEvent(input:EventInput,id:string,
  createdAt:string=new Date().toISOString()):InvoiceEvent{
  checkIdAndTime(id,createdAt);
  if(!idValid(input.seriesId))throw new TypeError('Invalid series ID');
  if(!Number.isSafeInteger(input.ordinal)||input.ordinal<1||input.ordinal>MAX_ORDINAL)
    throw new RangeError('Invalid reference number');
  if(!(['reserve','issue','void','import_issue','import_void'] as string[]).includes(input.action))
    throw new RangeError('Invalid reference action');
  if(!validDay(input.day))throw new RangeError('Invalid calendar date');
  const client=textField(input.client,96,'client');
  const note=textField(input.note,500,'event note',
    input.action==='void'||input.action==='import_void'||input.action==='import_issue');
  return {schema:1,kind:'event',id,createdAt,seriesId:input.seriesId,
    ordinal:input.ordinal,action:input.action,day:input.day,client,note};
}
export function formatReference(series:InvoiceSeries,ordinal:number):string{
  if(!Number.isSafeInteger(ordinal)||ordinal<series.start||ordinal>MAX_ORDINAL)
    throw new RangeError('Reference is outside this series');
  return series.code+String(ordinal).padStart(series.width,'0');
}
export function validateRecord(raw:unknown):LedgerRecord{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Invalid stored record');
  const r=raw as Record<string,unknown>;
  if(r.schema!==1||typeof r.id!=='string'||typeof r.createdAt!=='string')
    throw new TypeError('Unsupported record schema');
  if(r.kind==='series'){
    if(typeof r.label!=='string'||typeof r.code!=='string'||
      typeof r.start!=='number'||!Number.isSafeInteger(r.start)||
      typeof r.width!=='number'||!Number.isSafeInteger(r.width)||
      typeof r.archived!=='boolean')throw new TypeError('Invalid series properties');
    return createSeries({label:r.label,code:r.code,start:String(r.start),
      width:String(r.width)},r.id,r.createdAt,r.archived);
  }
  if(r.kind==='event'){
    if(typeof r.seriesId!=='string'||typeof r.ordinal!=='number'||
      !Number.isSafeInteger(r.ordinal)||typeof r.action!=='string'||
      typeof r.day!=='string'||typeof r.client!=='string'||
      typeof r.note!=='string')throw new TypeError('Invalid invoice reference event');
    return createEvent({seriesId:r.seriesId,ordinal:r.ordinal,action:r.action as Action,
      day:r.day,client:r.client,note:r.note},r.id,r.createdAt);
  }
  throw new TypeError('Unknown record type');
}
export function validateLedger(raw:readonly unknown[]):LedgerRecord[]{
  if(!Array.isArray(raw)||raw.length>MAX_RECORDS)throw new RangeError('Ledger too large');
  const rows=raw.map(validateRecord);
  const ids=new Set<string>(),codes=new Set<string>(),bySeries=new Map<string,InvoiceSeries>();
  for(const row of rows){
    if(ids.has(row.id))throw new TypeError('Duplicate record ID');
    ids.add(row.id);
    if(row.kind==='series'){
      if(codes.has(row.code))throw new TypeError('Duplicate series prefix');
      codes.add(row.code);bySeries.set(row.id,row);
    }
  }
  const states=new Map<string,ReferenceStatus>();
  for(const row of rows){
    if(row.kind!=='event')continue;
    const series=bySeries.get(row.seriesId);
    if(!series)throw new TypeError('Event has no series');
    if(row.ordinal<series.start)throw new RangeError('Event below the series start');
    const key=row.seriesId+'/'+row.ordinal;
    const state=states.get(key);
    if(row.action==='reserve'||row.action==='import_issue'||row.action==='import_void'){
      if(state)throw new TypeError('Number already allocated; cannot reuse or import twice');
      states.set(key,row.action==='reserve'?'reserved':row.action==='import_issue'?'issued':'void');
    }else if(row.action==='issue'||row.action==='void'){
      if(state!=='reserved')throw new TypeError('Only reserved numbers may be issued or voided');
      states.set(key,row.action==='issue'?'issued':'void');
    }
  }
  return rows;
}
export function seriesOf(records:readonly LedgerRecord[]):InvoiceSeries[]{
  return records.filter((x):x is InvoiceSeries=>x.kind==='series')
    .sort((a,b)=>Number(a.archived)-Number(b.archived)||a.code.localeCompare(b.code));
}
export function referencesOf(records:readonly LedgerRecord[],series:InvoiceSeries):Reference[]{
  const items=new Map<number,Reference>();
  for(const row of records){
    if(row.kind!=='event'||row.seriesId!==series.id)continue;
    const present=items.get(row.ordinal);
    if(!present){
      items.set(row.ordinal,{
        seriesId:row.seriesId,ordinal:row.ordinal,formatted:formatReference(series,row.ordinal),
        status:row.action==='reserve'?'reserved':row.action==='import_issue'?'issued':'void',
        client:row.client,lastDay:row.day,lastNote:row.note,events:[row],
      });
    }else{
      present.events.push(row);
      present.status=row.action==='issue'?'issued':'void';
      present.client=row.client||present.client;
      present.lastDay=row.day;
      present.lastNote=row.note;
    }
  }
  return [...items.values()].sort((a,b)=>b.ordinal-a.ordinal);
}
export function gapsOf(series:InvoiceSeries,refs:readonly Reference[]):GapRange[]{
  const sorted=[...new Set(refs.map(x=>x.ordinal))].sort((a,b)=>a-b);
  const gaps:GapRange[]=[];
  let expected=series.start;
  for(const n of sorted){
    if(n>expected)gaps.push({first:expected,last:n-1});
    if(n>=expected)expected=n+1;
  }
  return gaps;
}
export function summaryOf(series:InvoiceSeries,refs:readonly Reference[]):SeriesSummary{
  const gaps=gapsOf(series,refs);
  const maximum=refs.reduce((v,x)=>Math.max(v,x.ordinal),series.start-1);
  return {total:refs.length,reserved:refs.filter(x=>x.status==='reserved').length,
    issued:refs.filter(x=>x.status==='issued').length,
    voided:refs.filter(x=>x.status==='void').length,
    unaccounted:gaps.reduce((sum,g)=>sum+g.last-g.first+1,0),
    gaps,next:maximum>=MAX_ORDINAL?null:maximum+1};
}
function findSeries(rows:readonly LedgerRecord[],id:string):InvoiceSeries{
  const item=rows.find(x=>x.kind==='series'&&x.id===id) as InvoiceSeries|undefined;
  if(!item)throw new TypeError('Series not found');
  if(item.archived)throw new RangeError('This series is archived');
  return item;
}
function appendEvent(rows:readonly LedgerRecord[],event:InvoiceEvent):LedgerRecord[]{
  return validateLedger([...rows,event]);
}
/** These commands must run inside ONE serialized store.change transaction. */
export function reserveNext(rows:readonly LedgerRecord[],seriesId:string,eventId:string,
  day:string=todayKey(),at:string=new Date().toISOString()):{rows:LedgerRecord[];ordinal:number}{
  const safe=validateLedger(rows),series=findSeries(safe,seriesId);
  const ordinal=summaryOf(series,referencesOf(safe,series)).next;
  if(ordinal===null)throw new RangeError('This series reached the counter limit');
  const event=createEvent({seriesId,ordinal,action:'reserve',day,client:'',note:''},eventId,at);
  return {rows:appendEvent(safe,event),ordinal};
}
export function recordExisting(rows:readonly LedgerRecord[],seriesId:string,
  ordinal:number,status:'issued'|'void',client:string,note:string,eventId:string,
  day:string=todayKey(),at:string=new Date().toISOString()):LedgerRecord[]{
  const safe=validateLedger(rows),series=findSeries(safe,seriesId);
  formatReference(series,ordinal);
  const event=createEvent({seriesId,ordinal,action:status==='issued'?'import_issue':'import_void',
    day,client,note},eventId,at);
  return appendEvent(safe,event);
}
export function resolveReserved(rows:readonly LedgerRecord[],seriesId:string,
  ordinal:number,action:'issue'|'void',client:string,note:string,eventId:string,
  day:string=todayKey(),at:string=new Date().toISOString()):LedgerRecord[]{
  const safe=validateLedger(rows),series=findSeries(safe,seriesId);
  formatReference(series,ordinal);
  const event=createEvent({seriesId,ordinal,action,day,client,note},eventId,at);
  return appendEvent(safe,event);
}
export function archiveSeries(rows:readonly LedgerRecord[],seriesId:string,archived:boolean):LedgerRecord[]{
  const clean=validateLedger(rows);
  if(!clean.some(x=>x.kind==='series'&&x.id===seriesId))throw new TypeError('Series not found');
  return validateLedger(clean.map(x=>x.kind==='series'&&x.id===seriesId?
    {...x,archived}:x));
}
export const csvField=(value:string|number):string=>{
  const raw=String(value);
  const escaped=/^\s*[=+\-@\t\r\n]/.test(raw)?"'"+raw:raw;
  return '"'+escaped.replace(/"/g,'""')+'"';
};
export function exportCsv(rows:readonly LedgerRecord[]):string{
  const clean=validateLedger(rows);
  const cols=['Series','Invoice reference','Ordinal','Event','Date','Client',
    'Note','Recorded at','Event ID'];
  const seriesMap=new Map(seriesOf(clean).map(x=>[x.id,x]));
  const out:(string|number)[][]=[cols];
  for(const row of clean){
    if(row.kind!=='event')continue;
    const series=seriesMap.get(row.seriesId)!;
    out.push([series.label,formatReference(series,row.ordinal),row.ordinal,row.action,
      row.day,row.client,row.note,row.createdAt,row.id]);
  }
  return '\uFEFF'+out.map(r=>r.map(csvField).join(',')).join('\r\n')+'\r\n';
}
export function exportBackup(rows:readonly LedgerRecord[],
  exportedAt:string=new Date().toISOString()):string{
  if(!validIso(exportedAt))throw new RangeError('Invalid export timestamp');
  return JSON.stringify({schema:1,product:BACKUP_ID,exportedAt,
    records:validateLedger(rows)},null,2);
}
export function importBackup(raw:string):LedgerRecord[]{
  if(raw.length>2_000_000)throw new RangeError('Backup exceeds size limit');
  let value:unknown;
  try{value=JSON.parse(raw);}catch{throw new TypeError('Backup is not valid JSON');}
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Invalid backup root');
  const input=value as Record<string,unknown>;
  if(input.schema!==1||input.product!==BACKUP_ID||
    typeof input.exportedAt!=='string'||!validIso(input.exportedAt)||
    !Array.isArray(input.records))throw new TypeError('Wrong app or unsupported backup');
  return validateLedger(input.records);
}
