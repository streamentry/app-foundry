/** Date-only utilities work with local calendar dates, never UTC-parsed Date constructors. */
export function isDayKey(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const [year, month, date] = day.split('-').map(Number);
  const actual = new Date(Date.UTC(year!, month! - 1, date!));
  return actual.toISOString().slice(0, 10) === day;
}

export function dayKey(date: Date): string {
  if (Number.isNaN(date.getTime())) throw new RangeError('Invalid date');
  return [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function asLocalDate(day: string): Date {
  if (!isDayKey(day)) throw new RangeError('Expected YYYY-MM-DD calendar day');
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year!, month! - 1, date!, 12);
}

export function addDays(day: string, n: number): string {
  if (!isDayKey(day) || !Number.isSafeInteger(n) || Math.abs(n) > 36500) throw new RangeError('Invalid date offset');
  const date = asLocalDate(day);
  date.setDate(date.getDate() + n);
  return dayKey(date);
}

export function daysBetween(from: string, to: string): number {
  if (!isDayKey(from) || !isDayKey(to)) throw new RangeError('Invalid date');
  return Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000);
}

export function addMonths(day: string, months: number): string {
  if (!isDayKey(day) || !Number.isSafeInteger(months) || months < 0 || months > 1200) throw new RangeError('Invalid month interval');
  const d = asLocalDate(day);
  const target = new Date(d.getFullYear(), d.getMonth() + months, 1, 12);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d.getDate(), last));
  return dayKey(target);
}

export function timeString(date: Date): string {
  return [String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')].join(':');
}

export function timeAsDate(time: string): Date {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new RangeError('Time must be HH:mm');
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h!, m!, 0, 0);
  return d;
}

export function uniqueId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
}

export function niceDay(day: string): string {
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(asLocalDate(day));
}

export function requirePositiveNumber(value: string, max = 100000): number {
  const n = Number(value.trim());
  if (!value.trim() || !Number.isFinite(n) || n <= 0 || n > max) throw new RangeError('Enter a valid positive amount');
  return n;
}

/** Safe for export to Excel/Sheets; prevents formula interpretation of user data. */
export function csvCell(value: string | number): string {
  const str = String(value);
  const safe = /^\s*[=+\-@\t\r]/.test(str) ? "'" + str : str;
  return '"' + safe.replace(/"/g, '""') + '"';
}
