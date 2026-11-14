import { addDays, daysBetween, isDayKey } from '@foundry/mobile-kit/dates';
export interface Treatment { id: string; pet: string; name: string; dueOn: string; intervalDays: number; history: {givenOn:string; previousDueOn:string}[] }
export function makeTreatment(id: string, pet: string, name: string, dueOn: string, intervalDays: number): Treatment {
  if (!pet.trim() || !name.trim() || pet.trim().length>50 || name.trim().length>80 || !isDayKey(dueOn) ||
    !Number.isInteger(intervalDays) || intervalDays<1 || intervalDays>365) throw new RangeError('Enter pet, treatment, date and valid repeat interval');
  return {id,pet:pet.trim(),name:name.trim(),dueOn,intervalDays,history:[]};
}
export function treatmentRemaining(t: Treatment, today: string): number {return daysBetween(today,t.dueOn);}
export function recordGiven(t: Treatment, today: string): Treatment {
  if (!isDayKey(today)) throw new RangeError('Invalid date');
  if (t.history.some((h)=>h.givenOn===today)) return t;
  return {...t, dueOn:addDays(today,t.intervalDays),history:[...t.history,{givenOn:today,previousDueOn:t.dueOn}]};
}
export function undoLast(t: Treatment): Treatment {
  const last=t.history.at(-1);
  if (!last) return t;
  return {...t,dueOn:last.previousDueOn,history:t.history.slice(0,-1)};
}
