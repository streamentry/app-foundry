import { isDayKey, csvCell } from '@foundry/mobile-kit/dates';
export interface Trip { id: string; day: string; distanceKm: number; purpose: string }
export type Unit = 'km'|'mi';
const MILES_PER_KM=0.621371192;
export function toKm(value: number, unit:Unit):number {
  if (!Number.isFinite(value)||value<=0||value>100000)throw new RangeError('Enter a positive trip distance.');
  return value*(unit==='mi'?1/MILES_PER_KM:1);
}
export function fromKm(km:number,unit:Unit):number {return km*(unit==='mi'?MILES_PER_KM:1);}
export function makeTrip(id:string,day:string,distance:number,unit:Unit,purpose:string):Trip {
  if(!isDayKey(day)||!purpose.trim()||purpose.trim().length>120)throw new RangeError('Enter a date and trip purpose.');
  return {id,day,distanceKm:toKm(distance,unit),purpose:purpose.trim()};
}
export function totalDistance(trips:readonly Trip[],unit:Unit):number {
  return Math.round(fromKm(trips.reduce((sum,t)=>sum+t.distanceKm,0),unit)*10)/10;
}
export function tripsCSV(trips:readonly Trip[]):string {
  const sorted=[...trips].sort((a,b)=>a.day.localeCompare(b.day));
  return '\uFEFF'+'Date,Distance (km),Purpose\r\n'+sorted.map((t)=>[t.day,t.distanceKm.toFixed(3),t.purpose].map(csvCell).join(',')).join('\r\n')+'\r\n';
}
