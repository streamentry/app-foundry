/** Pure Retainer Hours domain. Exact integer minutes and explicit date-only periods.
 * This is a client-facing recordkeeping aid, not invoicing or legal advice.
 */
export const STORAGE_NAMESPACE = 'retainer-ledger.records';
export const MAX_RECORDS = 10000;
export const MAX_MINUTES = 600000;
export type LineKind = 'work' | 'topup';
export type AgreementState = 'open' | 'archived';
export interface Agreement {
  schema: 1;
  kind: 'agreement';
  id: string;
  createdAt: string;
  client: string;
  project: string;
  from: string;
  to: string;
  includedMinutes: number;
  note: string;
  state: AgreementState;
}
export interface Line {
  schema: 1;
  kind: 'line';
  id: string;
  createdAt: string;
  agreementId: string;
  day: string;
  action: LineKind;
  minutes: number;
  description: string;
}
export type LedgerRecord = Agreement | Line;
export interface AgreementInput {
  client: string; project: string; from: string; to: string;
  hours: string; minutes: string; note: string;
}
export interface LineInput {
  day: string; action: LineKind; hours: string; minutes: string; description: string;
}
export interface Balance {
  committed: number; credited: number; available: number; delivered: number;
  remaining: number; overage: number; percent: number;
}
const validId = (value:string):boolean => /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const validIso = (value:string):boolean => Number.isFinite(Date.parse(value)) &&
  new Date(value).toISOString() === value;
