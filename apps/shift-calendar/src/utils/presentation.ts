import { localDate, type Shift } from '../domain/roster';

export function fullDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(localDate(value));
}

export function shortDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(localDate(value));
}

export function monthTitle(value: string): string {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(localDate(value));
}

export function scheduleTime(shift: Shift): string {
  return shift.start && shift.end ? shift.start + ' — ' + shift.end : 'No scheduled hours';
}

export function readableError(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}
