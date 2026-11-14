/** Cash Close domain: exact integer minor-unit arithmetic, independent of React and Expo.
 * Monetary values are never computed with floating point multiplication.
 * Working product name and denomination presets require review before public release.
 */
export type CurrencyCode = 'USD' | 'VND' | 'SGD' | 'EUR';
export type DenominationKind = 'note' | 'coin';
export type Denomination = { id: string; minor: number; kind: DenominationKind };
export type CurrencyProfile = {
  code: CurrencyCode;
  title: string;
  symbol: string;
  fractionDigits: 0 | 2;
  notes: readonly number[];
  coins: readonly number[];
};

export const PROFILES: Record<CurrencyCode, CurrencyProfile> = {
  USD: {
    code: 'USD', title: 'US dollar', symbol: '$', fractionDigits: 2,
    notes: [10000, 5000, 2000, 1000, 500, 200, 100],
    coins: [100, 50, 25, 10, 5, 1],
  },
  VND: {
    code: 'VND', title: 'Vietnamese đồng', symbol: '₫', fractionDigits: 0,
    notes: [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100],
    coins: [],
  },
  SGD: {
    code: 'SGD', title: 'Singapore dollar', symbol: 'S$', fractionDigits: 2,
    notes: [10000, 5000, 1000, 500, 200],
    coins: [100, 50, 20, 10, 5],
  },
  EUR: {
    code: 'EUR', title: 'Euro', symbol: '€', fractionDigits: 2,
    notes: [20000, 10000, 5000, 2000, 1000, 500],
    coins: [200, 100, 50, 20, 10, 5, 2, 1],
  },
};

export const CURRENCIES: readonly CurrencyCode[] = ['USD', 'VND', 'SGD', 'EUR'];
export const MAX_QUANTITY = 99999;
const MAX_MINOR = 9_000_000_000_000;

