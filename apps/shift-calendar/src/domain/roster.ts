/**
 * Signal Shift Calendar domain.
 * A shift belongs to its START date. Overnight shifts end the following calendar day.
 * Scheduled durations are nominal clock hours, not audited payroll hours (DST/breaks differ).
 */
export const SHIFT_KINDS = ['day', 'evening', 'night', 'off'] as const;
export type ShiftKind = (typeof SHIFT_KINDS)[number];

export interface Shift {
  date: string;
  kind: ShiftKind;
  start: string | null;
  end: string | null;
  note: string;
}

export type WorkKind = Exclude<ShiftKind, 'off'>;
export type Times = { start: string; end: string };

export const DEFAULT_TIMES: Readonly<Record<WorkKind, Times>> = {
  day: { start: '07:00', end: '15:00' },
  evening: { start: '15:00', end: '23:00' },
  night: { start: '23:00', end: '07:00' },
};

export const SHIFT_LABELS: Readonly<Record<ShiftKind, string>> = {
  day: 'Day',
  evening: 'Evening',
  night: 'Night',
  off: 'Day off',
};

export const SHIFT_ABBREVIATIONS: Readonly<Record<ShiftKind, string>> = {
  day: 'D',
  evening: 'E',
  night: 'N',
  off: 'OFF',
};

export interface Rotation {
  id: string;
  name: string;
  description: string;
  cycle: readonly ShiftKind[];
}

export const ROTATIONS: readonly Rotation[] = [
  {
    id: 'four-on-four-off',
    name: '4 on · 4 off',
    description: 'Four day shifts, then four days off.',
    cycle: ['day', 'day', 'day', 'day', 'off', 'off', 'off', 'off'],
  },
  {
    id: 'two-two-four',
    name: '2 days · 2 nights · 4 off',
    description: 'Two day shifts, two nights, four days off.',
    cycle: ['day', 'day', 'night', 'night', 'off', 'off', 'off', 'off'],
  },
  {
    id: 'two-two-three',
    name: '2–2–3 rotation',
    description: 'Two on, two off, three on, two off, two on, three off.',
    cycle: ['day', 'day', 'off', 'off', 'day', 'day', 'day', 'off', 'off', 'day', 'day', 'off', 'off', 'off'],
  },
];

export function assertDateKey(value: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError('Date must be YYYY-MM-DD');
  const [y, m, d] = value.split('-').map(Number);
  const actual = new Date(Date.UTC(y!, m! - 1, d!));
  if (actual.toISOString().slice(0, 10) !== value) throw new RangeError('Invalid calendar date');
}

