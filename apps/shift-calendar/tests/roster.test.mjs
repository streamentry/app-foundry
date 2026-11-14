import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  addDays, assertDateKey, currentOrNextShift, dateKey, durationMinutes,
  makeShift, monthDays, monthSummary, planRotation, shiftMonth, startOfWeek, toCSV, weekDays,
} from '../src/domain/roster.ts';

test('calendar keys validate leap days and do not drift through DST', () => {
  assert.doesNotThrow(() => assertDateKey('2028-02-29'));
  assert.throws(() => assertDateKey('2027-02-29'), RangeError);
  assert.throws(() => assertDateKey('2026-13-01'), RangeError);
  assert.throws(() => assertDateKey('2026-11-14T01:00:00Z'), RangeError);
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2028-02-29', 1), '2028-03-01');
  assert.equal(startOfWeek('2026-11-14'), '2026-11-09');
  assert.deepEqual(weekDays('2026-11-14'), ['2026-11-09','2026-11-10','2026-11-11','2026-11-12','2026-11-13','2026-11-14','2026-11-15']);
  assert.equal(shiftMonth('2026-12-31', 1), '2027-01-01');
  assert.equal(dateKey(new Date(2026, 10, 14)), '2026-11-14');
});

test('calendar grid covers complete month in Monday-first weeks', () => {
  const november = monthDays('2026-11-14');
  assert.equal(november[0], '2026-10-26');
  assert.equal(november.at(-1), '2026-12-06');
  assert.equal(november.length % 7, 0);
  assert.equal(monthDays('2021-02-12').length, 28);
});

test('creates valid overnight shifts and rejects malformed times', () => {
  const night = makeShift('2026-11-14', 'night');
  assert.equal(durationMinutes(night), 480);
  const custom = makeShift('2026-11-14', 'day', '19:30', '06:15');
  assert.equal(durationMinutes(custom), 645);
  assert.equal(durationMinutes(makeShift('2026-11-14', 'off')), 0);
  assert.throws(() => makeShift('2026-11-14', 'day', '25:00', '07:00'), RangeError);
  assert.throws(() => makeShift('2026-11-14', 'day', '08:00', '08:00'), RangeError);
  assert.throws(() => makeShift('2026-11-14', 'day', undefined, undefined, 'a'.repeat(161)), RangeError);
  assert.equal(makeShift('2026-11-14', 'off', '15:00', '16:00').start, null);
});

test('focus prioritizes an overnight shift that is still ongoing', () => {
  const shifts = [makeShift('2026-11-14', 'night'), makeShift('2026-11-15', 'day')];
  const active = currentOrNextShift(shifts, new Date(2026, 10, 15, 3, 0));
  assert.equal(active?.state, 'ongoing');
  assert.equal(active?.shift.date, '2026-11-14');
  const day = currentOrNextShift(shifts, new Date(2026, 10, 15, 8, 10));
  assert.equal(day?.state, 'ongoing');
  assert.equal(day?.shift.date, '2026-11-15');
  assert.equal(currentOrNextShift(shifts, new Date(2026, 10, 15, 16, 0)), null);
  assert.equal(currentOrNextShift(shifts, new Date(2026, 10, 14, 12, 0))?.shift.kind, 'night');
});

test('rotation never overrides existing entries, including an explicit day off', () => {
  const existing = [makeShift('2026-11-15', 'off')];
  const result = planRotation('2026-11-14', 'two-two-four', 8, existing, {
    day: { start: '06:30', end: '18:30' },
    night: { start: '18:30', end: '06:30' },
  });
  assert.equal(result.skipped, 1);
  assert.equal(result.additions.length, 7);
  assert.equal(result.additions[0]?.start, '06:30');
  assert.equal(result.additions[1]?.kind, 'night');
  assert.equal(result.additions.at(-1)?.kind, 'off');
  assert.equal(planRotation('2026-11-14', 'two-two-four', 8, [...existing, ...result.additions]).skipped, 8);
  assert.throws(() => planRotation('2026-11-14', 'two-two-four', 85, []), RangeError);
  assert.throws(() => planRotation('2026-11-14', 'made-up', 7, []), RangeError);
  assert.throws(() => planRotation('2026-11-14', 'two-two-four', 7, [], { day: { start: 'bad', end: '07:00' } }), RangeError);
});

test('month totals and CSV export are deterministic and spreadsheet-safe', () => {
  const shifts = [
    makeShift('2026-11-15', 'night', '21:00', '07:30', '=HYPERLINK("bad")'),
    makeShift('2026-11-14', 'day', '07:00', '15:00', ' normal '),
    makeShift('2026-11-16', 'off'),
  ];
  assert.deepEqual(monthSummary(shifts, '2026-11-01'), { shifts: 2, off: 1, hours: 18.5 });
  const csv = toCSV(shifts);
  assert.ok(csv.startsWith('\uFEFFDate,Shift,Start,End,Scheduled hours,Note'));
  assert.ok(csv.indexOf('"2026-11-14"') < csv.indexOf('"2026-11-15"'));
  assert.ok(csv.includes("'=HYPERLINK("));
  assert.ok(csv.includes('""bad""'));
  assert.ok(csv.endsWith('\r\n'));
});