export function profile(code: CurrencyCode): CurrencyProfile {
  const result = PROFILES[code];
  if (!result) throw new RangeError('Unsupported currency');
  return result;
}
export function denominations(code: CurrencyCode): readonly Denomination[] {
  const p = profile(code);
  return [
    ...p.notes.map(minor => ({ id: 'n' + minor, minor, kind: 'note' as const })),
    ...p.coins.map(minor => ({ id: 'c' + minor, minor, kind: 'coin' as const })),
  ];
}
export function digitsOnlyQuantity(input: string): number {
  const trimmed = input.trim();
  if (!/^\d{1,5}$/.test(trimmed)) throw new RangeError('Enter a whole number from 0 to 99,999');
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value) || value > MAX_QUANTITY) throw new RangeError('Too many pieces');
  return value;
}
export function parseMoney(input: string, currency: CurrencyCode): number {
  const p = profile(currency);
  const trimmed = input.trim();
  if (!trimmed) throw new RangeError('Enter an amount');
  if (p.fractionDigits === 0) {
    if (!/^\d{1,12}$/.test(trimmed)) throw new RangeError('Use whole đồng without separators');
    const amount = Number(trimmed);
    if (!Number.isSafeInteger(amount) || amount > MAX_MINOR) throw new RangeError('Amount is too large');
    return amount;
  }
  // Accept either decimal point or decimal comma, but not ambiguous group separators.
  if (!/^\d{1,10}(?:[.,]\d{1,2})?$/.test(trimmed)) {
    throw new RangeError('Enter an amount without grouping, e.g. 1234.56');
  }
  const [whole, fractional = ''] = trimmed.replace(',', '.').split('.');
  const amount = Number(whole) * 100 + Number(fractional.padEnd(2, '0'));
  if (!Number.isSafeInteger(amount) || amount > MAX_MINOR) throw new RangeError('Amount is too large');
  return amount;
}
export function formatMoney(minor: number, currency: CurrencyCode): string {
  const p = profile(currency);
  if (!Number.isSafeInteger(minor) || Math.abs(minor) > MAX_MINOR) throw new RangeError('Invalid amount');
  const sign = minor < 0 ? '−' : '';
  const abs = Math.abs(minor);
  const scale = 10 ** p.fractionDigits;
  const units = String(Math.floor(abs / scale)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const cents = p.fractionDigits === 0 ? '' : '.' + String(abs % scale).padStart(2, '0');
  return currency === 'VND' ? sign + units + ' ' + p.symbol : sign + p.symbol + units + cents;
}
export function denominationLabel(currency: CurrencyCode, item: Denomination): string {
  return formatMoney(item.minor, currency);
}

export function isDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || year < 1900 || year > 2100) return false;
  return new Date(Date.UTC(year, month! - 1, day!)).toISOString().slice(0, 10) === value;
}
export function localDay(date: Date = new Date()): string {
  if (Number.isNaN(date.getTime())) throw new RangeError('Invalid calendar date');
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
}
export interface CountDraft {
  businessDay: string;
  currency: CurrencyCode;
  drawer: string;
  counts: Record<string, number>;
  otherInput: string;
  expectedInput: string;
  note: string;
}
export interface CloseSession {
  schema: 2;
  id: string;
  createdAt: string;
  businessDay: string;
  currency: CurrencyCode;
  drawer: string;
  counts: Record<string, number>;
  otherMinor: number;
  expectedMinor: number | null;
  note: string;
  source: 'manual' | 'legacy-import';
}
export function emptyDraft(currency: CurrencyCode = 'USD', day: string = localDay()): CountDraft {
  profile(currency);
  if (!isDay(day)) throw new RangeError('Invalid business date');
  return { businessDay: day, currency, drawer: '', counts: {}, otherInput: '', expectedInput: '', note: '' };
}
export function validateCounts(currency: CurrencyCode, counts: Record<string, number>): Record<string, number> {
  if (!counts || Array.isArray(counts) || typeof counts !== 'object') throw new RangeError('Invalid quantities');
  const allowed = new Set(denominations(currency).map(item => item.id));
  const clean: Record<string, number> = {};
  for (const [key, value] of Object.entries(counts)) {
    if (!allowed.has(key)) throw new RangeError('Unknown denomination: ' + key);
    if (!Number.isSafeInteger(value) || value < 0 || value > MAX_QUANTITY) {
      throw new RangeError('Invalid quantity for ' + key);
    }
    if (value) clean[key] = value;
  }
  return clean;
}
export function sumCash(currency: CurrencyCode, counts: Record<string, number>, kind?: DenominationKind): number {
  const validated = validateCounts(currency, counts);
  const total = denominations(currency).filter(d => !kind || d.kind === kind)
    .reduce((sum, item) => sum + item.minor * (validated[item.id] ?? 0), 0);
  if (!Number.isSafeInteger(total) || total > MAX_MINOR) throw new RangeError('Cash total is too large');
  return total;
}
export function totalMinor(session: Pick<CloseSession,'currency'|'counts'|'otherMinor'>): number {
  const other = session.otherMinor;
  if (!Number.isSafeInteger(other) || other < 0 || other > MAX_MINOR) throw new RangeError('Invalid other cash amount');
  const total = sumCash(session.currency, session.counts) + other;
  if (!Number.isSafeInteger(total) || total > MAX_MINOR) throw new RangeError('Cash total exceeds safe limit');
  return total;
}
export function varianceMinor(session: Pick<CloseSession,'currency'|'counts'|'otherMinor'|'expectedMinor'>): number | null {
  if (session.expectedMinor === null) return null;
  if (!Number.isSafeInteger(session.expectedMinor) || session.expectedMinor < 0 || session.expectedMinor > MAX_MINOR) throw new RangeError('Invalid expected amount');
  return totalMinor(session) - session.expectedMinor;
}
export type Reconciliation = { label:'Balanced'|'Over'|'Short'|'No expectation'; difference: number|null };
export function reconciliation(session: Pick<CloseSession,'currency'|'counts'|'otherMinor'|'expectedMinor'>): Reconciliation {
  const difference = varianceMinor(session);
  if (difference === null) return {label:'No expectation',difference};
  return {label:difference === 0 ? 'Balanced' : difference > 0 ? 'Over' : 'Short',difference};
}
export function makeSession(draft: CountDraft, id: string, createdAt: string = new Date().toISOString()): CloseSession {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new RangeError('Invalid record ID');
  if (!Number.isFinite(Date.parse(createdAt))) throw new RangeError('Invalid created timestamp');
  if (!isDay(draft.businessDay)) throw new RangeError('Select a valid business date');
  const drawer = draft.drawer.trim();
  const note = draft.note.trim();
  if (drawer.length > 72) throw new RangeError('Drawer name is too long');
  if (note.length > 500) throw new RangeError('Note is too long');
  const counts = validateCounts(draft.currency, draft.counts);
  const otherMinor = draft.otherInput.trim() ? parseMoney(draft.otherInput, draft.currency) : 0;
  const expectedMinor = draft.expectedInput.trim() ? parseMoney(draft.expectedInput, draft.currency) : null;
  const result: CloseSession = {
    schema: 2, id, createdAt, businessDay:draft.businessDay,
    currency:draft.currency, drawer, counts, otherMinor, expectedMinor, note, source:'manual',
  };
  totalMinor(result);
  if (expectedMinor !== null) varianceMinor(result);
  // Empty count with no additional cash is allowed, e.g., a truly empty register.
  return result;
}
export function draftFromSession(s: CloseSession): CountDraft {
  const validated = validateSession(s);
  const scale = 10 ** profile(validated.currency).fractionDigits;
  const stringify = (n:number) => profile(validated.currency).fractionDigits === 0
    ? String(n) : (n / scale).toFixed(2);
  return {
    businessDay:validated.businessDay, currency:validated.currency, drawer:validated.drawer,
    counts:{...validated.counts}, otherInput:validated.otherMinor ? stringify(validated.otherMinor) : '',
    expectedInput:validated.expectedMinor === null ? '' : stringify(validated.expectedMinor),
    note:validated.note,
  };
}

