import { isDayKey } from '@foundry/mobile-kit/dates';
export interface Medication { id: string; name: string; time: string; loggedDays: string[] }
export function makeMedication(id: string, name: string, time: string): Medication {
  const title=name.trim();
  if (!title || title.length > 70) throw new RangeError('Medicine name must have 1–70 characters.');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new RangeError('Invalid time');
  return { id, name:title, time, loggedDays:[] };
}
export function isLogged(med: Medication, day: string): boolean { return med.loggedDays.includes(day); }
export function toggleLog(med: Medication, day: string): Medication {
  if (!isDayKey(day)) throw new RangeError('Invalid day');
  return {...med, loggedDays: isLogged(med,day) ? med.loggedDays.filter((d)=>d!==day) : [...med.loggedDays,day].sort()};
}
export function dueToday(items: readonly Medication[], day: string): Medication[] { return [...items].filter((m)=>!isLogged(m,day)).sort((a,b)=>a.time.localeCompare(b.time)); }
