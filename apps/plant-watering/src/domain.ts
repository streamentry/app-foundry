import { addDays, daysBetween, isDayKey } from '@foundry/mobile-kit/dates';
export interface Plant { id: string; name: string; intervalDays: number; lastWatered: string; history: string[] }
export function makePlant(id: string, name: string, intervalDays: number, lastWatered: string): Plant {
  if (!name.trim() || name.trim().length > 70 || !Number.isInteger(intervalDays) || intervalDays<1 || intervalDays>180 || !isDayKey(lastWatered))
    throw new RangeError('Enter a name, a 1–180 day interval, and a valid date');
  return {id,name:name.trim(),intervalDays,lastWatered,history:[lastWatered]};
}
export function nextWater(plant: Plant): string {return addDays(plant.lastWatered,plant.intervalDays);}
export function daysToWater(plant: Plant,today: string): number {return daysBetween(today,nextWater(plant));}
export function water(plant: Plant,today: string): Plant {
  if (!isDayKey(today)) throw new RangeError('Invalid watering date');
  if (plant.history.includes(today)) return plant;
  return {...plant,lastWatered:today,history:[...plant.history,today].sort()};
}
