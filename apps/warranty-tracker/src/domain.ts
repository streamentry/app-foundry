import { addMonths, daysBetween, isDayKey } from '@foundry/mobile-kit/dates';
export interface Warranty { id: string; product: string; purchasedOn: string; termMonths: number; merchant: string }
export function makeWarranty(id:string,product:string,purchasedOn:string,termMonths:number,merchant:string):Warranty {
  if(!product.trim()||product.trim().length>80||!isDayKey(purchasedOn) || !Number.isInteger(termMonths) || termMonths<1||termMonths>240)
    throw new RangeError('Enter a product, valid purchase date, and 1–240 months.');
  return {id,product:product.trim(),purchasedOn,termMonths,merchant:merchant.trim().slice(0,80)};
}
export function estimatedExpiry(w:Warranty):string{return addMonths(w.purchasedOn,w.termMonths);}
export function daysLeft(w:Warranty,today:string):number{return daysBetween(today,estimatedExpiry(w));}
export function orderedWarranties(warr:readonly Warranty[]):Warranty[]{return [...warr].sort((a,b)=>estimatedExpiry(a).localeCompare(estimatedExpiry(b)));}