export function validDay(day: string):boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const [year,month,date] = day.split('-').map(Number);
  if (!year || year < 1900 || year > 2100) return false;
  return new Date(Date.UTC(year,month!-1,date!)).toISOString().slice(0,10) === day;
}
export function localDay(value:Date=new Date()):string {
  if (!Number.isFinite(value.getTime())) throw new RangeError('Invalid date');
  return [String(value.getFullYear()).padStart(4,'0'),
    String(value.getMonth()+1).padStart(2,'0'),String(value.getDate()).padStart(2,'0')].join('-');
}
export function daysInMonth(day:string):string {
  if(!validDay(day))throw new RangeError('Invalid date');
  const [y,m]=day.split('-').map(Number);
  const last=new Date(Date.UTC(y!,m!,0)).getUTCDate();
  return [String(y),String(m).padStart(2,'0'),String(last).padStart(2,'0')].join('-');
}
export function firstOfMonth(day:string):string {
  if(!validDay(day))throw new RangeError('Invalid date');
  return day.slice(0,7)+'-01';
}
export function readDuration(hours:string,minutes:string,allowZero=false):number {
  const h=hours.trim(),m=minutes.trim();
  if(!/^\d{1,4}$/.test(h)||!/^\d{1,2}$/.test(m))
    throw new RangeError('Use whole hours and minutes (e.g. 1 h 30 m)');
  const hr=Number(h),min=Number(m);
  if(min>=60 || !Number.isSafeInteger(hr))throw new RangeError('Minutes must be 0–59');
  const total=hr*60+min;
  if(total>MAX_MINUTES || (!allowZero && total===0))
    throw new RangeError('Enter a positive duration no greater than 10,000 hours');
  return total;
}
export function splitDuration(minutes:number):{hours:string;minutes:string}{
  if(!Number.isSafeInteger(minutes)||minutes<0||minutes>MAX_MINUTES)throw new RangeError('Invalid duration');
  return {hours:String(Math.floor(minutes/60)),minutes:String(minutes%60)};
}
export function displayDuration(minutes:number):string {
  if(!Number.isSafeInteger(minutes)||Math.abs(minutes)>MAX_MINUTES*MAX_RECORDS)
    throw new RangeError('Invalid duration');
  const abs=Math.abs(minutes);
  const h=Math.floor(abs/60);
  const m=abs%60;
  return (minutes<0?'−':'')+h+'h'+(m?(' '+String(m).padStart(2,'0')+'m'):'');
}
const safeText=(value:unknown,max:number,label:string,required:boolean):string=>{
  if(typeof value!=='string')throw new TypeError('Invalid '+label);
  const trimmed=value.trim();
  if(trimmed.length>max||(required&&!trimmed))throw new RangeError('Invalid '+label);
  if([...trimmed].some(char=>{const code=char.charCodeAt(0);return code<=8||code===11||(code>=14&&code<=31);}))
    throw new RangeError('Control character in '+label);
  return trimmed;
};
function checkId(id:string,createdAt:string):void {
  if(!validId(id))throw new RangeError('Invalid record ID');
  if(!validIso(createdAt))throw new RangeError('Invalid created timestamp');
}
export function emptyAgreement(day:string=localDay()):AgreementInput {
  return {client:'',project:'',from:firstOfMonth(day),to:daysInMonth(day),
    hours:'0',minutes:'0',note:''};
}
export function emptyLine(day:string=localDay(),action:LineKind='work'):LineInput {
  return {day,action,hours:'0',minutes:'0',description:''};
}
export function makeAgreement(input:AgreementInput,id:string,
  createdAt:string=new Date().toISOString(),state:AgreementState='open'):Agreement {
  checkId(id,createdAt);
  const client=safeText(input.client,80,'client name',true);
  const project=safeText(input.project,96,'project name',true);
  const note=safeText(input.note,500,'agreement note',false);
  if(!validDay(input.from)||!validDay(input.to)||input.from>input.to)
    throw new RangeError('Enter a valid period, start on or before end');
  if(state!=='open'&&state!=='archived')throw new RangeError('Invalid agreement state');
  return {schema:1,kind:'agreement',id,createdAt,client,project,from:input.from,to:input.to,
    includedMinutes:readDuration(input.hours,input.minutes),note,state};
}
export function makeLine(input:LineInput,agreement:Agreement,id:string,
  createdAt:string=new Date().toISOString()):Line {
  checkId(id,createdAt);
  if(input.action!=='work'&&input.action!=='topup')throw new RangeError('Invalid line type');
  if(agreement.state!=='open')throw new RangeError('Archived agreements cannot receive new lines');
  if(!validDay(input.day)||input.day<agreement.from||input.day>agreement.to)
    throw new RangeError('Work/credit date must be within the agreement period');
  const description=safeText(input.description,240,'work or credit description',true);
  return {schema:1,kind:'line',id,createdAt,agreementId:agreement.id,day:input.day,
    action:input.action,minutes:readDuration(input.hours,input.minutes),description};
}
export function validateRecord(raw:unknown):LedgerRecord {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Invalid ledger record');
  const r=raw as Record<string,unknown>;
  if(r.schema!==1||typeof r.id!=='string'||typeof r.createdAt!=='string')
    throw new TypeError('Unsupported ledger record format');
  checkId(r.id,r.createdAt);
  if(r.kind==='agreement'){
    if(typeof r.client!=='string'||typeof r.project!=='string'||typeof r.note!=='string'||
      typeof r.from!=='string'||typeof r.to!=='string'||typeof r.includedMinutes!=='number'||
      !Number.isSafeInteger(r.includedMinutes)||r.includedMinutes<1||
      r.includedMinutes>MAX_MINUTES||(r.state!=='open'&&r.state!=='archived'))
      throw new TypeError('Invalid agreement details');
    // Reconstruct through the same input guards, including text and period validity.
    const time=splitDuration(r.includedMinutes);
    return makeAgreement({...time,client:r.client,project:r.project,
      from:r.from,to:r.to,note:r.note},r.id,r.createdAt,r.state);
  }
  if(r.kind==='line'){
    if(typeof r.agreementId!=='string'||!validId(r.agreementId)||
      typeof r.day!=='string'||!validDay(r.day)||
      (r.action!=='work'&&r.action!=='topup')||
      typeof r.minutes!=='number'||!Number.isSafeInteger(r.minutes)||
      r.minutes<1||r.minutes>MAX_MINUTES||
      typeof r.description!=='string')
      throw new TypeError('Invalid time entry');
    const description=safeText(r.description,240,'description',true);
    return {schema:1,kind:'line',id:r.id,createdAt:r.createdAt,agreementId:r.agreementId,
      day:r.day,action:r.action,minutes:r.minutes,description};
  }
  throw new TypeError('Unknown ledger record type');
}
export function validateLedger(raw:readonly unknown[]):LedgerRecord[] {
  if(!Array.isArray(raw)||raw.length>MAX_RECORDS)throw new RangeError('Invalid ledger record count');
  const records=raw.map(validateRecord);
  const ids=new Set<string>();
  const agreements=new Map<string,Agreement>();
  const names=new Set<string>();
  for(const record of records){
    if(ids.has(record.id))throw new TypeError('Duplicate record ID');
    ids.add(record.id);
    if(record.kind==='agreement'){
      const key=[record.client.toLocaleLowerCase(),record.project.toLocaleLowerCase(),record.from,record.to].join('\u0000');
      if(names.has(key))throw new RangeError('This client/project period is already recorded');
      names.add(key);
      agreements.set(record.id,record);
    }
  }
  for(const record of records){
    if(record.kind!=='line')continue;
    const parent=agreements.get(record.agreementId);
    if(!parent)throw new TypeError('Time entry has no agreement');
    if(record.day<parent.from||record.day>parent.to)
      throw new RangeError('Time entry outside its agreement period');
  }
  return records;
}
export function agreementsOf(records:readonly LedgerRecord[]):Agreement[]{
  return records.filter((r):r is Agreement=>r.kind==='agreement')
    .sort((a,b)=>(a.state===b.state?0:a.state==='open'?-1:1)||
      b.to.localeCompare(a.to)||a.client.localeCompare(b.client));
}
export function entriesOf(records:readonly LedgerRecord[],agreementId:string):Line[]{
  return records.filter((r):r is Line=>r.kind==='line'&&r.agreementId===agreementId)
    .sort((a,b)=>b.day.localeCompare(a.day)||b.createdAt.localeCompare(a.createdAt));
}
export function balanceOf(agreement:Agreement,entries:readonly Line[]):Balance {
  let credited=0,delivered=0;
  for(const item of entries){
    if(item.agreementId!==agreement.id)throw new RangeError('Entry belongs to another agreement');
    if(item.action==='topup')credited+=item.minutes;
    else delivered+=item.minutes;
  }
  const available=agreement.includedMinutes+credited;
  const remaining=available-delivered;
  return {committed:agreement.includedMinutes,credited,available,delivered,
    remaining,overage:Math.max(0,-remaining),
    percent:available>0?Math.min(100,Math.round(delivered*100/available)):100};
}
export function periodStatus(agreement:Agreement,entries:readonly Line[],today:string):
  'archived'|'upcoming'|'ended'|'overdrawn'|'near-limit'|'in-progress' {
  if(!validDay(today))throw new RangeError('Invalid today');
  if(agreement.state==='archived')return 'archived';
  const b=balanceOf(agreement,entries);
  if(b.remaining<0)return 'overdrawn';
  if(today<agreement.from)return 'upcoming';
  if(today>agreement.to)return 'ended';
  if(b.available>0&&b.remaining<=Math.max(60,Math.floor(b.available*0.15)))return 'near-limit';
  return 'in-progress';
}
export const BACKUP_PRODUCT='retainer-hours-ledger';
export function exportBackup(records:readonly LedgerRecord[],exportedAt:string=new Date().toISOString()):string {
  if(!validIso(exportedAt))throw new RangeError('Invalid export timestamp');
  const clean=validateLedger(records);
  return JSON.stringify({schema:1,product:BACKUP_PRODUCT,exportedAt,records:clean},null,2);
}
export function importBackup(raw:string):LedgerRecord[] {
  if(raw.length>2_000_000)throw new RangeError('Backup too large');
  let obj:unknown;
  try{obj=JSON.parse(raw);}catch{throw new TypeError('Backup is not valid JSON');}
  if(!obj||typeof obj!=='object'||Array.isArray(obj))throw new TypeError('Invalid backup');
  const data=obj as Record<string,unknown>;
  if(data.product!==BACKUP_PRODUCT||data.schema!==1||typeof data.exportedAt!=='string'||
    !validIso(data.exportedAt)||!Array.isArray(data.records))
    throw new TypeError('Wrong app or backup format');
  return validateLedger(data.records);
}
export function csvCell(raw:string|number):string {
  const s=String(raw);
  const protect=/^\s*[=+\-@\t\r\n]/.test(s)?"'"+s:s;
  return '"'+protect.replace(/"/g,'""')+'"';
}
export function exportCsv(records:readonly LedgerRecord[]):string {
  const clean=validateLedger(records);
  const headings=['Record kind','Client','Project','Period start','Period end',
    'Entry date','Action','Minutes','Description','ID'];
  const rows:(string|number)[][]=[];
  for(const a of agreementsOf(clean)){
    rows.push(['Agreement',a.client,a.project,a.from,a.to,'','Opening allowance',a.includedMinutes,a.note,a.id]);
    for(const l of [...entriesOf(clean,a.id)].reverse())
      rows.push(['Entry',a.client,a.project,a.from,a.to,l.day,l.action,l.minutes,l.description,l.id]);
  }
  return '\uFEFF'+[headings,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
export function statement(agreement:Agreement,entries:readonly Line[]):string {
  const b=balanceOf(agreement,entries);
  const out=[
    'RETAINER HOURS / CLIENT UPDATE',
    'Client: '+agreement.client,
    'Project: '+agreement.project,
    'Period: '+agreement.from+' to '+agreement.to,
    'Opening hours: '+displayDuration(b.committed),
    'Additional hours recorded (verify client approval): '+displayDuration(b.credited),
    'Work logged: '+displayDuration(b.delivered),
    b.remaining>=0?'Remaining: '+displayDuration(b.remaining):'Overage: '+displayDuration(b.overage),
    '',
    'DATED LEDGER',
  ];
  if(entries.length===0)out.push('No work or credit entries yet.');
  for(const entry of [...entries].sort((a,c)=>a.day.localeCompare(c.day)||a.createdAt.localeCompare(c.createdAt)))
    out.push(entry.day+' | '+(entry.action==='work'?'Work':'Hours added')+' | '+
      displayDuration(entry.minutes)+' | '+entry.description);
  out.push('','Prepared from user-entered records. Verify scope and approvals before sharing.');
  return out.join('\n');
}
