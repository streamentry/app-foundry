import * as SQLite from 'expo-sqlite';
import { assertDateKey, makeShift, type Shift, type ShiftKind } from '../domain/roster';

type ShiftRow = {
  date: string;
  kind: ShiftKind;
  start_time: string | null;
  end_time: string | null;
  note: string;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function initialize(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('signal-shifts.db');
  await db.execAsync([
    'PRAGMA journal_mode = WAL;',
    'CREATE TABLE IF NOT EXISTS shifts (',
    'date TEXT PRIMARY KEY NOT NULL,',
    "kind TEXT NOT NULL CHECK(kind IN ('day', 'evening', 'night', 'off')),",
    'start_time TEXT,',
    'end_time TEXT,',
    "note TEXT NOT NULL DEFAULT '',",
    'updated_at TEXT NOT NULL',
    ');',
    'CREATE TABLE IF NOT EXISTS preferences (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);',
    'PRAGMA user_version = 1;',
  ].join(' '));
  return db;
}

function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = initialize().catch((error: unknown) => {
      databasePromise = null;
      throw error;
    });
  }
  return databasePromise;
}

function fromRow(row: ShiftRow): Shift {
  return makeShift(row.date, row.kind, row.start_time, row.end_time, row.note);
}

export async function listShifts(): Promise<Shift[]> {
  const db = await getDB();
  const result = await db.getAllAsync<ShiftRow>(
    'SELECT date, kind, start_time, end_time, note FROM shifts ORDER BY date ASC',
  );
  return result.map(fromRow);
}

export async function upsertShift(shift: Shift): Promise<void> {
  const valid = makeShift(shift.date, shift.kind, shift.start, shift.end, shift.note);
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO shifts (date, kind, start_time, end_time, note, updated_at) VALUES (?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(date) DO UPDATE SET kind=excluded.kind, start_time=excluded.start_time, ' +
      'end_time=excluded.end_time, note=excluded.note, updated_at=excluded.updated_at',
    [valid.date, valid.kind, valid.start, valid.end, valid.note, new Date().toISOString()],
  );
}

export async function deleteShift(date: string): Promise<void> {
  assertDateKey(date);
  const db = await getDB();
  await db.runAsync('DELETE FROM shifts WHERE date = ?', [date]);
}

/** Insert an entire rotation atomically; existing user edits are never overwritten. */
export async function insertRotation(additions: readonly Shift[]): Promise<number> {
  if (additions.length === 0) return 0;
  const valid = additions.map((shift) => makeShift(shift.date, shift.kind, shift.start, shift.end, shift.note));
  const db = await getDB();
  let inserted = 0;
  await db.withExclusiveTransactionAsync(async (txn) => {
    for (const shift of valid) {
      const result = await txn.runAsync(
        'INSERT OR IGNORE INTO shifts (date, kind, start_time, end_time, note, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [shift.date, shift.kind, shift.start, shift.end, shift.note, new Date().toISOString()],
      );
      inserted += result.changes;
    }
  });
  return inserted;
}

export async function clearAllShifts(): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM shifts');
}

export async function remindersEnabled(): Promise<boolean> {
  const db = await getDB();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', ['reminders']);
  return row?.value === 'yes';
}

export async function setRemindersEnabled(value: boolean): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO preferences (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
    ['reminders', value ? 'yes' : 'no'],
  );
}