export function validateSession(raw: unknown): CloseSession {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError('Invalid saved session');
  const r = raw as Record<string, unknown>;
  if (r.schema !== 2 || typeof r.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(r.id) ||
    typeof r.createdAt !== 'string' || !Number.isFinite(Date.parse(r.createdAt)) ||
    typeof r.businessDay !== 'string' || !isDay(r.businessDay) ||
    typeof r.currency !== 'string' || !CURRENCIES.includes(r.currency as CurrencyCode) ||
    typeof r.drawer !== 'string' || r.drawer.length > 72 ||
    typeof r.note !== 'string' || r.note.length > 500 ||
    (r.source !== 'manual' && r.source !== 'legacy-import') ||
    typeof r.otherMinor !== 'number' || !Number.isSafeInteger(r.otherMinor) || r.otherMinor < 0 ||
    (r.expectedMinor !== null && (typeof r.expectedMinor !== 'number' || !Number.isSafeInteger(r.expectedMinor) || r.expectedMinor < 0)) ||
    !r.counts || typeof r.counts !== 'object' || Array.isArray(r.counts)
  ) throw new TypeError('Invalid or unsupported session format');
  const counts = validateCounts(r.currency as CurrencyCode,r.counts as Record<string,number>);
  const session:CloseSession = {
    schema:2, id:r.id, createdAt:r.createdAt, businessDay:r.businessDay,
    currency:r.currency as CurrencyCode,drawer:r.drawer,note:r.note,
    counts,otherMinor:r.otherMinor,expectedMinor:r.expectedMinor as number|null,source:r.source,
  };
  totalMinor(session);
  varianceMinor(session);
  return session;
}
export function sortedSessions(entries: readonly CloseSession[]): CloseSession[] {
  return [...entries].sort((a,b) => b.businessDay.localeCompare(a.businessDay) || b.createdAt.localeCompare(a.createdAt));
}
export interface Backup { version: 2; product: 'cash-drawer-closeout'; exportedAt: string; sessions: CloseSession[] }
export function exportBackup(entries: readonly CloseSession[], exportedAt: string = new Date().toISOString()): string {
  const sessions = entries.map(validateSession);
  return JSON.stringify({version:2, product:'cash-drawer-closeout', exportedAt, sessions} satisfies Backup,null,2);
}
export function importBackup(raw: string): CloseSession[] {
  if (raw.length > 2_000_000) throw new RangeError('Backup is too large');
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new TypeError('Backup is not valid JSON'); }
  if (!parsed || typeof parsed !== 'object') throw new TypeError('Invalid backup');
  const data = parsed as Record<string,unknown>;
  if (data.version !== 2 || data.product !== 'cash-drawer-closeout' || !Array.isArray(data.sessions))
    throw new TypeError('Wrong app or backup version');
  if (data.sessions.length > 10000) throw new RangeError('Too many records in backup');
  const seen = new Set<string>();
  return data.sessions.map((row:unknown) => {
    const session = validateSession(row);
    if (seen.has(session.id)) throw new TypeError('Duplicate session ID in backup');
    seen.add(session.id);
    return session;
  });
}
function safeCsv(value: string|number):string {
  const original = String(value);
  const safe = /^\s*[=+\-@\t\r]/.test(original) ? "'" + original : original;
  return '"' + safe.replace(/"/g,'""') + '"';
}
export function exportCsv(entries: readonly CloseSession[]): string {
  const headings = ['Date','Drawer','Currency','Counted (minor units)','Expected (minor units)','Difference (minor units)','Reconciliation','Notes','Denomination quantities','Other cash (minor units)','Source'];
  const rows = sortedSessions(entries).map(s => {
    const status = reconciliation(s);
    const breakdown = denominations(s.currency).filter(d => (s.counts[d.id] ?? 0) > 0)
      .map(d => denominationLabel(s.currency,d) + ' × ' + s.counts[d.id]).join('; ');
    const cells: (string|number)[] = [
      s.businessDay,s.drawer,s.currency,totalMinor(s),s.expectedMinor ?? '',status.difference ?? '',
      status.label,s.note,breakdown,s.otherMinor,s.source,
    ];
    return cells.map(safeCsv).join(',');
  });
  return '\uFEFF' + headings.map(safeCsv).join(',') + '\r\n' + rows.join('\r\n') + '\r\n';
}
