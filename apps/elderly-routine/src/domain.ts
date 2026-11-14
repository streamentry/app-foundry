import { isDayKey } from '@foundry/mobile-kit/dates';
export interface Routine { id:string; title:string; time:string; completedOn:string[] }
export function makeRoutine(id:string,title:string,time:string):Routine {
  if(!title.trim()||title.trim().length>80||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
    throw new RangeError('Enter a routine name and valid time');
  return {id,title:title.trim(),time,completedOn:[]};
}
export function completedToday(r:Routine,today:string):boolean{return r.completedOn.includes(today);}
export function toggleRoutine(r:Routine,today:string):Routine {
  if(!isDayKey(today)) throw new RangeError('Invalid date');
  return {...r,completedOn: completedToday(r,today)?r.completedOn.filter((d)=>d!==today):[...r.completedOn,today].sort()};
}
export function routinesForDay(items:readonly Routine[],today:string):Routine[]{
  return [...items].sort((a,b)=>Number(completedToday(a,today))-Number(completedToday(b,today))||a.time.localeCompare(b.time));
}