export function dateKey(date: Date): string {
  if (Number.isNaN(date.getTime())) throw new RangeError('Invalid Date');
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

export function localDate(value: string): Date {
  assertDateKey(value);
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

export function addDays(value: string, amount: number): string {
  assertDateKey(value);
  if (!Number.isSafeInteger(amount) || Math.abs(amount) > 36600) throw new RangeError('Invalid number of days');
  const [y, m, d] = value.split('-').map(Number);
  const next = new Date(Date.UTC(y!, m! - 1, d! + amount));
  return next.toISOString().slice(0, 10);
}

export function shiftMonth(value: string, amount: number): string {
  assertDateKey(value);
  if (!Number.isSafeInteger(amount) || Math.abs(amount) > 1200) throw new RangeError('Invalid month change');
  const [y, m] = value.split('-').map(Number);
  const month = new Date(Date.UTC(y!, m! - 1 + amount, 1));
  return month.toISOString().slice(0, 10);
}

export function startOfWeek(value: string): string {
  assertDateKey(value);
  const [y, m, d] = value.split('-').map(Number);
  const weekday = new Date(Date.UTC(y!, m! - 1, d!)).getUTCDay();
  return addDays(value, -((weekday + 6) % 7));
}

export function weekDays(value: string): string[] {
  const monday = startOfWeek(value);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Monday-first grid, as short as possible (4–6 weeks). */
export function monthDays(value: string): string[] {
  assertDateKey(value);
  const first = value.slice(0, 7) + '-01';
  const month = first.slice(0, 7);
  const firstGrid = startOfWeek(first);
  const last = addDays(shiftMonth(first, 1), -1);
  const weeks = Math.ceil((Math.round((Date.parse(last + 'T00:00:00Z') - Date.parse(firstGrid + 'T00:00:00Z')) / 86400000) + 1) / 7);
  if (month !== first.slice(0, 7)) throw new RangeError('Invalid month');
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(firstGrid, i));
}

export function assertTime(value: string): void {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new RangeError('Time must be 24-hour HH:mm');
}

function minutes(value: string): number {
  assertTime(value);
  const [hours, mins] = value.split(':').map(Number);
  return hours! * 60 + mins!;
}

export function makeShift(
  date: string,
  kind: ShiftKind,
  start?: string | null,
  end?: string | null,
  note = '',
): Shift {
  assertDateKey(date);
  if (!(SHIFT_KINDS as readonly string[]).includes(kind)) throw new RangeError('Unknown shift type');
  if (note.length > 160) throw new RangeError('Note must be 160 characters or fewer');
  if (kind === 'off') {
    return { date, kind, start: null, end: null, note: note.trim() };
  }
  const defaults = DEFAULT_TIMES[kind];
  const finalStart = start ?? defaults.start;
  const finalEnd = end ?? defaults.end;
  assertTime(finalStart);
  assertTime(finalEnd);
  if (finalStart === finalEnd) throw new RangeError('Start and end cannot be identical');
  return { date, kind, start: finalStart, end: finalEnd, note: note.trim() };
}

/** Clock-duration estimate: overnight end time is on the following day. */
export function durationMinutes(shift: Shift): number {
  if (shift.kind === 'off') return 0;
  if (!shift.start || !shift.end) throw new RangeError('Working shift is missing times');
  let value = minutes(shift.end) - minutes(shift.start);
  if (value <= 0) value += 1440;
  return value;
}

export function shiftStartDate(shift: Shift): Date | null {
  if (shift.kind === 'off' || !shift.start) return null;
  const dt = localDate(shift.date);
  const [hours, mins] = shift.start.split(':').map(Number);
  dt.setHours(hours!, mins!, 0, 0);
  return dt;
}

export function shiftEndDate(shift: Shift): Date | null {
  if (shift.kind === 'off' || !shift.start || !shift.end) return null;
  const dt = localDate(shift.date);
  const [hours, mins] = shift.end.split(':').map(Number);
  dt.setHours(hours!, mins!, 0, 0);
  if (shift.end <= shift.start) dt.setDate(dt.getDate() + 1);
  return dt;
}

export interface ShiftFocus {
  shift: Shift;
  state: 'ongoing' | 'next';
}

/** A night shift that started yesterday is still active after midnight. */
export function currentOrNextShift(shifts: readonly Shift[], now: Date): ShiftFocus | null {
  if (Number.isNaN(now.getTime())) throw new RangeError('Invalid Date');
  const ordered = [...shifts].filter((s) => s.kind !== 'off').sort((a, b) => a.date.localeCompare(b.date) || (a.start ?? '').localeCompare(b.start ?? ''));
  let next: Shift | null = null;
  for (const shift of ordered) {
    const start = shiftStartDate(shift);
    const end = shiftEndDate(shift);
    if (!start || !end) continue;
    if (start.getTime() <= now.getTime() && end.getTime() > now.getTime()) {
      return { shift, state: 'ongoing' };
    }
    if (start.getTime() > now.getTime() && !next) next = shift;
  }
  return next ? { shift: next, state: 'next' } : null;
}

export function monthSummary(shifts: readonly Shift[], month: string): { shifts: number; off: number; hours: number } {
  assertDateKey(month);
  let work = 0;
  let off = 0;
  let mins = 0;
  for (const shift of shifts) {
    if (!shift.date.startsWith(month.slice(0, 7))) continue;
    if (shift.kind === 'off') off++;
    else { work++; mins += durationMinutes(shift); }
  }
  return { shifts: work, off, hours: Math.round(mins / 6) / 10 };
}

export function planRotation(
  start: string,
  rotationId: string,
  days: number,
  existing: readonly Shift[],
  times: Partial<Record<WorkKind, Times>> = {},
): { additions: Shift[]; skipped: number } {
  assertDateKey(start);
  if (!Number.isInteger(days) || days < 7 || days > 84) throw new RangeError('Rotation length must be between 7 and 84 days');
  const rotation = ROTATIONS.find((value) => value.id === rotationId);
  if (!rotation) throw new RangeError('Unknown rotation');
  const occupied = new Set(existing.map((shift) => shift.date));
  const additions: Shift[] = [];
  let skipped = 0;
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i);
    if (occupied.has(date)) { skipped++; continue; }
    const kind = rotation.cycle[i % rotation.cycle.length]!;
    const override = kind === 'off' ? undefined : times[kind];
    additions.push(makeShift(date, kind, override?.start, override?.end));
  }
  return { additions, skipped };
}

function escapeCell(value: string): string {
  // Mitigate spreadsheet formula injection in user notes (including leading whitespace).
  const safe = /^[\s]*[=+\-@\t\r]/.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g, '""') + '"';
}

export function toCSV(shifts: readonly Shift[]): string {
  const rows = [...shifts].sort((a, b) => a.date.localeCompare(b.date)).map((shift) =>
    [shift.date, SHIFT_LABELS[shift.kind], shift.start ?? '', shift.end ?? '', String(durationMinutes(shift) / 60), shift.note].map(escapeCell).join(','),
  );
  return '\uFEFF' + ['Date,Shift,Start,End,Scheduled hours,Note', ...rows].join('\r\n') + '\r\n';
}
