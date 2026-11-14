import { daysBetween, isDayKey } from '@foundry/mobile-kit/dates';
export interface Moment { id: string; title: string; day: string }
export function makeMoment(id: string, title: string, day: string): Moment {
  const name = title.trim();
  if (!name || name.length > 70 || !isDayKey(day)) throw new RangeError('Enter an event name (1–70 characters) and a valid date.');
  return { id, title: name, day };
}
export function daysUntil(moment: Moment, today: string): number { return daysBetween(today, moment.day); }
export function timeline(moments: readonly Moment[], today: string): Moment[] {
  return [...moments].sort((a,b) => {
    const da=daysUntil(a,today), db=daysUntil(b,today);
    if (da>=0 && db<0) return -1;
    if (da<0 && db>=0) return 1;
    return da>=0 ? da-db : db-da;
  });
}
