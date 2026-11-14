/** Explicitly opt-in upgrade path for v1 generic idea prototype records.
 * Legacy denominations were USD-like 100/50/20/10/5/1, with no currency field.
 * Import them as USD ONLY after showing this assumption to the user.
 * We never delete or edit the original on-device data.
 */
import { makeSession, type CloseSession } from './domain.ts';

export const LEGACY_STORAGE_KEY = 'foundry.idea.cash-float-count.v1';

type RawRecord = { id?: unknown; createdAt?: unknown; values?: unknown };
export function legacySessions(raw: string): CloseSession[] {
  if (raw.length > 2_000_000) throw new RangeError('Old data is too large');
  let parsed: unknown;
  try { parsed=JSON.parse(raw); } catch { throw new TypeError('Could not read old data'); }
  if (!parsed || typeof parsed!=='object') throw new TypeError('Wrong old data format');
  const env=parsed as Record<string,unknown>;
  if (env.version!==1 || !Array.isArray(env.records) || env.records.length>10000)
    throw new TypeError('Unsupported old data schema');
  const output:CloseSession[]=[];
  const seen=new Set<string>();
  const oldKeys:[string,string][]=[
    ['hundreds','n10000'],['fifties','n5000'],['twenties','n2000'],
    ['tens','n1000'],['fives','n500'],['ones','n100'],
  ];
  for(const rawEntry of env.records as RawRecord[]){
    if(!rawEntry || typeof rawEntry!=='object' || !rawEntry.values || typeof rawEntry.values!=='object')
      throw new TypeError('Invalid legacy count');
    const values=rawEntry.values as Record<string,unknown>;
    if(typeof rawEntry.id!=='string' || !/^[a-zA-Z0-9_-]{1,88}$/.test(rawEntry.id) ||
       typeof rawEntry.createdAt!=='string' || !Number.isFinite(Date.parse(rawEntry.createdAt)))
      throw new TypeError('Invalid legacy record ID or timestamp');
    const id='legacy_'+rawEntry.id;
    if(seen.has(id))throw new TypeError('Duplicate legacy count ID');
    seen.add(id);
    const date=new Date(rawEntry.createdAt);
    const local=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
    const counts:Record<string,number>={};
    for(const [oldKey,newKey] of oldKeys){
      const original=values[oldKey];
      if(original===undefined || original===null || original==='')continue;
      if(typeof original!=='string' || !/^\d{1,5}$/.test(original))throw new TypeError('Invalid old '+oldKey);
      counts[newKey]=Number(original);
    }
    const label=typeof values.label==='string'?values.label.slice(0,72):'';
    const session=makeSession({
      businessDay:local,currency:'USD',drawer:label,counts,
      expectedInput:'',otherInput:'',
      note:'Imported from the earlier generic prototype. Values treated as USD; verify before using.',
    },id,rawEntry.createdAt);
    output.push({...session,source:'legacy-import'});
  }
  return output;
}
export function appendLegacy(existing:readonly CloseSession[], imported:readonly CloseSession[]):CloseSession[]{
  const ids=new Set(existing.map(s=>s.id));
  return [...imported.filter(s=>!ids.has(s.id)),...existing];
}
