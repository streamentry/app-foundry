/** Manual upgrade for the generic Idea Lab app *when installed under the same OS app ID*.
 * Legacy data had just a single paid/used hours pair, no period, clients or immutable ledger.
 * We reconstruct one-day historical snapshots; we NEVER invent ongoing contracts.
 * The original key is left untouched, and invalid fractional minutes are rejected.
 */
import { makeAgreement, makeLine, validateLedger,
  type LedgerRecord } from './domain.ts';
export const LEGACY_KEY='foundry.idea.freelance-retainer-hours.v1';

function decimalHoursToMinutes(value:unknown,allowZero=false):number{
  if(typeof value!=='string'||!/^\d{1,4}(?:\.\d{1,4})?$/.test(value.trim()))
    throw new RangeError('Invalid legacy hours value');
  const raw=value.trim();
  const [major,decimal='']=raw.split('.');
  const base=Number(major)*60;
  const units=decimal?Number(decimal)*60/(10**decimal.length):0;
  const result=base+units;
  if(!Number.isSafeInteger(result)||result>600000||(!allowZero&&result<=0))
    throw new RangeError('Legacy value is not an exact whole-minute duration');
  return result;
}
function parts(min:number):{hours:string;minutes:string}{
  return {hours:String(Math.floor(min/60)),minutes:String(min%60)};
}
export function previewLegacy(raw:string):LedgerRecord[]{
  if(raw.length>2_000_000)throw new RangeError('Old records too large');
  let unknown:unknown;
  try{unknown=JSON.parse(raw);}catch{throw new TypeError('Could not read old JSON');}
  if(!unknown||typeof unknown!=='object'||Array.isArray(unknown))
    throw new TypeError('Old data is not an object');
  const env=unknown as Record<string,unknown>;
  if(env.version!==1||!Array.isArray(env.records)||env.records.length>5000)
    throw new TypeError('Unsupported old data format');
  const result:LedgerRecord[]=[];
  for(const rawRecord of env.records){
    if(!rawRecord||typeof rawRecord!=='object')throw new TypeError('Invalid old record');
    const old=rawRecord as Record<string,unknown>;
    if(typeof old.id!=='string'||!/^[a-zA-Z0-9_-]{1,85}$/.test(old.id)||
      typeof old.createdAt!=='string'||!Number.isFinite(Date.parse(old.createdAt))||
      !old.values||typeof old.values!=='object'||Array.isArray(old.values))
      throw new TypeError('Invalid old ID or values');
    const values=old.values as Record<string,unknown>;
    const paid=decimalHoursToMinutes(values.paidHours);
    const used=decimalHoursToMinutes(values.usedHours,true);
    if(typeof values.client!=='string'||!values.client.trim())
      throw new TypeError('Missing legacy client');
    const created=new Date(old.createdAt);
    const date=[created.getFullYear(),String(created.getMonth()+1).padStart(2,'0'),
      String(created.getDate()).padStart(2,'0')].join('-');
    const agreement=makeAgreement({
      client:values.client,project:'Legacy one-day snapshot',
      from:date,to:date,...parts(paid),
      note:'Imported from generic retainer calculator. This was a one-day paid/used snapshot, not evidence of a contract term.',
    },'legacy_a_'+old.id,old.createdAt,'archived');
    result.push(agreement);
    if(used>0){
      const line=makeLine({day:date,action:'work',...parts(used),
        description:'Hours reported by the old calculator; actual work dates unknown.'},
        {...agreement,state:'open'},'legacy_w_'+old.id,old.createdAt);
      result.push(line);
    }
  }
  return validateLedger(result);
}
export function appendLegacy(existing:readonly LedgerRecord[],incoming:readonly LedgerRecord[]):LedgerRecord[]{
  const ids=new Set(existing.map(item=>item.id));
  return validateLedger([...existing,...incoming.filter(item=>!ids.has(item.id))]);
}
