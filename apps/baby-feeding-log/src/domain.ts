export type EntryKind = 'feed' | 'diaper';
export interface BabyEntry { id: string; kind: EntryKind; at: string; note: string }
export function makeEntry(id: string, kind: EntryKind, at: string, note = ''): BabyEntry {
  if (kind !== 'feed' && kind !== 'diaper') throw new RangeError('Invalid event type');
  if (!Number.isFinite(Date.parse(at))) throw new RangeError('Invalid event timestamp');
  if (note.trim().length > 120) throw new RangeError('Note is too long');
  return {id,kind,at,note:note.trim()};
}
export function recentEntries(entries: readonly BabyEntry[], now: Date): BabyEntry[] {
  const cutoff=now.getTime()-86400000;
  return [...entries].filter((e)=>{const ms=Date.parse(e.at);return ms<=now.getTime() && ms>=cutoff;})
    .sort((a,b)=>b.at.localeCompare(a.at));
}
export function latestOf(entries: readonly BabyEntry[], kind: EntryKind): BabyEntry | undefined {
  return [...entries].filter((e)=>e.kind===kind).sort((a,b)=>b.at.localeCompare(a.at))[0];
}
