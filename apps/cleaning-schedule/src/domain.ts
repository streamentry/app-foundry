import { addDays, daysBetween, isDayKey } from '@foundry/mobile-kit/dates';
export interface Chore { id:string; title:string; intervalDays:number; startOn:string; doneOn:string[] }
export function makeChore(id:string,title:string,intervalDays:number,startOn:string):Chore {
  if(!title.trim()||title.trim().length>90||!Number.isInteger(intervalDays)||intervalDays<1||intervalDays>365||!isDayKey(startOn))
    throw new RangeError('Enter a chore, interval (1–365 days), and valid date.');
  return {id,title:title.trim(),intervalDays,startOn,doneOn:[]};
}
export function nextChore(chore:Chore):string {
  const last=[...chore.doneOn].sort().at(-1);
  return last?addDays(last,chore.intervalDays):chore.startOn;
}
export function daysUntilChore(chore:Chore,today:string):number {return daysBetween(today,nextChore(chore));}
export function completeChore(chore:Chore,today:string):Chore {
  if(!isDayKey(today))throw new RangeError('Invalid date');
  if(chore.doneOn.includes(today)) return chore;
  return {...chore,doneOn:[...chore.doneOn,today].sort()};
}
export function undoChore(chore:Chore,today:string):Chore {
  return {...chore,doneOn:chore.doneOn.filter((d)=>d!==today)};
}
